import React from 'react'
import { useRecoilValue } from 'recoil'
import { userAtom } from '../store/userAtom'
import { themeAtom } from '../store/themeAtom'
import ProfileCard from '../components/ProfileCard'

const Profile = () => {
    const currentTheme = useRecoilValue(themeAtom)
    const user = useRecoilValue(userAtom)
    // console.log(user.userInfo)
    return (
        <div className={`mx-4 sm:mx-16 py-4 sm:py-20 flex flex-col gap-10 ${currentTheme === "light" ? "text-black" : "text-white"
            }`}>
            <ProfileCard name={user?.userInfo.username} userId={user?.userInfo.userId} department={user?.userInfo.department} image={user?.userInfo.profilePicture} />
        </div>
    )
}

export default Profile
