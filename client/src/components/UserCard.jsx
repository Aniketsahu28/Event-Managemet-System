import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { RiDeleteBin6Line } from "react-icons/ri";
import PopupScreen from "./PopupScreen";
import { popupAtom } from "../store/popupAtom";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import axios from "axios";
import { userAtom } from "../store/userAtom";
import Loader from "./Loader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UserCard = ({ userDetails }) => {
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const [popup, setPopup] = useRecoilState(popupAtom);
    const [loadingMessage, setLoadingMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const removeStudent = async () => {
        setLoadingMessage("Removing student, please wait...")
        setLoading(true)
        try {
            const response = await axios.delete(
                `${BACKEND_URL}/api/user/deletestudent`,
                {
                    headers: {
                        token: user.token,
                    },
                    data: {
                        fromRollno: userDetails.userId,
                        toRollno: userDetails.userId,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Student removed successfully");
                setPopup(null);
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false)
    };

    const removeFaculty = async () => {
        setLoadingMessage("Removing faculty, please wait...")
        setLoading(true)
        try {
            const response = await axios.delete(
                `${BACKEND_URL}/api/user/deletefaculty`,
                {
                    headers: {
                        token: user.token,
                    },
                    data: {
                        userId: userDetails.userId,
                    },
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message);
                setPopup(null);
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false)
    };

    return (
        <>
            {popup === `removestudent-${userDetails.userId}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Remove Student
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col items-center text-center gap-4">
                            <img
                                src={userDetails.profilePicture}
                                alt="Profile picture"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                            <span>
                                <p className="text-lg font-montserrat font-medium">
                                    {userDetails.username}
                                </p>
                                <p
                                    className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                        }`}
                                >
                                    Roll no : {userDetails.userId}
                                </p>
                                <p
                                    className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                        }`}
                                >
                                    Department : {userDetails.department}
                                </p>
                            </span>
                        </span>
                        <button
                            className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-red"
                            onClick={removeStudent}
                        >
                            Remove Student
                        </button>
                    </div>
                </PopupScreen>
            )}
            {popup === `removefaculty-${userDetails.userId}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Remove Faculty
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col items-center text-center gap-4">
                            <img
                                src={userDetails.profilePicture}
                                alt="Profile picture"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                            <span>
                                <p className="text-lg font-montserrat font-medium">
                                    {userDetails.username}
                                </p>
                                <p
                                    className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                        }`}
                                >
                                    Faculty Id : {userDetails.userId}
                                </p>
                                <p
                                    className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                        }`}
                                >
                                    Department : {userDetails.department}
                                </p>
                            </span>
                        </span>
                        <button
                            className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-red"
                            onClick={removeFaculty}
                        >
                            Remove Faculty
                        </button>
                    </div>
                </PopupScreen>
            )}
            {loading && <Loader message={loadingMessage} />}
            <div
                className={`col-span-12 lg:col-span-6 flex flex-col sm:flex-row gap-2 justify-between custom_shadow p-3 rounded-lg ${currentTheme === "light" ? "bg-white" : "bg-black"
                    }`}
            >
                <div className="flex gap-3">
                    <img
                        src={userDetails.profilePicture}
                        alt="Profile picture"
                        className="w-20 h-20 object-cover rounded-md"
                    />
                    <span>
                        <p className="text-lg font-montserrat font-medium">
                            {userDetails.username}
                        </p>
                        <p
                            className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                }`}
                        >
                            {userDetails.userType === 'student' ? "Roll no" : "Faculty Id"} : {userDetails.userId}
                        </p>
                        <p
                            className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                }`}
                        >
                            Department : {userDetails.department}
                        </p>
                    </span>
                </div>
                <button
                    className="flex gap-2 items-center justify-center bg-red p-2 rounded-md text-white"
                    onClick={() => {
                        userDetails.userType === 'student' ?
                            setPopup(`removestudent-${userDetails.userId}`) :
                            setPopup(`removefaculty-${userDetails.userId}`)
                    }}
                >
                    <span className="sm:hidden">Remove {userDetails.userType === 'student' ? "Student" : "Faculty"}</span>
                    <RiDeleteBin6Line className="text-xl" />
                </button>
            </div>
        </>
    );
};

export default UserCard;
