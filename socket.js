const socketIo = require('socket.io');

let io;
const userSocketMap = {}; 

function initSocketServer(server) {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000", 
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', socket => {
        console.log('User connected:', socket.id);
        socket.on('registerUser', (userId) => {
            if (userId) {
                userSocketMap[userId] = socket.id; 
            } else {
            }
        });

        socket.on('disconnect', () => {
            for (let userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId];
                    console.log(`User with ID: ${userId} disconnected`);
                    break;
                }
            }
        });
    });
}

function sendReminder(userSocketId, reminder) {
    if (userSocketId && io) {
        io.to(userSocketId).emit('eventReminder', reminder);
    } else {
        console.log("User socket ID is missing or WebSocket not initialized.");
    }
}

function getUserSocket(userId) {
    const userSocketId = userSocketMap[userId];
    return userSocketId;
}

module.exports = { initSocketServer, sendReminder, getUserSocket };
