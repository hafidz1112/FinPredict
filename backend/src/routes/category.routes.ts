import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     description: Returns a list of all available transaction categories.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [INCOME, EXPENSE]
 *                       icon:
 *                         type: string
 */
router.get('/', requireAuth, categoryController.getAllCategories);

export default router;
