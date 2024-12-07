import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuSun } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { themeAtom } from "../store/themeAtom";
import HamburgerButton from "./HamburgerButton"
import { userAtom, isAuthenticated } from "../store/userAtom";

const MobileNavbar = () => {
    const [currentTheme, setCurrentTheme] = useRecoilState(themeAtom);
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);
    const isUserAuthenticated = useRecoilValue(isAuthenticated)
    const setUser = useSetRecoilState(userAtom);

    const logoutUser = () => {
        setExpanded(!expanded);
        setUser(null)
    }

    return (
        <div className={`mx-4 h-full flex flex-col gap-5 pt-2 pb-3 px-4 bg-gradient-to-r from-blue_200 to-blue_300 rounded-lg transition-all duration-200`}>
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
                    <span
                        onClick={() => {
                            setExpanded(!expanded);
                        }}
                    >
                        <HamburgerButton status={expanded} setStatus={setExpanded} />
                    </span>
                </span>
            </div>
            <div className={`${expanded ? "block" : "hidden"} flex flex-col gap-2 text-lg font-lato`}>
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
                {isUserAuthenticated && <Link
                    to="/profile"
                    onClick={(e) => {
                        setExpanded(!expanded);
                    }}
                    className={`w-full ${location.pathname === "/profile" ? "text-white/100" : "text-white/70"}`}
                >
                    Profile
                </Link>}
                {isUserAuthenticated ?
                    <Link to="/login" className="px-4 py-2 text-white text-center rounded-md text-lg mt-2 bg-red" onClick={logoutUser}>
                        Logout
                    </Link> :
                    <Link to="/login" className="px-4 py-2 text-white text-center rounded-md text-lg border-blue_100 border-2 mt-2" onClick={(e) => {
                        setExpanded(!expanded);
                    }}>
                        Login
                    </Link>
                }
            </div>
        </div>
    );
};

export default MobileNavbar;
