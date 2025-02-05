import React, { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
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
import toast from 'react-hot-toast'
import Loader from "./Loader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProfileCard = ({ name, userId, department, image, email, phone }) => {
    const [user, setUser] = useRecoilState(userAtom);
    const currentTheme = useRecoilValue(themeAtom);
    const [popup, setPopup] = useRecoilState(popupAtom);
    const [userInfo, setUserInfo] = useState({
        name: name,
        email: email,
        phone: phone
    })
    const oldPassword = useRef(null);
    const newPassword = useRef(null);
    const reEnteredNewPassword = useRef(null);
    const [profileHover, setProfileHover] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const changeUserInfo = async (event) => {
        event.preventDefault();

        if (!userInfo.name) {
            toast("Username cannot be empty");
        } else {
            setLoadingMessage("Saving changes...")
            setLoading(true)
            try {
                if (user.userInfo.userType === "organizer") {
                    const response = await axios.patch(
                        `${BACKEND_URL}/api/organizer/editUserInfo`,
                        {
                            username: userInfo.name,
                            email: userInfo.email,
                            phone: userInfo.phone,
                        },
                        {
                            headers: {
                                token: user.token,
                            },
                        }
                    );

                    if (response.status === 200) {
                        toast.success(response.data.message, {
                            duration: 3000
                        });
                        setUser((oldinfo) => ({
                            ...oldinfo,
                            userInfo: {
                                ...oldinfo.userInfo,
                                organizerName: userInfo.name,
                                email: userInfo.email,
                                phone: userInfo.phone,
                            },
                        }));
                        setPopup(null);
                    }
                } else {
                    const response = await axios.patch(
                        `${BACKEND_URL}/api/user/editUserInfo`,
                        {
                            username: userInfo.name,
                            email: userInfo.email,
                            phone: userInfo.phone,
                        },
                        {
                            headers: {
                                token: user.token,
                            },
                        }
                    );

                    if (response.status === 200) {
                        toast.success(response.data.message, {
                            duration: 3000
                        });
                        setUser((oldinfo) => ({
                            ...oldinfo,
                            userInfo: {
                                ...oldinfo.userInfo,
                                username: userInfo.name,
                                email: userInfo.email,
                                phone: userInfo.phone,
                            },
                        }));
                        setPopup(null);
                    }
                }
            } catch (error) {
                toast.error(error.response?.data.message || error);
            }
            setLoading(false)
        }
    };

    const changePassword = async (event) => {
        event.preventDefault();
        const _oldPassword = oldPassword.current.value;
        const _newPassword = newPassword.current.value;
        const _reEnteredNewPassword = reEnteredNewPassword.current.value;

        if (!_oldPassword || !_newPassword || !_reEnteredNewPassword) {
            toast("Enter your password");
        } else if (_newPassword !== _reEnteredNewPassword) {
            toast.error("New Password and Re-entered password must be same.");
        } else {
            setLoadingMessage("Saving changes...")
            setLoading(true)
            try {
                const response = await axios.patch(
                    user.userInfo.userType === "organizer"
                        ? `${BACKEND_URL}/api/organizer/changepassword`
                        : `${BACKEND_URL}/api/user/changepassword`,
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

                if (response.status === 200) {
                    toast.success(response.data.message, {
                        duration: 3000
                    });
                    setPopup(null);
                } else {
                    toast(response.data.message);
                }
            } catch (error) {
                toast.error(error.response?.data.message || error);
            }
            setLoading(false)
        }
    };

    const takeProfilePicture = async (event) => {
        const url = await useHandleFileUpload(event);
        setLoadingMessage("Saving changes...")
        setLoading(true)
        try {
            if (user.userInfo.userType === "organizer") {
                const response = await axios.patch(
                    `${BACKEND_URL}/api/organizer/editprofilePicture`,
                    {
                        profilePicture: url,
                    },
                    {
                        headers: {
                            token: user.token,
                        },
                    }
                );

                if (response.status === 200) {
                    toast.success(response.data.message, {
                        duration: 3000
                    });
                    setUser((oldinfo) => ({
                        ...oldinfo,
                        userInfo: {
                            ...oldinfo.userInfo,
                            organizerProfile: url,
                        },
                    }));
                } else {
                    toast.error(error.response?.data.message || error);
                }
            } else {
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

                if (response.status === 200) {
                    toast.success(response.data.message, {
                        duration: 3000
                    });
                    setUser((oldinfo) => ({
                        ...oldinfo,
                        userInfo: {
                            ...oldinfo.userInfo,
                            profilePicture: url,
                        },
                    }));
                } else {
                    toast(response.data.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false)
    };

    return (
        <>
            {popup === "updateinfo" && (
                <PopupScreen>
                    <form
                        onSubmit={changeUserInfo}
                        className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Update Info
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <div className="flex flex-col gap-4">
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
                                    value={userInfo.name}
                                    onChange={(e) => {
                                        setUserInfo((prev) => ({
                                            ...prev,
                                            name: e.target.value
                                        }))
                                    }}
                                />
                            </span>
                            <span className="flex flex-col gap-2">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/40"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder="Ex : johndoe@gmail.com"
                                    value={userInfo.email}
                                    onChange={(e) => {
                                        setUserInfo((prev) => ({
                                            ...prev,
                                            email: e.target.value
                                        }))
                                    }}
                                />
                            </span>
                            <span className="flex flex-col gap-2">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="number"
                                    id="phone"
                                    className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/40"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder="Ex : 1234567890"
                                    value={userInfo.phone}
                                    onChange={(e) => {
                                        setUserInfo((prev) => ({
                                            ...prev,
                                            phone: e.target.value
                                        }))
                                    }}
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
                </PopupScreen>
            )}
            {popup === "password" && (
                <PopupScreen>
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
                                onClick={() => setPopup(null)}
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
                </PopupScreen>
            )}
            {loading && <Loader message={loadingMessage} />}
            <div
                className={`flex flex-col sm:flex-row items-center sm:items-stretch justify-center gap-6 custom_shadow p-4 sm:p-6 rounded-lg w-full sm:w-fit ${currentTheme === "light"
                    ? "text-black bg-white"
                    : "bg-gray text-white"
                    }`}
            >
                <div
                    className="w-40 h-40 bg-black rounded-lg overflow-hidden relative"
                    onMouseEnter={() => setProfileHover(true)}
                    onMouseLeave={() => setProfileHover(false)}
                >
                    <img src={image} alt="Profile" className="object-cover w-full h-full" />
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
                <div className="flex flex-col justify-between gap-4 sm:gap-0 items-center sm:items-start relative sm:pr-10">
                    <FaRegPenToSquare
                        className={`absolute -right-10 sm:right-0 top-1 text-xl ${currentTheme === "light"
                            ? "text-black/60 hover:text-black"
                            : "text-white/60 hover:text-white"
                            }`}
                        onClick={() => {
                            setPopup("updateinfo");
                        }}
                    />
                    <span className="flex flex-col items-center sm:items-start">
                        <h2 className="font-montserrat font-medium text-xl sm:text-2xl">
                            {name}
                        </h2>{" "}
                        <p
                            className={`${currentTheme === "light" ? "text-black/80" : "text-white/80"
                                }`}
                        >
                            {userId}{department !== 'Outsider' && ` - ${department}`}
                        </p>
                        <p
                            className={`${currentTheme === "light" ? "text-black/80" : "text-white/80"
                                }`}
                        >
                            Email : {email}
                        </p>
                        <p
                            className={`${currentTheme === "light" ? "text-black/80" : "text-white/80"
                                }`}
                        >
                            Phone : {phone}
                        </p>
                    </span>
                    <button
                        className="w-fit flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-blue_100"
                        onClick={() => {
                            setPopup("password");
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
