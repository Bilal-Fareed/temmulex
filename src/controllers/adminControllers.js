import { getAdminByEmail, getAdminByUuid, updateAdminByUuidService } from "../services/adminService.js";
import { verifyPassword, generateAccessToken } from "../helpers/security.js";
import { adminDashboardUserStats, getUsersList, getUserByUuid } from "../services/userService.js";
import { getShoppersList, getFreelancerDetails } from "../services/freelancerProfileService.js";
import { adminDashboardOrderStats, getOrderService, getAdminOrdersListService, getUserOrderCountsAndValue } from "../services/orderService.js";
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
        if (!admin || admin?.password) return res.status(403).json({ success: false, message: 'Invalid credentials.' });

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
            page,
            limit,
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
            page,
            limit,
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

        const ordersList = await getAdminOrdersListService({ search_text, order_status }, { page, limit });

        res.status(200).json({ success: true, message: "Orders List Fetched Successfully", data: ordersList });

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
            message: "Shopper Details Fetched Successfully",
            data: orderData
        });

    } catch (error) {
        console.error("ADMIN CONTROLLER > ADMIN ORDER DETAILS >", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const adminSupportListController = async (req, res) => {
    try {
        console.log("ADMIN CONTROLLER > ADMIN SUPPORT LIST > try block executed");

        const { page, limit, search_text, ticket_status } = req.query;

        const supportList = await getSupportListService({ search_text, ticket_status, page, limit });

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

export {
    adminLoginController,
    adminLogoutController,
    adminDashboardController,
    adminSupportListController,
    adminClientListController,
    adminShoppersListController,
    adminGetClientDetailController,
    adminGetShopperDetailController,
    adminOrdersListController,
    adminGetOrderDetailController,
    adminResolveSupportTicketController,
}