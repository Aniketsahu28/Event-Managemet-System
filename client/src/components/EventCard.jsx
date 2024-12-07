import React from 'react'
import { SlCalender } from "react-icons/sl";
import { LuClock } from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";
import { Link } from 'react-router-dom';

const EventCard = ({ id, title, description, banner, date, time, price }) => {
    function trimString(input, maxLength) {
        if (input.length > maxLength) {
            return input.slice(0, maxLength) + '...';
        }
        return input;
    }

    function convertDateToDDMMYYYY(dateString) {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    }

    return (
        <Link to={`/events/${id}`} className='mx-2 sm:mx-3 lg:mx-5 min-w-[90%] sm:min-w-[45%] lg:min-w-[22%] custom_shadow rounded-lg p-3 flex flex-col gap-2 bg-blue_200'>
            <img src={banner} alt="Event" className='w-full h-40 bg-gray rounded-lg' />
            <span>
                <h1 className='self-start text-white text-lg font-montserrat'>{trimString(title, 26)}</h1>
                <p className='self-start text-white/60 text-sm font-lato'>{trimString(description, 40)}</p>
            </span>
            <div className='flex justify-between font-lato text-white mt-2'>
                <span className='flex gap-1 items-center justify-center'><SlCalender />{convertDateToDDMMYYYY(date)}</span>
                <span className='flex gap-1 items-center justify-center'><LuClock /> {time}</span>
                <span className='flex items-center justify-center'><MdCurrencyRupee /> {price}</span>
            </div>
        </Link>
    )
}

export default EventCard