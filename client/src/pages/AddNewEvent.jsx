import React, { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useDebounce } from "../hooks/useDebounce";
import JoditEditor from "jodit-react";
import { useHandleFileUpload } from "../hooks/useHandleFileUpload";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { userAtom } from "../store/userAtom";
import toast from 'react-hot-toast'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddNewEvent = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const speakerRef = useRef(null);
    const prizeRef = useRef(null);
    const UPI_IDRef = useRef(null);
    const departments = [
        "All Departments",
        "Computer",
        "IT",
        "EXTC",
        "Mechanical",
        "Electrical",
    ];
    const [isCustom, setIsCustom] = useState(false);
    const [eventDetails, setEventDetails] = useState({
        title: "",
        description: "",
        banner: "",
        date: "",
        time: "",
        venue: "",
        eventForDepts: [],
        speakers: [],
        isLimitedSeats: false,
        maxSeats: 100000,
        prizes: [],
        isEventFree: true,
        isPriceVariation: false,
        eventFee: 0,
        eventFeeForClubMember: 0,
        paymentQR: "",
        UPI_ID: "",
    });

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

    const addTitleToEventDetails = () => {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            title: titleRef.current.value,
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

    const addUPI_IDToEventDetails = () => {
        setEventDetails((prevDetails) => ({
            ...prevDetails,
            UPI_ID: UPI_IDRef.current.value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BACKEND_URL}/api/event/addevent`,
                {
                    title: eventDetails.title,
                    description: eventDetails.description,
                    banner: eventDetails.banner,
                    date: eventDetails.date,
                    time: eventDetails.time,
                    venue: eventDetails.venue,
                    eventForDepts: eventDetails.eventForDepts,
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
                        "Content-Type": "application/json",
                        "token": user.token
                    },
                }
            )

            if (response.status === 200) {
                toast.success(response.data.message, {
                    duration: 3000
                });
                setEventDetails({
                    title: "",
                    description: "",
                    banner: "",
                    date: "",
                    time: "",
                    venue: "",
                    eventForDepts: [],
                    speakers: [],
                    isLimitedSeats: false,
                    maxSeats: 0,
                    prizes: [],
                    isEventFree: true,
                    isPriceVariation: false,
                    eventFee: 0,
                    eventFeeForClubMember: 0,
                    paymentQR: "",
                    UPI_ID: "",
                })
            }
        }
        catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    return (
        <div
            className={`mx-4 sm:mx-16 py-10 sm:py-16 flex flex-col gap-10 items-center ${currentTheme === "light" ? "text-black" : "text-white"
                }`}
        >
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                Add New Event
            </h2>
            <form
                className={`custom_shadow w-full sm:w-[90%] lg:w-[70%] rounded-xl font-lato p-4 sm:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-8 ${currentTheme === "light" ? "bg-white" : "bg-gray"
                    }`}
                onSubmit={handleFormSubmit}
            >
                <span className="flex flex-col col-span-12 gap-2">
                    <label htmlFor="EventTitle">Event Title <span className="text-red">*</span></label>
                    <input
                        type="text"
                        name="EventTitle"
                        className={`p-2 rounded-lg border-[1px] outline-none ${currentTheme === "light"
                            ? "border-gray/50 text-black placeholder-black/60"
                            : "bg-gray border-white text-white placeholder-white/60"
                            }`}
                        placeholder="Ex:New Year Party"
                        required
                        ref={titleRef}
                        onChange={useDebounce(addTitleToEventDetails)}
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
                    <label htmlFor="EventBanner">Upload Event Banner</label>
                    <div
                        className={`p-6 flex flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-gray/50 text-black ${currentTheme === "light"
                            ? "border-gray/50 text-black placeholder-black/60"
                            : "bg-gray border-white text-white placeholder-white/60"
                            }`}
                    >
                        <IoCloudUploadOutline
                            className={`text-5xl ${currentTheme === "light" ? "text-black/50" : "text-white/50"
                                }`}
                        />
                        <input
                            type="file"
                            name="EventBanner"
                            id="EventBanner"
                            className=" w-full sm:w-fit items-center justify-center cursor-pointer black"
                            onChange={addBannerToEventDetails}
                        />
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
                                    isLimitedSeats: false
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
                                    isEventFree: true
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
                    <label htmlFor="UPIQR">Upload UPI QR</label>
                    <div
                        className={`p-6 flex flex-col items-center justify-center gap-4 rounded-lg border-[1px] border-gray/50 text-black ${currentTheme === "light" ? "" : "bg-gray border-white text-white"
                            }`}
                    >
                        <IoCloudUploadOutline
                            className={`text-5xl ${currentTheme === "light" ? "text-black/50" : "text-white/50"
                                }`}
                        />
                        <input
                            type="file"
                            name="UPIQR"
                            id="UPIQR"
                            className="w-full sm:w-fit items-center justify-center cursor-pointer"
                            onChange={addPaymentQRToEventDetails}
                        />
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
                        ref={UPI_IDRef}
                        onChange={addUPI_IDToEventDetails}
                    />
                </span>}
                <span className="col-span-12 text-center mt-6 font-semibold text-lg">
                    Mention any other important information about event in the event
                    description
                </span>
                <button
                    type="submit"
                    className="px-8 mx-auto py-2 text-black bg-green rounded-lg col-span-12 text-lg w-fit"
                >
                    Add Event
                </button>
            </form>
        </div>
    );
};

export default AddNewEvent;
