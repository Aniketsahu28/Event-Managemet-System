import React from 'react';
import DOMPurify from 'dompurify';
import { SlCalender } from "react-icons/sl";
import { LuClock } from "react-icons/lu";
import { MdCurrencyRupee } from "react-icons/md";
import { Link } from 'react-router-dom';

const EventCard = ({ id, title, description, banner, date, time, price }) => {
    const sanitizedDescription = DOMPurify.sanitize(description);
    const trimmedDescription = sanitizedDescription.length > 40
        ? `${sanitizedDescription.slice(0, 40)}...`
        : sanitizedDescription;

    function convertDateToDDMMYYYY(dateString) {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    }

    return (
        <Link to={`/events/${id}`} className='hover:scale-95 transition-all w-[320px] sm:w-[330px] custom_shadow rounded-lg p-3 flex flex-col gap-2 bg-blue_200'>
            <div className='w-full h-40 bg-gray rounded-lg flex items-center justify-center overflow-hidden'>
                <img src={banner} alt="Event" className='h-full w-full object-cover' />
            </div>
            <span>
                <h1 className='self-start text-white text-lg font-montserrat'>
                    {title.length > 26 ? `${title.slice(0, 26)}...` : title}
                </h1>
                <p
                    className='self-start text-white/60 text-sm font-lato'
                    dangerouslySetInnerHTML={{ __html: trimmedDescription }}
                />
            </span>
            <div className='flex justify-between font-lato text-white mt-2'>
                <span className='flex gap-1 items-center justify-center'>
                    <SlCalender />{convertDateToDDMMYYYY(date)}
                </span>
                <span className='flex gap-1 items-center justify-center'>
                    <LuClock /> {time}
                </span>
                <span className='flex items-center justify-center'>
                    <MdCurrencyRupee /> {price}
                </span>
            </div>
        </Link>
    );
};

export default EventCard;
