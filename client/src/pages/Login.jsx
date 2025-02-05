import React, { useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { userAtom } from "../store/userAtom";
import axios from "axios";
import toast from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { popupAtom } from "../store/popupAtom";
import PopupScreen from "../components/PopupScreen";
import { RxCross2 } from "react-icons/rx";
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
    const [popup, setPopup] = useRecoilState(popupAtom);
    const forgetPasswordUserId = useRef()


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

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        if (forgetPasswordUserId.current.value === "") {
            toast.error("Please enter your user id")
            return;
        }

        setLoadingMessage("Processing, please wait...")
        setLoading(true)
        try {
            const response = await axios.get(`${BACKEND_URL}/api/user/forgetpassword`, {
                params: {
                    userId: forgetPasswordUserId.current.value
                }
            })
            if (response.status === 200) {
                toast.success(response.data.message)
                setPopup(null)
            }
            else if (response.status === 400) {
                toast.error(response.data.message)
                setPopup(null)
            }
        }
        catch (error) {
            toast.error(error.response?.data.message || error)
        }
        setLoading(false)
    }

    return (
        <>{popup === "forgetPassword" && (
            <PopupScreen>
                <form
                    className={`rounded-lg mx-auto p-4 w-80 flex flex-col gap-8 font-lato mt-32 ${currentTheme === "light"
                        ? "text-black bg-white"
                        : "text-white bg-gray"
                        }`}
                    onSubmit={handleForgetPassword}
                >
                    <span className="flex justify-between items-center">
                        <p className="text-2xl font-montserrat font-medium">
                            Forget Password
                        </p>
                        <RxCross2
                            className="text-2xl cursor-pointer"
                            onClick={() => setPopup(null)}
                        />
                    </span>
                    <div className="flex flex-col gap-4">
                        <span className="flex flex-col gap-2">
                            <label htmlFor="username">UserId</label>
                            <input
                                type="text"
                                id="userId"
                                className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                                    ? "bg-white/60  placeholder-black/40"
                                    : "bg-gray/60 border-white text-white placeholder-white/60"
                                    }`}
                                placeholder="Enter your userId"
                                ref={forgetPasswordUserId}
                            />
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="flex gap-2 items-center justify-center px-4 py-2 text-black rounded-md text-lg bg-green"
                    >
                        Submit
                    </button>
                </form>
            </PopupScreen>
        )}
            <form
                onSubmit={handleLogin}
                className={`mx-4 px-4 rounded-lg custom_shadow mt-16 sm:mt-20 flex flex-col gap-10 items-center justify-center py-4 sm:w-[60%] sm:mx-auto lg:w-[40%] ${currentTheme === "light" ? "bg-white" : "bg-gray text-white"
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
                            type="button"
                            className={`self-end hover:underline ${currentTheme === "light" ? "text-black/60 " : "text-white/60"
                                } -mt-2`}
                            onClick={(e) => {
                                e.preventDefault()
                                setPopup('forgetPassword')
                            }}
                        >
                            Forgot Password ?
                        </button>
                    </span>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue_100 font-lato w-full rounded-md text-lg border-blue_100 border-2"
                >
                    Login
                </button>
                <p className={`-mt-6 ${currentTheme === 'light' ? "text-black/60" : "text-white/60"}`}>Not from FCRIT? <Link to="/signup" className={`hover:underline underline-offset-4 ${currentTheme === 'light' ? "text-black" : "text-white"}`}>Create account</Link></p>
            </form>
        </>
    );
};

export default Login;
