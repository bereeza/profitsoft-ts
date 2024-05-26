import {getSongIdList, getSongReview, saveReview} from "../../controllers/review/reviews";
import {router} from "../router";

router.post('', saveReview);
router.get('/:songId', getSongReview);
router.post('/_count', getSongIdList);

export default router;