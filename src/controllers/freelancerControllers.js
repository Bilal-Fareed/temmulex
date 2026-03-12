import { uploadFile } from "../helpers/cloudinary.js";
import {
    getFreelancerDetails,
    updateFreelancerDetailService,
    getFreelancerProfileDetailByUserUuid
} from "../services/freelancerProfileService.js";
import {
    getFreelancerServices,
    updateFreelancerService,
    deleteFreelancerServices,
    insertManyFreelancerServices,
} from "../services/freelancerServicesService.js";
import { getUserSpecificConversationListService, getConversationMessagesService, getConversationService, addMessageServices } from "../services/conversationService.js";
import { getOrderService, getFreelancerCompletedOrderStats } from "../services/orderService.js";
import { deleteFreelancersLanguage } from '../services/freelancerLanguageService.js';
import { insertManyFreelancerLanguagesService } from '../services/freelancerLanguageService.js';
import { updateUserByUuidService, getUserByUuid } from '../services/userService.js';
import { PROFILE_UPDATE_OTP_MESSAGE_SUBCODE } from '../helpers/constants.js';
import { getOrderByUuid, updateOrderByUuidService } from '../services/orderService.js';
import { redisClient } from "../../infra/redis.js";
import { sendOtpEmail } from "../helpers/mailer.js";
import { dollarsToCents } from "../helpers/constants.js";
import { socketUsers, emitNewMessage } from "../../socketServer.js";

const getMyFreelancerProfileController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > GET MY PROFILE > try block executed");

        const { uuid } = req.user;

        const freelancer = await getFreelancerDetails(uuid);

        if (!freelancer || freelancer.length < 1) return res.status(404).json({ success: false, message: "User does not exists" });

        res.status(200).json({ success: true, message: "Freelancer details fetched", freelancer: freelancer[0] });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > GET MY PROFILE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const uploadFileController = async (req, res) => {
    try {
        console.log("FREELANCER CONTROLLER > UPLOAD FILE > try block executed");

        const files = req.files ?? {};

        let uploadType;

        if (files?.profile_picture?.[0]) uploadType = 'profile_picture';
        else if (files?.dbs?.[0]) uploadType = 'dbs';
        else if (files?.cv?.[0]) uploadType = 'cv';
        else return res.status(400).json({ success: false, message: "Please upload a valid image or file to upload" });

        const fileUploadDecision = {
            "profile_picture": uploadFile(files?.profile_picture?.[0], "users/profilePicture"),
            "cv": uploadFile(files?.cv?.[0], "freelancers/cv"),
            "dbs": uploadFile(files?.dbs?.[0], "freelancers/dbs")
        }

        const file_url = await fileUploadDecision[uploadType];

        res.status(200).json({ success: true, file_url: file_url, message: "File uploaded successfully" });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > UPLOAD FILE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteServiceController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > DELETE SERVICE > try block executed");

        const { uuid } = req.user;
        const { service_id } = req.params;

        const freelancer = await getFreelancerProfileDetailByUserUuid(uuid);

        const deletedService = await deleteFreelancerServices({
            freelancer_id: freelancer.uuid,
            service_id: service_id,
        });

        if (!deletedService || deletedService.length < 1) return res.status(400).json({ success: true, message: "Service not found." });

        res.status(200).json({ success: true, message: "Service deleted successfully." });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > DELETE SERVICE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const addServiceController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > ADD SERVICE > try block executed");

        const { uuid } = req.user;
        const { serviceId, fixedPriceDollars, description, currency, title } = req.body;

        const freelancer = await getFreelancerProfileDetailByUserUuid(uuid);

        const addedService = await insertManyFreelancerServices({
            freelancerId: freelancer.uuid,
            serviceId: serviceId,
            fixedPriceCents: dollarsToCents(fixedPriceDollars),
            currency: currency,
            description: description,
            title: title
        });

        res.status(200).json({ success: true, message: "Service added successfully." });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > ADD SERVICE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateServiceController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > GET MY PROFILE > try block executed");

        const { uuid } = req.user;
        const { serviceId, fixedPriceDollars, description, title } = req.body;

        const freelancer = await getFreelancerProfileDetailByUserUuid(uuid);

        const service = await getFreelancerServices(freelancer.uuid, serviceId);

        if (!service) return res.status(400).json({ success: false, message: "No record found for this service against you details." });

        await updateFreelancerService(
            {
                freelancerId: freelancer.uuid,
                serviceId: serviceId,
            },
            {
                fixedPriceCents: dollarsToCents(fixedPriceDollars),
                description: description,
                title: title
            }
        );

        res.status(200).json({ success: true, message: "Service updated successfully." });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > GET MY PROFILE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateFreelancerProfileController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > UPDATE FREELANCER PROFILE > try block executed");

        const { uuid } = req.user;
        const { profile_picture_url, title, first_name, last_name, email, phone, dob, country, languages, cv_url, dbs_url, location, otp } = req.body;

        const user = await getUserByUuid(uuid);

        if (user?.isDeleted || user?.isBlocked) return res.status(400).json({ success: false, message: "Please contact support, your account has been deleted or blocked." });

        const freelancer = await getFreelancerProfileDetailByUserUuid()

        if (otp) {
            const storedOtp = await redisClient.get(`otp:${email}`);

            if (storedOtp && storedOtp === otp) {
                await redisClient.del(`otp:${email}`);
            } else {
                return res.status(403).json({ success: false, message: "Invalid OTP, please verify OTP to update your email." });
            }
        } else if (user && user.email !== email) {
            const otp = Math.floor(1000 + Math.random() * 9000).toString();

            await redisClient.set(`otp:${email}`, otp, 'EX', 60);

            await sendOtpEmail(email, otp);

            return res.status(200).json({ success: true, subcode: PROFILE_UPDATE_OTP_MESSAGE_SUBCODE, message: "An OTP is send on your new email please verify OTP to update your profile." });
        }

        await db.transaction(async (tx) => {

            await updateUserByUuidService(uuid, {
                email,
                title,
                first_name,
                last_name,
                country,
                dob,
                phone,
                profilePicture: profile_picture_url
            }, { transaction: tx });

            await updateFreelancerDetailService({
                cvUrl: cv_url,
                dbsUrl: dbs_url,
                location: location,
            }, { userId: uuid }, { transaction: tx });

            await deleteFreelancersLanguage({
                freelancerId: freelancer.uuid
            }, { transaction: tx })

            if (languages?.length) {
                await insertManyFreelancerLanguagesService(
                    languages.map((lang) => ({
                        freelancerId: freelancer.uuid,
                        languageId: lang,
                    })), { transaction: tx }
                )
            }
        });
        res.status(200).json({ success: true, message: "Profile updated successfully." });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > UPDATE FREELANCER PROFILE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getMyOrdersController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > GET MY ORDERS > try block executed");

        const { uuid } = req.user;
        const { page = 1, limit = 10, order_status } = req.query;

        const data = await getOrderService({
            status: order_status,
            freelancerId: uuid,
        }, {}, { page, limit });

        res.status(200).json({ success: true, message: "Orders fetched successfully", data: data || [] });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > GET MY ORDERS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getDashboardDetailsController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > GET DASHBOARD DETAILS > try block executed");

        const { uuid } = req.user;

        const result = await getFreelancerCompletedOrderStats(uuid);

        res.status(200).json({ success: true, message: "Dashboard details fetched successfully.", data: result });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > GET DASHBOARD DETAILS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getFreelancerChatsController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > GET CHATS LIST > try block executed");

        const { uuid } = req.user;
        const { page = 1, limit = 10 } = req.query;

        const conversationList = await getUserSpecificConversationListService({
            freelancerId: uuid,
            page,
            limit
        })

        res.status(200).json({ success: true, message: "Conversation List Fetched Successfully", data: conversationList });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > GET CHATS LIST >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getConversationMessagesController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > GET CONVERSATION MESSAGES > try block executed");

        const { uuid } = req.user;
        
        let { page = 1, limit = 50, client_id, conversation_id } = req.query;

        if (client_id && conversation_id) return res.status(400).json({ success: false, message: "Bad Request." })
        
        if (client_id) {
            const conversation = await getConversationService({
                freelancerId: uuid,
                clientId: client_id
            })
            conversation_id = conversation?.uuid
        }

        if(!conversation_id) return res.status(403).json({ success: false, message: "No conversation found." })

        const messages = await getConversationMessagesService({
            conversationId: conversation_id
        }, {}, { page, limit });

        res.status(200).json({ success: true, message: "Conversation List Fetched Successfully", data: messages });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > GET CONVERSATION MESSAGES >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const completeOrderController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > COMPLETE ORDER > try block executed");

        const { uuid } = req.user;
        const { order_id } = req.params;

        const order = await getOrderByUuid(order_id);

        if (!order) return res.status(400).json({ success: false, message: "Order not found." });

        if (order.freelancerId !== uuid) return res.status(403).json({ success: false, message: "You are not allowed to complete this order" });

        if (order.status === "pending") return res.status(403).json({ success: false, message: "Can not complete at this state" });

        await updateOrderByUuidService(order_id, { status: "completed" });

        res.status(200).json({ success: true, message: "Order completed successfully." });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > COMPLETE ORDER >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const sendMessagesController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > SEND MESSAGES > try block executed");

        const { uuid } = req.user;
        const { receiverId, content = null } = req.body;
        const files = req.files ?? {};
        let uploadType = 'text', fileUrl = null;

        const conversation = await getConversationService({
            freelancerId: uuid,
            clientId: receiverId
        })

        if (!conversation) return res.status(403).json({ success: false, message: "No conversation found." })

        if (files?.audio?.[0] || files?.image?.[0]) {
            if (files?.audio?.[0]) uploadType = 'image';
            else if (files?.image?.[0]) uploadType = 'audio';

            const fileUploadDecision = {
                "image": uploadFile(files?.profile_picture?.[0], "chat/images"),
                "audio": uploadFile(files?.cv?.[0], "chat/audios"),
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
        }

        res.status(200).json({ success: true, message: "Message Send Successfully" });
    } catch (error) {
        console.error("FREELANCER CONTROLLER > SEND MESSAGES >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export {
    uploadFileController,
    addServiceController,
    getMyOrdersController,
    deleteServiceController,
    updateServiceController,
    completeOrderController,
    sendMessagesController,
    getFreelancerChatsController,
    getDashboardDetailsController,
    updateFreelancerProfileController,
    getMyFreelancerProfileController,
    getConversationMessagesController,
}