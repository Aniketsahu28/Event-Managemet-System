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
import UserCard from "./UserCard";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminFacultyOperations = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const [popup, setPopup] = useRecoilState(popupAtom)
    const [faculties, setFaculties] = useState([]);
    const [searchedFaculties, setSearchedFaculties] = useState();
    const searchFacultyId = useRef();
    const addFacultyRollnoRef = useRef()
    const [addFacultyDepartment, setAddFacultyDepartment] = useState("")

    useEffect(() => {
        fetchAllFaculties();
    }, []);

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

    const AdminSearchFacultyId = () => {
        const searchQueryResult = faculties.filter((faculty) => {
            return faculty.userId.includes(searchFacultyId.current.value);
        });

        setSearchedFaculties(searchQueryResult);
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        if (addFacultyDepartment === "") {
            toast.error("Please select department");
        }
        else {
            try {
                const response = await axios.post(`${BACKEND_URL}/api/user/createfaculty`,
                    {
                        userId: addFacultyRollnoRef.current.value,
                        department: addFacultyDepartment
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
                else if (response.status === 200) {
                    toast(response.data.message)
                }
            }
            catch (error) {
                toast.error(error.response?.data.message || error)
            }
        }
    }

    return (
        <>{popup === `addfaculty` && (
            <PopupScreen>
                <form
                    onSubmit={handleAddFaculty}
                    className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                        ? "text-black bg-white"
                        : "text-white bg-gray"
                        }`}
                >
                    <span className="flex justify-between items-center">
                        <p className="text-2xl font-montserrat font-medium">
                            Add Faculty
                        </p>
                        <RxCross2
                            className="text-2xl cursor-pointer"
                            onClick={() => setPopup(null)}
                        />
                    </span>
                    <span className="flex flex-col gap-4">
                        <span className="flex flex-col gap-2">
                            <label htmlFor="userId">Faculty ID</label>
                            <input
                                type="number"
                                id="userId"
                                className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                    ? "bg-white/60  placeholder-black/40"
                                    : "bg-gray/60 border-white text-white placeholder-white/60"
                                    }`}
                                placeholder="Enter Faculty Id"
                                required
                                ref={addFacultyRollnoRef}
                            />
                        </span>
                        <span className="flex flex-col gap-2">
                            <label htmlFor="department">Department</label>
                            <select
                                name="department"
                                id="department"
                                className={`outline-none border-[1px] px-2 py-[10px] text-lg rounded-lg ${currentTheme === "light"
                                    ? "bg-white text-black border-gray/50"
                                    : "bg-gray text-white border-white"
                                    }`}
                                value={addFacultyDepartment}
                                onChange={(e) => setAddFacultyDepartment(e.target.value)}
                            >
                                <option value="">Department</option>
                                <option value="Computer">Computer</option>
                                <option value="Mechanical">Mechanical</option>
                                <option value="Electrical">Electrical</option>
                                <option value="IT">IT</option>
                                <option value="EXTC">EXTC</option>
                                <option value="Humanities">Humanities</option>
                            </select>
                        </span>
                    </span>
                    <button
                        type="submit"
                        className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                    >
                        Add Faculty
                    </button>
                </form>
            </PopupScreen>
        )}
            <div className="flex flex-col gap-8 sm:gap-6 lg:gap-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        name="userId"
                        className={`p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                            ? "bg-white/60  placeholder-black/60"
                            : "bg-gray/60 border-white text-white placeholder-white/60"
                            }`}
                        placeholder="Search by faculty id"
                        ref={searchFacultyId}
                        onChange={useDebounce(AdminSearchFacultyId)}
                    />
                    <button
                        className={`flex gap-2 items-center justify-center px-4 py-2 rounded-md text-lg text-black bg-yellow `}
                        onClick={() => setPopup('addfaculty')}
                    >
                        <span>Add Faculty</span>
                        <FaPlus className="text-xl" />
                    </button>
                </div>
                <h2 className="text-2xl sm:text-3xl font-montserrat font-medium">
                    Faculties{" "}
                    <span
                        className={`${currentTheme === "light" ? "text-black/40" : "text-white/60"
                            }`}
                    >
                        (
                        {searchFacultyId.current?.value === ""
                            ? faculties?.length
                            : searchedFaculties?.length}{" "}
                        results)
                    </span>
                </h2>
                <div className="grid grid-cols-12 gap-4">
                    {searchFacultyId.current?.value === ""
                        ? faculties?.map((faculty, index) => (
                            <UserCard key={index} userDetails={faculty} />
                        ))
                        : searchedFaculties?.map((faculty, index) => (
                            <UserCard key={index} userDetails={faculty} />
                        ))}
                </div>
            </div>
        </>
    );
};

export default AdminFacultyOperations;
