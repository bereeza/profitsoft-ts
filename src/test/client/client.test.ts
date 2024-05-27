import chai from 'chai';
import sinon from 'sinon';
import { getSongId } from '../../client';
import {instance as inst} from "../../client/instance";

const { expect } = chai;
const sandbox = sinon.createSandbox();

describe("Attempting to retrieve an existing song.", () => {
  const songId = 1;
  const instance = sandbox.stub(inst, 'get');

  afterEach(() => {
    sandbox.restore();
  });

  it("Return true if song exist.", async () => {
    instance.resolves({ data: { id: songId } });
    const result = await getSongId(songId);
    expect(result).to.be.true;
  });

  it("Return false if song doesn't exist.", async () => {
    instance.rejects(new Error(`Song with ${songId} id not found.`));
    const result = await getSongId(songId);
    expect(result).to.be.false;
  });
});
