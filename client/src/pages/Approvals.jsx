import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { themeAtom } from '../store/themeAtom'
import axios from 'axios';
import toast from 'react-hot-toast';
import { userAtom } from '../store/userAtom';
import Loader from '../components/Loader';
import EventCard from '../components/EventCard';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Approvals = () => {
    const currentTheme = useRecoilValue(themeAtom)
    const user = useRecoilValue(userAtom)
    const [events, setEvents] = useState([])
    const [loadingMessage, setLoadingMessage] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchFacultyApprovals();
    }, [])

    const fetchFacultyApprovals = async () => {
        setLoadingMessage("Loading events for verificaion...")
        setLoading(true)
        try {
            const response = await axios.get(`${BACKEND_URL}/api/event/facultyEvents`,
                {
                    headers: {
                        token: user.token
                    }
                }
            )
            setEvents(response.data.events)
        }
        catch (error) {
            toast.error(error.response?.data.message || error)
        }
        setLoading(false)
    }

    return (
        <div
            className={`mx-4 sm:mx-16 py-10 sm:py-16 flex flex-col gap-20 justify-center ${currentTheme === "light" ? "text-black" : "text-white"}`}
        >
            {loading && <Loader message={loadingMessage} />}
            {/* Verification pending */}
            <div className="flex flex-col justify-center gap-10">
                <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">Events Verification pending</h2>
                {events.length > 0 ? <div className="flex flex-col sm:flex-row gap-10 items-center flex-wrap">
                    {
                        [...events].reverse().map((event) => (
                            <EventCard
                                key={event._id}
                                id={event._id}
                                title={event.title}
                                banner={event.banner}
                                description={event.description}
                                time={event.time}
                                date={event.date}
                                price={event.eventFee}
                            />
                        ))
                    }
                </div> : "No events for verification"}
            </div>
        </div>
    )
}

export default Approvals
