import { Server as socketIo } from "socket.io";
import { redisClient } from "./infra/redis.js";
import { createAdapter } from "@socket.io/redis-adapter";

export const SocketServer = async (_server) => {
    const _socketServer = new socketIo(_server, {
        adapter: createAdapter(
            redisClient.instance,
            redisClient.instance.duplicate()
        )
    });

    _socketServer.on("connection", (socket) => {
        console.log("Socket connected: ", socket.id)
        socket.on("message", function (data) {
            if (data === "reply") socket.send("Hello from server")
            console.log(data)
        })
        socket.on("disconnect", () => {
            console.log("Socket disconnected: ", socket.id)
        })
    })
}