import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import EventCard from "../components/EventCard";
import eventAdBanner from "../assets/images/eventAdBanner.webp"
import { IoIosArrowUp } from "react-icons/io";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import axios from "axios";
import EventTimer from "../components/EventTimer";
import toast from 'react-hot-toast'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Events = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [todaysEvents, setTodaysEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, [])

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/event/allevents`);

            const today = new Date();

            const upcoming = [];
            const todayEvents = [];
            const past = [];

            response.data.events?.forEach((event) => {
                const eventDate = new Date(event.date);
                if (eventDate.toDateString() === today.toDateString()) {
                    todayEvents.push(event);
                } else if (eventDate > today) {
                    upcoming.push(event);
                } else {
                    past.push(event);
                }
            });

            setTodaysEvents(todayEvents);
            setUpcomingEvents(upcoming);
            setPastEvents(past);
        }
        catch (error) {
            toast.error(error.response?.data.message || error);
        }
    }

    const scrollIntoViewSmooth = (event, id) => {
        event.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const [windowStatus, setWindowStatus] = useState(
        window.innerWidth < 450 ? "mobile" : window.innerWidth < 1024 ? "tablet" : window.innerWidth < 1450 ? "macbook" : "desktop"
    );
    function checkWindowSize() {
        setWindowStatus(window.innerWidth < 450 ? "mobile" : window.innerWidth < 1024 ? "tablet" : window.innerWidth < 1450 ? "macbook" : "desktop");
    }
    window.onresize = checkWindowSize;

    return (
        <div
            className={`mx-4 sm:mx-16 py-4 sm:py-10 flex flex-col gap-20 justify-center ${currentTheme === "light" ? "text-black" : "text-white"}`}
        >
            {/* Hightlight section */}
            <div className="custom_shadow rounded-lg bg-gray overflow-hidden relative">
                <CarouselProvider
                    naturalSlideWidth={windowStatus === 'mobile' ? 2000 : windowStatus === 'tablet' ? 2000 : 1000}
                    naturalSlideHeight={windowStatus === 'mobile' ? 3050 : windowStatus === 'tablet' ? 800 : 360}
                    totalSlides={todaysEvents.length + upcomingEvents.length + pastEvents.slice(0, 5).length}
                    visibleSlides={1}
                    step={1}
                    interval={5000}
                    isPlaying={true}
                >
                    <Slider>
                        <div className="flex justify-center items-center">
                            {
                                [...todaysEvents].reverse().map((event, index) => (
                                    <Slide index={index} key={index}>
                                        <Link to={`/events/${event?._id}`} className="relative">
                                            <img
                                                src={event.banner}
                                                alt="Event banner"
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute bottom-0 z-10 left-0 text-white m-4 sm:m-7 lg:m-10 flex flex-col gap-4">
                                                <h2 className="text-2xl sm:text-3xl flex gap-2 items-end"><span>{event?.title}</span>
                                                    {/* <span className="text-xl">in</span> */}
                                                </h2>
                                                {/* <EventTimer date={event.date} time={event.time} /> */}
                                            </span>
                                            <div className="w-full h-[30%] bg-gradient-to-t from-black to-black/0 absolute bottom-0 z-0" />
                                        </Link>
                                    </Slide>
                                ))
                            }
                            {
                                [...upcomingEvents].reverse().map((event, index) => (
                                    <Slide index={index} key={index}>
                                        <Link to={`/events/${event?._id}`} className="relative">
                                            <img
                                                src={event.banner}
                                                alt="Event banner"
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute bottom-0 z-10 left-0 text-white m-4 sm:m-7 lg:m-10 flex flex-col gap-4">
                                                <h2 className="text-2xl sm:text-3xl flex gap-2 items-end"><span>{event?.title}</span>
                                                    {/* <span className="text-xl">in</span> */}
                                                </h2>
                                                {/* <EventTimer date={event.date} time={event.time} /> */}
                                            </span>
                                            <div className="w-full h-[30%] bg-gradient-to-t from-black to-black/0 absolute bottom-0 z-0" />
                                        </Link>
                                    </Slide>
                                ))
                            }
                            {
                                [...pastEvents].reverse().slice(0, 5).map((event, index) => (
                                    <Slide index={index} key={index}>
                                        <Link to={`/events/${event?._id}`} className="relative">
                                            <img
                                                src={event.banner}
                                                alt="Event banner"
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute bottom-0 z-10 left-0 text-white m-4 sm:m-7 lg:m-10 flex flex-col gap-4">
                                                <h2 className="text-2xl sm:text-3xl">{event?.title}</h2>
                                            </span>
                                            <div className="w-full h-[20%] bg-gradient-to-t from-black to-black/0 absolute bottom-0 z-0" />
                                        </Link>
                                    </Slide>
                                ))
                            }
                        </div>
                    </Slider>
                </CarouselProvider>
            </div>

            {/* Upcoming events */}
            <div className="flex flex-col justify-center gap-10">
                <h2 className="sm:hidden text-2xl sm:text-3xl font-montserrat font-semibold">Upcoming Events</h2>
                <span>
                    <CarouselProvider
                        totalSlides={upcomingEvents.length}
                        visibleSlides={windowStatus === "mobile" ? 1 : windowStatus === "tablet" ? 2 : windowStatus === "macbook" ? 3 : 4}
                        step={1}
                        className="flex flex-col gap-10"
                        isIntrinsicHeight={true}
                    >
                        <div className="hidden sm:flex items-center justify-between gap-6">
                            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                Upcoming Events
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
                                    [...upcomingEvents].reverse().map((upcomingEvent, index) => (
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
                            {upcomingEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>
            </div>

            {/* today's events */}
            <div className="flex flex-col justify-center gap-10">
                <h2 className="sm:hidden text-2xl sm:text-3xl font-montserrat font-semibold">Today's Events</h2>
                <span>
                    <CarouselProvider
                        totalSlides={todaysEvents.length}
                        visibleSlides={windowStatus === "mobile" ? 1 : windowStatus === "tablet" ? 2 : windowStatus === "macbook" ? 3 : 4}
                        step={1}
                        className="flex flex-col gap-10"
                        isIntrinsicHeight={true}
                    >
                        <div className="hidden sm:flex items-center justify-between gap-6">
                            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                Today's Events
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
                                    [...todaysEvents].reverse().map((event, index) => (
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
                            {todaysEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>
            </div>

            {/* Past events */}
            <div className="flex flex-col justify-center gap-10">
                <h2 className="sm:hidden text-2xl sm:text-3xl font-montserrat font-semibold">Past Events</h2>
                <span>
                    <CarouselProvider
                        totalSlides={pastEvents.length}
                        visibleSlides={windowStatus === "mobile" ? 1 : windowStatus === "tablet" ? 2 : windowStatus === "macbook" ? 3 : 4}
                        step={1}
                        className="flex flex-col gap-10"
                        isIntrinsicHeight={true}
                    >
                        <div className="hidden sm:flex items-center justify-between gap-6">
                            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                Past Events
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
                                    [...pastEvents].reverse().map((event, index) => (
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
                            {pastEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>
            </div>

            {/* Ad section */}
            <div className="mt-4 sm:mt-10 bg-blue_400 flex gap-6 lg:gap-20 justify-between px-4 sm:px-8 lg:px-10 rounded-lg text-white items-center py-6 sm:py-10 lg:pt-0 lg:pb-16 flex-col lg:flex-row">
                <div className="flex flex-col sm:flex-row gap-4 lg:w-[50%] items-center justify-center">
                    <img src={eventAdBanner} alt="event banner" className="hidden lg:block sm:w-32" />
                    <h3 className="text-2xl sm:text-3xl font-montserrat font-semibold">Discover all the latest campus happenings, <span className="text-blue_100">connect</span> with better people</h3>
                </div>
                <div className="lg:w-[40%] flex flex-col gap-6 sm:gap-10 lg:pt-12">
                    <p className="text-lg sm:text-xl text-white/60">Find something that interests you, discover the clubs organizing them, and register to be a part of it all. Stay connected and never miss out on what's happening on campus!"</p>
                    <span className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                        <Link to="/organizers" className="flex gap-2  items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-blue_100"><span>View Clubs</span> <IoIosArrowUp className="rotate-90" /></Link>
                        <button className="flex gap-2  items-center justify-center px-4 py-2 text-white rounded-md text-lg border-2 border-blue_100" onClick={(e) => scrollIntoViewSmooth(e, "appTop")}><span>Go to Top</span> <IoIosArrowUp /></button>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Events;
