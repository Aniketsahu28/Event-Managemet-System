import React from 'react'
import { IoIosArrowUp } from "react-icons/io";
import { Link } from 'react-router-dom';

const OrganizerCard = ({ id, image, name }) => {
    return (
        <Link to={`/organizers/${id}`} className='w-52 flex flex-col gap-4 bg-blue_200 custom_shadow p-4 rounded-lg hover:scale-95 transition-all'>
            <img src={image} alt="Organizer" className='w-44 h-44 bg-gray bg-cover rounded-lg' />
            <button className="flex items-center justify-between w-full px-4 py-2 text-white rounded-md text-lg border-[1px] border-white">
                <p> {name.length > 12 ? `${name.slice(0, 11)}...` : name}</p>
                <IoIosArrowUp className='rotate-90' />
            </button>
        </Link>
    )
}

export default OrganizerCard
