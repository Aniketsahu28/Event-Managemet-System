import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SlCalender } from "react-icons/sl";
import { LuClock } from "react-icons/lu";
import { GrLocationPin } from "react-icons/gr";
import { GoPeople } from "react-icons/go";
import { MdCurrencyRupee } from "react-icons/md";
import DOMPurify from "dompurify";
import EventTimer from "../components/EventTimer";
import { popupAtom } from "../store/popupAtom";
import PopupScreen from "../components/PopupScreen";
import { RxCross2 } from "react-icons/rx";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useHandleFileUpload } from "../hooks/useHandleFileUpload";
import { isAuthenticated, userAtom } from "../store/userAtom";
import ParticipantCard from "../components/ParticipantCard";
import { IoIosArrowUp } from "react-icons/io";
import EditEventDetails from "../components/EditEventDetails";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EventDetails = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const { id } = useParams();
    const [event, setEvent] = useState();
    const [eventTickets, setEventTickets] = useState();
    const [searchedEventTickets, setSearchedEventTickets] = useState();
    const [searchTerm, setSearchTerm] = useState("")
    const [paymentUrl, setPaymentUrl] = useState("");
    const sanitizedDescription = DOMPurify.sanitize(event?.description);
    const [popup, setPopup] = useRecoilState(popupAtom);
    const user = useRecoilValue(userAtom);
    const isUserAuthenticated = useRecoilValue(isAuthenticated);

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (
            isUserAuthenticated &&
            user.userInfo.userType === "organizer" &&
            event?.organizerDetails.organizerId === user.userInfo.organizerId
        ) {
            fetchEventTickets();
        }
    }, [event]);

    function canBookEvent(eventDate, eventTime) {
        const eventDateTimeString = `${eventDate}T${eventTime}:00`;
        const currentDateTime = new Date();
        const eventDateTime = new Date(eventDateTimeString);
        return currentDateTime < eventDateTime;
    }

    const fetchEvents = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/event/eventdetails`,
                {
                    params: {
                        eventId: id,
                    },
                }
            );

            setEvent(response.data.eventDetails);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    const fetchEventTickets = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/event/eventtickets`,
                {
                    params: {
                        eventId: id,
                    },
                    headers: {
                        token: user.token,
                    },
                }
            );
            setEventTickets(response.data.eventTickets);
        } catch (error) {
            console.log(error);
        }
    };

    const formatDateToWords = (dateString) => {
        if (!dateString) {
            return "Loading...";
        }

        const [year, month, day] = dateString.split("-");
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return `${day} ${months[month - 1]} ${year}`;
    };

    function convertTo12HourFormat(time24) {
        if (!time24) {
            return "Loading...";
        }

        let [hours, minutes] = time24.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }

    const getTicket = async () => {
        if (!isUserAuthenticated) {
            alert("Please login to continue");
            return;
        }
        if (!event?.isEventFree) {
            setPopup("paymentPopup");
        } else {
            try {
                const response = await axios.post(
                    `${BACKEND_URL}/api/event/bookticket`,
                    {
                        eventId: event._id,
                    },
                    {
                        headers: {
                            token: user.token,
                        },
                    }
                );
                if (response.statusText === "OK") {
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                alert(error.response?.data.message || error);
            }
        }
    };

    const takePaymentScreenshot = async (event) => {
        const url = await useHandleFileUpload(event);
        setPaymentUrl(url);
    };

    const handleBooking = async () => {
        if (paymentUrl === "") {
            alert("Payment required to proceed");
        } else {
            try {
                const response = await axios.post(
                    `${BACKEND_URL}/api/event/bookticket`,
                    {
                        eventId: event._id,
                        paymentImage: paymentUrl,
                    },
                    {
                        headers: {
                            token: user.token,
                        },
                    }
                );
                console.log(response)
                if (response.statusText === "OK") {
                    alert(response.data.message);
                } else {
                    alert(response.data.message);
                }
                setPopup(null);
            } catch (error) {
                alert(error);
            }
        }
    };

    const handleSearchParticipant = (e) => {
        setSearchTerm(e.target.value)
        const searchResult = eventTickets.filter((ticket) => {
            return ticket.userDetails.userId.includes(e.target.value);
        });
        setSearchedEventTickets(searchResult);
    }

    const toggleParticipation = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`${BACKEND_URL}/api/event/toggleparticipation`,
                {
                    eventId: id,
                    status: !event.acceptingParticipation
                },
                {
                    headers: {
                        token: user.token,
                    },
                }
            )

            if (response.status === 200) {
                alert(response.data.message)
                setEvent((prev) => {
                    return { ...prev, acceptingParticipation: !prev.acceptingParticipation }
                })
            }
        }
        catch (error) {
            alert(error)
        }
    }

    return (
        <>
            {popup === "paymentPopup" && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">Payment</p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col gap-2 items-center">
                            <img
                                src=""
                                alt="Payment QR"
                                className="h-48 w-48 bg-white custom_shadow rounded-lg"
                            />
                            <p className="text-lg">UPI id : abcdefgh@upisbi</p>
                            <label
                                htmlFor="paymentQR"
                                className={`items-center gap-4 flex cursor-pointer border-2 rounded-lg p-2 hover:scale-95 transition-all ${currentTheme === "light"
                                    ? "border-black/40"
                                    : "border-white/60"
                                    }`}
                            >
                                <input
                                    id="paymentQR"
                                    type="file"
                                    className="hidden"
                                    onChange={takePaymentScreenshot}
                                />
                                <p>Upload screenshot of payment</p>
                                <IoCloudUploadOutline
                                    className={`text-2xl ${currentTheme === "light" ? "text-black/80" : "text-white/80"
                                        }`}
                                />
                            </label>
                        </span>
                        <button
                            className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                            onClick={handleBooking}
                        >
                            Book Ticket
                        </button>
                    </div>
                </PopupScreen>
            )}
            {popup === "editeventdetails" && (
                <PopupScreen>
                    <EditEventDetails event={event} setEvent={setEvent} />
                </PopupScreen>
            )}
            <div
                className={`mx-4 sm:mx-16 py-4 sm:py-10 flex flex-col font-lato gap-16 justify-center ${currentTheme === "light" ? "text-black" : "text-white"
                    }`}
            >
                <div className="h-[500px] sm:h-[280px] lg:h-[500px] custom_shadow rounded-lg bg-gray flex items-center justify-center overflow-hidden relative">
                    <img
                        src={event?.banner}
                        alt="Event banner"
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 z-10 sm:left-0 text-white m-4 sm:m-7 lg:m-10">
                        {/* <EventTimer date={event?.date} time={event?.time} /> */}
                    </span>
                    <div className="w-full h-[30%] bg-gradient-to-t from-black to-black/0 absolute bottom-0 z-0" />
                </div>

                <div className="flex flex-col gap-10 lg:gap-0 lg:flex-row justify-between">
                    {/* Event details left-side */}
                    <div className="lg:w-[70%] flex flex-col gap-10">
                        <span className="flex flex-col gap-2">
                            <h1 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                {event?.title}
                            </h1>
                            <p
                                className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                    }`}
                            >
                                <span
                                    className={`font-lato font-semibold ${currentTheme === "light" ? "text-black" : "text-white"
                                        }`}
                                >
                                    By :
                                </span>{" "}
                                {event?.organizerDetails?.organizerName}
                            </p>
                            <span
                                className={`flex gap-1 ${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                    }`}
                            >
                                <p
                                    className={`font-lato font-semibold ${currentTheme === "light" ? "text-black" : "text-white"
                                        }`}
                                >
                                    For :
                                </p>
                                <span className="flex flex-wrap gap-2">
                                    {event?.eventForDepts.map((dept, index) => (
                                        <p key={index}> {dept},</p>
                                    ))}
                                </span>
                            </span>
                        </span>
                        <span className="flex flex-col gap-2">
                            <h2 className="text-lg sm:text-xl font-semibold">About Event</h2>
                            <p
                                className={`text-justify ${currentTheme === "light" ? "text-black/80" : "text-white/80"
                                    }`}
                                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                            />
                        </span>

                        {/* Speakers */}
                        {event?.speakers?.length > 0 && (
                            <span className="flex flex-col lg:flex-row gap-4">
                                <h2 className="text-2xl sm:text-xl font-semibold">
                                    Speakers :{" "}
                                </h2>
                                <span className="flex flex-wrap gap-4">
                                    {event.speakers.map((speaker, index) => (
                                        <p
                                            key={index}
                                            className={`border-[1px] rounded-full px-3 py-1 ${currentTheme === "light"
                                                ? "border-black/50"
                                                : "border-white/60"
                                                }`}
                                        >
                                            {speaker}
                                        </p>
                                    ))}
                                </span>
                            </span>
                        )}

                        {/* Prizes */}
                        {event?.prizes?.length > 0 && (
                            <span className="flex flex-col lg:flex-row gap-4">
                                <h2 className="text-2xl sm:text-xl font-semibold">Prizes : </h2>
                                <span className="flex flex-wrap gap-4">
                                    {event.prizes.map((prize, index) => (
                                        <p
                                            key={index}
                                            className={`border-[1px] rounded-full px-3 py-1 ${currentTheme === "light"
                                                ? "border-black/50"
                                                : "border-white/60"
                                                }`}
                                        >
                                            {prize}
                                        </p>
                                    ))}
                                </span>
                            </span>
                        )}
                    </div>

                    {/* Event Details Right side (Booking card) */}
                    <div
                        className={`lg:w-[25%] h-fit p-6 rounded-lg custom_shadow ${currentTheme === "light" ? "bg-white" : "bg-gray"
                            }`}
                    >
                        <div className="flex flex-col gap-3 text-lg">
                            <span className="flex gap-3 items-center">
                                <SlCalender className="text-xl" />
                                <p>{formatDateToWords(event?.date)}</p>
                            </span>
                            <span className="flex gap-3 items-center">
                                <LuClock className="text-xl" />
                                <p>{convertTo12HourFormat(event?.time)}</p>
                            </span>
                            <span className="flex gap-3 items-center">
                                <GrLocationPin className="text-xl" />
                                <p>{event?.venue}</p>
                            </span>
                            {event?.isLimitedSeats && (
                                <span className="flex gap-3 items-center">
                                    <GoPeople className="text-xl" />
                                    <p>
                                        {event?.seatsFilled} / {event?.maxSeats}
                                    </p>
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-4 mt-10">
                            {!event?.isEventFree && (
                                <p className="flex items-center gap-2">
                                    <MdCurrencyRupee className="text-xl" />
                                    <span className="text-3xl font-semibold">
                                        {event?.eventFee}
                                    </span>
                                </p>
                            )}
                            {event?.acceptingParticipation && event?.seatsFilled < event?.maxSeats &&
                                canBookEvent(event?.date, event?.time) && (
                                    <button
                                        className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-blue_100"
                                        onClick={getTicket}
                                    >
                                        Get Ticket
                                    </button>
                                )}
                        </div>
                    </div>
                </div>

                {/* Participants info only shown to organizers */}
                {isUserAuthenticated &&
                    user.userInfo.userType === "organizer" &&
                    event?.organizerDetails.organizerId === user.userInfo.organizerId && (
                        <div className="w-full flex flex-col gap-6 lg:gap-10">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 font-lato">
                                <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                    Participants {event.isLimitedSeats && `(${event.seatsFilled} / ${event.maxSeats})`}
                                </h2>
                                <input
                                    type="text"
                                    name="userId"
                                    className={`w-full sm:w-[50%] lg:w-[25%] p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/60"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder="Search participant by id"
                                    value={searchTerm}
                                    onChange={handleSearchParticipant}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 flex-wrap w-full sm:w-fit items-center sm:items-start justify-between sm:justify-start">
                                {eventTickets?.length > 0
                                    ?
                                    searchTerm === ""
                                        ? eventTickets.map((ticket, index) => (
                                            <ParticipantCard key={index} ticket={ticket} />
                                        ))
                                        : searchedEventTickets.map((ticket, index) => (
                                            <ParticipantCard key={index} ticket={ticket} />
                                        ))
                                    : "No tickets found"}
                            </div>
                            <span className="flex flex-col sm:flex-row gap-4 mx-auto mt-6">
                                {event?.acceptingParticipation === true ?
                                    <button
                                        className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-yellow"
                                        onClick={toggleParticipation}
                                    >
                                        Close Participation
                                    </button> :
                                    <button
                                        className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                                        onClick={toggleParticipation}
                                    >
                                        Resume Participation
                                    </button>
                                }
                                <button
                                    className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-blue_100"
                                    onClick={() => setPopup('editeventdetails')}
                                >
                                    <span>Edit event details</span>
                                    <IoIosArrowUp className="rotate-90" />
                                </button>
                            </span>
                        </div>
                    )}
            </div>
        </>
    );
};

export default EventDetails;
