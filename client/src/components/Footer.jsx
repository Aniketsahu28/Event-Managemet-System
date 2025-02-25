import React from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowUp } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import { userAtom, isAuthenticated } from "../store/userAtom";

const Footer = () => {
    const user = useRecoilValue(userAtom);
    const location = useLocation();

    return (
        <div className="mt-20">
            <div className="bg-gray px-4 sm:px-16 grid grid-cols-12 pt-10 pb-10 sm:pb-16 gap-6 sm:gap-10 lg:gap-0">
                <div className="col-span-12 lg:col-span-5 lg:pr-44 flex flex-col gap-2 lg:gap-5">
                    <h2 className="font-montserrat text-xl sm:text-2xl font-semibold text-yellow">
                        AGNELEVENTS
                    </h2>
                    <p className="text-white/60 font-lato sm:text-lg text-justify">
                        Find something that interests you, discover the clubs organizing
                        them, and register to be a part of it all. Stay connected and never
                        miss out on what's happening on campus!"
                    </p>
                </div>
                <div className="col-span-12 sm:col-span-4 lg:col-span-3 sm:text-lg flex flex-col gap-2 lg:gap-5">
                    <p className="text-white">Important Links</p>
                    <span className="flex flex-col gap-1">
                        <Link
                            to="/events"
                            className={`hover:text-white flex gap-1 items-center hover:gap-2 transition-all w-fit ${location.pathname === "/" || location.pathname === "/events"
                                ? "text-white"
                                : "text-white/60"
                                }`}
                        >
                            <IoIosArrowUp className="rotate-90" />
                            <span>Events</span>
                        </Link>
                        <Link
                            to="/organizers"
                            className={`hover:text-white flex gap-1 items-center hover:gap-2 transition-all w-fit ${location.pathname === "/organizers"
                                ? "text-white"
                                : "text-white/60"
                                }`}
                        >
                            <IoIosArrowUp className="rotate-90" />
                            <span>Organizers</span>
                        </Link>
                        {isAuthenticated && user?.userInfo?.userType === "organizer" && (
                            <Link
                                to="/addEvent"
                                className={`hover:text-white flex gap-1 items-center hover:gap-2 transition-all w-fit ${location.pathname === "/addapproval" ? "text-white" : "text-white/60"}`}
                            >
                                <IoIosArrowUp className="rotate-90" />
                                <span>Add New Event</span>
                            </Link>
                        )}
                        {isAuthenticated && user?.userInfo?.userType === "faculty" && (
                            <Link
                                to="/approvals"
                                className={`hover:text-white flex gap-1 items-center hover:gap-2 transition-all w-fit ${location.pathname === "/approvals" ? "text-white" : "text-white/60"}`}
                            >
                                <IoIosArrowUp className="rotate-90" />
                                <span>Approvals</span>
                            </Link>
                        )}
                        {isAuthenticated && user?.userInfo?.userType === "admin" && (
                            <Link
                                to="/adminpanel"
                                className={`hover:text-white flex gap-1 items-center hover:gap-2 transition-all w-fit ${location.pathname === "/adminpanel" ? "text-white" : "text-white/60"}`}
                            >
                                <IoIosArrowUp className="rotate-90" />
                                <span>Admin Panel</span>
                            </Link>
                        )}
                    </span>
                </div>
                <div className="col-span-12 sm:col-span-8 lg:col-span-4 sm:text-lg flex flex-col gap-2 lg:gap-5">
                    <p className="text-white">Contact us</p>
                    <span className="text-white/60 flex gap-2">
                        <GrLocation className="text-3xl" />
                        <p>
                            Agnel Technical Education Complex Sector 9-A, Vashi, Navi Mumbai,
                            Maharashtra, India, PIN - 400703.
                        </p>
                    </span>
                </div>
            </div>
            <div className="bg-black text-white/60 font-lato flex flex-col lg:flex-row items-center gap-2 lg:gap-0 py-4 lg:justify-between px-4 sm:px-16">
                <p>© All rights reserved, 2024</p>
                <p>
                    Design and Developed by{" "}
                    <Link
                        to="https://aniket-portfolio-alpha.vercel.app/"
                        className="text-blue_100 font-semibold hover:underline"
                        target="_blank"
                    >
                        Aniकेत
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Footer;
