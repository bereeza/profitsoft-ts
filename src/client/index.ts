import {instance} from "./instance";
import {logger} from "../logger";

// java service URL
const URL = "http://localhost:8080/api/song";

/**
 * Service request to check if a song exists.
 * true - if exists
 * false - if does not exist
 *
 * @param songId - song id to find
 */
export const getSongId = async (
  songId: number
):Promise<boolean> => {
  try {
    const result = await instance.get(`${URL}/${songId}`);
    logger.info(`A song with ${result.data.id} id exists.`);
    return true;
  } catch (err) {
    logger.error(`Song with ${songId} id not found.`);
    return false;
  }
};