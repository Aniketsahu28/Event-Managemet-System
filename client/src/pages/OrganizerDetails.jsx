import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { themeAtom } from '../store/themeAtom';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { IoIosArrowUp } from "react-icons/io";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import EventCard from '../components/EventCard';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OrganizerDetails = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const { id } = useParams();
    const [organizer, setOrganizer] = useState(null);
    const [events, setEvents] = useState({
        upcoming: [],
        todays: [],
        past: []
    });

    useEffect(() => {
        const fetchOrganizer = async () => {
            try {
                const response = await axios.get(
                    `${BACKEND_URL}/api/organizer/organizerdetails`,
                    {
                        params: {
                            organizerId: id,
                        },
                    }
                );

                setOrganizer(response.data.organizer);
            } catch (error) {
                console.error("Error fetching organizer:", error);
            }
        };

        fetchOrganizer();
    }, [id]);

    useEffect(() => {
        if (organizer?.organizerId) {
            const fetchOrganizerEvents = async () => {
                try {
                    const response = await axios.get(
                        `${BACKEND_URL}/api/event/organizerevents`,
                        {
                            params: {
                                organizerId: organizer.organizerId,
                            },
                        }
                    );

                    const today = new Date();
                    const upcomingEvents = [];
                    const todayEvents = [];
                    const pastEvents = [];

                    response.data.organizerEvents?.forEach((event) => {
                        const eventDate = new Date(event.date);
                        if (eventDate.toDateString() === today.toDateString()) {
                            todayEvents.push(event);
                        } else if (eventDate > today) {
                            upcomingEvents.push(event);
                        } else {
                            pastEvents.push(event);
                        }
                    });

                    setEvents({
                        upcoming: upcomingEvents,
                        todays: todayEvents,
                        past: pastEvents
                    })

                } catch (error) {
                    console.error("Error fetching events:", error);
                }
            };

            fetchOrganizerEvents();
        }
    }, [organizer]);

    const [windowStatus, setWindowStatus] = useState(
        window.innerWidth < 450 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop"
    );
    function checkWindowSize() {
        setWindowStatus(window.innerWidth < 450 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop");
    }
    window.onresize = checkWindowSize;

    return (
        <div className={`mx-4 sm:mx-16 py-10 sm:py-16 flex flex-col gap-10 sm:gap-20 justify-center ${currentTheme === "light" ? "text-black" : "text-white"}`}>
            <span>
                <h1 className='text-2xl sm:text-3xl font-montserrat font-semibold'>Welcome to {organizer?.organizerName}'s page</h1>
                <p className={`mt-1 text-lg ${currentTheme === "light" ? "text-black/70" : "text-white/60"}`}>Explore the event that interests you and participate.</p>
            </span>

            <div className='flex flex-col gap-20'>
                {/* Upcoming events */}
                <div className="flex flex-col justify-center gap-10">
                    <h2 className="sm:hidden text-xl font-montserrat font-medium">{organizer?.organizerName}'s upcoming events</h2>
                    <span>
                        <CarouselProvider
                            totalSlides={events.upcoming?.length}
                            visibleSlides={windowStatus === "mobile" ? 1 : windowStatus === "tablet" ? 2 : 4}
                            step={1}
                            className="flex flex-col gap-10"
                            isIntrinsicHeight={true}
                        >
                            <div className="hidden sm:flex items-center justify-between gap-6">
                                <h2 className="sm:text-2xl font-montserrat font-medium">
                                    {organizer?.organizerName}'s upcoming events
                                </h2>
                                <span className="flex gap-4">
                                    <ButtonBack
                                        className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                            }`}
                                    >
                                        <IoIosArrowUp className="-rotate-90 text-xl" />
                                    </ButtonBack>
                                    <ButtonNext
                                        className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                            }`}
                                    >
                                        <IoIosArrowUp className="rotate-90 text-xl" />
                                    </ButtonNext>
                                </span>
                            </div>
                            <Slider>
                                <div className="flex justify-center items-center w-full">
                                    {
                                        [...events.upcoming].reverse().map((upcomingEvent, index) => (
                                            <Slide index={index} key={index}>
                                                <EventCard
                                                    id={upcomingEvent._id}
                                                    title={upcomingEvent.title}
                                                    banner={upcomingEvent.banner}
                                                    description={upcomingEvent.description}
                                                    time={upcomingEvent.time}
                                                    date={upcomingEvent.date}
                                                    price={upcomingEvent.eventFee}
                                                />
                                            </Slide>
                                        ))
                                    }
                                </div>
                            </Slider>
                            <div className="sm:hidden flex items-center justify-center gap-6">
                                <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                                {events.upcoming?.length} Events
                                <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                            </div>
                        </CarouselProvider>
                    </span>
                </div>

                {/* today's events */}
                <div className="flex flex-col justify-center gap-10">
                    <h2 className="sm:hidden text-xl font-montserrat font-medium">{organizer?.organizerName}'s today's events</h2>
                    <span>
                        <CarouselProvider
                            totalSlides={events.todays?.length}
                            visibleSlides={windowStatus === "mobile" ? 1 : windowStatus === "tablet" ? 2 : 4}
                            step={1}
                            className="flex flex-col gap-10"
                            isIntrinsicHeight={true}
                        >
                            <div className="hidden sm:flex items-center justify-between gap-6">
                                <h2 className="sm:text-2xl font-montserrat font-medium">
                                    {organizer?.organizerName}'s today's Events
                                </h2>
                                <span className="flex gap-4">
                                    <ButtonBack
                                        className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                            }`}
                                    >
                                        <IoIosArrowUp className="-rotate-90 text-xl" />
                                    </ButtonBack>
                                    <ButtonNext
                                        className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                            }`}
                                    >
                                        <IoIosArrowUp className="rotate-90 text-xl" />
                                    </ButtonNext>
                                </span>
                            </div>
                            <Slider>
                                <div className="flex justify-center items-center w-full">
                                    {
                                        [...events.todays].reverse().map((event, index) => (
                                            <Slide index={index} key={index}>
                                                <EventCard
                                                    id={event._id}
                                                    title={event.title}
                                                    banner={event.banner}
                                                    description={event.description}
                                                    time={event.time}
                                                    date={event.date}
                                                    price={event.eventFee}
                                                />
                                            </Slide>
                                        ))
                                    }
                                </div>
                            </Slider>
                            <div className="sm:hidden flex items-center justify-center gap-6">
                                <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                                {events.todays?.length} Events
                                <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                            </div>
                        </CarouselProvider>
                    </span>
                </div>

                {/* Past events */}
                <div className="flex flex-col justify-center gap-10">
                    <h2 className="sm:hidden text-xl font-montserrat font-medium">{organizer?.organizerName}'s past events</h2>
                    <span>
                        <CarouselProvider
                            totalSlides={events.past?.length}
                            visibleSlides={windowStatus === "mobile" ? 1 : windowStatus === "tablet" ? 2 : 4}
                            step={1}
                            className="flex flex-col gap-10"
                            isIntrinsicHeight={true}
                        >
                            <div className="hidden sm:flex items-center justify-between gap-6">
                                <h2 className="sm:text-2xl font-montserrat font-medium">
                                    {organizer?.organizerName}'s past events
                                </h2>
                                <span className="flex gap-4">
                                    <ButtonBack
                                        className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                            }`}
                                    >
                                        <IoIosArrowUp className="-rotate-90 text-xl" />
                                    </ButtonBack>
                                    <ButtonNext
                                        className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                            }`}
                                    >
                                        <IoIosArrowUp className="rotate-90 text-xl" />
                                    </ButtonNext>
                                </span>
                            </div>
                            <Slider>
                                <div className="flex justify-center items-center w-full">
                                    {
                                        [...events.past].reverse().map((event, index) => (
                                            <Slide index={index} key={index}>
                                                <EventCard
                                                    id={event._id}
                                                    title={event.title}
                                                    banner={event.banner}
                                                    description={event.description}
                                                    time={event.time}
                                                    date={event.date}
                                                    price={event.eventFee}
                                                />
                                            </Slide>
                                        ))
                                    }
                                </div>
                            </Slider>
                            <div className="sm:hidden flex items-center justify-center gap-6">
                                <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                                {events.past?.length} Events
                                <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                            </div>
                        </CarouselProvider>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDetails;
