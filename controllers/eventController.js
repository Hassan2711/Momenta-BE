const Event = require("../models/Event");

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
module.exports = { 
    createEvent, 
    getEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent, 
};
