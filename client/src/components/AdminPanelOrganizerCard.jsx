import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Link } from 'react-router-dom';
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

const AdminPanelOrganizerCard = ({ organizer }) => {
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const [popup, setPopup] = useRecoilState(popupAtom);
    const [loadingMessage, setLoadingMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const removeOrganizer = async () => {
        setLoadingMessage("Removing organizer, please wait...")
        setLoading(true)
        try {
            const response = await axios.delete(
                `${BACKEND_URL}/api/organizer/deleteorganizer`,
                {
                    headers: {
                        token: user.token,
                    },
                    data: {
                        organizerId: organizer.organizerId,
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
            {popup === `removeorganizer-${organizer.organizerId}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Remove Organizer
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col items-center text-center gap-4">
                            <img
                                src={organizer.organizerProfile}
                                alt="Profile picture"
                                className="w-32 h-32 object-cover rounded-lg"
                            />
                            <span>
                                <p className="text-lg font-montserrat font-medium">
                                    {organizer.organizerName}
                                </p>
                                <p
                                    className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                        }`}
                                >
                                    Organizer Id : {organizer.organizerId} <br />
                                    Department : {organizer.department} <br />
                                    Faculty Id : {organizer.facultyDetails.userId} <br />
                                    Organizer type : {organizer.organizerType}<br />
                                    Email : {organizer.email}<br />
                                    Phone: {organizer.phone}
                                </p>
                            </span>
                        </span>
                        <button
                            className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-red"
                            onClick={removeOrganizer}
                        >
                            Remove Organizer
                        </button>
                    </div>
                </PopupScreen>
            )}
            {loading && <Loader message={loadingMessage} />}
            <Link to={`/organizers/${organizer._id}`}
                className={`col-span-12 lg:col-span-6 flex flex-col sm:flex-row gap-2 justify-between custom_shadow p-3 rounded-lg ${currentTheme === "light" ? "bg-white" : "bg-black"
                    }`}
            >
                <div className="flex gap-3">
                    <img
                        src={organizer.organizerProfile}
                        alt="Profile picture"
                        className="w-20 h-20 object-cover rounded-md"
                    />
                    <span>
                        <p className="text-lg font-montserrat font-medium">
                            {organizer.organizerName}
                        </p>
                        <p
                            className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                }`}
                        >
                            Organizer Id : {organizer.organizerId}
                        </p>
                        <p
                            className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                }`}
                        >
                            Department : {organizer.department}
                        </p>
                    </span>
                </div>
                <button
                    className="flex gap-2 items-center justify-center bg-red p-2 rounded-md text-white"
                    onClick={(e) => {
                        e.preventDefault()
                        setPopup(`removeorganizer-${organizer.organizerId}`);
                    }}
                >
                    <span className="sm:hidden">Remove Organizer</span>
                    <RiDeleteBin6Line className="text-xl" />
                </button>
            </Link>
        </>
    );
};

export default AdminPanelOrganizerCard;
