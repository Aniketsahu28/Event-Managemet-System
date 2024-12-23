import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import AdminStudentOperation from "../components/AdminStudentOperation";
import AdminFacultyOperations from "../components/AdminFacultyOperations";
import AdminOrganizerOperations from "../components/AdminOrganizerOperations";

const AdminPanel = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const [view, setView] = useState("students");

    return (
        <div
            className={`font-lato mx-4 sm:mx-16 py-10 flex flex-col lg:flex-row gap-5 lg:gap-0 lg:justify-between ${currentTheme === "light" ? "text-black" : "text-white"
                }`}
        >
            <div className={`custom_shadow overflow-x-scroll lg:overflow-x-hidden lg:w-[15%] rounded-lg flex flex-row lg:flex-col gap-5 lg:items-center lg:justify-center p-2 sm:p-4 lg:px-0 lg:py-6 h-fit ${currentTheme === 'light' ? "bg-white" : "bg-gray"}`}>
                <button
                    className={`lg:w-[80%] px-4 py-2 rounded-md text-lg border-2 border-blue_100 ${view === 'students' ? "text-white bg-blue_100" : `${currentTheme === 'light' ? "text-black" : "text-white"}`}`}
                    onClick={() => setView("students")}
                >
                    Students
                </button>
                <button
                    className={`lg:w-[80%] px-4 py-2 rounded-md text-lg border-2 border-blue_100 ${view === 'faculties' ? "text-white bg-blue_100" : `${currentTheme === 'light' ? "text-black" : "text-white"}`}`}
                    onClick={() => setView("faculties")}
                >
                    Faculties
                </button>
                <button
                    className={`lg:w-[80%] px-4 py-2 rounded-md text-lg border-2 border-blue_100 ${view === 'organizers' ? "text-white bg-blue_100" : `${currentTheme === 'light' ? "text-black" : "text-white"}`}`}
                    onClick={() => setView("organizers")}
                >
                    Organizers
                </button>
            </div>
            <div className={`custom_shadow lg:w-[82%] rounded-lg lg:h-[80vh] lg:overflow-y-scroll p-4 lg:p-6 ${currentTheme === 'light' ? "bg-white" : "bg-gray"}`}>
                {view === "students" ? (
                    <AdminStudentOperation />
                ) : view === "faculties" ? (
                    <AdminFacultyOperations />
                ) : (
                    <AdminOrganizerOperations />
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
