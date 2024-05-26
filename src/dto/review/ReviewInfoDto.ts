export interface ReviewInfoDto {
  _id: string,
  comment: string;
  rating: number;
  songId?: number;
}