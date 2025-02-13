const Event = require("../models/Event");
const mongoose = require('mongoose');

const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, reminder } = req.body;

        if (!title || !description || !date || !time || !location) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const event = await Event.create({
            user: req.user.id,
            title,
            description,
            date,
            time,
            location,
            reminder,
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            event,
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.user.id }).sort({ date: 1, time: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found." });

        if (event.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, reminder } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: "Event not found." });

        if (event.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.time = time || event.time;
        event.location = location || event.location;
        event.reminder = reminder !== undefined ? reminder : event.reminder;

        await event.save();
        res.status(200).json({ success: true, message: "Event updated successfully", event });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found." });

        if (event.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        await event.deleteOne();
        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const sendInvitation = async (req, res) => {
    const { userIds } = req.body; 
    const eventId = req.params.eventId;
    try {
        const event = await Event.findById(new mongoose.Types.ObjectId(eventId));
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        if (!event.invitedBy.includes(req.user.id)) {
            event.invitedBy.push(req.user.id);
        }

        userIds.forEach(userId => {
            if (!event.invitations.some(invite => invite.userId.toString() === userId)) {
                event.invitations.push({ userId, status: "pending" });
            }
        });

        await event.save();
        res.status(200).json({ success: true, message: "Invitations sent successfully", event });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getSentInvites = async (req, res) => {
    const userId = req.user.id;
    try {
        const events = await Event.find({ invitedBy: userId })
            .populate('invitations.userId', 'firstName lastName'); 

        if (events.length === 0) {
            return res.status(404).json({ message: "No events where you have sent invites" });
        }

        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const getInvitedEvents = async (req, res) => {
    try {
        const userId = req.params.userId;  

        const events = await Event.find({
            "invitations.userId": userId,
        });

        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this user" });
        }

        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const handleRSVP = async (req, res) => {
    const { eventId, invitationId } = req.params;
    const { status } = req.body; 
    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const invitation = event.invitations.id(invitationId);
        if (!invitation) {
            return res.status(404).json({ message: "Invitation not found" });
        }

        invitation.status = status;
        await event.save();
        res.status(200).json({ success: true, message: `RSVP updated to ${status}`, event });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { 
    createEvent, 
    getEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent, 
    sendInvitation,
    getInvitedEvents, 
    getSentInvites,
    handleRSVP 
};
