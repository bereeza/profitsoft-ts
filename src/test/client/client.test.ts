import chai from 'chai';
import {getSongId} from '../../client';

const {expect} = chai;

describe("Attempting to retrieve an existing song.", () => {
  it("Return true if song exist.", async () => {
    const songId = 1;

    await getSongId(songId).then((res) => {
      expect(res).to.be.true;
    }).catch((err: Error) => err);
  });

  it("Return false if song doesn't exist.", async () => {
    const songId = -1;

    await getSongId(songId).then((res) => {
      expect(res).to.be.false;
    }).catch((err: Error) => err);
  });
});
