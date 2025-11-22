import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_SECRET);
};
