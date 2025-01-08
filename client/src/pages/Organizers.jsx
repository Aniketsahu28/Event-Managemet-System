import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import OrganizerCard from "../components/OrganizerCard";
import axios from "axios";
import {
    CarouselProvider,
    Slider,
    Slide,
    ButtonBack,
    ButtonNext,
} from "pure-react-carousel";
import { IoIosArrowUp } from "react-icons/io";
import toast from "react-hot-toast";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Organizers = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const [cultural, setCultural] = useState([]);
    const [technicalStudentsClub, setTechnicalStudentsClub] = useState([]);
    const [
        technicalProfessionalSocietyChapter,
        setTechnicalProfessionalSocietyChapter,
    ] = useState([]);
    const [others, setOthers] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/organizer/allorganizers`
            );
            const cultural = [];
            const technicalStudentsClub = [];
            const technicalProfessionalSocietyChapter = [];
            const others = [];

            response.data.organizers?.forEach((organizer) => {
                if (organizer.organizerType === "Cultural") {
                    cultural.push(organizer);
                } else if (organizer.organizerType === "technicalStudentsClub") {
                    technicalStudentsClub.push(organizer);
                } else if (
                    organizer.organizerType === "technicalProfessionalSocietyChapter"
                ) {
                    technicalProfessionalSocietyChapter.push(organizer);
                } else {
                    others.push(organizer);
                }
            });

            setCultural(cultural);
            setTechnicalStudentsClub(technicalStudentsClub);
            setTechnicalProfessionalSocietyChapter(
                technicalProfessionalSocietyChapter
            );
            setOthers(others);
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    const [windowStatus, setWindowStatus] = useState(
        window.innerWidth < 450
            ? "mobile"
            : window.innerWidth < 1024
                ? "tablet"
                : window.innerWidth < 1450
                    ? "macbook"
                    : "desktop"
    );
    function checkWindowSize() {
        setWindowStatus(
            window.innerWidth < 450
                ? "mobile"
                : window.innerWidth < 1024
                    ? "tablet"
                    : window.innerWidth < 1450
                        ? "macbook"
                        : "desktop"
        );
    }
    window.onresize = checkWindowSize;

    return (
        <div
            className={`mx-4 sm:mx-16 py-10 sm:py-16 flex flex-col gap-20 justify-center ${currentTheme === "light" ? "text-black" : "text-white"
                }`}
        >
            {/* Cultural Clubs */}
            <div className="flex flex-col gap-7 lg:gap-10">
                {/* Cultural clubs carousel for mobile*/}
                <h2 className="sm:hidden text-2xl sm:text-3xl font-montserrat font-semibold">
                    Cultural Clubs
                </h2>
                <span>
                    <CarouselProvider
                        totalSlides={cultural.length}
                        visibleSlides={
                            windowStatus === "mobile"
                                ? 1.45
                                : windowStatus === "tablet"
                                    ? 3
                                    : windowStatus === "macbook"
                                        ? 5
                                        : 6
                        }
                        step={1}
                        className="flex flex-col gap-10"
                        isIntrinsicHeight={true}
                    >
                        <div className="hidden sm:flex items-center justify-between gap-6">
                            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                Cultural Clubs
                            </h2>
                            <span className="flex gap-4">
                                <ButtonBack
                                    className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                        }`}
                                >
                                    <IoIosArrowUp className="-rotate-90 text-xl" />
                                </ButtonBack>
                                <ButtonNext
                                    className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                        }`}
                                >
                                    <IoIosArrowUp className="rotate-90 text-xl" />
                                </ButtonNext>
                            </span>
                        </div>
                        <Slider>
                            <div className=" w-full flex justify-between">
                                {cultural.map((club, index) => (
                                    <Slide index={index} key={index}>
                                        <OrganizerCard
                                            id={club._id}
                                            image={club.organizerProfile}
                                            name={club.organizerName}
                                        />
                                    </Slide>
                                ))}
                            </div>
                        </Slider>
                        <div className="sm:hidden flex items-center justify-center gap-6 mt-4">
                            <ButtonBack
                                className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                    }`}
                            >
                                <IoIosArrowUp className="-rotate-90 text-xl" />
                            </ButtonBack>
                            <ButtonNext
                                className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                    }`}
                            >
                                <IoIosArrowUp className="rotate-90 text-xl" />
                            </ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>
            </div>

            {/* Technical (Students Club) */}
            <div className="flex flex-col gap-7 lg:gap-10">
                <h2 className="sm:hidden text-2xl sm:text-3xl font-montserrat font-semibold">
                    Technical (Students Club)
                </h2>
                <span>
                    <CarouselProvider
                        totalSlides={technicalStudentsClub.length}
                        visibleSlides={
                            windowStatus === "mobile"
                                ? 1.45
                                : windowStatus === "tablet"
                                    ? 3
                                    : windowStatus === "macbook"
                                        ? 5
                                        : 6
                        }
                        step={1}
                        className="flex flex-col gap-10"
                        isIntrinsicHeight={true}
                    >
                        <div className="hidden sm:flex items-center justify-between gap-6">
                            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                Technical (Students Club)
                            </h2>
                            <span className="flex gap-4">
                                <ButtonBack
                                    className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                        }`}
                                >
                                    <IoIosArrowUp className="-rotate-90 text-xl" />
                                </ButtonBack>
                                <ButtonNext
                                    className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                        }`}
                                >
                                    <IoIosArrowUp className="rotate-90 text-xl" />
                                </ButtonNext>
                            </span>
                        </div>
                        <Slider>
                            <div className=" w-full flex justify-between">
                                {technicalStudentsClub.map((club, index) => (
                                    <Slide index={index} key={index}>
                                        <OrganizerCard
                                            id={club._id}
                                            image={club.organizerProfile}
                                            name={club.organizerName}
                                        />
                                    </Slide>
                                ))}
                            </div>
                        </Slider>
                        <div className="sm:hidden flex items-center justify-center gap-6 mt-4">
                            <ButtonBack
                                className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                    }`}
                            >
                                <IoIosArrowUp className="-rotate-90 text-xl" />
                            </ButtonBack>
                            <ButtonNext
                                className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                    }`}
                            >
                                <IoIosArrowUp className="rotate-90 text-xl" />
                            </ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>
            </div>

            {/* Technical (Professional Society Chapter) */}
            <div className="flex flex-col gap-7 lg:gap-10">
                <h2 className="sm:hidden text-2xl sm:text-3xl font-montserrat font-semibold">
                    Technical (Professional Society Chapter)
                </h2>
                <span>
                    <CarouselProvider
                        totalSlides={technicalProfessionalSocietyChapter.length}
                        visibleSlides={
                            windowStatus === "mobile"
                                ? 1.45
                                : windowStatus === "tablet"
                                    ? 3
                                    : windowStatus === "macbook"
                                        ? 5
                                        : 6
                        }
                        step={1}
                        className="flex flex-col gap-10"
                        isIntrinsicHeight={true}
                    >
                        <div className="hidden sm:flex items-center justify-between gap-6">
                            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                Technical (Professional Society Chapter)
                            </h2>
                            <span className="flex gap-4">
                                <ButtonBack
                                    className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                        }`}
                                >
                                    <IoIosArrowUp className="-rotate-90 text-xl" />
                                </ButtonBack>
                                <ButtonNext
                                    className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                        }`}
                                >
                                    <IoIosArrowUp className="rotate-90 text-xl" />
                                </ButtonNext>
                            </span>
                        </div>
                        <Slider>
                            <div className=" w-full flex justify-between">
                                {technicalProfessionalSocietyChapter.map((club, index) => (
                                    <Slide index={index} key={index}>
                                        <OrganizerCard
                                            id={club._id}
                                            image={club.organizerProfile}
                                            name={club.organizerName}
                                        />
                                    </Slide>
                                ))}
                            </div>
                        </Slider>
                        <div className="sm:hidden flex items-center justify-center gap-6 mt-4">
                            <ButtonBack
                                className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                    }`}
                            >
                                <IoIosArrowUp className="-rotate-90 text-xl" />
                            </ButtonBack>
                            <ButtonNext
                                className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                    }`}
                            >
                                <IoIosArrowUp className="rotate-90 text-xl" />
                            </ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>
            </div>

            {/* Others */}
            <div className="flex flex-col gap-7 lg:gap-10">
                <h2 className="sm:hidden text-2xl sm:text-3xl font-montserrat font-semibold">
                    Other Clubs
                </h2>
                <span>
                    <CarouselProvider
                        totalSlides={others.length}
                        visibleSlides={
                            windowStatus === "mobile"
                                ? 1.45
                                : windowStatus === "tablet"
                                    ? 3
                                    : windowStatus === "macbook"
                                        ? 5
                                        : 6
                        }
                        step={1}
                        className="flex flex-col gap-10"
                        isIntrinsicHeight={true}
                    >
                        <div className="hidden sm:flex items-center justify-between gap-6">
                            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                                Other Clubs
                            </h2>
                            <span className="flex gap-4">
                                <ButtonBack
                                    className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                        }`}
                                >
                                    <IoIosArrowUp className="-rotate-90 text-xl" />
                                </ButtonBack>
                                <ButtonNext
                                    className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                        }`}
                                >
                                    <IoIosArrowUp className="rotate-90 text-xl" />
                                </ButtonNext>
                            </span>
                        </div>
                        <Slider>
                            <div className=" w-full flex justify-between">
                                {others.map((club, index) => (
                                    <Slide index={index} key={index}>
                                        <OrganizerCard
                                            id={club._id}
                                            image={club.organizerProfile}
                                            name={club.organizerName}
                                        />
                                    </Slide>
                                ))}
                            </div>
                        </Slider>
                        <div className="sm:hidden flex items-center justify-center gap-6 mt-4">
                            <ButtonBack
                                className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                    }`}
                            >
                                <IoIosArrowUp className="-rotate-90 text-xl" />
                            </ButtonBack>
                            <ButtonNext
                                className={`border-2 p-2 rounded-full ${currentTheme === "light" ? "border-black" : "border-white"
                                    }`}
                            >
                                <IoIosArrowUp className="rotate-90 text-xl" />
                            </ButtonNext>
                        </div>
                    </CarouselProvider>
                </span>
            </div>
        </div>
    );
};

export default Organizers;
