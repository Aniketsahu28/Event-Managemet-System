import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { FaPlus } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { userAtom } from "../store/userAtom";
import { useDebounce } from "../hooks/useDebounce";
import { popupAtom } from "../store/popupAtom";
import PopupScreen from "./PopupScreen";
import { RxCross2 } from "react-icons/rx";
import AdminPanelOrganizerCard from "./AdminPanelOrganizerCard";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminOrganizerOperations = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const [popup, setPopup] = useRecoilState(popupAtom);
    const [organizers, setOrganizers] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [searchedOrganizers, setSearchedOrganizers] = useState();
    const searchOrganizerName = useRef();
    const addOrganizerIdRef = useRef();
    const addOrganizerNameRef = useRef();
    const [addOrganizerDropdowns, setAddOrganizerDropdowns] = useState({
        organizerDepartment: "",
        organizerFacultyId: "",
        organizerType: ""
    })

    useEffect(() => {
        fetchAllOrganizers();
        fetchAllFaculties();
    }, []);

    const fetchAllOrganizers = async () => {
        try {
            const response = await axios.get(
                `${BACKEND_URL}/api/organizer/allorganizers`,
                {
                    headers: {
                        token: user.token,
                    },
                }
            );
            if (response.status === 200) {
                setOrganizers(response.data.organizers);
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    const fetchAllFaculties = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/user/allfaculty`, {
                headers: {
                    token: user.token,
                },
            });
            if (response.status === 200) {
                setFaculties(response.data.faculties);
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    const AdminSearchOrganizer = () => {
        const searchQueryResult = organizers.filter((organizer) => {
            return organizer.organizerName
                .toLowerCase()
                .includes(searchOrganizerName.current.value.toLowerCase());
        });

        setSearchedOrganizers(searchQueryResult);
    };

    //organizerId, organizerName, department, --> facultyId, organizerType <--
    const handleAddOrganizer = async (e) => {
        e.preventDefault();
        if (addOrganizerDropdowns.organizerDepartment === "" || addOrganizerDropdowns.organizerFacultyId === "" || addOrganizerDropdowns.organizerType === "") {
            toast.error("Please select dropdowns");
        } else {
            try {
                const response = await axios.post(`${BACKEND_URL}/api/organizer/createorganizer`,
                    {
                        organizerId: addOrganizerIdRef.current.value,
                        organizerName: addOrganizerNameRef.current.value,
                        department: addOrganizerDropdowns.organizerDepartment,
                        facultyId: addOrganizerDropdowns.organizerFacultyId,
                        organizerType: addOrganizerDropdowns.organizerType
                    },
                    {
                        headers: {
                            token: user.token
                        }
                    }
                )
                if (response.status === 201) {
                    toast.success(response.data.message, {
                        duration: 3000
                    })
                    setPopup(null)
                }
            }
            catch (error) {
                toast.error(error.response?.data.message || error)
            }
        }
    };

    return (
        <>
            {popup === `addorganizer` && (
                <PopupScreen>
                    <form
                        onSubmit={handleAddOrganizer}
                        className={`rounded-lg mx-auto p-4 w-80 sm:w-[40%] flex flex-col gap-8 font-lato mt-10 sm:mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Add Organizer
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                <span className="flex flex-col gap-2 sm:w-[35%]">
                                    <label htmlFor="organizerId">Organizer ID</label>
                                    <input
                                        type="number"
                                        id="organizerId"
                                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                            ? "bg-white/60  placeholder-black/40"
                                            : "bg-gray/60 border-white text-white placeholder-white/60"
                                            }`}
                                        placeholder="Enter Organizer Id"
                                        required
                                        ref={addOrganizerIdRef}
                                    />
                                </span>
                                <span className="flex flex-col gap-2 sm:w-[65%]">
                                    <label htmlFor="organizerName">Organizer Name</label>
                                    <input
                                        type="text"
                                        id="organizerName"
                                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                            ? "bg-white/60  placeholder-black/40"
                                            : "bg-gray/60 border-white text-white placeholder-white/60"
                                            }`}
                                        placeholder="Enter Organizer Name"
                                        required
                                        ref={addOrganizerNameRef}
                                    />
                                </span>
                            </div>
                            <span className="flex flex-col gap-2">
                                <label htmlFor="department">Department</label>
                                <select
                                    name="department"
                                    id="department"
                                    className={`outline-none border-[1px] px-2 py-[10px] text-lg rounded-lg ${currentTheme === "light"
                                        ? "bg-white text-black border-gray/50"
                                        : "bg-gray text-white border-white"
                                        }`}
                                    value={addOrganizerDropdowns.organizerDepartment}
                                    onChange={(e) => {
                                        setAddOrganizerDropdowns((prev) => ({
                                            ...prev,
                                            organizerDepartment: e.target.value
                                        }))
                                    }}
                                >
                                    <option value="">Department</option>
                                    <option value="Computer">Computer</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="IT">IT</option>
                                    <option value="EXTC">EXTC</option>
                                    <option value="Humanities">Humanities</option>
                                    <option value="Humanities">Inter branch</option>
                                </select>
                            </span>
                            <span className="flex flex-col gap-2">
                                <label htmlFor="organizerType">Organizer type</label>
                                <select
                                    name="organizerType"
                                    id="organizerType"
                                    className={`outline-none border-[1px] px-2 py-[10px] text-lg rounded-lg ${currentTheme === "light"
                                        ? "bg-white text-black border-gray/50"
                                        : "bg-gray text-white border-white"
                                        }`}
                                    value={addOrganizerDropdowns.organizerType}
                                    onChange={(e) => {
                                        setAddOrganizerDropdowns((prev) => ({
                                            ...prev,
                                            organizerType: e.target.value
                                        }))
                                    }}
                                >
                                    <option value="">Organizer Type</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="technicalStudentsClub">
                                        Technical (Students Club)
                                    </option>
                                    <option value="technicalProfessionalSocietyChapter">
                                        Technical (Professional Society Chapter)
                                    </option>
                                    <option value="otherClubs">Other Clubs</option>
                                </select>
                            </span>
                            <span className="flex flex-col gap-2">
                                <label htmlFor="organizerFaculty">Organizer Faculty Incharge</label>
                                <select
                                    name="organizerFaculty"
                                    id="organizerFaculty"
                                    className={`outline-none border-[1px] px-2 py-[10px] text-lg rounded-lg ${currentTheme === "light"
                                        ? "bg-white text-black border-gray/50"
                                        : "bg-gray text-white border-white"
                                        }`}
                                    value={addOrganizerDropdowns.organizerFacultyId}
                                    onChange={(e) => {
                                        setAddOrganizerDropdowns((prev) => ({
                                            ...prev,
                                            organizerFacultyId: e.target.value
                                        }))
                                    }}
                                >
                                    <option value="">Faculty Id - Faculty Name</option>
                                    {faculties.map((faculty, index) => (
                                        <option value={faculty.userId} key={index}>{faculty.userId} - {faculty.username}</option>
                                    ))}
                                </select>
                            </span>
                        </span>
                        <button
                            type="submit"
                            className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                        >
                            Add Organizer
                        </button>
                    </form>
                </PopupScreen>
            )}
            <div className="flex flex-col gap-8 sm:gap-6 lg:gap-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        name="organizerName"
                        className={`sm:w-[40%] md:w-[30%] p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                            ? "bg-white/60  placeholder-black/60"
                            : "bg-gray/60 border-white text-white placeholder-white/60"
                            }`}
                        placeholder="Search by organizer name"
                        ref={searchOrganizerName}
                        onChange={useDebounce(AdminSearchOrganizer)}
                    />
                    <button
                        className={`flex gap-2 items-center justify-center px-4 py-2 rounded-md text-lg text-black bg-yellow `}
                        onClick={() => setPopup("addorganizer")}
                    >
                        <span>Add Organizer</span>
                        <FaPlus className="text-xl" />
                    </button>
                </div>
                <h2 className="text-2xl sm:text-3xl font-montserrat font-medium">
                    Organizers{" "}
                    <span
                        className={`${currentTheme === "light" ? "text-black/40" : "text-white/60"
                            }`}
                    >
                        (
                        {searchOrganizerName.current?.value === ""
                            ? organizers?.length
                            : searchedOrganizers?.length}{" "}
                        results)
                    </span>
                </h2>
                <div className="grid grid-cols-12 gap-4">
                    {searchOrganizerName.current?.value === ""
                        ? organizers?.map((organizer, index) => (
                            <AdminPanelOrganizerCard key={index} organizer={organizer} />
                        ))
                        : searchedOrganizers?.map((organizer, index) => (
                            <AdminPanelOrganizerCard key={index} organizer={organizer} />
                        ))}
                </div>
            </div>
        </>
    );
};

export default AdminOrganizerOperations;
