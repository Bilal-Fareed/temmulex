import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { multerHandler } from '../middlewares/multerMiddleware.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
    addServiceSchema,
    completeOrderSchema,
    updateServiceSchema,
    getMyOrdersSchema,
    updateFreelancerProfileSchema,
    deleteServiceSchema,
} from '../schemas/freelancerSchemas.js'
import {
    uploadFileController,
    updateServiceController,
    deleteServiceController,
    getMyOrdersController,
    completeOrderController,
    addServiceController,
    updateFreelancerProfileController,
    getMyFreelancerProfileController,
} from '../controllers/freelancerControllers.js';

const router = Router();

router.get('/my-profile', authenticate, getMyFreelancerProfileController);

router.post('/upload', authenticate, multerHandler, uploadFileController);

router.delete('/:service_id/service', authenticate, validate({ params: deleteServiceSchema }), deleteServiceController);

router.post('/add-service', authenticate, validate({ body: addServiceSchema }), addServiceController);

router.post('/update-service', authenticate, validate({ body: updateServiceSchema }), updateServiceController);

router.post('/update-profile', authenticate, validate({ body: updateFreelancerProfileSchema }), updateFreelancerProfileController);

router.get('/my-order', authenticate, validate({ query: getMyOrdersSchema }), getMyOrdersController);

router.put('/:order_id/complete', authenticate, validate({ params: completeOrderSchema }), completeOrderController);

export default router;
