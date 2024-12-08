import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SlCalender } from "react-icons/sl";
import { LuClock } from "react-icons/lu";
import { GrLocationPin } from "react-icons/gr";
import { GoPeople } from "react-icons/go";
import { MdCurrencyRupee } from "react-icons/md";
import DOMPurify from "dompurify";

const EventDetails = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const { id } = useParams();
    const [event, setEvent] = useState();
    const sanitizedDescription = DOMPurify.sanitize(event?.description);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/event/eventdetails",
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

    const formatDateToWords = (dateString) => {
        if (!dateString) {
            return "Loading...";
        }

        const [year, month, day] = dateString.split("-");
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return `${day} ${months[month - 1]} ${year}`;
    }

    function convertTo12HourFormat(time24) {
        if (!time24) {
            return "Loading...";
        }

        let [hours, minutes] = time24.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }

    console.log(event)

    return (
        <div
            className={`mx-4 sm:mx-16 py-4 sm:py-10 flex flex-col font-lato gap-16 justify-center ${currentTheme === "light" ? "text-black" : "text-white"
                }`}
        >
            <div className="h-[300px] sm:h-[400px] lg:h-[500px] custom_shadow rounded-lg bg-gray flex items-center justify-center overflow-hidden relative">
                <img
                    src={event?.banner}
                    alt="Event banner"
                    className="w-full h-full object-cover"
                />
                <div className="w-full h-[20%] bg-gradient-to-t from-black to-black/0 absolute bottom-0" />
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
                            <h2 className="text-2xl sm:text-xl font-semibold">Speakers : </h2>
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
                                <p>{event?.seatsFilled} / {event?.maxSeats}</p>
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 mt-10">
                        {!event?.isEventFree && (
                            <p className="flex items-center gap-2">
                                <MdCurrencyRupee className="text-xl" />
                                <span className="text-3xl font-semibold">500.00</span>
                            </p>
                        )}
                        <button className="flex gap-2  items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-blue_100">
                            Get Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
