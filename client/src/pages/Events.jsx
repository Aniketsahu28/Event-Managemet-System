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
            const response = await axios.get('http://localhost:3000/api/event/allevents');

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
            console.error("Error fetching events:", error);
        }
    }

    const scrollIntoViewSmooth = (event, id) => {
        event.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div
            className={`mx-4 sm:mx-16 py-4 sm:py-10 flex flex-col gap-20 justify-center ${currentTheme === "light" ? "text-black" : "text-white"}`}
        >
            {/* Hightlight section */}
            <div className="h-[300px] sm:h-[400px] lg:h-[500px] custom_shadow rounded-lg bg-gray">
                {/* To do */}
            </div>

            {/* Upcoming events */}
            <div className="flex flex-col justify-center gap-10">
                <div className="flex justify-between flex-col sm:flex-row gap-4">
                    <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">Upcoming Events</h2>
                    <select
                        name="upcomingEvents"
                        id="upcomingEvents"
                        className={`outline-none border-2 p-2 rounded-lg ${currentTheme === "light" ? "bg-white text-black border-gray/60" : "bg-black text-white border-white/40"
                            }`}
                    >
                        <option value="all">All Events</option>
                        <option value="oneDay">One Day Events</option>
                        <option value="multipleDay">Multiple Day Events</option>
                    </select>
                </div>

                {/* Event carousel for mobile*/}
                <span className="block sm:hidden">
                    <CarouselProvider
                        naturalSlideWidth={1000}
                        naturalSlideHeight={900}
                        totalSlides={upcomingEvents.length}
                        visibleSlides={1}
                        step={1}
                        className="flex flex-col"
                    >
                        <Slider>
                            <div className="flex justify-center items-center">
                                {
                                    upcomingEvents.map((upcomingEvent, index) => (
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
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                            {upcomingEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>

                {/* Event carousel for tablet*/}
                <span className="hidden sm:block lg:hidden">
                    <CarouselProvider
                        naturalSlideWidth={1000}
                        naturalSlideHeight={900}
                        totalSlides={upcomingEvents.length}
                        visibleSlides={2}
                        step={2}
                        className="flex flex-col"
                    >
                        <Slider>
                            <div className="flex justify-center items-center">
                                {
                                    upcomingEvents.map((upcomingEvent, index) => (
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
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                            {upcomingEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>

                {/* Event Carousel for desktop */}
                <span className="hidden lg:block">
                    <CarouselProvider
                        naturalSlideWidth={1000}
                        naturalSlideHeight={900}
                        totalSlides={upcomingEvents.length}
                        visibleSlides={4}
                        step={4}
                        className="flex flex-col"
                    >
                        <Slider>
                            <div className="flex justify-center items-center">
                                {
                                    upcomingEvents.map((upcomingEvent, index) => (
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
                        <div className="flex items-center justify-center gap-6">
                            <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                            {upcomingEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>
            </div>

            {/* today's events */}
            <div className="flex flex-col justify-center gap-10">
                <div className="flex justify-between flex-col sm:flex-row gap-4">
                    <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">Today's Events</h2>
                    <select
                        name="upcomingEvents"
                        id="upcomingEvents"
                        className={`outline-none border-2 p-2 rounded-lg ${currentTheme === "light" ? "bg-white text-black border-gray/60" : "bg-black text-white border-white/40"
                            }`}
                    >
                        <option value="all">All Events</option>
                        <option value="oneDay">One Day Events</option>
                        <option value="multipleDay">Multiple Day Events</option>
                    </select>
                </div>

                {/* Event carousel for mobile*/}
                <span className="block sm:hidden">
                    <CarouselProvider
                        naturalSlideWidth={1000}
                        naturalSlideHeight={900}
                        totalSlides={todaysEvents.length}
                        visibleSlides={1}
                        step={1}
                        className="flex flex-col"
                    >
                        <Slider>
                            <div className="flex justify-center items-center">
                                {
                                    todaysEvents.map((todaysEvent, index) => (
                                        <Slide index={index} key={index}>
                                            <EventCard
                                                id={todaysEvent._id}
                                                title={todaysEvent.title}
                                                banner={todaysEvent.banner}
                                                description={todaysEvent.description}
                                                time={todaysEvent.time}
                                                date={todaysEvent.date}
                                                price={todaysEvent.eventFee}
                                            />
                                        </Slide>
                                    ))
                                }
                            </div>
                        </Slider>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                            {todaysEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>

                {/* Event carousel for tablet*/}
                <span className="hidden sm:block lg:hidden">
                    <CarouselProvider
                        naturalSlideWidth={1000}
                        naturalSlideHeight={900}
                        totalSlides={todaysEvents.length}
                        visibleSlides={2}
                        step={2}
                        className="flex flex-col"
                    >
                        <Slider>
                            <div className="flex justify-center items-center">
                                {
                                    todaysEvents.map((todaysEvent, index) => (
                                        <Slide index={index} key={index}>
                                            <EventCard
                                                id={todaysEvent._id}
                                                title={todaysEvent.title}
                                                banner={todaysEvent.banner}
                                                description={todaysEvent.description}
                                                time={todaysEvent.time}
                                                date={todaysEvent.date}
                                                price={todaysEvent.eventFee}
                                            />
                                        </Slide>
                                    ))
                                }
                            </div>
                        </Slider>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                            {todaysEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>

                {/* Event Carousel for desktop */}
                <span className="hidden lg:block">
                    <CarouselProvider
                        naturalSlideWidth={1000}
                        naturalSlideHeight={900}
                        totalSlides={todaysEvents.length}
                        visibleSlides={4}
                        step={4}
                        className="flex flex-col"
                    >
                        <Slider>
                            <div className="flex justify-center items-center">
                                {
                                    todaysEvents.map((todaysEvent, index) => (
                                        <Slide index={index} key={index}>
                                            <EventCard
                                                id={todaysEvent._id}
                                                title={todaysEvent.title}
                                                banner={todaysEvent.banner}
                                                description={todaysEvent.description}
                                                time={todaysEvent.time}
                                                date={todaysEvent.date}
                                                price={todaysEvent.eventFee}
                                            />
                                        </Slide>
                                    ))
                                }
                            </div>
                        </Slider>
                        <div className="flex items-center justify-center gap-6">
                            <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                            {todaysEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>
            </div>

            {/* Past events */}
            <div className="flex flex-col justify-center gap-10">
                <div className="flex justify-between flex-col sm:flex-row gap-4">
                    <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">Past Events</h2>
                    <select
                        name="upcomingEvents"
                        id="upcomingEvents"
                        className={`outline-none border-2 p-2 rounded-lg ${currentTheme === "light" ? "bg-white text-black border-gray/60" : "bg-black text-white border-white/40"
                            }`}
                    >
                        <option value="all">All Events</option>
                        <option value="oneDay">One Day Events</option>
                        <option value="multipleDay">Multiple Day Events</option>
                    </select>
                </div>

                {/* Event carousel for mobile*/}
                <span className="block sm:hidden">
                    <CarouselProvider
                        naturalSlideWidth={1000}
                        naturalSlideHeight={900}
                        totalSlides={pastEvents.length}
                        visibleSlides={1}
                        step={1}
                        className="flex flex-col"
                    >
                        <Slider>
                            <div className="flex justify-center items-center">
                                {
                                    pastEvents.map((pastEvent, index) => (
                                        <Slide index={index} key={index}>
                                            <EventCard
                                                id={pastEvent._id}
                                                title={pastEvent.title}
                                                banner={pastEvent.banner}
                                                description={pastEvent.description}
                                                time={pastEvent.time}
                                                date={pastEvent.date}
                                                price={pastEvent.eventFee}
                                            />
                                        </Slide>
                                    ))
                                }
                            </div>
                        </Slider>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                            {pastEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>

                {/* Event carousel for tablet*/}
                <span className="hidden sm:block lg:hidden">
                    <CarouselProvider
                        naturalSlideWidth={1000}
                        naturalSlideHeight={900}
                        totalSlides={pastEvents.length}
                        visibleSlides={2}
                        step={2}
                        className="flex flex-col"
                    >
                        <Slider>
                            <div className="flex justify-center items-center">
                                {
                                    pastEvents.map((pastEvent, index) => (
                                        <Slide index={index} key={index}>
                                            <EventCard
                                                id={pastEvent._id}
                                                title={pastEvent.title}
                                                banner={pastEvent.banner}
                                                description={pastEvent.description}
                                                time={pastEvent.time}
                                                date={pastEvent.date}
                                                price={pastEvent.eventFee}
                                            />
                                        </Slide>
                                    ))
                                }
                            </div>
                        </Slider>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <ButtonBack className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="-rotate-90 text-xl" /></ButtonBack>
                            {pastEvents.length} Events
                            <ButtonNext className={`border-2 p-2 rounded-full ${currentTheme === 'light' ? "border-black" : "border-white"}`}><IoIosArrowUp className="rotate-90 text-xl" /></ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>

                {/* Event Carousel for desktop */}
                <span className="hidden lg:block">
                    <CarouselProvider
                        naturalSlideWidth={1000}
                        naturalSlideHeight={900}
                        totalSlides={pastEvents.length}
                        visibleSlides={4}
                        step={4}
                        className="flex flex-col"
                    >
                        <Slider>
                            <div className="flex justify-center items-center">
                                {
                                    pastEvents.map((pastEvent, index) => (
                                        <Slide index={index} key={index}>
                                            <EventCard
                                                id={pastEvent._id}
                                                title={pastEvent.title}
                                                banner={pastEvent.banner}
                                                description={pastEvent.description}
                                                time={pastEvent.time}
                                                date={pastEvent.date}
                                                price={pastEvent.eventFee}
                                            />
                                        </Slide>
                                    ))
                                }
                            </div>
                        </Slider>
                        <div className="flex items-center justify-center gap-6">
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
