import { getLanguages } from "../services/languageServices.js";
import { getServices } from "../services/serviceServices.js";

const getServicesController = async (req, res) => {
    try {
        console.log("GET SERVICES OPEN CONTROLLER > try block executed");
        const services = await getServices();
        res.status(200).json({ success: true, message: "Services Fetched Successfully", services });
    } catch (error) {
        console.error("GET SERVICES OPEN CONTROLLER > ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getLanguagesController = async (req, res) => {
    try {
        console.log("GET LANGUAGES OPEN CONTROLLER >  try block executed");
        const languages = await getLanguages();
        res.status(200).json({ success: true, message: "Languages Fetched Successfully", languages });
    } catch (error) {
        console.error("GET LANGUAGES OPEN CONTROLLER > ", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export {
    getServicesController,
    getLanguagesController,
}