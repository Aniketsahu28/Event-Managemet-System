import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/userAtom";
import { themeAtom } from "../store/themeAtom";
import ProfileCard from "../components/ProfileCard";
import EventTicket from "../components/EventTicket";
import { useDebounce } from "../hooks/useDebounce";
import EventCard from "../components/EventCard";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import OrganizerApprovalCard from "../components/OrganizerApprovalCard";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const [events, setEvents] = useState();
    const [approvals, setApprovals] = useState();
    const [tickets, setTickets] = useState();
    const [searchEvent, setSearchedEvent] = useState();
    const [searchApproval, setSearchedApproval] = useState();
    const [searchTicket, setSearchedTicket] = useState();
    const searchedEvent = useRef(null);
    const searchedApproval = useRef(null);
    const searchedTicket = useRef(null);

    useEffect(() => {
        if (user.userInfo.userType === "organizer") {
            fetchOrganizerEvents();
            fetchOrganizerApprovals();
        } else if (user.userInfo.userType === "student") {
            fetchUserTickets();
        }
    }, []);

    const fetchUserTickets = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/event/usertickets`, {
                headers: {
                    token: user.token,
                },
            });

            if (response.status === 200) {
                setTickets(response.data.userTickets);
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    const searchTickets = () => {
        const searchResult = tickets.filter((ticket) => {
            return ticket.eventDetails.title
                .toLowerCase()
                .includes(searchedTicket.current.value.toLowerCase());
        });
        setSearchedTicket(searchResult);
    };

    const searchEvents = () => {
        const searchResult = events.filter((event) => {
            return event.title
                .toLowerCase()
                .includes(searchedEvent.current.value.toLowerCase());
        });
        setSearchedEvent(searchResult);
    };

    const searchApprovals = () => {
        const searchResult = approvals.filter((approval) => {
            return approval.title
                .toLowerCase()
                .includes(searchedApproval.current.value.toLowerCase());
        });
        setSearchedApproval(searchResult);
    };

    const fetchOrganizerEvents = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/event/organizerevents`,
                {
                    params: {
                        organizerId: user.userInfo.organizerId,
                    },
                }
            );

            setEvents(response.data.organizerEvents);
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    const fetchOrganizerApprovals = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/approval/organizerapprovals`,
                {
                    headers: {
                        token: user.token
                    }
                }
            );
            setApprovals(response.data.organizerApprovals);
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };


    return (
        <div
            className={`items-center sm:items-start mx-4 sm:mx-16 py-10 sm:py-20 flex flex-col gap-20 ${currentTheme === "light" ? "text-black" : "text-white"
                }`}
        >
            {user?.userInfo.userType === "organizer" ? (
                <ProfileCard
                    name={user?.userInfo.organizerName}
                    userId={user?.userInfo.organizerId}
                    department={user?.userInfo.department}
                    image={user?.userInfo.organizerProfile}
                />
            ) : user?.userInfo.userType === "student" ||
                user?.userInfo.userType === "faculty" ? (
                <ProfileCard
                    name={user?.userInfo.username}
                    userId={user?.userInfo.userId}
                    department={user?.userInfo.department}
                    image={user?.userInfo.profilePicture}
                />
            ) : (
                <h1 className="text-lg sm:text-xl lg:text-2xl font-montserrat font-semibold mx-auto">I am Admin</h1>
            )}

            {user.userInfo.userType === "organizer" && (
                <div className="w-full flex flex-col gap-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 font-lato">
                        <span className="flex items-center justify-between w-full sm:w-fit gap-8">
                            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                My Events
                            </h2>
                            <Link
                                to="/addEvent"
                                className="w-fit flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                            >
                                <span>Add Event</span>
                                <FaPlus className="hidden sm:block" />
                            </Link>
                        </span>
                        <input
                            type="text"
                            name="event title"
                            className={`w-full sm:w-[40%] lg:w-[25%] p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                ? "bg-white/60  placeholder-black/60"
                                : "bg-gray/60 border-white text-white placeholder-white/60"
                                }`}
                            placeholder="Search event by title"
                            ref={searchedEvent}
                            onChange={useDebounce(searchEvents)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-10 flex-wrap w-full sm:w-fit items-center sm:items-start justify-between">
                        {events?.length > 0
                            ? searchedEvent.current.value === ""
                                ? [...events]
                                    .reverse()
                                    .map((event) => (
                                        <EventCard
                                            key={event._id}
                                            id={event._id}
                                            title={event.title}
                                            banner={event.banner}
                                            description={event.description}
                                            time={event.time}
                                            date={event.date}
                                            price={event.eventFee}
                                            organizerId={event.organizerDetails.organizerId}
                                            setEvents={setEvents}
                                        />
                                    ))
                                : [...searchEvent]
                                    .reverse()
                                    .map((event) => (
                                        <EventCard
                                            key={event._id}
                                            id={event._id}
                                            title={event.title}
                                            banner={event.banner}
                                            description={event.description}
                                            time={event.time}
                                            date={event.date}
                                            price={event.eventFee}
                                            organizerId={event.organizerDetails.organizerId}
                                            setEvents={setEvents}
                                        />
                                    ))
                            : "No events found"}
                    </div>
                </div>
            )}

            {user.userInfo.userType === "organizer" && (
                <div className="w-full flex flex-col gap-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 font-lato">
                        <span className="flex items-center justify-between w-full sm:w-fit sm:gap-8">
                            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                My Approvals
                            </h2>
                            <Link
                                to="/addapproval"
                                className="w-fit flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                            >
                                <span>Add Approval</span>
                                <FaPlus className="hidden sm:block" />
                            </Link>
                        </span>
                        <input
                            type="text"
                            name="approval title"
                            className={`w-full sm:w-[40%] lg:w-[25%] p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                ? "bg-white/60  placeholder-black/60"
                                : "bg-gray/60 border-white text-white placeholder-white/60"
                                }`}
                            placeholder="Search approval by title"
                            ref={searchedApproval}
                            onChange={useDebounce(searchApprovals)}
                        />
                    </div>
                    <div className="flex flex-col sm:grid grid-cols-12 gap-10">
                        {approvals?.length > 0
                            ? searchedApproval.current.value === ""
                                ? [...approvals]
                                    .reverse()
                                    .map((approval) => (
                                        <OrganizerApprovalCard approval={approval} key={approval._id} />
                                    ))
                                : [...searchApproval]
                                    .reverse()
                                    .map((approval) => (
                                        <OrganizerApprovalCard approval={approval} key={approval._id} />
                                    ))
                            : <p className="w-full sm:col-span-6">No approvals found</p>}
                    </div>
                </div>
            )}
            {user.userInfo.userType === "student" && (
                <div className="w-full flex flex-col gap-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 font-lato">
                        <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                            My Event Tickets
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
                    <div className="flex flex-col sm:flex-row gap-10 flex-wrap w-full sm:w-fit items-center sm:items-start">
                        {tickets?.length > 0
                            ? searchedTicket.current.value === ""
                                ? [...tickets]
                                    .reverse()
                                    .map((ticket) => (
                                        <EventTicket
                                            key={ticket._id}
                                            event={ticket.eventDetails}
                                            user={user.userInfo}
                                        />
                                    ))
                                : [...searchTicket]
                                    .reverse()
                                    .map((ticket) => (
                                        <EventTicket
                                            key={ticket._id}
                                            event={ticket.eventDetails}
                                            user={user.userInfo}
                                        />
                                    ))
                            : "No tickets found"}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
