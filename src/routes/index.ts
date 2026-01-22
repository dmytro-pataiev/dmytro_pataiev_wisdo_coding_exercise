import { Router } from 'express';
import RouterLogin from './auth.route';
import RouterFeed from './feed.route';
import RouterBooks from './books.route';

const router: Router = Router();

router.use('/login', RouterLogin);
router.use('/books', RouterBooks);
router.use('/feed', RouterFeed);

export default router;
