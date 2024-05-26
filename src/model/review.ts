import mongoose, {Document, Schema} from "mongoose";

export interface IReview extends Document {
  comment: string,
  rating: number,
  date: Date,
  songId: number,

  createdAt: Date;
}

const reviewSchema = new Schema({
  comment: {
    required: false,
    type: String,
  },

  rating: {
    required: true,
    type: Number,
  },

  date: {
    required: true,
    type: Date,
  },

  songId: {
    required: true,
    type: Number,
  },
}, {
  timestamps: true,
  timezone: 'UTC',
});

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;