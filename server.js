const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const http = require("http");
require('./cron');
const { initSocketServer } = require("./socket");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

initSocketServer(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
