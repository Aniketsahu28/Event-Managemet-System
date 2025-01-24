import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { userAtom } from "../store/userAtom";
import axios from "axios";
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
    const navigate = useNavigate();
    const currentTheme = useRecoilValue(themeAtom);
    const [userType, setUserType] = useState('student')
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const setUser = useSetRecoilState(userAtom);
    const [loadingMessage, setLoadingMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleUserTypeChange = (event) => {
        event.preventDefault();
        setUserType(event.target.value)
    }

    const handleLogin = (e) => {
        e.preventDefault();
        if (userType === 'student' || userType === 'faculty' || userType === 'admin') {
            handleUserLogin()
        }
        else {
            handleOrganizerLogin()
        }
    }

    const handleUserLogin = async () => {
        setLoadingMessage("Logging you in...")
        setLoading(true)
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/user/login`,
                {
                    userId,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                setUser({
                    userInfo: response.data.user,
                    token: response.data.token,
                });
                toast.success("You are logged in", {
                    duration: 3000
                });
                setUserId("");
                setPassword("");
                navigate('/')
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false)
    };

    const handleOrganizerLogin = async () => {
        setLoadingMessage("Logging you in...")
        setLoading(true)
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/organizer/login`,
                {
                    organizerId: userId,
                    password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                setUser({
                    userInfo: response.data.user,
                    token: response.data.token,
                });
                toast.success('You are logged in', {
                    duration: 3000
                });
                setUserId("");
                setPassword("");
                navigate('/')
            }
        } catch (error) {
            toast.error(error.response?.data.message || error);
        }
        setLoading(false)
    };

    return (
        <form
            onSubmit={handleLogin}
            className={`w-full px-4 rounded-lg custom_shadow mt-20 flex flex-col gap-10 items-center justify-center py-4 sm:w-[60%] mx-auto lg:w-[40%] ${currentTheme === "light" ? "bg-white" : "bg-gray text-white"
                }`}
        >
            {loading && <Loader message={loadingMessage} />}
            <h1 className="font-montserrat text-2xl font-semibold">LOGIN</h1>
            <div className="flex flex-col w-full gap-6 font-lato">
                <span className="flex flex-col gap-2">
                    <label htmlFor="usertype">Login as</label>
                    <select
                        name="usertype"
                        id="usertype"
                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                            ? "bg-white/60  placeholder-black/60"
                            : "bg-gray/60 border-white text-white placeholder-black/60"
                            }`}
                        onChange={handleUserTypeChange}
                    >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                    </select>
                </span>
                <span className="flex flex-col gap-2">
                    <p>Enter User-ID</p>
                    <input
                        type="text"
                        name="userId"
                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                            ? "bg-white/60  placeholder-black/60"
                            : "bg-gray/60 border-white text-white placeholder-white/60"
                            }`}
                        placeholder="Ex:1021237"
                        value={userId}
                        onChange={(e) => handleChange(e, setUserId)}
                    />
                </span>
                <span className="flex flex-col gap-2">
                    <p>Enter Password</p>
                    <input
                        type="password"
                        name="password"
                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                            ? "bg-white/60  placeholder-black/60"
                            : "bg-gray/60 border-white text-white placeholder-white/60"
                            }`}
                        placeholder="Ex:******"
                        value={password}
                        onChange={(e) => handleChange(e, setPassword)}
                    />
                    <button
                        className={`self-end hover:underline ${currentTheme === "light" ? "text-black/60 " : "text-white/60"
                            } -mt-2`}
                    >
                        Forget Password
                    </button>
                </span>
            </div>
            <button
                type="submit"
                className="px-4 py-2 text-white bg-blue_100 font-lato w-full rounded-md text-lg border-blue_100 border-2"
            >
                Login
            </button>
        </form>
    );
};

export default Login;
