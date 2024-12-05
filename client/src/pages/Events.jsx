import React from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import EventCard from "../components/EventCard";
import eventAdBanner from "../assets/images/eventAdBanner.webp"
import { IoIosArrowUp } from "react-icons/io";

const Events = () => {
    const currentTheme = useRecoilValue(themeAtom);
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
                <div className="flex gap-5 sm:gap-10">
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                </div>
            </div>

            {/* Ongoing events */}
            <div className="flex flex-col justify-center gap-10">
                <div className="flex justify-between flex-col sm:flex-row gap-4">
                    <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">Ongoing Events</h2>
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
                <div className="flex gap-5 sm:gap-10">
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                </div>
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
                <div className="flex gap-5 sm:gap-10">
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                    <EventCard
                        title="Agnathon (24Hrs Hackathon)"
                        description="CSI Computer department has held a 24 hold a hackathon"
                        time="6:30 pm"
                        date="12/12/12"
                        price="FREE"
                    />
                </div>
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
