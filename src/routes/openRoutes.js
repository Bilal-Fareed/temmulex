import { Router } from 'express';
import { getLanguagesController, getServicesController } from '../controllers/openControllers.js';

const router = Router();

router.get('/services', getServicesController);

router.get('/languages', getLanguagesController);

export default router;
