import React from 'react'
import { Link } from 'react-router-dom'
import { IoIosArrowUp } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import { IoMailOutline } from "react-icons/io5";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <div className='mt-20'>
            <div className='bg-gray px-4 sm:px-16 grid grid-cols-12 pt-10 pb-10 sm:pb-16 gap-6 sm:gap-10 lg:gap-0'>
                <div className='col-span-12 lg:col-span-5 lg:pr-44 flex flex-col gap-2 lg:gap-5'>
                    <h2 className="font-montserrat text-xl sm:text-2xl font-semibold text-yellow">
                        AGNELEVENTS
                    </h2>
                    <p className='text-white/60 font-lato sm:text-lg text-justify'>Find something that interests you, discover the clubs organizing them, and register to be a part of it all. Stay connected and never miss out on what's happening on campus!"</p>
                </div>
                <div className='col-span-12 sm:col-span-4 lg:col-span-3 sm:text-lg flex flex-col gap-2 lg:gap-5'>
                    <p className='text-white'>Important Links</p>
                    <span className='flex flex-col gap-1'>
                        <Link to="/events" className='text-white/60 hover:text-white flex gap-1 items-center hover:gap-2 transition-all w-fit'><IoIosArrowUp className='rotate-90' /><span>Events</span></Link>
                        <Link to="/organizers" className='text-white/60 hover:text-white flex gap-1 items-center hover:gap-2 transition-all w-fit'><IoIosArrowUp className='rotate-90' /><span>Organizers</span></Link>
                        <Link to="/addApproval" className='text-white/60 hover:text-white flex gap-1 items-center hover:gap-2 transition-all w-fit'><IoIosArrowUp className='rotate-90' /><span>Ask For Approval</span></Link>
                        <Link to="/addEvent" className='text-white/60 hover:text-white flex gap-1 items-center hover:gap-2 transition-all w-fit'><IoIosArrowUp className='rotate-90' /><span>Add New Event</span></Link>
                    </span>
                </div>
                <div className='col-span-12 sm:col-span-8 lg:col-span-4 sm:text-lg flex flex-col gap-2 lg:gap-5'>
                    <p className='text-white'>Contact us</p>
                    <span className='text-white/60 flex gap-2'><GrLocation className='text-3xl' /><p>Agnel Technical Education Complex Sector 9-A, Vashi, Navi Mumbai, Maharashtra, India, PIN - 400703.</p></span>
                    <span className='text-white/60 text-2xl sm:text-3xl flex gap-4 ml-6'>
                        <IoMailOutline />
                        <MdOutlinePhoneInTalk />
                        <FaInstagram />
                    </span>
                </div>
            </div>
            <div className='bg-black text-white/60 font-lato flex flex-col lg:flex-row items-center gap-2 lg:gap-0 py-4 lg:justify-between px-4 sm:px-16'>
                <p>© All rights reserved, 2024</p>
                <p>Design and Developed by <Link to="https://aniket-portfolio-alpha.vercel.app/" className='text-blue_100 font-semibold hover:underline' target='_blank'>Aniकेत</Link></p>
            </div>
        </div>
    )
}

export default Footer
