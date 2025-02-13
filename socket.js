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

                    break;
                }
            }
        });
    });
}

function sendReminder(userSocketId, reminder) {
    if (userSocketId && io) {
        io.to(userSocketId).emit('eventReminder', reminder);
    }
}

function getUserSocket(userId) {
    const userSocketId = userSocketMap[userId];
    return userSocketId;
}

module.exports = { initSocketServer, sendReminder, getUserSocket };
