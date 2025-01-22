import React, { useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { popupAtom } from "../store/popupAtom";
import { useDebounce } from "../hooks/useDebounce";
import JoditEditor from "jodit-react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useHandleFileUpload } from "../hooks/useHandleFileUpload";
import { userAtom } from "../store/userAtom";
import axios from "axios";
import toast from 'react-hot-toast'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EditEventDetails = ({ event, setEvent }) => {
    const currentTheme = useRecoilValue(themeAtom);
    const setPopup = useSetRecoilState(popupAtom);
    const user = useRecoilValue(userAtom)
    const descriptionRef = useRef(null);
    const speakerRef = useRef(null);
    const prizeRef = useRef(null);
    const [bannerHover, setBannerHover] = useState(false);
    const [payment, setPayment] = useState(false);
    const [isCustom, setIsCustom] = useState(false);
    const [eventDetails, setEventDetails] = useState({
        title: event.title,
        description: event.description,
        banner: event.banner,
        date: event.date,
        time: event.time,
        venue: event.venue,
        eventForDepts: event.eventForDepts,
        minTeamSize: event.minTeamSize,
        maxTeamSize: event.maxTeamSize,
        speakers: event.speakers,
        isLimitedSeats: event.isLimitedSeats,
        maxSeats: event.maxSeats,
        prizes: event.prizes,
        isEventFree: event.isEventFree,
        isPriceVariation: event.isPriceVariation,
        eventFee: event.eventFee,
        eventFeeForClubMember: event.eventFeeForClubMember,
        paymentQR: event.paymentQR,
        UPI_ID: event.UPI_ID,
    });

    const departments = [
        "All Departments",
        "Computer",
        "IT",
        "EXTC",
        "Mechanical",
        "Electrical",
    ];

    const addTitleToEventDetails = (e) => {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            title: e.target.value,
        }));
    };

    const addDescToEventDetails = () => {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            description: descriptionRef.current.value,
        }));
    };

    const addBannerToEventDetails = async (event) => {
        const url = await useHandleFileUpload(event);
        if (url) {
            setEventDetails((prevDetails) => ({
                ...prevDetails,
                banner: url,
            }));
        }
    };

    const toggleDepartment = (dept, e) => {
        e.preventDefault();
        let depts = eventDetails.eventForDepts;
        if (depts.includes(dept)) {
            depts = depts.filter((item) => item !== dept)
            setEventDetails(prevDetails => ({
                ...prevDetails,
                eventForDepts: depts
            }))
        }
        else {
            setEventDetails(prevDetails => ({
                ...prevDetails,
                eventForDepts: [...depts, dept]
            }))
        }
    };

    const handleVenueChange = (event) => {
        const value = event.target.value;
        if (value === "custom") {
            setIsCustom(true);
            setEventDetails({
                ...eventDetails,
                venue: "",
            });
        } else {
            setIsCustom(false);
            setEventDetails({
                ...eventDetails,
                venue: value,
            });
        }
    };

    const handleAddSpeaker = (e) => {
        e.preventDefault();
        const speaker = speakerRef.current.value;
        if (speaker === "") return;
        setEventDetails(prevDetails => ({
            ...prevDetails,
            speakers: [...prevDetails.speakers, speaker]
        }))
        speakerRef.current.value = ""
    }

    const removeSpeaker = (e) => {
        e.preventDefault();
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            speakers: prevDetails.speakers.filter((speaker) => speaker !== e.target.innerText)
        }))
    }

    const handleAddPrize = (e) => {
        e.preventDefault();
        const prize = prizeRef.current.value;
        if (prize === "") return;

        setEventDetails(prevDetails => ({
            ...prevDetails,
            prizes: [...prevDetails.prizes, prize]
        }))
        prizeRef.current.value = ""
    }

    const removePrize = (e) => {
        e.preventDefault();
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            prizes: prevDetails.prizes.filter((prize) => prize !== e.target.innerText)
        }))
    }

    const addPaymentQRToEventDetails = async (event) => {
        const url = await useHandleFileUpload(event);
        if (url) {
            setEventDetails((prevDetails) => ({
                ...prevDetails,
                paymentQR: url,
            }));
        }
    };

    const addUPI_IDToEventDetails = (e) => {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            UPI_ID: e.target.value,
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `${BACKEND_URL}/api/event/editevent`,
                {
                    eventId: event._id,
                    title: eventDetails.title,
                    description: eventDetails.description,
                    banner: eventDetails.banner,
                    date: eventDetails.date,
                    time: eventDetails.time,
                    venue: eventDetails.venue,
                    eventForDepts: eventDetails.eventForDepts,
                    minTeamSize: eventDetails.minTeamSize,
                    maxTeamSize: eventDetails.maxTeamSize,
                    speakers: eventDetails.speakers,
                    isLimitedSeats: eventDetails.isLimitedSeats,
                    maxSeats: eventDetails.maxSeats,
                    prizes: eventDetails.prizes,
                    isEventFree: eventDetails.isEventFree,
                    isPriceVariation: eventDetails.isPriceVariation,
                    eventFee: eventDetails.eventFee,
                    eventFeeForClubMember: eventDetails.eventFeeForClubMember,
                    paymentQR: eventDetails.paymentQR,
                    UPI_ID: eventDetails.UPI_ID,
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
                setEvent({
                    _id: event._id,
                    organizerDetails: {
                        department: event.organizerDetails.department,
                        organizerId: event.organizerDetails.organizerId,
                        organizerName: event.organizerDetails.organizerName
                    },
                    title: eventDetails.title,
                    description: eventDetails.description,
                    banner: eventDetails.banner,
                    date: eventDetails.date,
                    time: eventDetails.time,
                    venue: eventDetails.venue,
                    eventForDepts: eventDetails.eventForDepts,
                    minTeamSize: eventDetails.minTeamSize,
                    maxTeamSize: eventDetails.maxTeamSize,
                    speakers: eventDetails.speakers,
                    isLimitedSeats: eventDetails.isLimitedSeats,
                    seatsFilled: event.seatsFilled,
                    maxSeats: eventDetails.maxSeats,
                    prizes: eventDetails.prizes,
                    isEventFree: eventDetails.isEventFree,
                    eventFee: eventDetails.eventFee,
                    paymentQR: eventDetails.paymentQR,
                    UPI_ID: eventDetails.UPI_ID,
                })
                setPopup(null)
            }
        }
        catch (error) {
            toast.error(error.response?.data.message || error);
        }
    }

    return (
        <div
            className={`rounded-lg mx-auto px-4 lg:px-8 py-4 w-[90%] lg:w-[60%] h-[90vh] overflow-y-scroll flex flex-col gap-8 font-lato mt-10 ${currentTheme === "light"
                ? "text-black bg-white"
                : "text-white bg-gray"
                }`}
        >
            <span className="flex justify-between items-center">
                <p className="text-2xl font-montserrat font-medium">Edit Event Details</p>
                <RxCross2
                    className="text-2xl cursor-pointer"
                    onClick={() => setPopup(null)}
                />
            </span>
            <form onSubmit={handleSaveChanges} className="flex flex-col lg:grid grid-cols-12 gap-8">
                <span className="flex flex-col col-span-12 gap-2">
                    <label htmlFor="EventTitle">Event Title <span className="text-red">*</span></label>
                    <input
                        type="text"
                        name="EventTitle"
                        className={`p-2 rounded-lg border-[1px] outline-none ${currentTheme === "light"
                            ? "border-gray/50 text-black placeholder-black/60"
                            : "bg-gray border-white text-white placeholder-white/60"
                            }`}
                        placeholder="Ex : New Year Party"
                        value={eventDetails.title}
                        onChange={addTitleToEventDetails}
                        required
                    />
                </span>
                <span className="flex flex-col gap-2 col-span-12">
                    <label htmlFor="EventDescription">About Event <span className="text-red">*</span></label>
                    <span className={`text-black `}>
                        <JoditEditor
                            ref={descriptionRef}
                            value={eventDetails.description}
                            onChange={useDebounce(addDescToEventDetails)}
                        />
                    </span>
                </span>
                <span className="flex flex-col gap-2 col-span-6">
                    <label htmlFor="EventBanner">Event Banner</label>
                    <div
                        className={`relative h-36 overflow-hidden flex flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-gray/50 text-black ${currentTheme === "light"
                            ? "border-gray/50 text-black placeholder-black/60 bg-white"
                            : "bg-gray border-white text-white placeholder-white/60"
                            }`}
                        onMouseEnter={() => setBannerHover(true)}
                        onMouseLeave={() => setBannerHover(false)}
                    >
                        <img src={eventDetails.banner} alt="Event banner" className="object-cover" />
                        {bannerHover && (
                            <label
                                htmlFor="banner"
                                className={`absolute top-0 left-0 w-full h-full items-center gap-2 flex flex-col justify-center cursor-pointer p-2 bg-black/60 text-white lato`}
                            >
                                <input
                                    id="banner"
                                    type="file"
                                    className="hidden"
                                    onChange={addBannerToEventDetails}
                                />
                                <IoCloudUploadOutline className={`text-5xl text-white`} />
                                <p className="text-center">Update event banner</p>
                            </label>
                        )}
                    </div>
                </span>
                <span className="col-span-6 grid grid-cols-6">
                    <div className="col-span-3 flex flex-col gap-2 mr-3">
                        <label htmlFor="date">Date <span className="text-red">*</span></label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            className={`p-2 rounded-lg border-[1px] outline-none ${currentTheme === "light"
                                ? "border-gray/50 text-black "
                                : "bg-gray border-white text-white/60"
                                }`}
                            required
                            value={eventDetails.date}
                            onChange={(e) => {
                                setEventDetails((prevDetails) => ({
                                    ...prevDetails,
                                    date: e.target.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="col-span-3 flex flex-col gap-2 ml-3">
                        <label htmlFor="time">Time <span className="text-red">*</span></label>
                        <input
                            type="time"
                            name="time"
                            id="time"
                            className={`p-2 rounded-lg border-[1px] outline-none ${currentTheme === "light"
                                ? "border-gray/50 text-black "
                                : "bg-gray border-white text-white/60"
                                }`}
                            required
                            value={eventDetails.time}
                            onChange={(e) => {
                                setEventDetails((prevDetails) => ({
                                    ...prevDetails,
                                    time: e.target.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="col-span-6 flex flex-col gap-2 mt-6">
                        <label htmlFor="venue">Location</label>
                        {!isCustom ? (
                            <select
                                name="venue"
                                id="venue"
                                className={`outline-none border-[1px] p-2 rounded-lg ${currentTheme === "light"
                                    ? "bg-white text-black border-gray/50"
                                    : "bg-gray text-white border-white"
                                    }`}
                                value={eventDetails.venue}
                                onChange={handleVenueChange}
                            >
                                <option value="">Choose location or type custom</option>
                                <option value="Degree Foyer">Degree Foyer</option>
                                <option value="Diploma Foyer">Diploma Foyer</option>
                                <option value="AX-412">AX-412</option>
                                <option value="custom">Type Custom</option>
                            </select>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="text"
                                    name="custom-location"
                                    id="custom-location"
                                    className={`w-full sm:w-[60%] outline-none border-[1px] p-2 rounded-lg ${currentTheme === "light"
                                        ? "bg-white text-black border-gray/50"
                                        : "bg-gray text-white placeholder-white/60 border-white"
                                        }`}
                                    placeholder="Enter custom location"
                                    value={eventDetails.venue}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setEventDetails((prevDetails) => ({
                                            ...prevDetails,
                                            venue: e.target.value,
                                        }));
                                    }}
                                />
                                <button
                                    className={`items-center justify-center px-4 py-2 rounded-md border-[1px] ${currentTheme === "light"
                                        ? "text-blue_100 border-blue_100"
                                        : "border-0 text-white bg-black"
                                        }`}
                                    onClick={() => {
                                        setIsCustom(false);
                                        setEventDetails((prevDetails) => ({
                                            ...prevDetails,
                                            venue: "",
                                        }));
                                    }}
                                >
                                    Show Dropdown
                                </button>
                            </div>
                        )}
                    </div>
                </span>
                <span className="flex flex-col gap-2 col-span-12">
                    <label htmlFor="eventForDepts">
                        This event is for which departments ?
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {departments.map((dept) => (
                            <button
                                key={dept}
                                onClick={(e) => toggleDepartment(dept, e)}
                                className={`px-4 py-2 rounded-full border-[1px]
                                    ${currentTheme === "light"
                                        ? eventDetails.eventForDepts.includes(dept)
                                            ? "text-white border-blue_100 bg-blue_100"
                                            : "border-black/50 text-black/70"
                                        : eventDetails.eventForDepts.includes(dept)
                                            ? "text-white border-blue_100 bg-blue_100"
                                            : "border-white/60 text-white/60 border-[1px]"
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </span>
                <div className="grid grid-cols-8 gap-6 col-span-12">
                    <div className="lg:col-span-2 col-span-4 flex flex-col gap-2">
                        <label htmlFor="date">Min Team Size <span className="text-red">*</span></label>
                        <input
                            type="number"
                            name="minTeamSize"
                            id="minTeamSize"
                            className={`p-2 rounded-lg border-[1px] outline-none ${currentTheme === "light"
                                ? "border-gray/50 text-black "
                                : "bg-gray border-white text-white/60"
                                }`}
                            required
                            value={eventDetails.minTeamSize}
                            onChange={(e) => {
                                setEventDetails((prevDetails) => ({
                                    ...prevDetails,
                                    minTeamSize: e.target.value,
                                }));
                            }}
                        />
                    </div>
                    <div className="lg:col-span-2 col-span-4 flex flex-col gap-2">
                        <label htmlFor="maxTeamSize">Max Team Size <span className="text-red">*</span></label>
                        <input
                            type="number"
                            name="maxTeamSize"
                            id="maxTeamSize"
                            className={`p-2 rounded-lg border-[1px] outline-none ${currentTheme === "light"
                                ? "border-gray/50 text-black "
                                : "bg-gray border-white text-white/60"
                                }`}
                            required
                            value={eventDetails.maxTeamSize}
                            onChange={(e) => {
                                setEventDetails((prevDetails) => ({
                                    ...prevDetails,
                                    maxTeamSize: e.target.value,
                                }));
                            }}
                        />
                    </div>
                </div>
                <span className="flex flex-col gap-2 col-span-8">
                    <label htmlFor="Speakers">Speakers</label>
                    <span className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            name="Speakers"
                            id="Speakers"
                            className={`sm:w-[60%] outline-none border-[1px] p-2 rounded-lg ${currentTheme === "light"
                                ? "bg-white text-black border-gray/50"
                                : "bg-gray text-white border-white"
                                }`}
                            placeholder="Speaker name..."
                            ref={speakerRef}
                        />
                        <button
                            className={`items-center justify-center px-4 py-2 rounded-lg text-white ${currentTheme === "light" ? "bg-gray" : "bg-black"
                                } `}
                            onClick={handleAddSpeaker}
                        >
                            Add Speaker
                        </button>
                    </span>
                    <span className="flex flex-wrap gap-2">
                        {
                            eventDetails.speakers.map((speaker, index) => (
                                <button key={index} className={`border-[1px] rounded-full px-3 py-1 hover:border-red hover:text-red flex items-center justify-center gap-2 ${currentTheme === 'light' ? "border-black/50" : "border-white/60"}`} onClick={removeSpeaker}>
                                    {speaker}
                                    <RxCross2 />
                                </button>
                            ))
                        }
                    </span>
                </span>
                <span className="flex flex-col gap-2 col-span-8">
                    <label htmlFor="seatsBoolean">
                        Does this event has limited seats ? <span className="text-red">*</span>
                    </label>
                    <span className="flex flex-col sm:flex-row gap-4">
                        <button
                            name="seatsBoolean"
                            className={`px-4 py-2 rounded-full border-[1px] 
                            ${currentTheme === "light"
                                    ? eventDetails.isLimitedSeats === true
                                        ? "text-white border-blue_100 bg-blue_100"
                                        : "border-black/50 text-black/70 border-[1px]"
                                    : eventDetails.isLimitedSeats === true
                                        ? "text-white border-blue_100 bg-blue_100"
                                        : "border-white/60 text-white/60 border-[1px]"
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                setEventDetails((prevDetails) => ({
                                    ...prevDetails,
                                    isLimitedSeats: true
                                }))
                            }}
                        >
                            Yes, event has limited seats
                        </button>
                        <button
                            name="seatsBoolean"
                            className={`px-4 py-2 rounded-full border-[1px] 
                            ${currentTheme === "light"
                                    ? eventDetails.isLimitedSeats === false
                                        ? "text-white border-blue_100 bg-blue_100"
                                        : "border-black/50 text-black/70 border-[1px]"
                                    : eventDetails.isLimitedSeats === false
                                        ? "text-white border-blue_100 bg-blue_100"
                                        : "border-white/60 text-white/60 border-[1px]"
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                setEventDetails((prevDetails) => ({
                                    ...prevDetails,
                                    isLimitedSeats: false,
                                    maxSeats: 100000
                                }))
                            }}
                        >
                            No, unlimited seats are present
                        </button>
                    </span>
                </span>
                {
                    eventDetails.isLimitedSeats && <span className="flex flex-col gap-2 col-span-12">
                        <label htmlFor="maxSeats">Maximum no. of seats</label>
                        <input
                            type="number"
                            name="maxSeats"
                            className={`w-32 p-2 rounded-lg border-[1px] border-gray/50 outline-none ${currentTheme === "light"
                                ? "text-black"
                                : "bg-gray placeholder-white/60 border-white text-white"
                                }`}
                            placeholder="Ex: 60"
                            value={eventDetails.maxSeats}
                            onChange={(e) => setEventDetails((prevDetails) => ({
                                ...prevDetails,
                                maxSeats: e.target.value
                            }))}
                        />
                    </span>
                }
                <span className="flex flex-col gap-2 col-span-8">
                    <label htmlFor="Prize">Prize</label>
                    <span className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            name="Prize"
                            id="Prize"
                            className={`sm:w-[60%] outline-none border-[1px] p-2 rounded-lg ${currentTheme === "light"
                                ? "bg-white text-black border-gray/50"
                                : "bg-gray text-white border-white"
                                }`}
                            placeholder="Ex: 1st-5000 Rs (number-prize)"
                            ref={prizeRef}
                        />
                        <button
                            className={`items-center justify-center px-4 py-2 rounded-lg text-white ${currentTheme === "light" ? "bg-gray" : "bg-black"
                                } `}
                            onClick={handleAddPrize}
                        >
                            Add Prize
                        </button>
                    </span>
                    <span className="flex flex-wrap gap-2">
                        {
                            eventDetails.prizes.map((prize, index) => (
                                <button key={index} className={`border-[1px] rounded-full px-3 py-1 hover:border-red hover:text-red flex items-center justify-center gap-2 ${currentTheme === 'light' ? "border-black/50" : "border-white/60"}`} onClick={removePrize}>
                                    {prize}
                                    <RxCross2 />
                                </button>
                            ))
                        }
                    </span>
                </span>
                <span className="flex flex-col gap-2 col-span-8">
                    <label htmlFor="isFreeBoolean">Is this event free ? <span className="text-red">*</span></label>
                    <span className="flex flex-col sm:flex-row gap-4">
                        <button
                            name="isFreeBoolean"
                            className={`px-4 py-2 rounded-full border-[1px] 
                            ${currentTheme === "light"
                                    ? eventDetails.isEventFree === true
                                        ? "text-white border-blue_100 bg-blue_100"
                                        : "border-black/50 text-black/70 border-[1px]"
                                    : eventDetails.isEventFree === true
                                        ? "text-white border-blue_100 bg-blue_100"
                                        : "border-white/60 text-white/60 border-[1px]"
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                setEventDetails((prevDetails) => ({
                                    ...prevDetails,
                                    isEventFree: true,
                                    eventFee: 0
                                }))
                            }}
                        >
                            Yes, event is free
                        </button>
                        <button
                            name="isFreeBoolean"
                            className={`px-4 py-2 rounded-full border-[1px] 
                            ${currentTheme === "light"
                                    ? eventDetails.isEventFree === false
                                        ? "text-white border-blue_100 bg-blue_100"
                                        : "border-black/50 text-black/70 border-[1px]"
                                    : eventDetails.isEventFree === false
                                        ? "text-white border-blue_100 bg-blue_100"
                                        : "border-white/60 text-white/60 border-[1px]"
                                }`}
                            onClick={(e) => {
                                e.preventDefault();
                                setEventDetails((prevDetails) => ({
                                    ...prevDetails,
                                    isEventFree: false
                                }))
                            }}
                        >
                            No, event is paid
                        </button>
                    </span>
                </span>
                {
                    !eventDetails.isEventFree && <span className="flex flex-col gap-2 col-span-8">
                        <label htmlFor="isPriceVariation">Event fees are different for club and non-club members ? <span className="text-red">*</span></label>
                        <span className="flex flex-col sm:flex-row gap-4">
                            <button
                                name="isPriceVariation"
                                className={`px-4 py-2 rounded-full border-[1px] 
                            ${currentTheme === "light"
                                        ? eventDetails.isPriceVariation === true
                                            ? "text-white border-blue_100 bg-blue_100"
                                            : "border-black/50 text-black/70 border-[1px]"
                                        : eventDetails.isPriceVariation === true
                                            ? "text-white border-blue_100 bg-blue_100"
                                            : "border-white/60 text-white/60 border-[1px]"
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEventDetails((prevDetails) => ({
                                        ...prevDetails,
                                        isPriceVariation: true
                                    }))
                                }}
                            >
                                Yes, Fees are different
                            </button>
                            <button
                                name="isPriceVariation"
                                className={`px-4 py-2 rounded-full border-[1px] 
                            ${currentTheme === "light"
                                        ? eventDetails.isPriceVariation === false
                                            ? "text-white border-blue_100 bg-blue_100"
                                            : "border-black/50 text-black/70 border-[1px]"
                                        : eventDetails.isPriceVariation === false
                                            ? "text-white border-blue_100 bg-blue_100"
                                            : "border-white/60 text-white/60 border-[1px]"
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEventDetails((prevDetails) => ({
                                        ...prevDetails,
                                        isPriceVariation: false
                                    }))
                                }}
                            >
                                No, Fees is same
                            </button>
                        </span>
                    </span>
                }
                {
                    !eventDetails.isEventFree && <span className="flex flex-col gap-2 col-span-12">
                        <label htmlFor="eventFee">{eventDetails.isPriceVariation ? "Enter normal event fees" : "Enter event fees"}</label>
                        <input
                            type="number"
                            name="eventFee"
                            className={`w-56 p-2 rounded-lg border-[1px] border-gray/50  outline-none ${currentTheme === "light"
                                ? "text-black"
                                : "bg-gray/60  placeholder-white/60 border-white"
                                }`}
                            placeholder="Ex: 399"
                            value={eventDetails.eventFee}
                            onChange={(e) => setEventDetails((prevDetails) => ({
                                ...prevDetails,
                                eventFee: e.target.value
                            }))}
                        />
                    </span>
                }
                {
                    !eventDetails.isEventFree && eventDetails.isPriceVariation && <span className="flex flex-col gap-2 col-span-12">
                        <label htmlFor="eventFeeForClubMembers">Enter event fees for club members</label>
                        <input
                            type="number"
                            name="eventFeeForClubMembers"
                            className={`w-56 p-2 rounded-lg border-[1px] border-gray/50  outline-none ${currentTheme === "light"
                                ? "text-black"
                                : "bg-gray/60  placeholder-white/60 border-white"
                                }`}
                            placeholder="Ex: 399"
                            value={eventDetails.eventFeeForClubMember}
                            onChange={(e) => setEventDetails((prevDetails) => ({
                                ...prevDetails,
                                eventFeeForClubMember: e.target.value
                            }))}
                        />
                    </span>
                }
                {!eventDetails.isEventFree && <span className="flex flex-col gap-2 col-span-6">
                    <label htmlFor="UPIQR">Payment QR Code</label>
                    <div
                        className={`relative h-36 overflow-hidden flex flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-gray/50 text-black ${currentTheme === "light"
                            ? "border-gray/50 text-black placeholder-black/60 bg-white"
                            : "bg-gray border-white text-white placeholder-white/60"
                            }`}
                        onMouseEnter={() => setPayment(true)}
                        onMouseLeave={() => setPayment(false)}
                    >
                        <img src={event.paymentQR} alt="Payment QR code" className="h-36 w-36 object-cover" />
                        {payment && (
                            <label
                                htmlFor="upiqr"
                                className={`absolute top-0 left-0 w-full h-full items-center gap-2 flex flex-col justify-center cursor-pointer p-2 bg-black/60 text-white lato`}
                            >
                                <input
                                    id="upiqr"
                                    type="file"
                                    className="hidden"
                                    onChange={addPaymentQRToEventDetails}
                                />
                                <IoCloudUploadOutline className={`text-5xl text-white`} />
                                <p className="text-center">Update payment QR code</p>
                            </label>
                        )}
                    </div>
                </span>}
                {!eventDetails.isEventFree && <span className="flex flex-col gap-2 col-span-6">
                    <label htmlFor="UPIID">Enter UPI ID</label>
                    <input
                        type="text"
                        name="UPIID"
                        className={`p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none ${currentTheme === "light"
                            ? ""
                            : "bg-gray placeholder-white/60 border-white text-white"
                            }`}
                        placeholder="Ex: john.doe@okhdfcbank"
                        value={eventDetails.UPI_ID}
                        onChange={addUPI_IDToEventDetails}
                    />
                </span>}
                <button
                    type="submit"
                    className="col-span-12 px-6 py-2 mt-10 text-black rounded-md text-lg bg-green"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditEventDetails;
