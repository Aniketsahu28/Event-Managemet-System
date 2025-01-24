import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { useDebounce } from "../hooks/useDebounce";
import JoditEditor from "jodit-react";
import axios from "axios";
import { userAtom } from "../store/userAtom";
import toast from "react-hot-toast";
import { RiDeleteBin6Line } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import Loader from "../components/Loader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AddNewApproval = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const [faculties, setFaculties] = useState();
    const [loadingMessage, setLoadingMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [approvalDetails, setApprovalDetails] = useState({
        title: "",
        description: "",
        approvers: [
            {
                id: uuidv4(),
                approverTitle: "Approver Title",
                approverDetails: {
                    userId: "",
                    userType: "",
                    username: "",
                },
            },
        ],
    });

    useEffect(() => {
        fetchAllFaculties();
    }, []);

    const fetchAllFaculties = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/user/allfaculty`);
            if (response.status === 200) {
                setFaculties(response.data.faculties);
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    const handleApproverTitleChange = (e) => {
        const id = e.target.id;
        const newValue = e.target.value;

        setApprovalDetails((prevDetails) => ({
            ...prevDetails,
            approvers: prevDetails.approvers.map((approver) =>
                approver.id === id
                    ? { ...approver, approverTitle: newValue }
                    : approver
            ),
        }));
    };

    const handleApproverChange = (e) => {
        const id = e.target.id;
        const faculty = faculties.filter(
            (faculty) => faculty.userId === e.target.value
        );
        setApprovalDetails((prevDetails) => ({
            ...prevDetails,
            approvers: prevDetails.approvers.map((approver) =>
                approver.id === id
                    ? {
                        ...approver,
                        approverDetails: {
                            ...approver.approverDetails,
                            userId: faculty[0].userId,
                            userType: faculty[0].userType,
                            username: faculty[0].username,
                        },
                    }
                    : approver
            ),
        }));
    };

    const addTitleToApprovalDetails = () => {
        setApprovalDetails((prevDetails) => ({
            ...prevDetails,
            title: titleRef.current.value,
        }));
    };

    const addDescToApprovalDetails = () => {
        setApprovalDetails((prevDetails) => ({
            ...prevDetails,
            description: descriptionRef.current.value,
        }));
    };

    const increaseApprover = (e) => {
        e.preventDefault();
        setApprovalDetails((prevDetails) => ({
            ...prevDetails,
            approvers: [
                ...prevDetails.approvers,
                {
                    id: uuidv4(),
                    approverTitle: "Approver Title",
                    approverDetails: {
                        userId: "",
                        userType: "",
                        username: "",
                    },
                },
            ],
        }));
    };

    const removeApprover = (e) => {
        e.preventDefault();
        const indexToRemove = e.currentTarget.id;
        setApprovalDetails((prevDetails) => {
            const newArray = prevDetails.approvers.filter(
                (approver) => approver.id !== indexToRemove
            );
            console.log(newArray)
            return {
                ...prevDetails,
                approvers: newArray,
            };
        });
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        approvalDetails.approvers.forEach((approver) => {
            if (approver.approverTitle === 'Approver Title') {
                toast.error("Please select approver title")
                return;
            }
            else if (approver.approverDetails.userId === '') {
                toast.error("Please select approver")
            }
        })

        setLoadingMessage("Adding approval...")
        setLoading(true)
        try {
            const response = await axios.post(`${BACKEND_URL}/api/approval/addapproval`,
                {
                    title: approvalDetails.title,
                    document: approvalDetails.description,
                    approvers: approvalDetails.approvers
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
            }

            setApprovalDetails({
                title: "",
                description: "",
                approvers: [
                    {
                        id: uuidv4(),
                        approverTitle: "Approver Title",
                        approverDetails: {
                            userId: "",
                            userType: "",
                            username: "",
                        },
                    },
                ],
            })
            titleRef.current.value = ""
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false)
    };

    return (
        <div
            className={`mx-4 sm:mx-16 py-10 sm:py-16 flex flex-col gap-10 items-center ${currentTheme === "light" ? "text-black" : "text-white"
                }`}
        >
            {loading && <Loader message={loadingMessage} />}
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                Add New Approval
            </h2>
            <form
                className={`custom_shadow w-full sm:w-[90%] lg:w-[70%] rounded-xl font-lato p-4 sm:p-8 flex flex-col lg:grid lg:grid-cols-12 gap-8 ${currentTheme === "light" ? "bg-white" : "bg-gray"
                    }`}
                onSubmit={handleFormSubmit}
            >
                <span className="flex flex-col col-span-12 gap-2">
                    <label htmlFor="approvalTitle">
                        Approval Title <span className="text-red">*</span>
                    </label>
                    <input
                        type="text"
                        name="approvalTitle"
                        className={`p-2 rounded-lg border-[1px] outline-none ${currentTheme === "light"
                            ? "border-gray/50 text-black placeholder-black/60"
                            : "bg-gray border-white text-white placeholder-white/60"
                            }`}
                        placeholder="Enter approval title"
                        required
                        ref={titleRef}
                        onChange={useDebounce(addTitleToApprovalDetails)}
                    />
                </span>
                <span className="flex flex-col gap-2 col-span-12">
                    <label htmlFor="ApprovalDescription">
                        Approval Description<span className="text-red">*</span>
                    </label>
                    <span className={`text-black `}>
                        <JoditEditor
                            ref={descriptionRef}
                            value={approvalDetails.description}
                            onChange={useDebounce(addDescToApprovalDetails)}
                        />
                    </span>
                </span>
                <div className="flex flex-col col-span-12">
                    <p className="mb-6">
                        Select Approvers<span className="text-red">*</span>
                    </p>
                    {approvalDetails.approvers.map((approver) => (
                        <div className="flex gap-2 sm:gap-4 w-full" key={approver.id}>
                            <span className="flex flex-col items-center">
                                <div
                                    className={`w-4 h-4 rounded-full ${currentTheme === "light" ? "bg-gray/50" : "bg-white/40"}`}
                                />
                                <div
                                    className={`h-28 w-[3px] rounded-full ${currentTheme === "light" ? "bg-gray/50" : "bg-white/40"}`}
                                />
                            </span>
                            <span className="flex flex-col gap-2 w-full -mt-2">
                                <select
                                    name={approver.id}
                                    id={approver.id}
                                    className={`w-fit outline-none border-[1px] px-2 py-[6px] rounded-full ${currentTheme === "light"
                                        ? "bg-white text-black border-gray/50"
                                        : "bg-gray text-white border-white"}`}
                                    onChange={handleApproverTitleChange}
                                >
                                    <option value={approver.approverTitle}>{approver.approverTitle}</option>
                                    <option value="Faculty Co-ordinator">Faculty Co-ordinator</option>
                                    <option value="Head of Department">Head of Department</option>
                                    <option value="Dean of Student Affairs">Dean of Student Affairs</option>
                                    <option value="Principal">Principal</option>
                                    <option value="Father">Father</option>
                                </select>
                                <div className="flex gap-2 sm:gap-4">
                                    <select
                                        name={approver.id}
                                        id={approver.id}
                                        className={`w-full sm:w-[60%] lg:w-[30%] outline-none border-[1px] p-2 rounded-lg ${currentTheme === "light"
                                            ? "bg-white text-black border-gray/50"
                                            : "bg-gray text-white border-white"}`}
                                        onChange={handleApproverChange}
                                    >
                                        <option value={approver.approverDetails.userId}>
                                            {approver.approverDetails.userId} - {approver.approverDetails.username}
                                        </option>
                                        {faculties?.map((faculty, facultyIndex) => (
                                            <option key={facultyIndex} value={faculty.userId}>
                                                {faculty.userId} - {faculty.username}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="flex gap-2 items-center justify-center bg-red p-2 rounded-md text-white"
                                        id={approver.id}
                                        onClick={removeApprover}
                                    >
                                        <RiDeleteBin6Line className="text-xl" />
                                    </button>
                                </div>
                            </span>
                        </div>
                    ))}

                    <div className="flex gap-4 w-full">
                        <span className="flex flex-col items-center">
                            <div
                                className={`w-4 h-4 rounded-full ${currentTheme === "light" ? "bg-gray/50" : "bg-white/40"
                                    }`}
                            />
                        </span>
                        <button
                            className="-mt-3 px-8 h-fit py-2 text-black bg-yellow rounded-lg col-span-12 text-lg w-fit"
                            onClick={increaseApprover}
                        >
                            Add approver
                        </button>
                    </div>
                </div>
                <span className="col-span-12 text-center mt-6 font-semibold text-lg">
                    Note : The approval notifications will be sent in sequence from top to
                    bottom. Add the approvers in the same order.
                </span>
                <button
                    type="submit"
                    className="px-8 mx-auto py-2 text-black bg-green rounded-lg col-span-12 text-lg w-fit"
                >
                    Add Approval
                </button>
            </form>
        </div>
    );
};

export default AddNewApproval;
