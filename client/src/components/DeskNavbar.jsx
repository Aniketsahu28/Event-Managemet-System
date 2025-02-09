import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuSun } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { userAtom, isAuthenticated } from "../store/userAtom";

const DeskNavbar = () => {
    const [profilePopUp, setProfilePopUp] = useState(false);
    const [currentTheme, setCurrentTheme] = useRecoilState(themeAtom);
    const isUserAuthenticated = useRecoilValue(isAuthenticated);
    const [user, setUser] = useRecoilState(userAtom);
    const location = useLocation();
    const navigate = useNavigate();

    const logoutUser = () => {
        setUser(null);
        setProfilePopUp(false)
    };

    return (
        <div className="mx-16 py-3 px-7 bg-gradient-to-r from-blue_200 to-blue_300 rounded-lg flex justify-between items-center">
            <Link
                to="/"
                className="font-montserrat text-xl font-semibold text-yellow"
            >
                AGNELEVENTS
            </Link>
            <span className="flex gap-10 text-lg text-white">
                <Link
                    to="/events"
                    className={`${location.pathname === "/" || location.pathname === "/events"
                        ? "text-white/100"
                        : "text-white/70"
                        }`}
                >
                    Events
                </Link>
                <Link
                    to="/organizers"
                    className={`${location.pathname === "/organizers"
                        ? "text-white/100"
                        : "text-white/70"
                        }`}
                >
                    Organizers
                </Link>
                {user?.userInfo?.userType === 'faculty' && <Link
                    to="/approvals"
                    className={`${location.pathname === "/approvals"
                        ? "text-white/100"
                        : "text-white/70"
                        }`}
                >
                    Approvals
                </Link>}
                {user?.userInfo?.userType === 'admin' && <Link
                    to="/adminpanel"
                    className={`${location.pathname === "/adminpanel"
                        ? "text-white/100"
                        : "text-white/70"
                        }`}
                >
                    Admin Panel
                </Link>}
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
                {isUserAuthenticated ? (
                    <span className="relative font-lato">
                        <img src={user.userInfo.userType === 'organizer' ? user.userInfo.organizerProfile : user.userInfo.profilePicture} alt="Profile"
                            className="w-10 h-10 rounded-full my-[1px] cursor-pointer object-cover"
                            onClick={() => setProfilePopUp(!profilePopUp)}
                        />
                        {profilePopUp && (
                            <div
                                className={`absolute flex flex-col gap-4 custom_shadow py-4 px-6 -right-6 rounded-lg z-50 ${currentTheme === "light" ? "bg-white" : "bg-gray"
                                    }`}
                            >
                                <button
                                    to="/profile"
                                    className={`px-6 py-[6px] text-black bg-white rounded-md text-lg ${currentTheme === "light" && "border-2 border-blue_100"
                                        }`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/profile')
                                        setProfilePopUp(false);
                                    }}
                                >
                                    Profile
                                </button>
                                <button
                                    className="px-6 py-[6px] text-white rounded-md text-lg bg-red"
                                    onClick={logoutUser}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </span>
                ) : (
                    <Link
                        to="/login"
                        className="px-4 py-1 text-white rounded-md text-lg border-blue_100 border-2"
                    >
                        Login
                    </Link>
                )}
            </span>
        </div>
    );
};

export default DeskNavbar;
