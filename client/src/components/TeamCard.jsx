import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import PopupScreen from "./PopupScreen";
import { popupAtom } from "../store/popupAtom";
import { RxCross2 } from "react-icons/rx";
import { LuExternalLink } from "react-icons/lu";
import { Link } from "react-router-dom";
import axios from "axios";
import { userAtom } from "../store/userAtom";
import ParticipantCard from "./ParticipantCard";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeamCard = ({ ticket, maxTeamSize, iAmClubMember, isPriceVariation, paymentImage }) => {
    const user = useRecoilValue(userAtom);
    const currentTheme = useRecoilValue(themeAtom);
    const [popup, setPopup] = useRecoilState(popupAtom);

    const removeTeam = async () => {
        try {
            const response = await axios.delete(
                `${BACKEND_URL}/api/event/deleteticket`,
                {
                    data: {
                        ticketId: ticket._id,
                    },
                    headers: {
                        token: user.token,
                    },
                }
            );
            toast.success(response.data.message);
            setPopup(null);
        } catch (error) {
            toast.error(error.response?.data.message || error);
            setPopup(null);
        }
    };

    return (
        <>
            {popup === `removeTeam-${ticket.teamName}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 sm:w-96 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Remove Team
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <p className="text-center">Are you sure you want to remove team : <b>{ticket.teamName}</b> ?</p>
                        <button
                            className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-red"
                            onClick={removeTeam}
                        >
                            Yes, Remove team
                        </button>
                    </div>
                </PopupScreen>
            )}
            <div className={`p-4 rounded-lg flex flex-col sm:flex-row sm:flex-wrap w-full sm:w-fit gap-4 border-[1px] ${currentTheme === 'light' ? "border-black" : "border-white"}`}>
                <h2 className="p-4 rounded-lg flex items-center justify-center font-medium text-xl bg-gray text-white">
                    {ticket.teamName}
                </h2>
                {ticket.userDetails.map((user, index) => (
                    <ParticipantCard
                        key={index}
                        userDetails={user}
                        maxTeamSize={maxTeamSize}
                        iAmClubMember={iAmClubMember}
                        isPriceVariation={isPriceVariation}
                        paymentImage={paymentImage}
                    />
                ))}
                <button
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-lg text-white bg-red`}
                    onClick={() => setPopup(`removeTeam-${ticket.teamName}`)}
                >
                    <p className="block sm:hidden">Remove Team</p>
                    <RiDeleteBin6Line className="text-2xl" />
                </button>
            </div>
        </>
    );
};

export default TeamCard;
