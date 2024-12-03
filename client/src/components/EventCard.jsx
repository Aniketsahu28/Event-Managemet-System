import React from 'react'
import { SlCalender } from "react-icons/sl";
import { LuClock } from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";

const EventCard = ({ title, description, date, time, price }) => {
    function trimString(input, maxLength) {
        if (input.length > maxLength) {
            return input.slice(0, maxLength) + '...';
        }
        return input;
    }

    return (
        <div className='min-w-[90%] sm:min-w-[45%] lg:min-w-[22%] custom_shadow rounded-lg p-3 flex flex-col gap-2 bg-blue_200'>
            <img src="" alt="Event" className='w-full h-40 bg-gray rounded-lg' />
            <span>
                <h1 className='self-start text-white text-lg font-montserrat'>{trimString(title, 26)}</h1>
                <p className='self-start text-white/60 text-sm font-lato'>{trimString(description, 40)}</p>
            </span>
            <div className='flex justify-between font-lato text-white mt-2'>
                <span className='flex gap-1 items-center justify-center'><SlCalender />{date}</span>
                <span className='flex gap-1 items-center justify-center'><LuClock /> {time}</span>
                <span className='flex items-center justify-center'><MdCurrencyRupee /> {price}</span>
            </div>
        </div>
    )
}

export default EventCard