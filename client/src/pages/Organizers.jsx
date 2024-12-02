import React from 'react'
import { useRecoilValue } from 'recoil'
import { themeAtom } from '../store/themeAtom'

const Organizers = () => {
    const currentTheme = useRecoilValue(themeAtom);
    return (
        <div className={`${currentTheme === "light" ? "text-black" : "text-white"}`}>
            This is organizers page
        </div>
    )
}

export default Organizers
