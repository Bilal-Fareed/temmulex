import { uploadFile } from "../helpers/cloudinary.js";
import { sendNotification } from "../helpers/firebase.js";
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken } from "../helpers/security.js";
import { getUserByEmail, createUserService, getUserByUuid, updateUserByUuidService } from "../services/userService.js";
import { insertFreelancerDetailService, getFreelancerProfileDetailByUserUuid, getNearbyFreelancers } from "../services/freelancerProfileService.js";
import { insertManyFreelancerLanguagesService } from "../services/freelancerLanguageService.js";
import { insertManyFreelancerServices, getFreelancerServices } from "../services/freelancerServicesService.js";
import { getOrderService, rateOrder } from "../services/orderService.js";
import { getNotificationTokenService, addNotificationTokenService } from "../services/notificationTokenService.js";
import {
    addMessageServices,
    getConversationService,
    insertConversationServices,
    getConversationMessagesService,
    getUserSpecificConversationListService,
} from "../services/conversationService.js";
import { redisClient } from "../../infra/redis.js";
import { sendOtpEmail } from "../helpers/mailer.js";
import { createOrderService } from "../services/orderService.js"
import { deleteUserSessionByUserId, insertUserSession } from "../services/sessionsService.js";
import { randomUUID } from 'crypto';
import { PROFILE_UPDATE_OTP_MESSAGE_SUBCODE } from '../helpers/constants.js';
import { db } from "../../infra/db.js";
import { socketUsers, emitNewMessage } from "../../socketServer.js";
import { dollarsToCents } from "../helpers/constants.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const userSignupController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > SIGNUP > try block executed");

        let cvUrl = null;
        let dbsUrl = null;

        const { email, password, title, first_name, last_name, country, dob, phone, user_type, services, languages, location } = req.body;
        const files = req.files ?? {};

        if (req.user?.email !== email) return res.status(403).json({ success: false, message: "Please use the same email for registration which was used for OTP verification." });

        if (req.user?.intent !== 'EMAIL_VERIFICATION') return res.status(403).json({ success: false, message: "Please verify OTP again for email verification." });

        const exists = await getUserByEmail(email);

        if (exists?.isDeleted || exists?.isBlocked) return res.status(400).json({ success: false, message: "Please contact support, the account on this email has been deleted or blocked." });

        if (exists) return res.status(403).json({ success: false, message: "Email already in use" });

        if (!files?.profile_picture?.[0]) return res.status(422).json({ success: false, message: "Profile picture is required" });

        const [hashedPassword, profilePictureUrl] = await Promise.all([
            hashPassword(password),
            uploadFile(files?.profile_picture?.[0], "users/profilePicture")
        ]);

        if (user_type === "freelancer" && (!files?.cv?.[0] || !files?.dbs?.[0])) {
            return res.status(422).json({ success: false, message: "CV and DBS are required for freelancers" });
        }

        if (user_type === "freelancer") {
            [cvUrl, dbsUrl] = await Promise.all([
                uploadFile(files?.cv?.[0], "freelancers/cv"),
                uploadFile(files?.dbs?.[0], "freelancers/dbs")
            ])
        };

        await db.transaction(async (tx) => {

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
            }, { transaction: tx });

            if (user_type === "freelancer") {

                const { lat = 0, lng = 0 } = location;
                const insertingFreelancersDetails = [];

                const freelancer = await insertFreelancerDetailService({ userId: user.uuid, lat, lng, cvUrl, dbsUrl }, { transaction: tx });

                if (services?.length) {
                    insertingFreelancersDetails.push(
                        insertManyFreelancerServices(
                            services.map((service) => ({
                                freelancerId: freelancer.uuid,
                                serviceId: service.serviceId,
                                fixedPriceCents: dollarsToCents(service.fixedPriceDollars),
                                currency: service.currency
                            })), { transaction: tx }
                        )
                    );
                }

                if (languages?.length) {
                    insertingFreelancersDetails.push(
                        insertManyFreelancerLanguagesService(
                            languages.map((lang) => ({
                                freelancerId: freelancer.uuid,
                                languageId: lang,
                            })), { transaction: tx }
                        )
                    );
                }
                await Promise.all(insertingFreelancersDetails);
            }
        });
        res.status(200).json({ success: true, message: "Signup successful" });
    } catch (error) {
        console.error("USER CONTROLLER > SIGNUP >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const uploadFileController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > UPLOAD FILE > try block executed");

        const files = req.files ?? {};

        if (!files?.profile_picture?.[0]) return res.status(400).json({ success: false, message: "Please provide an image to upload" });

        const file_url = await uploadFile(files?.profile_picture?.[0], "users/profilePicture");

        res.status(200).json({ success: true, file_url: file_url, message: "File Uploaded successfully" });
    } catch (error) {
        console.error("USER CONTROLLER > UPLOAD FILE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateUserProfileController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > UPDATE USER PROFILE > try block executed");

        const { uuid } = req.user;
        const { email, title, first_name, last_name, country, dob, phone, profile_picture, otp } = req.body;

        const user = await getUserByUuid(uuid);

        if (user?.isDeleted || user?.isBlocked) return res.status(400).json({ success: false, message: "Please contact support, your account has been deleted or blocked." });

        if (otp) {
            const storedOtp = await redisClient.get(`otp:${email}`);

            if (storedOtp && storedOtp === otp) {
                await redisClient.del(`otp:${email}`);
                await updateUserByUuidService(uuid, {
                    email,
                    title,
                    firstName: first_name,
                    lastName: last_name,
                    country,
                    dob,
                    phone,
                    profilePicture: profile_picture
                });
            } else {
                return res.status(403).json({ success: false, message: "Invalid OTP, please verify OTP to update your email." });
            }
        } else if (user && user.email !== email) {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();

            await redisClient.set(`otp:${email}`, otp, 'EX', 60);

            await sendOtpEmail(email, otp);

            return res.status(200).json({ success: true, subcode: PROFILE_UPDATE_OTP_MESSAGE_SUBCODE, message: "An OTP is send on your new email please verify OTP to update your profile." });
        }

        await updateUserByUuidService(uuid, {
            title,
            firstName: first_name,
            lastName: last_name,
            country,
            dob,
            phone,
            profilePicture: profile_picture
        });

        res.status(200).json({ success: true, message: "Your profile details have been updated successfully" });
    } catch (error) {
        console.error("USER CONTROLLER > UPDATE USER PROFILE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const loginController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > LOGIN > try block executed");

        const { email, password, user_type } = req.body;
        const userAgent = req.headers['x-user-agent'] || 'unknown';
        const deviceId = req.headers['x-device-id'];

        let user = await getUserByEmail(email) || {};
        if (!user || !user.password) return res.status(403).json({ success: false, message: 'Invalid credentials.' });

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return res.status(403).json({ success: false, message: 'Invalid credentials.' });
        
        if (user?.isDeleted || user?.isBlocked) return res.status(400).json({ success: false, message: "Please contact support, the account on this email has been deleted or blocked." });

        if (user_type === "freelancer") {
            const freelancerProfileDetails = await getFreelancerProfileDetailByUserUuid(user.uuid);
            if (!freelancerProfileDetails) return res.status(404).json({ success: false, message: 'Please create a shopper profile first to proceed further.' });
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
                firstName: user.firstName,
                lastName: user.lastName,
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

const deleteAccountController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > DELETE ACCOUNT > try block executed");
        const { uuid } = req.user

        if (!uuid) {
            res.status(400).json({ success: false, message: 'Failed to delete account' });
            return;
        }

        const user = await getUserByUuid(uuid);

        if (!user) return res.status(404).json({ success: false, message: "Failed to delete account" });

        await Promise.all([
            updateUserByUuidService(uuid, { refreshTokenVersion: user.refreshTokenVersion + 1, isDeleted: true }),
            deleteUserSessionByUserId(uuid)
        ]);

        res.status(200).json({ success: true, message: "User Logged Out" });
    } catch (error) {
        console.error("USER CONTROLLER > DELETE ACCOUNT >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const verifyOtpController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > VERIFY OTP > try block executed");

        const { email, otp, intent = 'EMAIL_VERIFICATION' } = req.body;

        if (process.env.ENVIRONMENT?.toLowerCase() !== 'production') {
            if (otp !== '0000') return res.status(403).json({ success: false, message: "Invalid OTP" });
            const accessToken = generateAccessToken({ email, intent });
            return res.status(200).json({ success: true, token: accessToken, message: 'OTP Verified Successfully!' });
        }

        const storedOtp = await redisClient.get(`otp:${email}`);

        if (storedOtp && storedOtp === otp) {
            await redisClient.del(`otp:${email}`);
            const accessToken = generateAccessToken({ email, intent }, { expiryTime: '5m' });
            return res.status(200).json({ success: true, token: accessToken, message: 'OTP Verified Successfully!' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        console.error("USER CONTROLLER > VERIFY OTP >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const forgotPasswordController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > FORGOT PASSWORD > try block executed");

        const { email, intent } = req.user;
        const { password } = req.body;

        if (intent !== 'PASSWORD_UPDATE') return res.status(401).json({ success: false, message: "Unauthorized User" });

        const user = await getUserByEmail(email);

        if (!user) return res.status(404).json({ success: false, message: "User does not exists" });

        const hashedPassword = await hashPassword(password);

        await updateUserByUuidService(uuid, {
            password: hashedPassword,
            refreshTokenVersion: user.refreshTokenVersion + 1
        });

        res.status(200).json({ success: true, message: "Password updated" });
    } catch (error) {
        console.error("USER CONTROLLER > FORGOT PASSWORD >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updatePasswordController = async (req, res) => {
    try {
        console.log("USER CONTROLLER > UPDATE PASSWORD > try block executed");

        const { uuid } = req.user;
        const { old_password, new_password } = req.body;

        const user = await getUserByUuid(uuid);

        if (!user) return res.status(404).json({ success: false, message: "User does not exists" });

        const isValid = await verifyPassword(old_password, user.password);

        if (!isValid) return res.status(403).json({ success: false, message: "Your old password is incorrect" });

        const hashedPassword = await hashPassword(new_password);

        await updateUserByUuidService(uuid, {
            password: hashedPassword,
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

        if (process.env.ENVIRONMENT?.toLowerCase() !== 'production')
            return res.status(201).json({ success: true, message: "OTP send successfully" });

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        await redisClient.set(`otp:${email}`, otp, 'EX', 60);

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

        const { uuid } = req.params;

        const user = await getUserByUuid(uuid, {
            password: false,
            refreshTokenVersion: false,
            updatedAt: false,
            id: false
        });

        if (!user) return res.status(404).json({ success: false, message: "User does not exists" });

        res.status(200).json({ success: true, message: "User details fetched", user: user });
    } catch (error) {
        console.error("USER CONTROLLER > GET USER DETAILS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getMyProfileController = async (req, res) => {
    try {

        console.log("USER CONTROLLER > GET MY PROFILE > try block executed");
        
        const { uuid } = req.user;

        const user = await getUserByUuid(uuid, {
            password: false,
            refreshTokenVersion: false,
            updatedAt: false,
            id: false
        });

        if (!user) return res.status(404).json({ success: false, message: "User does not exists" });

        res.status(200).json({ success: true, message: "User details fetched", user: user });
    } catch (error) {
        console.error("USER CONTROLLER > GET MY PROFILE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getNearbyTopRatedShoppersController = async (req, res) => {
    try {

        console.log("USER CONTROLLER > GET NEARBY TOP RATED SHOPPERS > try block executed");
        
        let {
            lat = 0.0,
            lng = 0.0,
            radius = 1000,
            languages = [],
            services = [],
            search_text,
            page = 1,
            limit = 10,
            price_range
        } = req.query;

        if (!Array.isArray(languages)) languages = [languages];
        if (!Array.isArray(services)) services = [services];
        if (price_range) price_range = JSON.parse(price_range);

        const data = await getNearbyFreelancers({
            lat,
            lng,
            radius,
            languageIds: languages,
            serviceIds: services,
            page,
            limit,
            search_text,
            ...(price_range && { price_range })
        });

        res.status(200).json({ success: true, message: "Nearby shoppers fetched successfully", data: data || [] });
    } catch (error) {
        console.error("USER CONTROLLER > GET NEARBY TOP RATED SHOPPERS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getMyOrdersController = async (req, res) => {
    try {

        console.log("USER CONTROLLER > GET MY ORDERS > try block executed");

        const { uuid } = req.user;
        const { page = 1, limit = 10, order_status } = req.query;

        const data = await getOrderService({
            status: order_status,
            clientId: uuid,
        }, {}, { page, limit });

        res.status(200).json({ success: true, message: "Orders fetched successfully", data: data || [] });
    } catch (error) {
        console.error("USER CONTROLLER > GET MY ORDERS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const placeOrderController = async (req, res) => {
    try {

        console.log("USER CONTROLLER > PLACE ORDER > try block executed");

        const { uuid } = req.user;
        const { service_id, freelancer_id } = req.body;

        if(uuid === freelancer_id) return res.status(403).json({success: false, message: "You can not book a service for yourself."})

        const freelancerDetails = await getFreelancerProfileDetailByUserUuid(freelancer_id);
        
        if(!freelancerDetails) return res.status(400).json({success: false, message: "The user with whome you are trying to book is not a shopper."})

        const freelancerService = await getFreelancerServices(freelancerDetails.uuid, service_id);

        if(!freelancerService) return res.status(400).json({success: false, message: "This selected service is not offered by the shopper."})

        if (!freelancerService?.fixedPriceCents) return res.status(400).json({ success: false, message: "The Shopper has not finalized the pricing for this service yet." })

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: freelancerService?.fixedPriceCents,
            currency: "GBP",
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        });

        const order = await createOrderService({
            clientId: uuid, 
            freelancerId: freelancer_id, 
            serviceId: service_id, 
            price: freelancerService.fixedPriceCents,
            paymentReference: paymentIntent.id,
        })

        res.status(200).json({
            success: true,
            message: "Your order have been placed successfully",
            data: {
                ...order,
                clientSecret: paymentIntent.client_secret,
            }
        });

    } catch (error) {
        console.error("USER CONTROLLER > PLACE ORDER >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const orderFeedbackController = async (req, res) => {
    try {

        console.log("USER CONTROLLER > BOOKING FEEDBACK > try block executed");

        const { booking_id, rating } = req.body;

        const order = await getOrderService({ uuid: booking_id }, {}, { page: 1, limit: 1 });

        if (!order || order.length <= 0) return res.status(400).json({ success: false, message: "Booking not found." });

        await rateOrder({
            orderId: order[0].orderId,
            reviewerId: order[0].clientUuid,
            freelancerId: order[0].freelancerUuid,
            rating: rating
        })

        res.status(200).json({ success: true, message: "Rating has been added successfully" });
    } catch (error) {
        console.error("USER CONTROLLER > BOOKING FEEDBACK >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUserChatsController = async (req, res) => {
    try {

        console.log("USER CONTROLLER > GET CHATS LIST > try block executed");

        const { uuid } = req.user;
        const { page = 1, limit = 10 } = req.query;

        const conversationList = await getUserSpecificConversationListService({
            clientId: uuid,
            page,
            limit
        })

        res.status(200).json({ success: true, message: "Conversation List Fetched Successfully", data: conversationList });
    } catch (error) {
        console.error("USER CONTROLLER > GET CHATS LIST >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getConversationMessagesController = async (req, res) => {
    try {

        console.log("USER CONTROLLER > GET CONVERSATION MESSAGES > try block executed");

        const { uuid } = req.user;
        
        let { page = 1, limit = 50, freelancer_id, conversation_id } = req.query;

        if (freelancer_id && conversation_id) return res.status(400).json({ success: false, message: "Bad Request." })
        
        if (freelancer_id) {
            let conversation = await getConversationService({
                freelancerId: freelancer_id,
                clientId: uuid
            })

            if (!conversation) {
                conversation = await insertConversationServices([
                    { clientId: uuid, freelancerId: freelancer_id }
                ])
            }

            conversation_id = conversation?.uuid
        }

        if(!conversation_id) return res.status(403).json({ success: false, message: "No conversation found." })

        const messages = await getConversationMessagesService({
            conversationId: conversation_id
        }, {}, { page, limit });

        res.status(200).json({ success: true, message: "Messages fetched Successfully", data: messages });
    } catch (error) {
        console.error("USER CONTROLLER > GET CONVERSATION MESSAGES >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const sendMessagesController = async (req, res) => {
    try {

        console.log("USER CONTROLLER > SEND MESSAGES > try block executed");

        const { uuid } = req.user;
        const { receiverId, content = null } = req.body;
        const files = req.files ?? {};
        let uploadType = 'text', fileUrl = null;

        const conversation = await getConversationService({
            freelancerId: receiverId,
            clientId: uuid
        })

        if (!conversation) return res.status(403).json({ success: false, message: "No conversation found." })

        if (files?.audio?.[0]) uploadType = 'audio';
        else if (files?.image?.[0]) uploadType = 'image';
        else if (files?.pdf?.[0]) uploadType = 'pdf';
        else if (files?.video?.[0]) uploadType = 'video';

        if (['audio', 'image', 'pdf', 'video'].includes(uploadType)) {
            const fileUploadDecision = {
                "image": uploadFile(files?.profile_picture?.[0], "chat/images"),
                "audio": uploadFile(files?.cv?.[0], "chat/audios"),
                "video": uploadFile(files?.pdf?.[0], "chat/videos"),
                "pdf": uploadFile(files?.pdf?.[0], "chat/pdf"),
            }

            fileUrl = await fileUploadDecision[uploadType];
        }

        await addMessageServices([{
            senderId: uuid,
            conversationId: conversation.uuid,
            content: content,
            attachmentUrl: fileUrl,
            contenType: uploadType
        }])

        const receiverSocket = socketUsers.get(receiverId)

        if (receiverSocket) {
            emitNewMessage(receiverSocket, 'receive_message', {
                senderId: uuid,
                conversationId: conversation.uuid,
                content: content,
                attachmentUrl: fileUrl,
                contenType: uploadType
            })
        } else {
            const notificationTokens = await getNotificationTokenService({ userId: receiverId })
            if (!notificationTokens || notificationTokens?.length === 0) console.log("Notification token not found.")
            const tokens = notificationTokens.map(nt => nt.token);
            sendNotification(tokens, 'New Message', content, {
                senderId: uuid,
                conversationId: conversation.uuid,
                content: content,
                attachmentUrl: fileUrl,
                contenType: uploadType
            })

        }

        res.status(200).json({ success: true, message: "Message Send Successfully" });
    } catch (error) {
        console.error("USER CONTROLLER > SEND MESSAGES >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const storeFirebaseNotificationTokenController = async (req, res) => {
    try {

        console.log("USER CONTROLLER > STORE FIREBASE NOTIFICATION TOKEN > try block executed");
        
        const { uuid } = req.user;
        const { token } = req.body;
        const deviceId = req.headers['x-device-id'], userAgent = req.headers['x-user-agent'] || 'android';

        const tokenExists = await getNotificationTokenService({ deviceId, userId: uuid });

        if (tokenExists) return res.status(200).json({ success: true, message: "Token already exists." });

        await addNotificationTokenService({
            userId: uuid,
            token: token,
            deviceId: deviceId,
            userAgent: userAgent,
        });

        res.status(200).json({ success: true, message: "User notification token stored successfully" });
    } catch (error) {
        console.error("USER CONTROLLER > STORE FIREBASE NOTIFICATION TOKEN >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export {
    userSignupController,
    loginController,
    logoutController,
    orderFeedbackController,
    verifyOtpController,
    sendMessagesController,
    forgotPasswordController,
    updatePasswordController,
    sendOtpController,
    getUserDetailsController,
    deleteAccountController,
    getMyProfileController,
    placeOrderController,
    updateUserProfileController,
    getMyOrdersController,
    getUserChatsController,
    uploadFileController,
    getConversationMessagesController,
    getNearbyTopRatedShoppersController,
    storeFirebaseNotificationTokenController,
}