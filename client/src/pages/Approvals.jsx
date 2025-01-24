import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { themeAtom } from '../store/themeAtom'
import FacultyApprovalCard from '../components/FacultyApprovalCard'
import axios from 'axios';
import toast from 'react-hot-toast';
import { userAtom } from '../store/userAtom';
import Loader from '../components/Loader';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Approvals = () => {
    const currentTheme = useRecoilValue(themeAtom)
    const user = useRecoilValue(userAtom)
    const [approvals, setApprovals] = useState()
    const [loadingMessage, setLoadingMessage] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchFacultyApprovals();
    }, [])

    const fetchFacultyApprovals = async () => {
        setLoadingMessage("Loading your approvals...")
        setLoading(true)
        try {
            const response = await axios.get(`${BACKEND_URL}/api/approval/facultyapprovals`,
                {
                    headers: {
                        token: user.token
                    }
                }
            )
            setApprovals(response.data.facultyapprovals)
        }
        catch (error) {
            toast.error(error.response?.data.message || error)
        }
        setLoading(false)
    }

    return (
        <div className={`items-center sm:items-start mx-4 sm:mx-16 py-10 sm:py-16 flex flex-col gap-10 ${currentTheme === "light" ? "text-black" : "text-white"
            }`}>
            {loading && <Loader message={loadingMessage} />}
            <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">
                Approvals
            </h2>
            <div className="flex flex-col sm:grid sm:grid-cols-12 gap-6 lg:gap-10 w-full">
                {
                    approvals?.map((approval) => (
                        <FacultyApprovalCard key={approval._id} approval={approval} />
                    ))
                }
            </div>
        </div>
    )
}

export default Approvals
