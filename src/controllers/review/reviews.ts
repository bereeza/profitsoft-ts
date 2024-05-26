import httpStatus from "http-status";
import {Request, Response} from "express";
import {saveReviewApi, getSongIdListApi, getSongReviewApi} from "../../services/review";
import {ReviewSaveDto} from "../../dto/review/ReviewSaveDro";
import {InternalError} from "../../system/internalError";
import {logger} from "../../logger";

export const saveReview = async (
  req: Request,
  res: Response
) => {
  try {
    const review = new ReviewSaveDto(req.body);
    const id = await saveReviewApi({...review});
    res.status(httpStatus.CREATED).send({
      id,
    });
  } catch (err) {
    const {message, status} = new InternalError(err);
    logger.error('Something went wrong.', err);
    res.status(status).send({message});
  }
};

export const getSongReview = async (
  req: Request,
  res: Response
) => {
  const songId = parseInt(req.params.songId as string);
  const size = parseInt(req.query.size as string);
  const from = parseInt(req.query.from as string);

  try {
    const result = await getSongReviewApi({songId, size, from});
    res.send({result});
  } catch (err) {
    const {message, status} = new InternalError(err);
    logger.error('Something went wrong. Choose another song id.', err);
    res.status(status).send({message});
  }
};

export const getSongIdList = async (
  req: Request,
  res: Response
) => {
  const ids = req.body.id;
  try {
    const result = await getSongIdListApi(ids);
    res.send({result});
  } catch (err) {
    const {message, status} = new InternalError(err);
    logger.error('Something went wrong.', err);
    res.status(status).send({message});
  }
};