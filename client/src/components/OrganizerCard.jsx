import React from 'react'
import { IoIosArrowUp } from "react-icons/io";

const OrganizerCard = ({ image, name }) => {
    return (
        <div className='lg:col-span-2 flex flex-col gap-4 bg-blue_200 custom_shadow p-4 rounded-lg hover:scale-105 transition-all'>
            <img src="" alt="Organizer" className='w-44 h-44 bg-gray bg-cover rounded-lg' />
            <button className="flex items-center justify-between w-full px-4 py-2 text-white rounded-md text-lg border-[1px] border-white">
                <p>{name}</p>
                <IoIosArrowUp className='rotate-90' />
            </button>
        </div>
    )
}

export default OrganizerCard
