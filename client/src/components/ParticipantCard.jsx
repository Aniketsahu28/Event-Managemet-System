import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import PopupScreen from "./PopupScreen";
import { popupAtom } from "../store/popupAtom";
import { RxCross2 } from "react-icons/rx";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";
import axios from "axios";
import { userAtom } from "../store/userAtom";
import toast from "react-hot-toast";
import Loader from "./Loader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ParticipantCard = ({ ticketId, userDetails, maxTeamSize, iAmClubMember, isPriceVariation, paymentImage }) => {
    const user = useRecoilValue(userAtom)
    const currentTheme = useRecoilValue(themeAtom);
    const [popup, setPopup] = useRecoilState(popupAtom);
    const [loadingMessage, setLoadingMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const removeParticipant = async () => {
        setLoadingMessage("Removing participant, please wait...")
        setLoading(true)
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/event/deleteticket`,
                {
                    data: {
                        ticketId: ticketId
                    },
                    headers: {
                        "token": user.token
                    }
                }
            );
            toast.success(response.data.message, {
                duration: 3000,
            });
            setPopup(null)
        }
        catch (error) {
            toast.error(error.response?.data.message || error);
            setPopup(null)
        }
        setLoading(false)
    }

    return (
        <>
            {popup === `eventParticipant${userDetails.userId}` && (
                <PopupScreen>
                    <div
                        className={`w-80 sm:w-[50%] lg:w-[25%] rounded-lg mx-auto p-4 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Participant info
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <div className="flex flex-col gap-4 text-center items-center">
                            <img
                                src={userDetails.profilePicture}
                                alt="Profile"
                                className="w-32 h-32 rounded-lg bg-black"
                            />
                            <span className="flex flex-col">
                                <h3 className="text-xl font-montserrat font-semibold">
                                    {userDetails.username}
                                </h3>
                                <p
                                    className={`${currentTheme === "light" ? "text-black/60" : "text-white/70"
                                        }`}
                                >
                                    {userDetails.userId} - {userDetails.department}
                                </p>
                                <p
                                    className={`${currentTheme === "light" ? "text-black/60" : "text-white/70"
                                        }`}
                                >
                                    Email : {userDetails.email}
                                </p>
                                <p
                                    className={`${currentTheme === "light" ? "text-black/60" : "text-white/70"
                                        }`}
                                >
                                    Phone : {userDetails.phone}
                                </p>
                                {isPriceVariation && iAmClubMember && "Member of the club"}
                                {paymentImage !== "" &&
                                    <Link to={paymentImage}
                                        target="_blank"
                                        className={`items-center mt-2 gap-3 flex cursor-pointer border-2 rounded-lg py-2 px-3 hover:scale-95 transition-all ${currentTheme === "light"
                                            ? "border-black/40"
                                            : "border-white/60"
                                            }`}
                                    >
                                        <span>View payment screenshot</span>
                                        <LuExternalLink className="text-xl" />
                                    </Link>}
                            </span>
                        </div>
                        <div className="flex flex-col justify-center sm:flex-row gap-4">
                            <button
                                className={`flex gap-2 items-center justify-center px-4 py-2 rounded-md text-lg border-2 border-blue_100 ${currentTheme === "light" ? "text-black" : "text-white"
                                    }`}
                                onClick={() => setPopup(null)}
                            >
                                Cancel
                                <RxCross2 className="text-2xl cursor-pointer" />
                            </button>
                            {maxTeamSize === 1 &&
                                <button className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-red" onClick={removeParticipant}>
                                    Remove Participant
                                </button>
                            }
                        </div>
                    </div>
                </PopupScreen>
            )}
            {loading && <Loader message={loadingMessage} />}
            <div
                className={`p-4 w-full sm:w-fit custom_shadow rounded-lg cursor-pointer flex items-center gap-4 font-lato ${currentTheme === "light" ? "bg-white" : "bg-gray"
                    }`}
                onClick={() => setPopup(`eventParticipant${userDetails.userId}`)}
            >
                <img
                    src={userDetails.profilePicture}
                    alt="Profile"
                    className="w-12 h-12 bg-black rounded-full"
                />
                <span className="flex flex-col">
                    <p className="text-lg">{userDetails.username}</p>
                    <p
                        className={`${currentTheme === "light" ? "text-black/60" : "text-white/70"
                            }`}
                    >
                        {userDetails.department} - {userDetails.userId}
                    </p>
                </span>
            </div>
        </>
    );
};

export default ParticipantCard;
