import bodyParser from 'body-parser';
import express from 'express';
import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import routers from "../../routers/review";
import Review from "../../model/review";
import {ObjectId} from 'mongodb';
import {afterEach} from "mocha";
import mongoSetup from "../mongoSetup";
import {ReviewInfoDto} from "../../dto/review/ReviewInfoDto";

const {expect} = chai;

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();
const app = express();

app.use(bodyParser.json({limit: '1mb'}));
app.use('/', routers);

const review1 = new Review({
  comment: "review2",
  rating: 2,
  date: new Date("01-01-2000"),
  songId: 1,
});

const review2 = new Review({
  comment: "review1",
  rating: 3,
  date: new Date("01-01-2000"),
  songId: 1,
});

describe("Review controller", () => {
  before(async () => {
    await mongoSetup;

    await review1.save();
    await review2.save();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("Save review", () => {
    const reviewId = new ObjectId();
    const review = {
      comment: "review",
      rating: 3,
      date: new Date("01-01-2000"),
      songId: 1,
    };

    const saveOneStub = sandbox.stub(
      Review.prototype,
      'save',
    );

    saveOneStub.resolves({
      ...review,
      _id: reviewId,
    });

    chai.request(app)
      .post('')
      .send({body: {...review}})
      .end((_, res) => {
        res.should.have.status(201);
        expect(res.body._id).to.equal(reviewId.toString());
      });
  });

  it("Get song review", (done) => {
    const songId = 1;
    const size = 2;
    const from = 0;

    chai.request(app)
      .get(`/${songId}`)
      .query({ size, from })
      .end((_, res) => {
        res.should.have.status(200);
        expect(res.body.result).to.be.an('Array');
        expect(res.body.result.length).to.equal(2);

        const resultIds = res.body.result
          .map((review: ReviewInfoDto) => review._id.toString());

        const ids = [review1._id.toString(), review2._id.toString()];

        expect(resultIds).to.have.members(ids);
        done();
      });
  });

  it("Get song id list.", (done) => {
    const ids = [1];

    chai.request(app)
      .post('/_count')
      .send({ id: ids })
      .end((_, res) => {
        res.should.have.status(200);
        expect(res.body.result).to.be.an('Array');
        expect(res.body.result.length).to.equal(1);

        expect(res.body.result[0]._id).to.equal(1);
        expect(res.body.result[0].count).to.equal(2);

        done();
      });
  });
});