import React from 'react'
import { useRecoilValue } from 'recoil'
import { themeAtom } from '../store/themeAtom'
import { Link } from 'react-router-dom'

const EventTicket = ({ event, user }) => {
    const currentTheme = useRecoilValue(themeAtom)
    console.log(event)
    return (
        <Link to={`/events/${event.eventId}`} className='bg-[#67fd59] rounded-xl w-80 font-lato h-fit text-black'>
            <div className='p-4 flex flex-col gap-4'>
                <h2 className='font-montserrat font-semibold text-xl '>{event.title.length > 25 ? `${event.title.slice(0, 25)}...` : event.title}</h2>
                <div className='grid grid-cols-4 gap-y-6'>
                    <span className='col-span-2'>
                        <p className='font-semibold'>Date</p>
                        <p className='text-black/80'>{event.date}</p>
                    </span>
                    <span className='col-span-2'>
                        <p className='font-semibold'>Time</p>
                        <p className='text-black/80'>{event.time}</p>
                    </span>
                    <span className='col-span-2'>
                        <p className='font-semibold'>Venue</p>
                        <p className='text-black/80'>{event.venue}</p>
                    </span>
                    <span className='col-span-2'>
                        <p className='font-semibold'>Event Fees</p>
                        <p className='text-black/80'>{event.eventFee}</p>
                    </span>
                </div>
            </div>
            <div className='relative h-10'>
                <hr className='border-[1px] border-dashed translate-y-5' />
                <div className={`${currentTheme === 'light' ? "bg-white" : "bg-black"} w-5 h-10 rounded-r-full absolute left-0 top-0`}></div>
                <div className={`${currentTheme === 'light' ? "bg-white" : "bg-black"} w-5 h-10 rounded-l-full absolute right-0 top-0`}></div>
            </div>
            <div className='p-4 flex gap-3 items-center'>
                <img src={user.profilePicture} alt="Profile" className='w-12 h-12 bg-black rounded-full object-cover' />
                <span>
                    <p className='text-lg font-medium'>{user.username}</p>
                    <p className='text-black/60'>{user.userId}</p>
                </span>
            </div>
        </Link>
    )
}

export default EventTicket
