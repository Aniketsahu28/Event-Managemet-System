import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LuSun } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { themeAtom } from "../store/themeAtom";

const DeskNavbar = () => {
    const [currentTheme, setCurrentTheme] = useRecoilState(themeAtom);
    const location = useLocation();

    return (
        <div className="w-full py-4 px-7 bg-gradient-to-r from-blue_200 to-blue_300 rounded-lg flex justify-between items-center">
            <Link to="/" className="font-montserrat text-xl font-semibold text-yellow">
                AGNELEVENTS
            </Link>
            <span className="flex gap-10 text-lg text-white">
                <Link to="/events" className={`${location.pathname === "/" || location.pathname === "/events" ? "text-white/100" : "text-white/70"}`}>Events</Link>
                <Link to="/organizers" className={`${location.pathname === "/organizers" ? "text-white/100" : "text-white/70"}`}>Organizers</Link>
            </span>
            <span className="flex gap-6 items-center justify-center text-white">
                <span className="cursor-pointer">
                    {currentTheme == "light" ? (
                        <IoMoonOutline
                            className="text-3xl"
                            onClick={() => setCurrentTheme("dark")}
                        />
                    ) : (
                        <LuSun
                            className="text-3xl"
                            onClick={() => setCurrentTheme("light")}
                        />
                    )}
                </span>
                <Link to="/login" className="px-4 py-1 text-white rounded-md text-lg border-blue_100 border-2">
                    Login
                </Link>
            </span>
        </div>
    );
};

export default DeskNavbar;
