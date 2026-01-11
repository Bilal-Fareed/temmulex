import { v4 as uuidv4 } from 'uuid';
import { getUserByUuid } from '../services/userService.js';
import { getUserSessionForAuth, insertUserSession } from '../services/sessionsService.js';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../helpers/security.js';

/**
 * Express middleware to authenticate users using access and refresh tokens
 */
const authenticate = async (req, res, next) => {
	const accessToken = req.headers.authorization?.split(' ')[1];
	const refreshToken = req.headers['x-refresh-token'];
	const deviceId = req.headers['x-device-id'];
	const userAgent = req.headers['user-agent'] || 'unknown';

	if (!accessToken) {
		return res.status(401).json({ message: 'Access token missing' });
	}

	try {
		const decodedAccess = verifyAccessToken(accessToken);

		// Validate user
		const [user] = await getUserByUuid(decodedAccess.uuid);
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
			const decodedRefreshToken = verifyRefreshToken(refreshToken);

			// Validate session exists and matches device
			const [session] = await getUserSessionForAuth({
				tokenId: decodedRefreshToken.tokenId,
				deviceId: deviceId,
				userUuid: decodedRefreshToken.uuid,
				userType: decodedRefreshToken.userType,
				revoked: false
			})

			if (!session) {
				return res.status(401).json({ message: 'Session revoked or device mismatch' });
			}

			// Validate user
			const [user] = await getUserByUuid(decodedRefreshToken.uuid);
			if (!user || user.refreshTokenVersion !== decodedRefreshToken.version) {
				return res.status(401).json({ message: 'Session version mismatch' });
			}

			// Rotate session
			await deleteSessionById();

			const newTokenId = uuidv4();
			await insertUserSession({
				tokenId: newTokenId,
				userId: user.uuid,
				deviceId: deviceId,
				userAgent: userAgent,
				userType: decodedRefreshToken.userType,
			});

			// Generate new tokens
			const newAccessToken = generateAccessToken({
				uuid: user.uuid,
				version: user.refreshTokenVersion,
				tokenId: newTokenId,
				userType: decodedRefreshToken.userType,
			});

			const newRefreshToken = generateRefreshToken({
				uuid: user.uuid,
				version: user.refreshTokenVersion,
				tokenId: newTokenId,
				userType: decodedRefreshToken.userType,
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
	authenticate,
};
