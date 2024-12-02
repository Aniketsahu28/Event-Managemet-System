import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { themeAtom } from "../store/themeAtom";
import { authTokenAtom } from "../store/authTokenAtom";
import axios from 'axios'

const Login = () => {
    const currentTheme = useRecoilValue(themeAtom);
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [authToken, setAuthToken] = useRecoilState(authTokenAtom);

    const handleChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/user/login', {
                userId, password
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            if (!response.statusText) {
                alert("Invalid user id or password");
            }
            else {
                setAuthToken(response.data.token)
                alert("You are logged in")
                setUserId("")
                setPassword("")
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className={`w-full px-4 rounded-lg custom_shadow mt-20 flex flex-col gap-10 items-center justify-center py-4 sm:w-[60%] mx-auto lg:w-[40%] ${currentTheme === "light" ? "bg-white" : "bg-gray text-white"
                }`}
        >
            <h1 className="font-montserrat text-2xl font-semibold">LOGIN</h1>
            <div className="flex flex-col w-full gap-6 font-lato">
                <span className="flex flex-col gap-2">
                    <p>Enter User-ID</p>
                    <input
                        type="text"
                        name="userId"
                        className={`w-full p-2 rounded-lg border-[1px] border-gray/50 text-black outline-none text-lg ${currentTheme === "light" ? "" : "bg-white/60  placeholder-black/60"
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
                        className={`w-full p-2 rounded-lg border-[1px] text-black border-gray/50 outline-none text-lg ${currentTheme === "light" ? "" : "bg-white/60 placeholder-black/60"
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
                className="px-4 py-2 text-white bg-blue_100 font-lato w-full rounded-md text-lg border-blue_100 border-2"
                onClick={handleLogin}
            >
                Login
            </button>
        </div>
    );
};

export default Login;
