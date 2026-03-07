import { Router } from 'express';
import { getLanguagesController, getServicesController, insertQueryController } from '../controllers/openControllers.js';
import { contactUsSchema } from '../schemas/openSchemas.js';
import { validate } from '../middlewares/validationMiddleware.js';

const router = Router();

router.get('/services', getServicesController);

router.get('/languages', getLanguagesController);

router.post('/contact-us', validate({ body: contactUsSchema }) , insertQueryController);

export default router;
