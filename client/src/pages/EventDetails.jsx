import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SlCalender } from "react-icons/sl";
import { LuClock } from "react-icons/lu";
import { GrLocationPin } from "react-icons/gr";
import { GoPeople } from "react-icons/go";
import { MdCurrencyRupee } from "react-icons/md";
import DOMPurify from "dompurify";
import EventTimer from "../components/EventTimer";
import { popupAtom } from "../store/popupAtom";
import PopupScreen from "../components/PopupScreen";
import { RxCross2 } from "react-icons/rx";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useHandleFileUpload } from "../hooks/useHandleFileUpload";
import { isAuthenticated, userAtom } from "../store/userAtom";
import ParticipantCard from "../components/ParticipantCard";
import { IoIosArrowUp } from "react-icons/io";
import EditEventDetails from "../components/EditEventDetails";
import toast from "react-hot-toast";
import { MdOutlineFileDownload } from "react-icons/md";
import jsonToCsvExport from "json-to-csv-export";
import { MdVerified } from "react-icons/md";
import { FaChair } from "react-icons/fa6";
import TeamCard from "../components/TeamCard";
import Loader from "../components/Loader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EventDetails = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const { id } = useParams();
    const [event, setEvent] = useState();
    const [userIsClubMember, setUserIsClubMember] = useState(false);
    const [eventTickets, setEventTickets] = useState();
    const [searchedEventTickets, setSearchedEventTickets] = useState();
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentUrl, setPaymentUrl] = useState("");
    const sanitizedDescription = DOMPurify.sanitize(event?.description);
    const [popup, setPopup] = useRecoilState(popupAtom);
    const user = useRecoilValue(userAtom);
    const isUserAuthenticated = useRecoilValue(isAuthenticated);
    const [allstudents, setAllStudents] = useState();
    const [teammates, setTeammates] = useState([]);
    const memberRef = useRef();
    const [teamName, setTeamName] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");
    const validateDescription = useRef();

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (
            isUserAuthenticated &&
            user.userInfo.userType === "organizer" &&
            event?.organizerDetails.organizerId === user.userInfo.organizerId
        ) {
            fetchEventTickets();
        }
    }, [event]);

    function canBookEvent(eventDate, eventTime) {
        const eventDateTimeString = `${eventDate}T${eventTime}:00`;
        const currentDateTime = new Date();
        const eventDateTime = new Date(eventDateTimeString);
        return currentDateTime < eventDateTime;
    }

    const fetchEvents = async () => {
        setLoadingMessage("Loading event details...");
        setLoading(true);
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/event/eventdetails`,
                {
                    params: {
                        eventId: id,
                    },
                }
            );

            setEvent(response.data.eventDetails);
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false);
    };

    const fetchEventTickets = async () => {
        setLoadingMessage("Loading event details....");
        setLoading(true);
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/event/eventtickets`,
                {
                    params: {
                        eventId: id,
                    },
                    headers: {
                        token: user.token,
                    },
                }
            );
            setEventTickets(response.data.eventTickets);
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false);
    };

    const formatDateToWords = (dateString) => {
        if (!dateString) {
            return "Loading...";
        }

        const [year, month, day] = dateString.split("-");
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return `${day} ${months[month - 1]} ${year}`;
    };

    function convertTo12HourFormat(time24) {
        if (!time24) {
            return "Loading...";
        }

        let [hours, minutes] = time24.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${period}`;
    }

    const addTeamMates = async () => {
        if (!isUserAuthenticated) {
            toast("Please login to continue");
            return;
        } else if (!user.userInfo.email) {
            toast.error("Please first add your contact information in profile");
            return;
        } else {
            try {
                setPopup("addTeammates");
                const response = await axios.get(`${BACKEND_URL}/api/user/allstudents`);
                setAllStudents(response.data.students);
            } catch (error) {
                toast.error("Something went wrong, please try again.");
            }
        }
    };

    const isUserPresentInTeam = () => {
        const userPresent = teammates.find(
            (teammate) => teammate.userId === user.userInfo.userId
        );
        console.log(userPresent ? true : false);
        return userPresent ? true : false;
    };

    const isUserTicketAlreadyBooked = async () => {
        setLoadingMessage("Processing, please wait...");
        setLoading(true);

        try {
            const userDetails =
                event?.maxTeamSize > 1
                    ? JSON.stringify(teammates)
                    : JSON.stringify([
                        {
                            userId: user.userInfo.userId,
                            username: user.userInfo.username,
                        },
                    ]);

            const response = await axios.get(
                `${BACKEND_URL}/api/event/isUserTicketBookedAlready`,
                {
                    params: {
                        eventId: event._id,
                        userDetails: userDetails,
                    },
                    headers: {
                        token: user.token,
                    },
                }
            );

            if (response.data.found === true) {
                toast.error(response.data.message);
                setPopup(null);
                setLoading(false);
                return true;
            } else {
                setLoading(false);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data.message || error.message);
        }

        setLoading(false);
    };

    const getTicket = async () => {
        if (!isUserAuthenticated) {
            toast("Please login to continue");
            return;
        } else if (
            (user.userInfo.department !== "Outsider" &&
                !event?.eventForDepts.includes(user.userInfo.department) &&
                !event?.eventForDepts.includes("All Departments")) ||
            (user.userInfo.department === "Outsider" && !event.outsideStudentsAllowed)
        ) {
            let depts = "";
            event.eventForDepts.forEach((dept) => {
                depts += dept + ", ";
            });
            if (user.userInfo.department === "Outsider") {
                toast("Event is only for FCRIT students");
            } else {
                toast(`Event is for ${depts}`);
            }
        } else if (!user.userInfo.isVerified || !user.userInfo.phone) {
            if (!user.userInfo.isVerified) {
                toast.error("Email is not verified, Add email in profile")
            }
            else {
                toast.error("Add your contact number in profile");
            }
            return;
        } else if (event?.maxTeamSize > 1 && teamName === "") {
            toast.error("Please Enter your team name");
        } else if (event?.maxTeamSize > 1 && !isUserPresentInTeam()) {
            toast.error("You didn't add youself in team");
        } else if (await isUserTicketAlreadyBooked()) {
            return;
        } else if (!event?.isEventFree) {
            setPopup("paymentPopup");
        } else {
            setLoadingMessage("Booking event, please wait...");
            setLoading(true);
            try {
                const response = await axios.post(
                    `${BACKEND_URL}/api/event/bookticket`,
                    event?.maxTeamSize > 1
                        ? {
                            eventId: event._id,
                            userDetails: teammates,
                            teamName: teamName,
                        }
                        : {
                            eventId: event._id,
                            userDetails: [
                                {
                                    userId: user.userInfo.userId,
                                    username: user.userInfo.username,
                                    email: user.userInfo.email,
                                    phone: user.userInfo.phone,
                                    department: user.userInfo.department,
                                    profilePicture: user.userInfo.profilePicture,
                                },
                            ],
                        },
                    {
                        headers: {
                            token: user.token,
                        },
                    }
                );
                if (response.status === 201) {
                    toast.success(response.data.message, {
                        duration: 3000,
                    });
                    setPopup(null);
                } else {
                    toast(response.data.message);
                    setPopup(null);
                }
            } catch (error) {
                toast.error(error.response?.data.message || error);
            }
            setLoading(false);
        }
    };

    const takePaymentScreenshot = async (event) => {
        setLoadingMessage("Uploding payment screenshot...");
        setLoading(true);
        const url = await useHandleFileUpload(event);
        setLoading(false);
        setPaymentUrl(url);
    };

    const handleBooking = async () => {
        if (paymentUrl === "") {
            toast("Payment required to proceed");
        } else {
            setLoadingMessage("Booking event, please wait....");
            setLoading(true);
            try {
                const response = await axios.post(
                    `${BACKEND_URL}/api/event/bookticket`,
                    event?.maxTeamSize > 1
                        ? {
                            eventId: event._id,
                            paymentImage: paymentUrl,
                            iAmClubMember: userIsClubMember,
                            userDetails: teammates,
                            teamName: teamName,
                        }
                        : {
                            eventId: event._id,
                            paymentImage: paymentUrl,
                            iAmClubMember: userIsClubMember,
                            userDetails: [
                                {
                                    userId: user.userInfo.userId,
                                    username: user.userInfo.username,
                                    email: user.userInfo.email,
                                    phone: user.userInfo.phone,
                                    department: user.userInfo.department,
                                    profilePicture: user.userInfo.profilePicture,
                                },
                            ],
                        },
                    {
                        headers: {
                            token: user.token,
                        },
                    }
                );
                if (response.status === 201) {
                    toast.success(response.data.message, {
                        duration: 3000,
                    });
                } else {
                    toast(response.data.message);
                }
                setPopup(null);
            } catch (error) {
                toast.error(error.response?.data.message || error);
            }
            setLoading(false);
        }
    };

    const handleSearchParticipant = (e) => {
        setSearchTerm(e.target.value);
        const searchResult = eventTickets.filter((ticket) => {
            return event?.maxTeamSize > 1
                ? ticket.teamName.toLowerCase().includes(e.target.value.toLowerCase())
                : ticket.userDetails[0].userId.includes(e.target.value);
        });
        setSearchedEventTickets(searchResult);
    };

    const toggleParticipation = async (e) => {
        e.preventDefault();
        setLoadingMessage("Processing, please wait....");
        setLoading(true);
        try {
            const response = await axios.patch(
                `${BACKEND_URL}/api/event/toggleparticipation`,
                {
                    eventId: id,
                    status: !event.acceptingParticipation,
                },
                {
                    headers: {
                        token: user.token,
                    },
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message, {
                    duration: 3000,
                });
                setEvent((prev) => {
                    return {
                        ...prev,
                        acceptingParticipation: !prev.acceptingParticipation,
                    };
                });
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false);
    };

    const downloadParticipantsList = () => {
        const tickets = eventTickets;
        let participantsList = [];
        tickets.forEach((ticket) => {
            const currentDate = new Date();

            ticket.userDetails.forEach((userDetail) => {
                if (userDetail.department === "Outsider") {
                    userDetail.year = "Outsider";
                } else {
                    const userJoiningYear = userDetail.userId.slice(2, 4);
                    const userDate = new Date(`20${userJoiningYear}-06-01`);
                    const difference =
                        (currentDate.getFullYear() - userDate.getFullYear()) * 12 +
                        currentDate.getMonth() -
                        userDate.getMonth();
                    userDetail.year = Math.ceil(difference / 12);
                }

                //Push into the array
                event?.isPriceVariation
                    ? participantsList.push({
                        teamName: event?.maxTeamSize > 1 && ticket.teamName,
                        userId: userDetail.userId,
                        username: userDetail.username,
                        department: userDetail.department,
                        year: userDetail.year,
                        amoutPaid:
                            ticket.eventDetails.isPriceVariation && ticket.iAmClubMember
                                ? ticket.eventDetails.eventFeeForClubMember
                                : ticket.eventDetails.eventFee,
                        clubMember: ticket.iAmClubMember ? "Yes" : "No",
                    })
                    : participantsList.push({
                        teamName: event?.maxTeamSize > 1 && ticket.teamName,
                        userId: userDetail.userId,
                        username: userDetail.username,
                        department: userDetail.department,
                        year: userDetail.year,
                    });
            });
        });
        jsonToCsvExport({
            data: participantsList,
            filename: event.title + " Participants",
        });
    };

    const addMembers = () => {
        const student = allstudents.find((student) => {
            return student.userId === memberRef.current.value;
        });

        if (teammates.length < event?.maxTeamSize) {
            if (student) {
                const alreadyPresent = teammates.find(
                    (teammate) => teammate.userId === student.userId
                );
                if (alreadyPresent) {
                    toast.error("Member already added in your team");
                } else {
                    setTeammates((prevTeammates) => [...prevTeammates, student]);
                }
            } else {
                toast.error("Invalid user Id");
            }
        } else {
            toast.error("Team size limit reached");
        }
        memberRef.current.value = "";
    };

    const removeMember = (teammateUserId) => {
        setTeammates((prevTeammates) =>
            prevTeammates.filter((teammate) => teammate.userId !== teammateUserId)
        );
    };

    const validateEvent = async (status) => {
        setLoadingMessage("Processing, please wait...")
        setLoading(true)
        try {
            const response = await axios.patch(`${BACKEND_URL}/api/event/verifyEvent`,
                {
                    eventId: event._id,
                    facultyStatus: status,
                    facultyReview: validateDescription.current.value
                },
                {
                    headers: {
                        token: user.token
                    }
                }
            )
            toast.success(response.data.message)
            setPopup(null)
        }
        catch (error) {
            toast.error(error.response?.data.message || error)
        }
        setLoading(false)
    }

    return (
        <>
            {popup === "paymentPopup" && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-24 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">Payment</p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col gap-4 items-center">
                            <img
                                src={event.paymentQR}
                                alt="Payment QR"
                                className="h-48 w-48 bg-white custom_shadow rounded-lg"
                            />
                            <p className="text-lg">UPI id : {event.UPI_ID}</p>
                            <label
                                htmlFor="paymentQR"
                                className={`items-center gap-4 flex cursor-pointer border-2 rounded-lg p-2 hover:scale-95 transition-all ${currentTheme === "light"
                                    ? "border-black/40"
                                    : "border-white/60"
                                    }`}
                            >
                                <input
                                    id="paymentQR"
                                    type="file"
                                    className="hidden"
                                    onChange={takePaymentScreenshot}
                                />
                                <p>Upload screenshot of payment</p>
                                {paymentUrl.length === 0 ? (
                                    <IoCloudUploadOutline
                                        className={`text-2xl ${currentTheme === "light"
                                            ? "text-black/80"
                                            : "text-white/80"
                                            }`}
                                    />
                                ) : (
                                    <MdVerified className={`text-2xl text-green`} />
                                )}
                            </label>
                            {event?.isPriceVariation && (
                                <span className="flex gap-2 items-center justify-center">
                                    <input
                                        type="checkbox"
                                        name="iamclubmember"
                                        id="iamclubmember"
                                        className="w-4 h-4"
                                        checked={userIsClubMember}
                                        onChange={() => {
                                            setUserIsClubMember(!userIsClubMember);
                                        }}
                                    />
                                    <p>I am Club Member</p>
                                </span>
                            )}
                        </span>
                        <button
                            className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                            onClick={handleBooking}
                        >
                            Book Ticket
                        </button>
                    </div>
                </PopupScreen>
            )}
            {popup === "addTeammates" && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 max-h-[85vh] overflow-y-auto w-80 sm:w-[80%] lg:w-[70%] flex flex-col gap-8 font-lato mt-16 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center gap-4">
                            <p className="text-2xl font-montserrat font-medium">
                                Create Team
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col gap-10 items-center">
                            <input
                                type="text"
                                name="teamName"
                                className={`w-full sm:w-[80%] lg:w-[50%] p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                    ? "bg-white/60  placeholder-black/60"
                                    : "bg-gray/60 border-white text-white placeholder-white/60"
                                    }`}
                                placeholder="What's your team name ?"
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-[80%] lg:w-[50%] justify-center">
                                <input
                                    type="text"
                                    name="userId"
                                    className={`p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/60"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder="Team member user Id"
                                    ref={memberRef}
                                />
                                <button
                                    className={`items-center justify-center px-4 py-2 rounded-lg text-white ${currentTheme === "light" ? "bg-gray" : "bg-black"
                                        } `}
                                    onClick={addMembers}
                                >
                                    Add Member
                                </button>
                            </div>
                            <div className="w-full flex flex-wrap gap-4 justify-center items-center">
                                {teammates.map((teammate) => (
                                    <div
                                        className={`p-4 w-full sm:w-fit custom_shadow rounded-lg cursor-pointer flex items-center gap-4 font-lato hover:bg-red ${currentTheme === "light" ? "bg-white" : "bg-black"
                                            }`}
                                        key={teammate.userId}
                                        onClick={() => removeMember(teammate.userId)}
                                    >
                                        <img
                                            src={teammate.profilePicture}
                                            alt="Profile"
                                            className="w-12 h-12 bg-black rounded-full"
                                        />
                                        <span className="flex flex-col">
                                            <p className="text-lg">{teammate.username}</p>
                                            <p
                                                className={`${currentTheme === "light"
                                                    ? "text-black/60"
                                                    : "text-white/70"
                                                    }`}
                                            >
                                                {teammate.department} - {teammate.userId}
                                            </p>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </span>
                        <p className="text-center -mb-2">
                            Note : Add all team members including yourself.
                        </p>
                        <button
                            className={`w-fit mx-auto mb-4 flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green ${teammates.length >= event?.minTeamSize &&
                                teammates.length <= event?.maxTeamSize
                                ? "opacity-100"
                                : "opacity-75"
                                }`}
                            onClick={getTicket}
                            disabled={
                                !(
                                    teammates.length >= event?.minTeamSize &&
                                    teammates.length <= event?.maxTeamSize
                                )
                            }
                        >
                            {event?.isEventFree ? "Book Ticket" : "Proceed for payment"}
                        </button>
                    </div>
                </PopupScreen>
            )}
            {popup === "editeventdetails" && (
                <PopupScreen>
                    <EditEventDetails event={event} setEvent={setEvent} />
                </PopupScreen>
            )}
            {popup === `approve-${event?._id}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 sm:w-96 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Approve Event
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className='flex flex-col gap-2'>
                            <p>
                                Are you sure you want to approve this event  ?
                            </p>
                            <textarea
                                name="verifyEvent"
                                id="validate"
                                className={`w-full p-2 rounded-lg border-[1px] outline-none ${currentTheme === "light"
                                    ? "border-gray/50 text-black placeholder-black/60"
                                    : "bg-gray border-white text-white placeholder-white/60"
                                    }`}
                                placeholder="Reviews..."
                                cols={2}
                                ref={validateDescription}
                            />
                        </span>
                        <div className='flex gap-2 items-center'>
                            <button
                                className="px-4 py-2 text-black rounded-md bg-green mt-4 flex gap-2 items-center justify-center"
                                onClick={() => validateEvent("accepted")}
                            >
                                <span>Approve Approval</span>
                                <MdVerified className="text-2xl" />
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md mt-4 ${currentTheme === 'light' ? "text-black" : "text-white"}`}
                                onClick={() => setPopup(null)}
                            >
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </PopupScreen>
            )}
            {popup === `reject-${event?._id}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 sm:w-96 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Reject Event
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className='flex flex-col gap-2'>
                            <p>
                                You are rejecting this approval. Please provide a reason.
                            </p>
                            <textarea
                                name="verifyEvent"
                                id="validate"
                                className={`w-full p-2 rounded-lg border-[1px] outline-none ${currentTheme === "light"
                                    ? "border-gray/50 text-black placeholder-black/60"
                                    : "bg-gray border-white text-white placeholder-white/60"
                                    }`}
                                placeholder="Anything in you mind ?"
                                cols={2}
                                ref={validateDescription}
                            />
                        </span>
                        <div className='flex gap-2'>
                            <button
                                className="px-4 py-2 text-white rounded-md bg-red mt-4 flex gap-2 items-center justify-center"
                                onClick={() => validateEvent("rejected")}
                            >
                                <span>Reject Approval</span>
                                <RxCross2
                                    className="text-2xl"
                                />
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md mt-4 ${currentTheme === 'light' ? "text-black" : "text-white"}`}
                                onClick={() => setPopup(null)}
                            >
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </PopupScreen>
            )}
            {loading && <Loader message={loadingMessage} />}
            <div
                className={`mx-4 sm:mx-16 py-4 sm:py-10 flex flex-col font-lato gap-16 justify-center ${currentTheme === "light" ? "text-black" : "text-white"
                    }`}
            >
                <div className="h-[500px] sm:h-[280px] lg:h-[500px] custom_shadow rounded-lg bg-gray flex items-center justify-center overflow-hidden relative">
                    <img
                        src={event?.banner}
                        alt="Event banner"
                        className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 z-10 sm:left-0 text-white m-4 sm:m-7 lg:m-10">
                        {/* <EventTimer date={event?.date} time={event?.time} /> */}
                    </span>
                    <div className="w-full h-[30%] bg-gradient-to-t from-black to-black/0 absolute bottom-0 z-0" />
                </div>

                <div className="flex flex-col gap-10 lg:gap-0 lg:flex-row justify-between">
                    {/* Event details left-side */}
                    <div className="lg:w-[70%] flex flex-col gap-10">
                        <span className="flex flex-col gap-2">
                            <h1 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                {event?.title}
                            </h1>
                            <p
                                className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                    }`}
                            >
                                <span
                                    className={`font-lato font-semibold ${currentTheme === "light" ? "text-black" : "text-white"
                                        }`}
                                >
                                    By :
                                </span>{" "}
                                {event?.organizerDetails?.organizerName}
                            </p>
                            <span
                                className={`flex gap-1 ${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                    }`}
                            >
                                <p
                                    className={`font-lato font-semibold ${currentTheme === "light" ? "text-black" : "text-white"
                                        }`}
                                >
                                    For :
                                </p>
                                <span className="flex flex-wrap gap-2">
                                    {event?.eventForDepts.map((dept, index) => (
                                        <p key={index}> {dept},</p>
                                    ))}
                                </span>
                            </span>
                            {event?.outsideStudentsAllowed && (
                                <p
                                    className={`${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                        }`}
                                >
                                    <span
                                        className={`font-lato font-semibold ${currentTheme === "light" ? "text-black" : "text-white"
                                            }`}
                                    >
                                        (Outsiders allowed)
                                    </span>
                                </p>
                            )}
                        </span>
                        <span className="flex flex-col gap-2">
                            <h2 className="text-lg sm:text-xl font-semibold">About Event</h2>
                            <p
                                className={`text-justify ${currentTheme === "light" ? "text-black/80" : "text-white/80"
                                    }`}
                                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                            />
                        </span>

                        {/* Speakers */}
                        {event?.speakers?.length > 0 && (
                            <span className="flex flex-col lg:flex-row gap-4">
                                <h2 className="text-2xl sm:text-xl font-semibold">
                                    Speakers :{" "}
                                </h2>
                                <span className="flex flex-wrap gap-4">
                                    {event.speakers.map((speaker, index) => (
                                        <p
                                            key={index}
                                            className={`border-[1px] rounded-full px-3 py-1 ${currentTheme === "light"
                                                ? "border-black/50"
                                                : "border-white/60"
                                                }`}
                                        >
                                            {speaker}
                                        </p>
                                    ))}
                                </span>
                            </span>
                        )}

                        {/* Prizes */}
                        {event?.prizes?.length > 0 && (
                            <span className="flex flex-col lg:flex-row gap-4">
                                <h2 className="text-2xl sm:text-xl font-semibold">Prizes : </h2>
                                <span className="flex flex-wrap gap-4">
                                    {event.prizes.map((prize, index) => (
                                        <p
                                            key={index}
                                            className={`border-[1px] rounded-full px-3 py-1 ${currentTheme === "light"
                                                ? "border-black/50"
                                                : "border-white/60"
                                                }`}
                                        >
                                            {prize}
                                        </p>
                                    ))}
                                </span>
                            </span>
                        )}

                        {/* Contact info */}
                        {(event?.organizerDetails?.email ||
                            event?.organizerDetails?.phone) && (
                                <div
                                    className={`flex gap-2 ${currentTheme === "light" ? "text-black/60" : "text-white/60"
                                        }`}
                                >
                                    <span
                                        className={`font-lato font-semibold ${currentTheme === "light" ? "text-black" : "text-white"
                                            }`}
                                    >
                                        For any queries, contact :
                                    </span>
                                    <p
                                        className={`${currentTheme === "light"
                                            ? "border-black/50"
                                            : "border-white/60"
                                            }`}
                                    >
                                        {event?.organizerDetails?.email}, {" +91 "}
                                        {event?.organizerDetails?.phone}
                                    </p>
                                </div>
                            )}
                    </div>

                    {/* Event Details Right side (Booking card) */}
                    <div
                        className={`lg:w-[25%] h-fit p-6 rounded-lg custom_shadow ${currentTheme === "light" ? "bg-white" : "bg-gray"
                            }`}
                    >
                        <div className="flex flex-col gap-3 text-lg">
                            <span className="flex gap-3 items-center">
                                <SlCalender className="text-xl" />
                                <p>{formatDateToWords(event?.date)}</p>
                            </span>
                            <span className="flex gap-3 items-center">
                                <LuClock className="text-xl" />
                                <p>{convertTo12HourFormat(event?.time)}</p>
                            </span>
                            <span className="flex gap-3 items-center">
                                <GrLocationPin className="text-xl" />
                                <p>{event?.venue}</p>
                            </span>
                            {event?.isLimitedSeats && (
                                <span className="flex gap-3 items-center">
                                    <FaChair className="text-xl" />
                                    <p>
                                        {event?.seatsFilled} / {event?.maxSeats}
                                    </p>
                                </span>
                            )}
                            <span className="flex gap-3 items-center">
                                <GoPeople className="text-xl" />
                                <p>
                                    {event?.maxTeamSize > 1
                                        ? `Team size (${event?.minTeamSize} - ${event?.maxTeamSize})`
                                        : `Single ${event?.minTeamSize}`}
                                </p>
                            </span>
                        </div>
                        <div className="flex flex-col gap-4 mt-10">
                            {!event?.isEventFree && (
                                <p className="flex items-center gap-2">
                                    <MdCurrencyRupee className="text-xl" />
                                    <span className="text-3xl font-semibold">
                                        {event?.eventFee}
                                    </span>
                                    <span>
                                        {event?.isPriceVariation ? "(For non-club members)" : ""}
                                    </span>
                                </p>
                            )}
                            {!event?.isEventFree && event?.isPriceVariation && (
                                <p className="flex items-center gap-2">
                                    <MdCurrencyRupee className="text-xl" />
                                    <span className="text-3xl font-semibold">
                                        {event?.eventFeeForClubMember}
                                    </span>
                                    <span>(For club members)</span>
                                </p>
                            )}
                            {event?.acceptingParticipation &&
                                event?.seatsFilled < event?.maxSeats &&
                                canBookEvent(event?.date, event?.time) && (
                                    <button
                                        className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-blue_100"
                                        onClick={event?.maxTeamSize > 1 ? addTeamMates : getTicket}
                                    >
                                        Book Ticket
                                    </button>
                                )}
                        </div>
                    </div>
                </div>

                {/* Participants info only shown to organizers */}
                {isUserAuthenticated &&
                    user.userInfo.userType === "organizer" &&
                    event?.organizerDetails.organizerId === user.userInfo.organizerId && (
                        <div className="w-full flex flex-col gap-6 lg:gap-10">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 font-lato">
                                <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                    {event?.maxTeamSize > 1 ? "Teams" : "Participants"}{" "}
                                    {event.isLimitedSeats &&
                                        `(${event.seatsFilled} / ${event.maxSeats})`}
                                </h2>
                                <input
                                    type="text"
                                    name="userId"
                                    className={`w-full sm:w-[50%] lg:w-[25%] p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/60"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder={`${event?.maxTeamSize > 1
                                        ? "Search by team name"
                                        : "Search participant by id"
                                        }`}
                                    value={searchTerm}
                                    onChange={handleSearchParticipant}
                                />
                            </div>
                            <div
                                className={`flex flex-col ${event?.maxTeamSize > 1 ? "sm:flex-col" : "sm:flex-row"
                                    } gap-4 lg:gap-6 flex-wrap w-full sm:w-fit items-center sm:items-start justify-between sm:justify-start`}
                            >
                                {eventTickets?.length > 0
                                    ? searchTerm === ""
                                        ? eventTickets.map((ticket, index) =>
                                            event?.maxTeamSize > 1 ? (
                                                <TeamCard
                                                    key={index}
                                                    ticket={ticket}
                                                    maxTeamSize={event?.maxTeamSize}
                                                    iAmClubMember={ticket.iAmClubMember}
                                                    isPriceVariation={
                                                        ticket.eventDetails.isPriceVariation
                                                    }
                                                    paymentImage={ticket.paymentImage}
                                                />
                                            ) : (
                                                <ParticipantCard
                                                    key={index}
                                                    ticketId={ticket._id}
                                                    userDetails={ticket.userDetails[0]}
                                                    maxTeamSize={event?.maxTeamSize}
                                                    iAmClubMember={ticket.iAmClubMember}
                                                    isPriceVariation={
                                                        ticket.eventDetails.isPriceVariation
                                                    }
                                                    paymentImage={ticket.paymentImage}
                                                />
                                            )
                                        )
                                        : searchedEventTickets.map((ticket, index) =>
                                            event?.maxTeamSize > 1 ? (
                                                <TeamCard
                                                    key={index}
                                                    ticket={ticket}
                                                    maxTeamSize={event?.maxTeamSize}
                                                    iAmClubMember={ticket.iAmClubMember}
                                                    isPriceVariation={
                                                        ticket.eventDetails.isPriceVariation
                                                    }
                                                    paymentImage={ticket.paymentImage}
                                                />
                                            ) : (
                                                <ParticipantCard
                                                    key={index}
                                                    ticketId={ticket._id}
                                                    userDetails={ticket.userDetails[0]}
                                                    maxTeamSize={event?.maxTeamSize}
                                                    iAmClubMember={ticket.iAmClubMember}
                                                    isPriceVariation={
                                                        ticket.eventDetails.isPriceVariation
                                                    }
                                                    paymentImage={ticket.paymentImage}
                                                />
                                            )
                                        )
                                    : "No tickets found"}
                            </div>
                            <span className="flex flex-col sm:flex-row gap-4 mx-auto mt-6">
                                {event?.acceptingParticipation === true ? (
                                    <button
                                        className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-yellow"
                                        onClick={toggleParticipation}
                                    >
                                        Close Participation
                                    </button>
                                ) : (
                                    <button
                                        className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                                        onClick={toggleParticipation}
                                    >
                                        Resume Participation
                                    </button>
                                )}
                                <button
                                    className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-blue_100"
                                    onClick={() => setPopup("editeventdetails")}
                                >
                                    <span>Edit event details</span>
                                    <IoIosArrowUp className="rotate-90" />
                                </button>
                                <button
                                    className={`flex gap-2 items-center justify-center px-4 py-2 rounded-md text-lg border-2 ${currentTheme === "light" ? "border-black" : "border-white"
                                        }`}
                                    onClick={downloadParticipantsList}
                                >
                                    <span>Download Partipants List</span>
                                    <MdOutlineFileDownload className="text-2xl" />
                                </button>
                            </span>
                        </div>
                    )}

                {/* Events verification section, shown only to faculties */}
                {isUserAuthenticated &&
                    user.userInfo.userType === "faculty" &&
                    event?.organizerDetails.facultyId === user.userInfo.userId && (
                        event.status === 'pending' ? <div className='flex gap-4 mx-auto'>
                            <button
                                className="px-4 py-2 text-black rounded-md bg-green mt-4 flex gap-2 items-center justify-center"
                                onClick={() => setPopup(`approve-${event?._id}`)}
                            >
                                <span>Approve</span>
                                <MdVerified className="text-2xl" />
                            </button>
                            <button
                                className="px-4 py-2 text-white rounded-md bg-red mt-4 flex gap-2 items-center justify-center"
                                onClick={() => setPopup(`reject-${event?._id}`)}
                            >
                                <span>Reject</span>
                                <RxCross2
                                    className="text-2xl"
                                />
                            </button>
                        </div> : <p className="text-center font-semibold text-2xl">Event {event?.status}</p>
                    )}
            </div>
        </>
    );
};

export default EventDetails;
