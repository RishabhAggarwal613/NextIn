import { io } from "socket.io-client";
import { SOCKET_URL, SOCKET_NAMESPACE } from "../config/env";
export const socket = io(SOCKET_URL + SOCKET_NAMESPACE, { autoConnect: false, transports: ["websocket"] });
