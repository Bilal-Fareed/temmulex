import { getAdminByEmail, getAdminByUuid, updateAdminByUuidService } from "../services/adminService.js";
import { verifyPassword, generateAccessToken } from "../helpers/security.js";
import { refundPayment, disbursePayment } from "../helpers/payment.js"; 
import { dollarsToCents }from "../helpers/constants.js"
import { adminDashboardUserStats, getUsersList, getUserByUuid, updateUserByUuidService } from "../services/userService.js";
import {
    getShoppersList,
    getFreelancerDetails,
    getFreelancerProfileDetailByUserUuid,
    updateFreelancerDetailDynamicallyService,
} from "../services/freelancerProfileService.js";
import {
    getOrderService,
    adminDashboardOrderStats,
    getAdminOrdersListService,
    getUserOrderCountsAndValue,
    getOrderByFilterService,
    updateOrderByUuidService,
    getOrderDetailsForAdminService,
    getAdminOrdersListForPaymentService,
    updateOrderPaymentStatusService,
} from "../services/orderService.js";
import {
    getSupportListService,
    getContactUsQueryByIdServices,
    updateContactUsQueryService,
} from "../services/contactUsService.js";

const adminLoginController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > LOGIN > try block executed");

        const { email, password } = req.body;

        const admin = await getAdminByEmail(email);
        if (!admin) return res.status(403).json({ success: false, message: 'Invalid credentials.' });

        const isValid = await verifyPassword(password, admin.password);
        if (!isValid) return res.status(403).json({ success: false, message: 'Invalid credentials.' });
        
        const accessToken = generateAccessToken({
            uuid: admin.uuid,
            email: admin.email,
            version: admin.refreshTokenVersion,
        }, { expiryTime: '12h' });

        res.status(200).json({
            success: true,
            user: {
                uuid: admin.uuid,
                email: admin.email,
                firstName: admin.firstName,
                lastName: admin.lastName,
            },
            accessToken,
        });
    } catch (error) {
        console.error("ADMIN CONTROLLER > LOGIN >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminLogoutController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > LOGOUT > try block executed");
        const { uuid } = req.user;

        if (!uuid) {
            res.status(400).json({ success: false, message: 'Failed to logout' });
            return;
        }

        const admin = await getAdminByUuid(uuid);

        if (!admin) return res.status(404).json({ success: false, message: "Failed to logout" });

        await updateAdminByUuidService(uuid, { refreshTokenVersion: admin.refreshTokenVersion + 1 });

        res.status(200).json({ success: true, message: "Admin Logged Out" });
    } catch (error) {
        console.error("ADMIN CONTROLLER > LOGOUT >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminDashboardController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN DASHBOARD STATS > try block executed");

        const [userStats, orderStats, orderList] = await Promise.all([
            adminDashboardUserStats(),
            adminDashboardOrderStats(),
            getOrderService({}, undefined, { page: 1, limit: 5 })
        ])

        res.status(200).json({ success: true, message: "Admin Dashboard Data Fetched Successfully", data: {
            userStats,
            orderStats,
            orderList
        } });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN DASHBOARD STATS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminClientListController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN CLIENT LIST > try block executed");

        const { page, limit, search_text, profile_status } = req.query;

        const clientList = await getUsersList({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search_text,
            profile_status
        });

        res.status(200).json({ success: true, message: "Client List Fetched Successfully", data: clientList });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN CLIENT LIST >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminGetClientDetailController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN CLIENT DETAILS > try block executed");

        const { user_id } = req.params;

        const clientData = await getUserByUuid(user_id, {
            password: false,
            refreshTokenVersion: false,
            updatedAt: false,
            id: false
        });

        const orderDetail = await getUserOrderCountsAndValue({
            clientId: user_id
        })

        res.status(200).json({
            success: true,
            message: "Client Details Fetched Successfully",
            data: {
                ...clientData,
                ...orderDetail
            }
        });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN CLIENT DETAILS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminBlockUserController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN BLOCK USER > try block executed");

        const { user_id } = req.params;

        await updateUserByUuidService(user_id, { isBlocked: true });

        res.status(200).json({
            success: true,
            message: "User Blocked Successfully",
        });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN BLOCK USER >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminUpdateShopperDetailsController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN UPDATE SHOPPER STATUS > try block executed");

        const { shopper_id, status } = req.params;

        const shopper = await getFreelancerProfileDetailByUserUuid(shopper_id)

        if (shopper.profileStatus != "pending")
            return res.status(400).json({
                success: false,
                message: `Partner already ${shopper.profileStatus}, can not ${status} shopper!`
            });

        await updateFreelancerDetailDynamicallyService({ profileStatus: status }, { userId: shopper_id });

        res.status(200).json({
            success: true,
            message: `Shopper ${status} Successfully`,
        });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN UPDATE SHOPPER STATUS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminGetShopperDetailController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN SHOPPER DETAILS > try block executed");

        const { shopper_id } = req.params;

        const shopperData = await getFreelancerDetails(shopper_id);

        const orderDetail = await getUserOrderCountsAndValue({
            freelancerId: shopper_id
        })

        res.status(200).json({
            success: true,
            message: "Shopper Details Fetched Successfully",
            data: {
                ...shopperData,
                ...orderDetail
            }
        });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN SHOPPER DETAILS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminShoppersListController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN SHOPPERS LIST > try block executed");

        const { page, limit, search_text, profile_status } = req.query;

        const shoppersList = await getShoppersList({
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            search_text,
            profile_status
        });

        res.status(200).json({ success: true, message: "Shoppers List Fetched Successfully", data: shoppersList });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN SHOPPERS LIST >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminOrdersListController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN ORDERS LIST > try block executed");

        const { page, limit, search_text, order_status } = req.query;

        const ordersList = await getAdminOrdersListService({ search_text, order_status }, { page: Number(page) || 1, limit: Number(limit) || 10 });

        res.status(200).json({ success: true, message: "Orders List Fetched Successfully", data: ordersList });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN ORDERS LIST >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminPaymentListController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN ORDERS LIST > try block executed");

        const { page, limit, search_text, payment_status } = req.query;

        const paymentsList = await getAdminOrdersListForPaymentService({ search_text, payment_status }, { page: Number(page) || 1, limit: Number(limit) || 10 });

        res.status(200).json({ success: true, message: "Payment List Fetched Successfully", data: paymentsList });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN ORDERS LIST >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminGetOrderDetailController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN ORDER DETAILS > try block executed");

        const { order_id } = req.params;

        const [orderData] = await getOrderService({ uuid: order_id }, undefined, { page: 1, limit: 1 });

        res.status(200).json({
            success: true,
            message: "Order Details Fetched Successfully",
            data: orderData
        });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN ORDER DETAILS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminUpdateOrderController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN UPDATE ORDER STATUS > try block executed");

        const { order_id, status } = req.body;

        const order = await getOrderByFilterService({ uuid: order_id });

        if (!order) return res.status(404).json({ success: false, message: "Order Not Found" });
        else if (order.status === 'ongoing' || order.status == 'pending' && ['hold', 'cancelled'].includes(status)) await updateOrderByUuidService(order_id, { status: status });
        else if (['completed', 'cancelled'].includes(order.status)) return res.status(403).json({ success: false, message: `Cannot mark order ${status} as order is already marked as ${order.status}` });
        else return res.status(400).json({ success: false, message: "Something went wrong, unable to update the status of the order" });

        res.status(200).json({ success: true, message: "Order Status Updated Successfully" });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN UPDATE ORDER STATUS > ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminSupportListController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN SUPPORT LIST > try block executed");

        const { page, limit, search_text, ticket_status } = req.query;

        const supportList = await getSupportListService({ search_text, ticket_status, page: Number(page) || 1, limit: Number(limit) || 10 });

        res.status(200).json({ success: true, message: "Tickets List Fetched Successfully", data: supportList });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN SUPPORT LIST >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminResolveSupportTicketController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN RESOLVE SUPPORT TICKET > try block executed");

        const { ticket_no } = req.params;

        const ticket = await getContactUsQueryByIdServices(ticket_no);

        if (ticket.isResolved) return res.status(400).json({ success: false, message: "Tickets is already resolved" });

        await updateContactUsQueryService({ uuid: ticket_no }, { isResolved: true })

        res.status(200).json({ success: true, message: "Tickets Updated Successfully" });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN RESOLVE SUPPORT TICKET > ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const refundPaymentController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN REFUND PAYMENT > try block executed");

        const { order_id } = req.params;

        const orderDetails = await getOrderDetailsForAdminService({ uuid: order_id });

        if (['received'].includes(orderDetails.paymentStatus)){
            await refundPayment({ 
                paymentIntent: orderDetails.paymentReference,
                orderId: order_id, 
            });
            await updateOrderPaymentStatusService({ paymentStatus: 'refunded_pending' }, { uuid: order_id })
            return res.status(200).json({ success: true, message: "Payment Refunded Successfully" });
        } else {
            res.status(400).json({ success: false, message: `Unable to refund payment` });
        }

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN REFUND PAYMENT > ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const disbursePaymentController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN DISPURSE PAYMENT > try block executed");

        const { order_id } = req.params;

        const orderDetails = await getOrderDetailsForAdminService({ uuid: order_id });

        if (orderDetails.status != "completed")
            return res.status(400).json({ success: false, message: "Unable to payout, order status is not completed yet" });

        const freelancerDetails = await getFreelancerProfileDetailByUserUuid(orderDetails.freelancerUuid);

        if (!freelancerDetails.onboardingComplete)
            return res.status(400).json({ success: false, message: "Unable to payout shopper, incomplete connect account setup" });

        if (orderDetails.status === 'completed' && orderDetails.paymentStatus === 'received') {
            const transfer = await disbursePayment({
                amount: dollarsToCents(orderDetails.netShopperPayout),
                currency: 'GBP',
                orderId: order_id,
                destinationAccount: freelancerDetails.stripeAccountId
            });
            await updateOrderPaymentStatusService({ paymentStatus: 'disbursed_pending', payoutTransferId: transfer.id }, { uuid: order_id });
            return res.status(200).json({ success: true, message: "Payment Disbursed Successfully" });
        } else {
            res.status(400).json({ success: false, message: `Unable to disburse payout` });
        }

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN DISPURSE PAYMENT > ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export {
    adminLoginController,
    refundPaymentController,
    adminBlockUserController,
    adminLogoutController,
    adminDashboardController,
    disbursePaymentController,
    adminSupportListController,
    adminPaymentListController,
    adminUpdateOrderController,
    adminClientListController,
    adminShoppersListController,
    adminGetClientDetailController,
    adminGetShopperDetailController,
    adminOrdersListController,
    adminGetOrderDetailController,
    adminResolveSupportTicketController,
    adminUpdateShopperDetailsController,
}