import { Server as socketIo } from "socket.io";
import { redisClient } from "./infra/redis.js";
import { createAdapter } from "@socket.io/redis-adapter";
import { verifyAccessToken } from "./src/helpers/security.js";

let _socketServer = null;
const socketUsers = new Map()

const SocketServer = async (_server) => {
    _socketServer = new socketIo(_server, {
        connectionStateRecovery: {},
        adapter: createAdapter(
            redisClient.instance,
            redisClient.instance.duplicate()
        )
    });

    _socketServer.use((socket, next) => {

        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1]

        if (!token) {
            return next(new Error("Unauthorized"))
        }

        try {
            const decoded = verifyAccessToken(token)

            socket.user = decoded

            next()

        } catch (err) {
            next(new Error("Invalid Token"))
        }

    })

    _socketServer.on("connection", (socket) => {

        console.log("Socket connected: ", socket.id)

        socket.on("join_conversation", () => {
            socketUsers.set(socket.user.uuid, socket.id)
        })

        socket.on("typing", ({ receiverId, senderId }) => {

            const receiverSocket = socketUsers.get(receiverId)

            if (receiverSocket) {
                _socketServer.to(receiverSocket).emit("typing", { senderId })
            }

        })

        socket.on("disconnect", () => {
            for (const [userId, socketId] of socketUsers) {
                if (socketId === socket.id) {
                    socketUsers.delete(userId)
                }
            }
        })
    })
}

const emitNewMessage = (socketId, event, message) => {
    _socketServer.to(socketId).emit(event, message)
}

export {
    SocketServer,
    emitNewMessage,
    socketUsers,
}