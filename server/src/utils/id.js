import { customAlphabet } from "nanoid";
import { QUEUE_ID_ALPHABET, QUEUE_ID_LENGTH } from "../constants/index.js";

// generator for 6-char queue IDs (e.g., "A3Z9QX")
export const genQueueId = customAlphabet(QUEUE_ID_ALPHABET, QUEUE_ID_LENGTH);

// socket.io room helper
export const ROOM = (id) => `queue:${id}`;
