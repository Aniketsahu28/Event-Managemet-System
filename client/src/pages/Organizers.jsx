import React from 'react'
import { useRecoilValue } from 'recoil'
import { themeAtom } from '../store/themeAtom'
import OrganizerCard from "../components/OrganizerCard"

const Organizers = () => {
    const currentTheme = useRecoilValue(themeAtom);
    return (
        <div className={`mx-4 sm:mx-16 py-10 sm:py-16 flex flex-col gap-20 justify-center ${currentTheme === "light" ? "text-black" : "text-white"}`}>
            {/* Cultural Clubs */}
            <div className='flex flex-col gap-7 lg:gap-10'>
                <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">Cultural Clubs</h2>
                <div className='flex lg:grid lg:grid-cols-12 gap-4 lg:gap-7'>
                    <OrganizerCard name="CSI FCRIT" />
                    <OrganizerCard name="GDSC FCRIT" />
                    <OrganizerCard name="NSS" />
                    <OrganizerCard name="Rhythm" />
                    <OrganizerCard name="Manthan" />
                    <OrganizerCard name="ARC" />
                </div>
            </div>

            {/* Technical (Students Club) */}
            <div className='flex flex-col gap-7 lg:gap-10'>
                <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">Technical (Students Club)</h2>
                <div className='flex lg:grid lg:grid-cols-12 gap-4 lg:gap-7'>
                    <OrganizerCard name="CSI FCRIT" />
                    <OrganizerCard name="GDSC FCRIT" />
                    <OrganizerCard name="NSS" />
                    <OrganizerCard name="Rhythm" />
                    <OrganizerCard name="Manthan" />
                    <OrganizerCard name="ARC" />
                </div>
            </div>

            {/* Technical (Professional Society Chapter) */}
            <div className='flex flex-col gap-7 lg:gap-10'>
                <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">Technical (Professional Society Chapter)</h2>
                <div className='flex lg:grid lg:grid-cols-12 gap-4 lg:gap-7'>
                    <OrganizerCard name="CSI FCRIT" />
                    <OrganizerCard name="GDSC FCRIT" />
                    <OrganizerCard name="NSS" />
                    <OrganizerCard name="Rhythm" />
                </div>
            </div>

            {/* Others */}
            <div className='flex flex-col gap-7 lg:gap-10'>
                <h2 className="text-2xl sm:text-3xl font-montserrat font-semibold">Others</h2>
                <div className='flex lg:grid lg:grid-cols-12 gap-4 lg:gap-7'>
                    <OrganizerCard name="CSI FCRIT" />
                </div>
            </div>
        </div>
    )
}

export default Organizers
