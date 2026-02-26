import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = process.env.SALT_ROUNDS || 12;
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

function hashPasswordSync(password) {
    return bcrypt.hashSync(password, SALT_ROUNDS);
}

function verifyPasswordSync(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function generateAccessToken(payload, options = {}) {
    const { expiryTime = '1h' } = options;
    return jwt.sign(payload, ACCESS_SECRET, { expiresIn: expiryTime });
};

function generateRefreshToken(payload, options = {}) {
    const { expiryTime = '7d' } = options;
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: expiryTime });
};

function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_SECRET);
};

function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
};


export {
    verifyPasswordSync,
    hashPasswordSync,
    hashPassword,
    verifyPassword,
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
}