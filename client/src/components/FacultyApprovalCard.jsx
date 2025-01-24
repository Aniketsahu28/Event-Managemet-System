import React, { useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { themeAtom } from '../store/themeAtom'
import { popupAtom } from '../store/popupAtom'
import { RxCross2 } from "react-icons/rx";
import PopupScreen from './PopupScreen';
import { MdVerified } from "react-icons/md";
import DOMPurify from "dompurify";
import toast from 'react-hot-toast';
import axios from 'axios';
import { userAtom } from '../store/userAtom';
import Loader from './Loader';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const FacultyApprovalCard = ({ approval }) => {
    const currentTheme = useRecoilValue(themeAtom)
    const [popup, setPopup] = useRecoilState(popupAtom)
    const validateDescription = useRef()
    const sanitizedDescription = DOMPurify.sanitize(approval?.document);
    const user = useRecoilValue(userAtom)
    const [loadingMessage, setLoadingMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const validateApproval = async (status) => {
        setLoadingMessage("Processing, please wait...")
        setLoading(true)
        try {
            const response = await axios.post(`${BACKEND_URL}/api/approval/validateapproval`,
                {
                    approvalId: approval._id,
                    status: status,
                    description: validateDescription.current.value
                },
                {
                    headers: {
                        token: user.token
                    }
                }
            )
            if (response.status === 200) {
                toast.success(response.data.message)
                setPopup(null)
            }
        }
        catch (error) {
            toast.error(error.response?.data.message || error)
        }
        setLoading(false)
    }

    return (
        <>
            {popup === `viewapproval-${approval._id}` && (
                <PopupScreen>
                    <div
                        className={`max-h-[90%] lg:max-h-[85%] overflow-y-scroll rounded-lg mx-auto p-4 w-[92%] sm:w-[85%] lg:w-[50%] flex flex-col gap-8 font-lato mt-12 sm:mt-20 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Validate Approval
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <p
                            className={`text-justify ${currentTheme === "light" ? "text-black/80" : "text-white/80"
                                }`}
                            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                        />
                        <div className='flex gap-4 mx-auto'>
                            <button
                                className="px-4 py-2 text-black rounded-md bg-green mt-4 flex gap-2 items-center justify-center"
                                onClick={() => setPopup(`approve-${approval._id}`)}
                            >
                                <span>Approve</span>
                                <MdVerified className="text-2xl" />
                            </button>
                            <button
                                className="px-4 py-2 text-white rounded-md bg-red mt-4 flex gap-2 items-center justify-center"
                                onClick={() => setPopup(`reject-${approval._id}`)}
                            >
                                <span>Reject</span>
                                <RxCross2
                                    className="text-2xl"
                                />
                            </button>
                        </div>
                    </div>
                </PopupScreen>
            )}
            {popup === `approve-${approval._id}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 sm:w-96 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Approve Approval
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
                                name="validateDesc"
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
                        <div className='flex gap-2 items-center'>
                            <button
                                className="px-4 py-2 text-black rounded-md bg-green mt-4 flex gap-2 items-center justify-center"
                                onClick={() => validateApproval("approve")}
                            >
                                <span>Approve Approval</span>
                                <MdVerified className="text-2xl" />
                            </button>
                            <button
                                className="px-4 py-2 text-black rounded-md mt-4"
                                onClick={() => setPopup(null)}
                            >
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </PopupScreen>
            )}
            {popup === `reject-${approval._id}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 sm:w-96 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Reject Approval
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
                                name="validateDesc"
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
                                onClick={() => validateApproval("rejected")}
                            >
                                <span>Reject Approval</span>
                                <RxCross2
                                    className="text-2xl"
                                />
                            </button>
                            <button
                                className="px-4 py-2 text-black rounded-md mt-4"
                                onClick={() => setPopup(null)}
                            >
                                <span>Cancel</span>
                            </button>
                        </div>
                    </div>
                </PopupScreen>
            )}
            {loading && <Loader message={loadingMessage} />}
            <div className="flex flex-col gap-2 p-4 bg-blue_300 text-white rounded-lg sm:col-span-6 lg:col-span-4">
                <h2 className="text-lg font-montserrat font-medium">
                    {approval.title}
                </h2>
                <p>From : <span className={`text-white/70`}>{approval.organizerDetails.organizerName}</span></p>
                <p>Department : <span className={`text-white/70`}>{approval.organizerDetails.department}</span></p>
                <button
                    className="px-4 py-2 text-white rounded-md bg-blue_100 mt-4"
                    onClick={() => setPopup(`viewapproval-${approval._id}`)}
                >
                    View Approval
                </button>
            </div>
        </>
    )
}

export default FacultyApprovalCard
