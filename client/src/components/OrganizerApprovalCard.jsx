import React from "react";
import { MdVerified } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRecoilState, useRecoilValue } from "recoil";
import { popupAtom } from "../store/popupAtom";
import { RxCross2 } from "react-icons/rx";
import PopupScreen from "./PopupScreen";
import { themeAtom } from "../store/themeAtom";
import toast from "react-hot-toast";
import axios from "axios";
import { userAtom } from "../store/userAtom";
import DOMPurify from "dompurify";
import EditApprovalDetails from "./EditApprovalDetails";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const OrganizerApprovalCard = ({ approval }) => {
    const [popup, setPopup] = useRecoilState(popupAtom);
    const currentTheme = useRecoilValue(themeAtom);
    const user = useRecoilValue(userAtom);
    const sanitizedDescription = DOMPurify.sanitize(approval?.document);

    const removeApproval = async () => {
        try {
            const response = await axios.delete(
                `${BACKEND_URL}/api/approval/deleteapproval`,
                {
                    headers: {
                        token: user.token,
                    },
                    data: {
                        approvalId: approval._id,
                    },
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message);
                setPopup(null);
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
    };

    return (
        <>
            {popup === `removeApprover-${approval._id}` && (
                <PopupScreen>
                    <div
                        className={`rounded-lg mx-auto p-4 w-80 sm:w-96 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Remove Approval
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <p className="text-center">
                            Are you sure you want to delete this approval ? You can never
                            retrieve it again.
                        </p>
                        <button
                            onClick={removeApproval}
                            className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-red"
                        >
                            Remove Approval
                        </button>
                    </div>
                </PopupScreen>
            )}
            {popup === `trackapproval-${approval._id}` && (
                <PopupScreen>
                    <div
                        className={`max-h-[85%] overflow-y-scroll rounded-lg mx-auto p-4 w-[90%] sm:w-[70%] lg:w-[40%] flex flex-col gap-8 font-lato mt-12 sm:mt-20 ${currentTheme === "light"
                            ? "text-black bg-white"
                            : "text-white bg-gray"
                            }`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-2xl font-montserrat font-medium">
                                Track Approval
                            </p>
                            <RxCross2
                                className="text-2xl cursor-pointer"
                                onClick={() => setPopup(null)}
                            />
                        </span>
                        <span className="flex flex-col sm:flex-row justify-between">
                            <h2 className="font-montserrat text-xl font-medium sm:w-[60%]">
                                {approval.title}
                            </h2>
                            <p
                                className={`${currentTheme === "light" ? "text-black/50" : "text-white/60"
                                    }`}
                            >
                                Applied on {approval.date}
                            </p>
                        </span>
                        <span>
                            {approval.approvers.map((approver, index) => (
                                <div className="flex justify-between" key={approver._id}>
                                    <div className="flex gap-2 sm:gap-4 w-full sm:w-[70%]">
                                        <span className="flex flex-col items-center">
                                            <div
                                                className={`w-4 h-4 rounded-full ${approver.approvalStatus === "pending"
                                                    ? "bg-yellow"
                                                    : approver.approvalStatus === "approved"
                                                        ? "bg-green"
                                                        : approver.approvalStatus === "rejected"
                                                            ? "bg-red"
                                                            : currentTheme === "light"
                                                                ? "bg-gray/50"
                                                                : "bg-white/40"
                                                    }`}
                                            />
                                            <div
                                                className={`${index === approval.approvers.length - 1
                                                    ? "hidden"
                                                    : "block"
                                                    } h-full w-[3px] rounded-full ${approver.approvalStatus === "pending"
                                                        ? "bg-yellow"
                                                        : approver.approvalStatus === "approved"
                                                            ? "bg-green"
                                                            : approver.approvalStatus === "rejected"
                                                                ? "bg-red"
                                                                : currentTheme === "light"
                                                                    ? "bg-gray/50"
                                                                    : "bg-white/40"
                                                    }`}
                                            />
                                        </span>
                                        <span className="flex flex-col sm:gap-1 w-full -mt-1 pb-14">
                                            <h3 className="font-montserrat text-lg">
                                                {approver.approverTitle}
                                            </h3>
                                            <h3 className="flex gap-1 text-lg">
                                                <p className={`${currentTheme === "light" ? "text-gray/60" : "text-white/60"}`}
                                                >
                                                    {approver.approvalStatus === "pending"
                                                        ? "Requires approval from "
                                                        : approver.approvalStatus === "approved"
                                                            ? "Approved by "
                                                            : "Rejected by "}
                                                </p>
                                                <span>@{approver.approverDetails.username}</span>
                                            </h3>
                                            <p className={`block sm:hidden ${currentTheme === "light" ? "text-gray/60" : "text-white/60"}`}>
                                                {approver.approvalStatus === 'pending' ? "Approval pending..." : `${approver.approvedDate}`}
                                            </p>
                                            {approver.description && <p>Review : {approver.description}</p>}
                                        </span>
                                    </div>
                                    <p className={`hidden sm:block -mt-1 ${currentTheme === "light" ? "text-gray/60" : "text-white/60"}`}>
                                        {approver.approvalStatus === 'pending' ? "Approval pending..." : `${approver.approvedDate}`}
                                    </p>
                                </div>
                            ))}
                        </span>
                        <p className="mx-auto text-lg font-semibold">
                            {approval.currentApprover === 100 ? "Approval Rejected" : approval.currentApprover >= approval.approvers.length
                                ? "Approval Approved"
                                : "Approval Pending"}
                        </p>
                    </div>
                </PopupScreen>
            )}
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
                                Approval
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
                        <span className="flex justify-center">
                            <button
                                onClick={() => setPopup(`removeApprover-${approval._id}`)}
                                className="flex gap-2 items-center justify-center px-4 py-2 text-white rounded-md text-lg bg-red"
                            >
                                Remove Approval
                            </button>
                        </span>
                    </div>
                </PopupScreen>
            )}
            {/* {popup === `editapproval-${approval._id}` && (
                <PopupScreen>
                    <EditApprovalDetails approval={approval} />
                </PopupScreen>
            )} */}
            <div className="flex flex-col gap-6 p-4 bg-blue_300 text-white rounded-lg col-span-12 lg:col-span-4 relative">
                <h2 className="text-lg font-montserrat font-medium w-[90%]">
                    {approval.title}
                </h2>
                <MdVerified
                    className={`absolute top-4 right-4 text-xl ${approval.currentApprover === 100
                        ? "text-red"
                        : approval.currentApprover >= approval.approvers.length ? "text-green" : "text-yellow"}`}
                />
                <span className="flex gap-4">
                    <button
                        className="px-4 py-2 text-white rounded-md border-2 border-blue_100"
                        onClick={() => setPopup(`viewapproval-${approval._id}`)}
                    >
                        View Approval
                    </button>
                    <button
                        className="px-4 py-2 text-white rounded-md bg-blue_100"
                        onClick={() => setPopup(`trackapproval-${approval._id}`)}
                    >
                        Track Approval
                    </button>
                    {/* <button className="px-4 py-2 text-white rounded-md border-blue_100 border-2"
                        onClick={() => setPopup(`editapproval-${approval._id}`)}
                    >
                        Edit Approval
                    </button> */}
                </span>
            </div>
        </>
    );
};

export default OrganizerApprovalCard;
