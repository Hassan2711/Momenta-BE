const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    reminder: { type: Boolean, default: false },
    invitations: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
        invitedAt: { type: Date, default: Date.now }
    }],
    invitedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
