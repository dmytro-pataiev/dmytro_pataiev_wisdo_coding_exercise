import { Router } from 'express';
import { getFeed } from '../controllers/feed.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticateJWT);

/**
 * @swagger
 * /feed:
 *   get:
 *     summary: Get a ranked feed of books
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 50
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A ranked list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', getFeed as any);

export default router;
