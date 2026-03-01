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
import { getOrderService } from "../services/orderService.js";
import { deleteFreelancersLanguage } from '../services/freelancerLanguageService.js';
import { insertManyFreelancerLanguagesService } from '../services/freelancerLanguageService.js';
import { updateUserByUuidService, getUserByUuid } from '../services/userService.js';
import { PROFILE_UPDATE_OTP_MESSAGE_SUBCODE } from '../helpers/constants.js';
import { getOrderByUuid, updateOrderByUuidService } from '../services/orderService.js';
import { redisClient } from "../../infra/redis.js";
import { sendOtpEmail } from "../helpers/mailer.js";

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
        else if (files?.dbs?.[0]) uploadType = 'cv';
        else if (files?.cv?.[0]) uploadType = 'dbs';
        else return res.status(400).json({ success: false, message: "Please upload a valid image or file to upload" });

        const fileUploadDecision = {
            "profile_picture": uploadFile(files?.profile_picture?.[0], "users/profilePicture"),
            "cv": uploadFile(files?.cv?.[0], "freelancers/cv"),
            "dbs": uploadFile(files?.dbs?.[0], "freelancers/dbs")
        }

        const file_url = await fileUploadDecision[uploadType];

        res.status(200).json({ success: true, file_url: file_url, message: "Signup successful" });
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
        const { serviceId, fixedPriceCents, description, currency, title } = req.body;

        const freelancer = await getFreelancerProfileDetailByUserUuid(uuid);

        const addedService = await insertManyFreelancerServices({
            freelancerId: freelancer.uuid,
            serviceId: serviceId,
            fixedPriceCents: fixedPriceCents,
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

        console.log("UPDATE SERVICE CONTROLLER > GET MY PROFILE > try block executed");

        const { uuid } = req.user;
        const { serviceId, fixedPriceCents, description, title } = req.body;

        const freelancer = await getFreelancerProfileDetailByUserUuid(uuid);

        const service = await getFreelancerServices(freelancer.uuid, serviceId);

        if (!service) return res.status(400).json({ success: false, message: "No record found for this service against you details." });

        await updateFreelancerService(
            {
                freelancerId: freelancer.uuid,
                serviceId: serviceId,
            },
            {
                fixedPriceCents: fixedPriceCents,
                description: description,
                title: title
            }
        );

        res.status(200).json({ success: true, message: "Service updated successfully." });
    } catch (error) {
        console.error("UPDATE SERVICE CONTROLLER > GET MY PROFILE >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const updateFreelancerProfileController = async (req, res) => {
    try {

        console.log("FREELANCER CONTROLLER > UPDATE FREELANCER PROFILE > try block executed");

        const { uuid } = req.user;
        const { profile_picture_url, title, first_name, last_name, email, phone, dob, country, languages, cv_url, dbs_url, location } = req.body;

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

const completeOrderController = async (req, res) => {
    try {

        console.log("COMPLETE ORDER CONTROLLER > COMPLETE ORDER > try block executed");

        const { uuid } = req.user;
        const { order_id } = req.params;

        const order = await getOrderByUuid(order_id);

        if (!order) return res.status(400).json({ success: false, message: "Order not found." });

        if (order.freelancerId !== uuid) return res.status(403).json({ success: false, message: "You are not allowed to complete this order" });

        if (order.status === "pending") return res.status(403).json({ success: false, message: "Can not complete at this state" });

        await updateOrderByUuidService(order_id, { status: "completed" });

        res.status(200).json({ success: true, message: "Order completed successfully." });
    } catch (error) {
        console.error("COMPLETE ORDER CONTROLLER > COMPLETE ORDER >", error);
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
    updateFreelancerProfileController,
    getMyFreelancerProfileController,
}