import React, { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
    const navigate = useNavigate();
    const currentTheme = useRecoilValue(themeAtom);
    const [userId, setUserId] = useState("");
    const username = useRef();
    const password = useRef();
    const repassword = useRef();
    const [loadingMessage, setLoadingMessage] = useState("");
    const [loading, setLoading] = useState(false);

    function containsAlphabet(str) {
        return /[a-zA-Z]/.test(str);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        //Checks
        if (
            userId === "" ||
            username.current.value === "" ||
            password.current.value === "" ||
            repassword.current.value === ""
        ) {
            toast.error("Fields cannot be empty");
            return;
        } else if (!containsAlphabet(userId)) {
            toast.error("UserId must have atleast one alphabet");
            return;
        } else if (password.current.value !== repassword.current.value) {
            toast.error("Password and re-entered password must be same");
        } else {
            setLoadingMessage("Creating your account, please wait...");
            setLoading(true);
            try {
                const response = await axios.post(
                    `${BACKEND_URL}/api/user/signup`,
                    {
                        userId: userId,
                        username: username.current.value,
                        password: password.current.value,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.status === 201) {
                    toast.success(response.data.message, {
                        duration: 3000,
                    });
                    navigate("/login");
                } else {
                    toast.error(response.data.message);
                    setUserId("");
                }
            } catch (error) {
                toast.error(error.response?.data.message || error);
            }
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSignup}
            className={`mx-4 px-4 rounded-lg custom_shadow mt-20 flex flex-col gap-10 items-center justify-center py-4 sm:w-[60%] sm:mx-auto lg:w-[40%] ${currentTheme === "light" ? "bg-white" : "bg-gray text-white"
                }`}
        >
            {loading && <Loader message={loadingMessage} />}
            <h1 className="font-montserrat text-2xl font-semibold">CREATE ACCOUNT</h1>
            <div className="flex flex-col w-full gap-6 font-lato">
                <span className="flex flex-col gap-2">
                    <p>Enter User-ID</p>
                    <input
                        type="text"
                        name="userId"
                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                            ? "bg-white/60  placeholder-black/60"
                            : "bg-gray/60 border-white text-white placeholder-white/60"
                            }`}
                        placeholder="abc123"
                        value={userId}
                        onChange={(e) => {
                            setUserId(e.target.value);
                        }}
                    />
                    {userId !== "" && (
                        <span className="flex gap-2 items-center">
                            {containsAlphabet(userId) ? (
                                <FaCheck className="text-green text-sm" />
                            ) : (
                                <ImCross className="text-red text-sm" />
                            )}
                            <p>Atleast one alphabet</p>
                        </span>
                    )}
                </span>
                <span className="flex flex-col gap-2">
                    <p>Enter Username</p>
                    <input
                        type="text"
                        name="username"
                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                            ? "bg-white/60  placeholder-black/60"
                            : "bg-gray/60 border-white text-white placeholder-white/60"
                            }`}
                        placeholder="John Doe"
                        ref={username}
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
                        placeholder="Enter password"
                        ref={password}
                    />
                </span>
                <span className="flex flex-col gap-2">
                    <p>Re-enter Password</p>
                    <input
                        type="password"
                        name="repassword"
                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light"
                            ? "bg-white/60  placeholder-black/60"
                            : "bg-gray/60 border-white text-white placeholder-white/60"
                            }`}
                        placeholder="Re-enter your password"
                        ref={repassword}
                    />
                </span>
            </div>
            <button
                type="submit"
                className="px-4 py-2 text-white bg-blue_100 font-lato w-full rounded-md text-lg border-blue_100 border-2"
            >
                Sign up
            </button>
            <p
                className={`-mt-6 ${currentTheme === "light" ? "text-black/60" : "text-white/60"
                    }`}
            >
                Already have an account?{" "}
                <Link
                    to="/login"
                    className={`hover:underline underline-offset-4 ${currentTheme === "light" ? "text-black" : "text-white"
                        }`}
                >
                    Signin
                </Link>
            </p>
        </form>
    );
};

export default Signup;
