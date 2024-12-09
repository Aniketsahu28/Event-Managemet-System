const { Router } = require('express')
const eventRouter = Router();
const { organizerAuth } = require('../middlewares/organizerAuth')
const { userAuth } = require('../middlewares/userAuth')
const { OrganizerModel } = require('../models/organizer')
const { EventModel } = require('../models/event')
const { UserModel } = require('../models/user')
const { TicketModel } = require('../models/ticket')

eventRouter.post('/addevent', organizerAuth, async (req, res) => {
    const organizerId = req.organizerId;
    const { title, description, banner, date, time, venue, eventForDepts, speakers, isLimitedSeats, maxSeats, prizes, isEventFree, eventFee, paymentQR, UPI_ID } = req.body;

    try {
        const organizer = await OrganizerModel.findOne({ organizerId });
        await EventModel.create({
            organizerDetails: {
                organizerId: organizer.organizerId,
                organizerName: organizer.organizerName,
                department: organizer.department
            },
            participantsIds: [],
            title,
            description,
            banner,
            date,
            time,
            venue,
            eventForDepts,
            speakers,
            isLimitedSeats,
            maxSeats,
            prizes,
            isEventFree,
            eventFee,
            paymentQR,
            UPI_ID
        })

        res.status(200).json({
            message: "Event Added Successfully",
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.delete('/deleteevent', organizerAuth, async (req, res) => {
    const { eventId } = req.body;
    try {
        await EventModel.deleteOne({ "_id": eventId })
        res.status(200).json({
            message: "Event deleted Successfully",
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.patch('/editevent', organizerAuth, async (req, res) => {
    const { eventId, title, description, banner, date, time, venue, eventForDepts, speakers, isLimitedSeats, maxSeats, prizes, isEventFree, eventFee, paymentQR, UPI_ID } = req.body;

    try {
        await EventModel.updateOne({ "_id": eventId }, {
            title,
            description,
            banner,
            date,
            time,
            venue,
            eventForDepts,
            speakers,
            isLimitedSeats,
            maxSeats,
            prizes,
            isEventFree,
            eventFee,
            paymentQR,
            UPI_ID
        })

        res.status(200).json({
            message: "Event edited Successfully",
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.get('/allevents', async (req, res) => {
    try {
        const events = await EventModel.find({})
        if (events.length > 0) {
            res.status(200).json({ events });
        }
        else {
            res.status(404).json({
                message: "No event found"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.get('/eventdetails', async (req, res) => {
    const { eventId } = req.query;
    try {
        const eventDetails = await EventModel.findOne({ "_id": eventId });
        res.status(200).json({
            eventDetails
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.get('/organizerevents', async (req, res) => {
    const { organizerId } = req.query;
    try {
        const organizerEvents = await EventModel.find({ "organizerDetails.organizerId": organizerId });
        if (organizerEvents.length > 0) {
            res.status(200).json({
                organizerEvents
            })
        }
        else {
            res.status(404).json({
                message: "No event found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.post('/bookticket', userAuth, async (req, res) => {
    const userId = req.userId;
    const { eventId, paymentImage } = req.body;
    try {
        const alreadyPresent = await TicketModel.findOne({ 'userDetails.userId': userId, 'eventDetails.eventId': eventId })
        if (alreadyPresent) {
            res.status(200).json({
                message: "Ticket already bought"
            })
        } else {
            const user = await UserModel.findOne({ userId });
            const event = await EventModel.findOne({ "_id": eventId });
            await TicketModel.create({
                userDetails: {
                    userId: user.userId,
                    username: user.username,
                    department: user.department,
                    profilePicture: user.profilePicture
                },
                eventDetails: {
                    eventId: event._id,
                    title: event.title,
                    date: event.date,
                    time: event.time,
                    venue: event.venue,
                },
                paymentImage: paymentImage
            })
            res.status(201).json({
                message: "Ticket booked successfully"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

module.exports = {
    eventRouter
}