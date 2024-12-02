import React from 'react'
import { useRecoilValue } from 'recoil'
import { themeAtom } from '../store/themeAtom'

const Events = () => {
    const currentTheme = useRecoilValue(themeAtom);
    return (
        <div className={`${currentTheme === "light" ? "text-black" : "text-white"}`}>
            This is home page and event page
        </div>
    )
}

export default Events
