import { uploadPdf } from "../helpers/cloudinary.js";
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken } from "../helpers/security.js";
import { getUserByEmail, createUserService, getUserByUuid, updateUserByUuidService } from "../services/userService.js";
import { insertFreelancerDetailService, getFreelancerProfileDetailByUserUuid } from "../services/freelancerProfileService.js";
import { insertManyFreelancerLanguagesService } from "../services/freelancerLanguageService.js";
import { insertManyFreelancerServicesService } from "../services/freelancerServicesService.js";
import { redisClient } from "../../infra/redis.js";
import { sendOtpEmail } from "../helpers/mailer.js";
import { deleteUserSessionByUserId, insertUserSession } from "../services/sessionsService.js";
import { randomUUID } from 'crypto';

const userSignupController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > SIGNUP > try block executed");

        let cvUrl = null;
        let dbsUrl = null;

        const { email, password, title, first_name, last_name, country, dob, phone, user_type, services, languages, location } = req.body;
        const files = req.files;

        const existing = await getUserByEmail(email);

        if (existing) return res.status(403).json({ success: false, message: "Email already in use" });

        const [hashedPassword, profilePictureUrl] = await Promise.all([
            hashPassword(password),
            uploadPdf(files?.cv?.[0], "users/profilePicture")
        ]);

        const user = await createUserService({
            email,
            password: hashedPassword,
            phone,
            title,
            first_name,
            last_name,
            dob,
            country,
            profilePicture: profilePictureUrl
        });

        if (user_type === "freelancer") {
            [cvUrl, dbsUrl] = await Promise.all([
                uploadPdf(files?.cv?.[0], "freelancers/cv"),
                uploadPdf(files?.dbs?.[0], "freelancers/dbs")
            ]);

            const { lat = 0, lng = 0 } = location;
            const insertingFreelancersDetails = [];

            insertingFreelancersDetails.push(insertFreelancerDetailService({ userId: user.uuid, lat, lng, cvUrl, dbsUrl }));

            if (services?.length) {
                insertingFreelancersDetails.push(insertManyFreelancerServicesService(services.map((service) => ({
                    freelancerId: user.uuid,
                    serviceId: service.serviceId,
                    fixedPriceCents: service.fixedPriceCents,
                    currency: service.currency
                }))));
            }

            if (languages?.length) {
                insertingFreelancersDetails.push(insertManyFreelancerLanguagesService(languages.map((lang) => ({
                    freelancerId: user.uuid,
                    languageId: lang,
                }))));
            }
            await Promise.all(insertingFreelancersDetails);
        }

        res.status(200).json({ success: true, message: "Signup successful" });
    } catch (error) {
        console.error("USER CONTROLLER > SIGNUP >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const loginController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > LOGIN > try block executed");

        const { email, password, user_type } = req.body;
        const userAgent = request.headers['x-user-agent'] || 'unknown';
        const deviceId = request.headers['x-device-id'];

        const user = await getUserByEmail(email);
        if (!user || !user.password) return res.status(403).json({ success: false, message: 'Invalid credentials' });

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return res.status(403).json({ success: false, message: 'Invalid credentials' });

        if (user_type === "freelancer") {
            const freelancerProfileDetails = getFreelancerProfileDetailByUserUuid(user.uuid);
            user = {
                ...user,
                location: freelancerProfileDetails.location,
                resumeLink: freelancerProfileDetails.resumeLink,
                certificateLink: freelancerProfileDetails.certificateLink,
                profileStatus: freelancerProfileDetails.profileStatus,
                isBlocked: freelancerProfileDetails.isBlocked,
                isDeleted: freelancerProfileDetails.isDeleted,
                createdAt: freelancerProfileDetails.createdAt
            }
        }

        const tokenId = randomUUID();
        const accessToken = generateAccessToken({ uuid: user.uuid, version: user.refreshTokenVersion, tokenId });
        const refreshToken = generateRefreshToken({ uuid: user.uuid, version: user.refreshTokenVersion, tokenId });

        await insertUserSession({
            tokenId,
            userUuid: user.uuid,
            deviceId,
            userAgent,
            userType: user_type
        })

        res.status(200).json({
            success: true,
            user: {
                uuid: user.uuid,
                email: user.email,
                title: user.title,
                country: user.country,
                dob: user.dob,
                phone: user.phone,
                profilePicture: user.profilePicture,
                name: user.firstName + user.lastName,
                isBlocked: user.isBlocked,
                createdAt: user.createdAt,
                ...(user_type === "freelancer" && {
                    location: user.location,
                    resumeLink: user.resumeLink,
                    certificateLink: user.certificateLink,
                    profileStatus: user.profileStatus,
                })
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error("USER CONTROLLER > LOGIN >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const logoutController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > LOGOUT > try block executed");
        const { uuid } = req.user

        if (!uuid) {
            res.status(400).json({ success: false, message: 'Failed to logout' });
            return;
        }

        const user = await getUserByUuid(uuid);

        if (!user) return res.status(404).json({ success: false, message: "Failed to logout" });

        await Promise.all([
            updateUserByUuidService(uuid, { refreshTokenVersion: user.refreshTokenVersion + 1 }),
            deleteUserSessionByUserId(uuid)
        ]);

        res.status(200).json({ success: true, message: "User Logged Out" });
    } catch (error) {
        console.error("USER CONTROLLER > LOGOUT >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const verifyOtpController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > VERIFY OTP > try block executed");

        const { email, otp, intent } = req.body;

        const user = await getUserByEmail(email);

        if (!user) return res.status(404).json({ success: false, message: "Email does not exists" });

        if (process.env.ENVIRONMENT?.toLowerCase() !== 'production') {
            if (otp !== '0000') return res.status(403).json({ success: false, message: "Invalid OTP" });
            const accessToken = generateAccessToken({ uuid: user.uuid, version: user.refreshTokenVersion, intent });
            res.status(200).json({ success: true, token: accessToken, message: 'OTP Verified Successfully!' });
        }

        const storedOtp = await redisClient.get(`otp:${user.uuid}`);

        if (storedOtp && storedOtp === otp) {
            await redisClient.del(`otp:${user.uuid}`);
            await updateUserByUuidService(user.uuid, { isVerified: true })
            const accessToken = generateAccessToken({ uuid: user.uuid, version: user.refreshTokenVersion, intent });
            res.status(200).json({ success: true, token: accessToken, message: 'OTP Verified Successfully!' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error("USER CONTROLLER > VERIFY OTP >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updatePasswordController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > UPDATE PASSWORD > try block executed");

        const { uuid, intent } = req.user;
        const { password } = req.body;

        if (intent !== 'PASSWORD_UPDATE') return res.status(401).json({ success: false, message: "Unauthorized User" });

        const user = await getUserByUuid(uuid)

        if (!user) return res.status(404).json({ success: false, message: "User does not exists" });

        const hashedPassword = await hashPassword(password);

        await updateUserByUuidService(uuid, {
            password: hashedPassword,
            refreshTokenVersion: user.refreshTokenVersion + 1
        });

        res.status(200).json({ success: true, message: "Password updated" });
    } catch (error) {
        console.error("USER CONTROLLER > UPDATE PASSWORD >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const sendOtpController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > SEND OTP > try block executed");
        const { email } = req.body;
        const user = await getUserByEmail(email);

        if (!user) return res.status(404).json({ success: false, message: "Email does not exists" });

        if (process.env.ENVIRONMENT?.toLowerCase() !== 'production')
            res.status(201).json({ success: true, message: "OTP send successfully" });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        await redisClient.set(`otp:${user.uuid}`, otp, 'EX', 60);

        await sendOtpEmail(email, otp);

        res.status(201).json({ success: true, message: "OTP send successfully" });

    } catch (error) {
        console.error("USER CONTROLLER > SEND OTP >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUserDetailsController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > GET USER DETAILS > try block executed");
        res.status(200).json({ success: true, message: "User details fetched" });
    } catch (error) {
        console.error("USER CONTROLLER > GET USER DETAILS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export {
    userSignupController,
    loginController,
    logoutController,
    verifyOtpController,
    updatePasswordController,
    sendOtpController,
    getUserDetailsController,
}