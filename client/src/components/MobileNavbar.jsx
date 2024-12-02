import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuSun } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import { useRecoilState } from "recoil";
import { themeAtom } from "../store/themeAtom";
import HamburgerButton from "./HamburgerButton"

const MobileNavbar = () => {
    const [currentTheme, setCurrentTheme] = useRecoilState(themeAtom);
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`h-full flex flex-col gap-5 pt-2 pb-3 px-4 bg-gradient-to-r from-blue_200 to-blue_300 rounded-lg transition-all duration-200 w-full`}>
            <div className=" flex justify-between items-center">
                <Link
                    to="/"
                    className="font-montserrat text-lg font-semibold text-yellow"
                >
                    AGNELEVENTS
                </Link>
                <span className="flex gap-5 items-center justify-center text-white">
                    <span className="cursor-pointer">
                        {currentTheme == "light" ? (
                            <IoMoonOutline
                                className="text-2xl"
                                onClick={() => setCurrentTheme("dark")}
                            />
                        ) : (
                            <LuSun
                                className="text-2xl"
                                onClick={() => setCurrentTheme("light")}
                            />
                        )}
                    </span>
                    <button
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                    >
                        <HamburgerButton status={expanded} setStatus={setExpanded} />
                    </button>
                </span>
            </div>
            <div className={`${expanded ? "block" : "hidden"} flex flex-col gap-2 text-lg`}>
                <Link
                    to="/events"
                    onClick={(e) => {
                        setExpanded(!expanded);
                    }}
                    className={`w-full ${location.pathname === "/" || location.pathname === "/events" ? "text-white/100" : "text-white/70"}`}
                >
                    Events
                </Link>
                <Link
                    to="/organizers"
                    onClick={(e) => {
                        setExpanded(!expanded);
                    }}
                    className={`w-full ${location.pathname === "/organizers" ? "text-white/100" : "text-white/70"}`}
                >
                    Organizers
                </Link>
                <Link to="/login" className="px-4 py-1 text-white text-center rounded-md text-lg border-blue_100 border-2 mt-2" onClick={(e) => {
                    setExpanded(!expanded);
                }}>
                    Login
                </Link>
            </div>
        </div>
    );
};

export default MobileNavbar;
