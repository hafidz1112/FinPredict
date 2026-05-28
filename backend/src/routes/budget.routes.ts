import { Router } from 'express';
import * as budgetController from '../controllers/budget.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /budgets:
 *   get:
 *     tags: [Budgets]
 *     summary: Get user budgets
 *     description: Returns a list of the authenticated user's budgets. Can be filtered by month.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month_year
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by month. Use first day of month (YYYY-MM-DD), e.g. "2025-01-01".
 *     responses:
 *       200:
 *         description: A list of budgets with category details
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
 *                         type: string
 *                         format: uuid
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                       category_id:
 *                         type: integer
 *                       monthly_limit:
 *                         type: string
 *                         description: Decimal value as string
 *                       month_year:
 *                         type: string
 *                         format: date
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [INCOME, EXPENSE]
 *   post:
 *     tags: [Budgets]
 *     summary: Create or update a budget
 *     description: Creates a new budget or updates an existing one for a specific category and month. If a budget already exists for the same user/category/month, it will be updated.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category_id, monthly_limit, month_year]
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 5
 *                 description: ID of the expense category
 *               monthly_limit:
 *                 type: number
 *                 example: 1000000
 *                 description: Monthly budget limit in IDR
 *               month_year:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-01"
 *                 description: First day of the target month
 *     responses:
 *       201:
 *         description: Budget created or updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Category not found
 */
router.get('/', budgetController.getBudgets);
router.post('/', budgetController.upsertBudget);

/**
 * @openapi
 * /budgets/status:
 *   get:
 *     tags: [Budgets]
 *     summary: Get budget status with spending progress
 *     description: Returns each budget with actual spending, remaining amount, and percentage used. Useful for dashboard visualizations and early warning indicators.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month_year
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by month. Defaults to current month.
 *     responses:
 *       200:
 *         description: Budget status with spending details
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
 *                       category:
 *                         type: object
 *                       monthly_limit:
 *                         type: number
 *                       spent:
 *                         type: number
 *                       remaining:
 *                         type: number
 *                       percentage:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [OK, WARNING, OVER_BUDGET]
 */
router.get('/status', budgetController.getBudgetStatus);

export default router;
