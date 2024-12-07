import React from 'react'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../store/userAtom'
import { themeAtom } from '../store/themeAtom'

const Profile = () => {
    const currentTheme = useRecoilValue(themeAtom)
    const user = useRecoilValue(userAtom)
    return (
        <div className={`mx-4 sm:mx-16 py-4 sm:py-20 flex flex-col gap-10 items-center ${currentTheme === "light" ? "text-black" : "text-white"
            }`}>
            {user?.userInfo.userType}
        </div>
    )
}

export default Profile
