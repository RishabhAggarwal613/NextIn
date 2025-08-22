// src/utils/id.js
import { customAlphabet } from "nanoid";
import { QUEUE_ID_ALPHABET, QUEUE_ID_LENGTH } from "../constants/index.js";

/**
 * Generator for 6-char queue IDs (e.g., "A3Z9QX").
 * Alphabet excludes ambiguous chars (I, O, 0, 1).
 * Usage: const id = genQueueId();
 */
export const genQueueId = customAlphabet(QUEUE_ID_ALPHABET, QUEUE_ID_LENGTH);
