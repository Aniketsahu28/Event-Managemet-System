import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/userAtom";
import { themeAtom } from "../store/themeAtom";
import ProfileCard from "../components/ProfileCard";
import EventTicket from "../components/EventTicket";
import { useDebounce } from "../hooks/useDebounce";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const [tickets, setTickets] = useState();
    const [search, setSearched] = useState();
    const searchedTicket = useRef(null);

    useEffect(() => {
        fetchUserTickets();
    }, []);

    const fetchUserTickets = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/event/usertickets`, {
                headers: {
                    token: user.token,
                },
            });

            if (response.statusText === "OK") {
                setTickets(response.data.userTickets);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const searchTickets = () => {
        const searchResult = tickets.filter((ticket) => {
            return ticket.eventDetails.title
                .toLowerCase()
                .includes(searchedTicket.current.value.toLowerCase());
        });
        setSearched(searchResult);
    };

    return (
        <div
            className={`items-center sm:items-start mx-4 sm:mx-16 py-10 sm:py-20 flex flex-col gap-20 ${currentTheme === "light" ? "text-black" : "text-white"
                }`}
        >
            <ProfileCard
                name={user?.userInfo.username}
                userId={user?.userInfo.userId}
                department={user?.userInfo.department}
                image={user?.userInfo.profilePicture}
            />
            <div className="w-full flex flex-col gap-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 font-lato">
                    <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                        Your Event Tickets
                    </h2>
                    <input
                        type="text"
                        name="userId"
                        className={`w-full sm:w-[50%] lg:w-[25%] p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                            ? "bg-white/60  placeholder-black/60"
                            : "bg-gray/60 border-white text-white placeholder-white/60"
                            }`}
                        placeholder="Search ticket by title"
                        ref={searchedTicket}
                        onChange={useDebounce(searchTickets)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-10 flex-wrap w-full sm:w-fit items-center sm:items-start justify-between">
                    {tickets?.length > 0
                        ? searchedTicket.current.value === ""
                            ? tickets.map((ticket) => (
                                <EventTicket
                                    key={ticket._id}
                                    event={ticket.eventDetails}
                                    user={user.userInfo}
                                />
                            ))
                            : search.map((ticket) => (
                                <EventTicket
                                    key={ticket._id}
                                    event={ticket.eventDetails}
                                    user={user.userInfo}
                                />
                            ))
                        : "No tickets found"}
                </div>
            </div>
        </div>
    );
};

export default Profile;
