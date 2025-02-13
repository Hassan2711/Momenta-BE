const cron = require('node-cron');
const Event = require('./models/Event');
const { getUserSocket, sendReminder } = require('./socket'); 


cron.schedule('* * * * *', async () => {

    const currentDate = new Date();
    const reminderDate = new Date(currentDate.getTime() + 30 * 60 * 1000);

    try {


        const events = await Event.find({
            reminder: true,
        });

        events.forEach(event => {
            const eventDateTime = new Date(event.date);
            const eventTimeParts = event.time.split(":");

            eventDateTime.setHours(eventTimeParts[0]);
            eventDateTime.setMinutes(eventTimeParts[1]); 

            if (eventDateTime >= currentDate && eventDateTime <= reminderDate) {
                const userSocketId = getUserSocket(event.user);
                if (userSocketId) {
                    sendReminder(userSocketId, {
                        title: event.title,
                        date: eventDateTime,
                        time: event.time,
                        location: event.location,
                    });
                }
            }
        });
    } catch (error) {
        console.error("Error fetching events:", error);
    }
});