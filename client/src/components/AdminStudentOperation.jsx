import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { FaPlus } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import axios from "axios";
import { userAtom } from "../store/userAtom";
import { useDebounce } from "../hooks/useDebounce";
import { popupAtom } from "../store/popupAtom";
import PopupScreen from "./PopupScreen";
import { RxCross2 } from "react-icons/rx";
import UserCard from "./UserCard";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminStudentOperation = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const [popup, setPopup] = useRecoilState(popupAtom);
    const [students, setStudents] = useState();
    const [searchedStudents, setSearchedStudents] = useState();
    const searchRollno = useRef();
    const addStudentFromRollnoRef = useRef();
    const addStudentToRollnoRef = useRef();
    const removeStudentFromRollnoRef = useRef();
    const removeStudentToRollnoRef = useRef();
    const [addStudentDepartment, setAddStudentDepartment] = useState("");

    useEffect(() => {
        fetchAllStudents();
    }, []);

    const fetchAllStudents = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/user/allstudents`, {
                headers: {
                    token: user.token,
                },
            });
            if (response.status === 200) {
                setStudents(response.data.students);
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    const AdminSearchRollno = () => {
        const searchQueryResult = students.filter((student) => {
            return student.userId.includes(searchRollno.current.value);
        });

        setSearchedStudents(searchQueryResult);
    };

    const handleAddStudents = async (e) => {
        e.preventDefault();
        if (addStudentDepartment === "") {
            toast.error("Please select department");
        } else {
            try {
                const response = await axios.post(
                    `${BACKEND_URL}/api/user/createstudent`,
                    {
                        fromRollno: addStudentFromRollnoRef.current.value,
                        toRollno: addStudentToRollnoRef.current.value,
                        department: addStudentDepartment,
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
                } else if (response.status === 200) {
                    toast(response.data.message);
                }
            } catch (error) {
                toast.error(error.response?.data.message || error);
            }
        }
    };

    const handleRemoveStudents = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.delete(
                `${BACKEND_URL}/api/user/deletestudent`,
                {
                    headers: {
                        token: user.token,
                    },
                    data: {
                        fromRollno: removeStudentFromRollnoRef.current.value,
                        toRollno: removeStudentToRollnoRef.current.value,
                    },
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message, {
                    duration: 3000,
                });
                setPopup(null);
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    return (
        <>
            {popup === `addstudents` && (
                <PopupScreen>
                    <form
                        onSubmit={handleAddStudents}
                        className={`rounded-lg mx-auto p-4 w-80 sm:w-96 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Add Students
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col gap-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <span className="flex flex-col gap-2">
                                    <label htmlFor="fromRollno">From - Roll no</label>
                                    <input
                                        type="number"
                                        id="fromRollno"
                                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                            ? "bg-white/60  placeholder-black/40"
                                            : "bg-gray/60 border-white text-white placeholder-white/60"
                                            }`}
                                        placeholder="Starting Roll no"
                                        required
                                        ref={addStudentFromRollnoRef}
                                    />
                                </span>
                                <span className="flex flex-col gap-2">
                                    <label htmlFor="toRollno">To - Roll no</label>
                                    <input
                                        type="number"
                                        id="toRollno"
                                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                            ? "bg-white/60  placeholder-black/40"
                                            : "bg-gray/60 border-white text-white placeholder-white/60"
                                            }`}
                                        placeholder="Ending Roll no"
                                        required
                                        ref={addStudentToRollnoRef}
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
                                    value={addStudentDepartment}
                                    onChange={(e) => setAddStudentDepartment(e.target.value)}
                                >
                                    <option value="">Department</option>
                                    <option value="Computer">Computer</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Electrical">Electrical</option>
                                    <option value="IT">IT</option>
                                    <option value="EXTC">EXTC</option>
                                </select>
                            </span>
                        </span>
                        <button
                            type="submit"
                            className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                        >
                            Add Students
                        </button>
                    </form>
                </PopupScreen>
            )}
            {popup === `removestudents` && (
                <PopupScreen>
                    <form
                        onSubmit={handleRemoveStudents}
                        className={`rounded-lg mx-auto p-4 w-80 sm:w-96 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Remove Students
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col sm:flex-row gap-4">
                            <span className="flex flex-col gap-2">
                                <label htmlFor="fromRollno">From - Roll no</label>
                                <input
                                    type="number"
                                    id="fromRollno"
                                    className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/40"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder="Starting Roll no"
                                    required
                                    ref={removeStudentFromRollnoRef}
                                />
                            </span>
                            <span className="flex flex-col gap-2">
                                <label htmlFor="toRollno">To - Roll no</label>
                                <input
                                    type="number"
                                    id="toRollno"
                                    className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                        ? "bg-white/60  placeholder-black/40"
                                        : "bg-gray/60 border-white text-white placeholder-white/60"
                                        }`}
                                    placeholder="Ending Roll no"
                                    required
                                    ref={removeStudentToRollnoRef}
                                />
                            </span>
                        </span>
                        <button
                            type="submit"
                            className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-red"
                        >
                            Remove Students
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
                        placeholder="Search by roll no"
                        ref={searchRollno}
                        onChange={useDebounce(AdminSearchRollno)}
                    />
                    <button
                        className={`flex gap-2 items-center justify-center px-4 py-2 rounded-md text-lg text-black bg-yellow `}
                        onClick={() => setPopup("addstudents")}
                    >
                        <span>Add Students</span>
                        <FaPlus className="text-xl" />
                    </button>
                    <button
                        className={`flex gap-2 items-center justify-center px-4 py-2 rounded-md text-lg text-white bg-red`}
                        onClick={() => setPopup("removestudents")}
                    >
                        <span>Remove Students</span>
                        <RiDeleteBin6Line className="text-xl" />
                    </button>
                </div>
                <h2 className="text-2xl sm:text-3xl font-montserrat font-medium">
                    Students{" "}
                    <span
                        className={`${currentTheme === "light" ? "text-black/40" : "text-white/60"
                            }`}
                    >
                        ({!students
                            ? "Loading..."
                            : searchRollno.current?.value === ""
                                ? students.length
                                : searchedStudents?.length}{" "}
                        results)
                    </span>
                </h2>
                <div className="grid grid-cols-12 gap-4">
                    {searchRollno.current?.value === ""
                        ? students?.map((student, index) => (
                            <UserCard key={index} userDetails={student} />
                        ))
                        : searchedStudents?.map((student, index) => (
                            <UserCard key={index} userDetails={student} />
                        ))}
                </div>
            </div>
        </>
    );
};

export default AdminStudentOperation;
