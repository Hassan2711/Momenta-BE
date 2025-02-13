const cron = require('node-cron');
const Event = require('./models/Event');
const { getUserSocket, sendReminder } = require('./socket'); 

console.log("🛠️ Setting up cron job...");

cron.schedule('* * * * *', async () => {

    const currentDate = new Date();
    const reminderDate = new Date(currentDate.getTime() + 30 * 60 * 1000);

    try {
        console.log("📡 Fetching events...");

        const events = await Event.find({
            reminder: true,
        });

        console.log("📡 Events fetched:", events); 

        if (events.length === 0) {
            console.log("🚫 No events found for reminders.");
        }

        events.forEach(event => {
            const eventDateTime = new Date(event.date);
            const eventTimeParts = event.time.split(":");

            eventDateTime.setHours(eventTimeParts[0]);
            eventDateTime.setMinutes(eventTimeParts[1]); 

            console.log(`📅 Event DateTime: ${eventDateTime}`);

            if (eventDateTime >= currentDate && eventDateTime <= reminderDate) {
                const userSocketId = getUserSocket(event.user);
                if (userSocketId) {
                    sendReminder(userSocketId, {
                        title: event.title,
                        date: eventDateTime,
                        time: event.time,
                        location: event.location,
                    });
                } else {
                    console.log(`User socket not found for event: ${event.title}`);
                }
            }
        });
    } catch (error) {
        console.error("Error fetching events:", error);
    }
});