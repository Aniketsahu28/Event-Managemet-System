import React, { useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { IoIosArrowUp } from "react-icons/io";
import { popupAtom } from "../store/popupAtom";
import PopupScreen from "./PopupScreen";
import { RxCross2 } from "react-icons/rx";
import { userAtom } from "../store/userAtom";
import axios from "axios";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useHandleFileUpload } from "../hooks/useHandleFileUpload";
import { FaRegPenToSquare } from "react-icons/fa6";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProfileCard = ({ name, userId, department, image }) => {
    const [user, setUser] = useRecoilState(userAtom);
    const currentTheme = useRecoilValue(themeAtom);
    const setPopup = useSetRecoilState(popupAtom);
    const username = useRef(null);
    const oldPassword = useRef(null);
    const newPassword = useRef(null);
    const reEnteredNewPassword = useRef(null);
    const [profileHover, setProfileHover] = useState(false);
    const [popupElement, setPopupElement] = useState("");

    const changeUsername = async (event) => {
        event.preventDefault();
        const _username = username.current.value;

        if (!_username) {
            alert("Enter username");
        } else {
            try {
                const response = await axios.patch(
                    `${BACKEND_URL}/api/user/editUsername`,
                    {
                        username: _username,
                    },
                    {
                        headers: {
                            token: user.token,
                        },
                    }
                );

                if (response.statusText === "OK") {
                    alert(response.data.message);
                    setUser((oldinfo) => ({
                        ...oldinfo,
                        userInfo: {
                            ...oldinfo.userInfo,
                            username: _username,
                        },
                    }));
                    setPopup(false)
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const changePassword = async (event) => {
        event.preventDefault();
        const _oldPassword = oldPassword.current.value;
        const _newPassword = newPassword.current.value;
        const _reEnteredNewPassword = reEnteredNewPassword.current.value;

        if (!_oldPassword || !_newPassword || !_reEnteredNewPassword) {
            alert("Enter your password");
        } else if (_newPassword !== _reEnteredNewPassword) {
            alert("New Password and Re-entered password must be same.");
        } else {
            try {
                const response = await axios.patch(
                    `${BACKEND_URL}/api/user/changepassword`,
                    {
                        password: _oldPassword,
                        newPassword: _newPassword,
                    },
                    {
                        headers: {
                            token: user.token,
                        },
                    }
                );

                if (response.statusText === "OK") {
                    alert(response.data.message);
                    setPopup(false);
                    oldPassword.current.value = "";
                    newPassword.current.value = "";
                    reEnteredNewPassword.current.value = "";
                } else {
                    alert(response.data.message);
                }
            } catch (error) {
                alert(error.response.data.message);
            }
        }
    };

    const takeProfilePicture = async (event) => {
        const url = await useHandleFileUpload(event);
        try {
            const response = await axios.patch(
                `${BACKEND_URL}/api/user/editprofilePicture`,
                {
                    profilePicture: url,
                },
                {
                    headers: {
                        token: user.token,
                    },
                }
            );

            if (response.statusText === "OK") {
                alert(response.data.message);
                setUser((oldinfo) => ({
                    ...oldinfo,
                    userInfo: {
                        ...oldinfo.userInfo,
                        profilePicture: url,
                    },
                }));
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <PopupScreen>
                {popupElement === "username" && (
                    <form
                        onSubmit={changeUsername}
                        className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Change Username
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(false)}
                            />
                        </span>
                        <span className="flex flex-col gap-2">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                    ? "bg-white/60  placeholder-black/40"
                                    : "bg-gray/60 border-white text-white placeholder-white/60"
                                    }`}
                                placeholder="New username"
                                ref={username}
                            />
                        </span>
                        <button
                            type="submit"
                            className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
                {popupElement === "password" && (
                    <form
                        onSubmit={changePassword}
                        className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Change Password
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(false)}
                            />
                        </span>
                        <div className="flex flex-col gap-4">
                            <span className="flex flex-col gap-2">
                                <label htmlFor="password">Current password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/40"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder="Current password..."
                                    ref={oldPassword}
                                />
                            </span>
                            <span className="flex flex-col gap-2">
                                <label htmlFor="newpassword">New password</label>
                                <input
                                    type="password"
                                    id="newpassword"
                                    className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/40"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder="New password..."
                                    ref={newPassword}
                                />
                            </span>
                            <span className="flex flex-col gap-2">
                                <label htmlFor="reEnteredpassword">Re-enter new password</label>
                                <input
                                    type="password"
                                    id="reEnteredpassword"
                                    className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/40"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder="New password..."
                                    ref={reEnteredNewPassword}
                                />
                            </span>
                        </div>
                        <button
                            type="submit"
                            className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                        >
                            Save Changes
                        </button>
                    </form>
                )}
            </PopupScreen>
            <div
                className={`flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-6 custom_shadow p-4 sm:p-6 rounded-lg w-fit ${currentTheme === "light"
                    ? "text-black bg-white"
                    : "bg-gray text-white"
                    }`}
            >
                <div
                    className="w-40 h-40 bg-black rounded-lg overflow-hidden relative"
                    onMouseEnter={() => setProfileHover(true)}
                    onMouseLeave={() => setProfileHover(false)}
                >
                    <img src={image} alt="Profile" className="object-cover" />
                    {profileHover && (
                        <label
                            htmlFor="profilePicture"
                            className={`absolute top-0 left-0 w-full h-full items-center gap-2 flex flex-col justify-center cursor-pointer p-2 bg-black/60 text-white lato`}
                        >
                            <input
                                id="profilePicture"
                                type="file"
                                className="hidden"
                                onChange={takeProfilePicture}
                            />
                            <IoCloudUploadOutline className={`text-5xl text-white`} />
                            <p className="text-center">Update profile picture</p>
                        </label>
                    )}
                </div>
                <div className="flex flex-col justify-between gap-4 sm:gap-0 items-center sm:items-start">
                    <span className="flex flex-col items-center sm:items-start">
                        <h2 className="flex gap-4 items-center justify-between">
                            <p className="font-montserrat font-medium text-xl sm:text-2xl">{name}</p>{" "}
                            <FaRegPenToSquare
                                className={`text-xl ${currentTheme === 'light' ? "text-black/60 hover:text-black" : "text-white/60 hover:text-white"}`}
                                onClick={() => {
                                    setPopupElement("username");
                                    setPopup(true);
                                }}
                            />
                        </h2>
                        <p
                            className={`${currentTheme === "light" ? "text-black/80" : "text-white/80"
                                }`}
                        >
                            User id : {userId}
                        </p>
                        <p
                            className={`${currentTheme === "light" ? "text-black/80" : "text-white/80"
                                }`}
                        >
                            Department : {department}
                        </p>
                    </span>
                    <button
                        className="w-fit flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-blue_100"
                        onClick={() => {
                            setPopupElement("password");
                            setPopup(true);
                        }}
                    >
                        <span>Change Password</span> <IoIosArrowUp className="rotate-90" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProfileCard;
