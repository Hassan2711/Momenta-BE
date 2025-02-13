const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent, sendInvitation, 
        getInvitedEvents, getSentInvites, handleRSVP  } = require("../controllers/eventController");

router.post("/", protect, createEvent);
router.get("/", protect, getEvents);
router.get("/:id", protect, getEventById);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

router.post("/:eventId/invite", protect, sendInvitation);
router.get("/invited/:userId", protect, getInvitedEvents);
router.get("/sent-invites/:userId", protect, getSentInvites);
router.post("/:eventId/invitation/:invitationId/rsvp", protect, handleRSVP);

module.exports = router;
