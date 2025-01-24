import React, { useState } from "react";
import DOMPurify from "dompurify";
import { SlCalender } from "react-icons/sl";
import { LuClock } from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRecoilState, useRecoilValue } from "recoil";
import { isAuthenticated, userAtom } from "../store/userAtom";
import axios from "axios";
import PopupScreen from "./PopupScreen";
import { RxCross2 } from "react-icons/rx";
import { popupAtom } from "../store/popupAtom";
import { themeAtom } from "../store/themeAtom";
import toast from 'react-hot-toast'
import Loader from "./Loader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EventCard = ({
    organizerId,
    id,
    title,
    description,
    banner,
    date,
    time,
    price,
    setEvents,
}) => {
    const currentTheme = useRecoilValue(themeAtom)
    const user = useRecoilValue(userAtom);
    const isUserAuthenticated = useRecoilValue(isAuthenticated)
    const [popup, setPopup] = useRecoilState(popupAtom)
    const [loading, setLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState("")
    const sanitizedDescription = DOMPurify.sanitize(description);
    const trimmedDescription =
        sanitizedDescription.length > 40
            ? `${sanitizedDescription.slice(0, 40)}...`
            : sanitizedDescription;

    function convertDateToDDMMYYYY(dateString) {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    }

    const deleteEvent = async (e) => {
        e.preventDefault();
        setLoadingMessage("Deleting event...")
        setLoading(true)
        try {
            const response = await axios.delete(
                `${BACKEND_URL}/api/event/deleteevent`,
                {
                    headers: { token: user.token },
                    data: { eventId: id },
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message, {
                    duration: 3000
                });
                setEvents((prevEvents) => {
                    return prevEvents.filter((event) => event._id !== id)
                })
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false)
    };

    return (
        <>
            {popup === `deleteEvent${id}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Delete event
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <p className="text-center">Are you sure you want to delete this event. You can never restore it.</p>
                        <button
                            className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-red"
                            onClick={deleteEvent}
                        >
                            Yes, delete event
                        </button>
                    </div>
                </PopupScreen>
            )}
            {loading && <Loader message={loadingMessage} />}
            <Link
                to={`/events/${id}`}
                className="hover:scale-95 transition-all w-[320px] sm:w-[330px] custom_shadow rounded-lg p-3 flex flex-col gap-2 bg-blue_200 relative"
            >
                <button
                    className={`${isUserAuthenticated && user?.userInfo.userType === 'organizer' && user?.userInfo.organizerId === organizerId ? "block" : "hidden"
                        } p-3 bg-red w-fit rounded-full absolute right-3`}
                    onClick={(e) => {
                        e.preventDefault()
                        setPopup(`deleteEvent${id}`)
                    }}
                >
                    <RiDeleteBin6Line className="text-2xl text-white" />
                </button>
                <div className="w-full h-40 bg-gray rounded-lg flex items-center justify-center overflow-hidden">
                    <img src={banner} alt="Event" className="h-full w-full object-cover" />
                </div>
                <span>
                    <h1 className="self-start text-white text-lg font-montserrat">
                        {title.length > 26 ? `${title.slice(0, 26)}...` : title}
                    </h1>
                    <p
                        className="self-start text-white/60 text-sm font-lato"
                        dangerouslySetInnerHTML={{ __html: trimmedDescription }}
                    />
                </span>
                <div className="flex justify-between font-lato text-white mt-2">
                    <span className="flex gap-1 items-center justify-center">
                        <SlCalender />
                        {convertDateToDDMMYYYY(date)}
                    </span>
                    <span className="flex gap-1 items-center justify-center">
                        <LuClock /> {time}
                    </span>
                    <span className="flex items-center justify-center">
                        <MdCurrencyRupee /> {price}
                    </span>
                </div>
            </Link>
        </>
    );
};

export default EventCard;
