import chai from "chai";
import sinon from "sinon";
import {ObjectId} from "mongodb";
import mongoSetup from "../mongoSetup";
import Review from "../../model/review";
import {ReviewSaveDto} from "../../dto/review/ReviewSaveDro";
import {ReviewQueryDto} from "../../dto/review/ReviewQueryDto";
import * as reviewService from "../../services/review";
import {afterEach} from "mocha";

const {expect} = chai;
const sandbox = sinon.createSandbox();

const review1 = new Review({
  _id: new ObjectId(),
  comment: "review2",
  rating: 2,
  date: new Date("01-01-2000"),
  songId: 1,
});

const review2 = new Review({
  _id: new ObjectId(),
  comment: "review1",
  rating: 3,
  date: new Date("01-01-2000"),
  songId: 1,
});

describe('Review service', () => {
  before(async () => {
    await mongoSetup;

    await review1.save();
    await review2.save();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Save valid review.", (done) => {
    const reviewDto: ReviewSaveDto = {
      comment: "review",
      rating: 5,
      date: new Date("01-01-2000"),
      songId: 1,
    };

    reviewService.saveReviewApi(reviewDto)
      .then(async (id) => {
        const review = await Review.findById(id);

        expect(review).to.exist;
        expect(review?.comment).to.equal(reviewDto.comment);
        expect(review?.rating).to.equal(reviewDto.rating);
        expect(review?.date).to.eql(reviewDto.date);
        expect(review?.songId).to.equal(reviewDto.songId);

        done();
      }).catch((err: Error) => done(err));
  });

  it("Save invalid review (rating is incorrect).", (done) => {
    const reviewDto: ReviewSaveDto = {
      comment: "review",
      rating: -5,
      date: new Date("01-01-2000"),
      songId: 1,
    };
    reviewService.saveReviewApi(reviewDto)
      .then(() => {
        done(new Error("The rating should not be less than 0 or more than 5."));
      }).catch(() => done());
  });

  it("Save invalid review (date is incorrect).", (done) => {
    const reviewDto: ReviewSaveDto = {
      comment: "review",
      rating: 5,
      date: new Date("01-01-2999"),
      songId: 1,
    };
    reviewService.saveReviewApi(reviewDto)
      .then(() => {
        done(new Error("Review date must be less than the current one."));
      }).catch(() => done());
  });

  it("Get song review.", (done) => {
    const savedReviews = [review2, review1];
    const query = new ReviewQueryDto();
    query.songId = 1;
    query.size = 2;
    query.from = 0;
    reviewService.getSongReviewApi(query)
      .then((reviews) => {
        expect(reviews.length).to.equal(2);
        expect(reviews.map(res => res._id.toString())).to
          .eql(savedReviews.map(res => res._id.toString()));

        done();
      }).catch((err: Error) => done(err));
  });

  it("Get song id list", (done) => {
    const id: number[] = [1];
    reviewService.getSongIdListApi(id)
      .then((songs) =>{
        expect(songs.length).to.equal(1);
        expect(songs[0]._id).to.equal(id[0]);
        done();
      })
      .catch((err: Error) => done(err));
  });
});