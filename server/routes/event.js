const { Router } = require('express')
const eventRouter = Router();
const { organizerAuth } = require('../middlewares/organizerAuth')
const { userAuth } = require('../middlewares/userAuth')
const { OrganizerModel } = require('../models/organizer')
const { EventModel } = require('../models/event')
const { TicketModel } = require('../models/ticket');
const { UserModel } = require('../models/user');
const { sendEventApprovalEmail } = require('../utils/email');

eventRouter.post('/addevent', organizerAuth, async (req, res) => {
    const organizerId = req.organizerId;
    const { title, description, banner, date, time, venue, eventForDepts, outsideStudentsAllowed, minTeamSize, maxTeamSize, speakers, isLimitedSeats, maxSeats, prizes, isEventFree, isPriceVariation, eventFee, eventFeeForClubMember, paymentQR, UPI_ID } = req.body;

    try {
        const organizer = await OrganizerModel.findOne({ organizerId }, { password: 0 });
        await EventModel.create({
            organizerDetails: {
                organizerId: organizer.organizerId,
                facultyId: organizer.facultyDetails.userId,
                organizerName: organizer.organizerName,
                department: organizer.department,
                email: organizer.email,
                phone: organizer.phone
            },
            title,
            description,
            banner,
            date,
            time,
            venue,
            eventForDepts,
            outsideStudentsAllowed,
            minTeamSize,
            maxTeamSize,
            speakers,
            isLimitedSeats,
            maxSeats,
            prizes,
            isEventFree,
            isPriceVariation,
            eventFee,
            eventFeeForClubMember,
            paymentQR,
            UPI_ID
        })
        const facultyEmail = await UserModel.findOne({ userId: organizer.facultyDetails.userId }, { email: 1 })
        await sendEventApprovalEmail(facultyEmail, title, organizer.organizerName)

        res.status(200).json({
            message: "Event added successfully, verification request sent to faculty coordinator",
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

eventRouter.patch('/toggleparticipation', organizerAuth, async (req, res) => {
    const { eventId, status } = req.body;

    try {
        await EventModel.updateOne({ "_id": eventId }, {
            acceptingParticipation: status
        })

        res.status(200).json({
            message: "Participation status changed",
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.patch('/editevent', organizerAuth, async (req, res) => {
    const organizerId = req.organizerId;
    const { eventId, title, description, banner, date, time, venue, eventForDepts, outsideStudentsAllowed, minTeamSize, maxTeamSize, speakers, isLimitedSeats, maxSeats, prizes, isEventFree, isPriceVariation, eventFee, eventFeeForClubMember, paymentQR, UPI_ID } = req.body;

    try {
        const organizer = await OrganizerModel.findOne({ organizerId }, { password: 0 });
        await EventModel.updateOne({ "_id": eventId }, {
            organizerDetails: {
                organizerId: organizer.organizerId,
                facultyId: organizer.facultyDetails.userId,
                organizerName: organizer.organizerName,
                department: organizer.department,
                email: organizer.email,
                phone: organizer.phone
            },
            title,
            description,
            banner,
            date,
            time,
            venue,
            eventForDepts,
            outsideStudentsAllowed,
            minTeamSize,
            maxTeamSize,
            speakers,
            isLimitedSeats,
            maxSeats,
            prizes,
            isEventFree,
            isPriceVariation,
            eventFee,
            eventFeeForClubMember,
            paymentQR,
            UPI_ID,
            status: "pending"
        })
        const facultyEmail = await UserModel.findOne({ userId: organizer.facultyDetails.userId }, { email: 1 })
        await sendEventApprovalEmail(facultyEmail, title, organizer.organizerName)

        res.status(200).json({
            message: "Event edited Successfully, verification request sent to faculty coordinator",
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.get('/allevents', async (req, res) => {
    try {
        const events = await EventModel.find({ status: "accepted" }, { 'organizerDetails.facultyReview': 0 })
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
        const eventDetails = await EventModel.findOne({ "_id": eventId }, { 'organizerDetails.facultyReview': 0 });
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

eventRouter.get('/isUserTicketBookedAlready', userAuth, async (req, res) => {
    const { eventId, userDetails } = req.query;

    try {
        const parsedUserDetails = JSON.parse(userDetails);

        for (const user of parsedUserDetails) {
            const alreadyPresent = await TicketModel.findOne({
                'userDetails.userId': user.userId,
                'eventDetails.eventId': eventId
            });

            if (alreadyPresent) {
                return res.status(200).json({
                    found: true,
                    message: `Ticket already booked for ${user.username}`
                });
            }
        }
        res.status(200).json({
            found: false
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

eventRouter.post('/bookticket', userAuth, async (req, res) => {
    const { eventId, paymentImage, iAmClubMember, userDetails, teamName } = req.body;
    try {
        const event = await EventModel.findOne({ "_id": eventId });
        if (event.seatsFilled < event.maxSeats) {
            if (event.acceptingParticipation) {
                await TicketModel.create({
                    userDetails,
                    eventDetails: {
                        eventId: event._id,
                        title: event.title,
                        date: event.date,
                        time: event.time,
                        venue: event.venue,
                        isPriceVariation: event.isPriceVariation,
                        eventFee: event.eventFee,
                        eventFeeForClubMember: event.eventFeeForClubMember,
                    },
                    teamName,
                    iAmClubMember,
                    paymentImage
                });

                await EventModel.updateOne({ "_id": eventId }, { $inc: { seatsFilled: 1 } });

                return res.status(201).json({
                    message: "Ticket booked successfully"
                });
            } else {
                return res.status(400).json({
                    message: "Event is currently not taking participation"
                });
            }
        } else {
            return res.status(400).json({
                message: "Event is full"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

eventRouter.delete('/deleteticket', organizerAuth, async (req, res) => {
    const { ticketId } = req.body;
    try {
        const ticket = await TicketModel.findOne({ '_id': ticketId })
        if (ticket) {
            await TicketModel.deleteOne({ "_id": ticketId })
            await EventModel.updateOne({ "_id": ticket.eventDetails.eventId },
                { $inc: { seatsFilled: -1 } }
            );
            res.status(200).json({
                message: "Participant removed",
            })
        }
        else {
            res.status(404).json({
                message: "Participant already removed",
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.get('/usertickets', userAuth, async (req, res) => {
    const userId = req.userId;
    try {
        const userTickets = await TicketModel.find({ 'userDetails.userId': userId })
        if (userTickets.length > 0) {
            res.status(200).json({
                userTickets
            })
        }
        else {
            res.status(404).json({
                message: "No tickets found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.get('/eventtickets', organizerAuth, async (req, res) => {
    const { eventId } = req.query;
    try {
        const eventTickets = await TicketModel.find({ 'eventDetails.eventId': eventId })
        if (eventTickets.length > 0) {
            res.status(200).json({
                eventTickets
            })
        }
        else {
            res.status(404).json({
                message: "No tickets found"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.get('/facultyEvents', userAuth, async (req, res) => {
    const userId = req.userId;

    try {
        const events = await EventModel.find({ "organizerDetails.facultyId": userId, status: "pending" }, { 'organizerDetails.facultyReview': 0 });
        if (events.length > 0) {
            res.status(200).json({
                events
            })
        }
        else {
            res.status(404).json({
                message: "No events to verify"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
})

eventRouter.patch('/verifyEvent', userAuth, async (req, res) => {
    const userId = req.userId;
    const { eventId, facultyStatus, facultyReview } = req.body;

    try {
        const event = await EventModel.findOne({ "_id": eventId });
        if (event.organizerDetails.facultyId === userId) {
            if (facultyStatus === "accepted") {
                await EventModel.updateOne({ "_id": eventId }, { $set: { status: "accepted", 'organizerDetails.facultyReview': facultyReview } })
            }
            else {
                await EventModel.updateOne({ "_id": eventId }, { $set: { status: "rejected", 'organizerDetails.facultyReview': facultyReview } })
            }
            res.status(200).json({
                message: "Your response has been recorded. Thank you.",
            })
        }
        else {
            res.status(403).json({
                message: "You are not authorized to verify this event"
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