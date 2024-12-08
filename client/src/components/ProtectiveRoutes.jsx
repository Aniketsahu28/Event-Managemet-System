import React from 'react'
import { useRecoilValue } from 'recoil'
import { isAuthenticated } from '../store/userAtom'
import { Navigate } from 'react-router-dom'

const ProtectiveRoutes = ({ children }) => {
    const isUserAuthenticated = useRecoilValue(isAuthenticated)
    if (!isUserAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <div>
            {children}
        </div>
    )
}

export default ProtectiveRoutes
