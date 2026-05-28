import { Router } from 'express';
import * as transactionController from '../controllers/transaction.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Apply requireAuth middleware to all transaction routes
router.use(requireAuth);

/**
 * @openapi
 * /transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Create a new transaction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [category_id, amount, transaction_date]
 *             properties:
 *               category_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               transaction_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created
 *   get:
 *     tags: [Transactions]
 *     summary: Get all transactions
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);

/**
 * @openapi
 * /transactions/summary:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction summary
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction summary
 */
router.get('/summary', transactionController.getSummary);

/**
 * @openapi
 * /transactions/import:
 *   post:
 *     tags: [Transactions]
 *     summary: Import transactions from CSV
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               csvData:
 *                 type: string
 *     responses:
 *       200:
 *         description: Import successful
 */
router.post('/import', transactionController.importFromCsv);

/**
 * @openapi
 * /transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction details
 *   put:
 *     tags: [Transactions]
 *     summary: Update a transaction
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *               transaction_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated
 *   delete:
 *     tags: [Transactions]
 *     summary: Delete a transaction
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 */
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;
