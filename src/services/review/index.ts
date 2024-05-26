import {ReviewSaveDto} from "../../dto/review/ReviewSaveDro";
import Review, {IReview} from "../../model/review";
import {getSongId} from "../../client";
import {ReviewInfoDto} from "../../dto/review/ReviewInfoDto";
import {ReviewQueryDto} from "../../dto/review/ReviewQueryDto";
import {PipelineStage} from "mongoose";
import {SongResult} from "../../dto/SongResult";

/**
 * Save object API. Validation by id, date and rating is used.
 *
 * @param reviewSaveDto - object to save
 */
export const saveReviewApi = async (
  reviewSaveDto: ReviewSaveDto
): Promise<string> => {
  await validateReview(reviewSaveDto);
  const review = await new Review(reviewSaveDto).save();
  return review._id;
};

/**
 * Song review API. Validation by song id.
 *
 * @param reviewQuery - query with id, size and from params.
 */
export const getSongReviewApi = async (
  reviewQuery: ReviewQueryDto
): Promise<ReviewInfoDto[]> => {
  const songId = reviewQuery.songId || -1;
  await validateSongId(songId);

  const size = reviewQuery.size || 1;
  const from = reviewQuery.from || 0;

  /**
   * pipeline for filtering the data we will receive
   */
  const pipeline: PipelineStage[] = [
    {$match: {songId}},
    {$sort: {createdAt: -1}},
    {$skip: from},
    {$limit: size},
  ];

  const reviews = await Review.aggregate(pipeline);
  return reviews.map(review => toReviewInfoDto(review));
};

export const getSongIdListApi = async (
  id: number[]
): Promise<Array<SongResult>> => {

  /**
   * pipeline for filtering the data we will receive
   */
  const pipeline: PipelineStage[] = [
    {$match: {songId: {$in: id}}},
    {$group: {_id: "$songId", count: {$sum: 1}}},
    {$project: {_id: 1, count: 1}},
  ];

  return Review.aggregate(pipeline);
};

const toReviewInfoDto = (review: IReview): ReviewInfoDto => {
  return ({
    _id: review._id,
    comment: review.comment,
    rating: review.rating,
  });
};

const validateSongId = async (songId: number) => {
  const result = await getSongId(songId);
  if (!result) {
    throw new Error(`Result: ${result}. Song doesn't exist!`);
  }
};

const validateReview = async (reviewDto: ReviewSaveDto) => {
  await validateSongId(reviewDto.songId as number);

  if (!!reviewDto.rating && (reviewDto.rating < 0 || reviewDto.rating > 5)) {
    throw new Error("The rating should not be less than 0 or more than 5.");
  }

  if (!!reviewDto.date && reviewDto.date.getTime() >= new Date().getTime()) {
    throw new Error("Review date must be less than the current one.");
  }
};