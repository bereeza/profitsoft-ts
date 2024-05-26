import ping from 'src/controllers/ping';
import {router} from "./router";
import review from './review';

router.get('', ping);
router.use('/api/review', review);

export default router;
