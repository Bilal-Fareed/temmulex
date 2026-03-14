import { getAdminByEmail, getAdminByUuid, updateAdminByUuidService } from "../services/adminService.js";
import { verifyPassword, generateAccessToken } from "../helpers/security.js";
import { adminDashboardUserStats, getUsersList } from "../services/userService.js";
import { getShoppersList } from "../services/freelancerProfileService.js";
import { getSupportListService } from "../services/contactUsService.js";
import { adminDashboardOrderStats, getOrderService, getAdminOrdersListService } from "../services/orderService.js";

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

export {
    adminLoginController,
    adminLogoutController,
    adminDashboardController,
    adminSupportListController,
    adminClientListController,
    adminShoppersListController,
    adminOrdersListController,
}