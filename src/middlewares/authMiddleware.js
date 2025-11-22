import { v4 as uuidv4 } from 'uuid';
import { db } from '../../infra/db.js';
import { clients } from '../models/clientsModel.js';
import { freelancers } from '../models/freelancersModel.js';
import { sessions } from '../models/sessionsModel.js';
import { and, eq } from 'drizzle-orm';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.js';

/**
 * Express middleware to authenticate users using access and refresh tokens
 */
const authenticate = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.headers['x-refresh-token'];
  const deviceId = req.headers['x-device-id'];
  const userAgent = req.headers['user-agent'] || 'unknown';
  const tableSelector = {
    "freelancer": freelancers,
    "client": clients
  }
  
  if (!accessToken) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decodedAccess = verifyAccessToken(accessToken);
    
    const table = tableSelector[`${decodedAccess.userType}`]

    // Validate user
    const [user] = await db().select().from(table).where(eq(table.uuid, decodedAccess.uuid));
    if (!user || user.refreshTokenVersion !== decodedAccess.version) {
      return res.status(401).json({ message: 'Session version mismatch' });
    }

    req.user = {
      uuid: decodedAccess.uuid,
      tokenId: decodedAccess.tokenId,
      userType: decodedAccess.userType || 'client',
      ...(decodedAccess.intent && { intent: decodedAccess.intent }),
    };
    return next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE > CATCH NO 1 >", error);

    // If token expired and refresh token & deviceId exist
    if (error.name !== 'TokenExpiredError' || !refreshToken || !deviceId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decodedRefresh = verifyRefreshToken(refreshToken);

      const table = tableSelector[`${decodedRefresh.userType}`]

      // Validate session exists and matches device
      const [session] = await db()
        .select()
        .from(sessions)
        .where(
          and(
            eq(sessions.tokenId, decodedRefresh.tokenId),
            eq(sessions.deviceId, deviceId),
            eq(sessions.userId, decodedRefresh.uuid),
            eq(sessions.userType, decodedRefresh.userType),
            eq(sessions.revoked, false)
          )
        );

      if (!session) {
        return res.status(401).json({ message: 'Session revoked or device mismatch' });
      }

      // Validate user
      const [user] = await db().select().from(table).where(eq(table.uuid, decodedRefresh.uuid));
      if (!user || user.refreshTokenVersion !== decodedRefresh.version) {
        return res.status(401).json({ message: 'Session version mismatch' });
      }

      // Rotate session
      await db().delete(sessions).where(eq(sessions.tokenId, decodedRefresh.tokenId));

      const newTokenId = uuidv4();
      await db().insert(sessions).values({
        tokenId: newTokenId,
        userId: user.uuid,
        deviceId: deviceId,
        userAgent: userAgent,
        userType: decodedRefresh.userType,
      });

      // Generate new tokens
      const newAccessToken = generateAccessToken({
        uuid: user.uuid,
        version: user.refreshTokenVersion,
        tokenId: newTokenId,
        userType: decodedRefresh.userType,
      });

      const newRefreshToken = generateRefreshToken({
        uuid: user.uuid,
        version: user.refreshTokenVersion,
        tokenId: newTokenId,
        userType: decodedRefresh.userType,
      });

      // Send new tokens in headers
      res.setHeader('x-access-token', newAccessToken);
      res.setHeader('x-refresh-token', newRefreshToken);

      req.user = {
        uuid: user.uuid,
        tokenId: newTokenId,
      };

      return next();
    } catch (err) {
      console.error("AUTH MIDDLEWARE > CATCH NO 2 >", err);
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  }
};

export { 
  authenticate 
};
