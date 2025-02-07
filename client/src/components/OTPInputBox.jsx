import React, { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { themeAtom } from '../store/themeAtom';

function OTPInputBox({ otp, setOtp }) {
    const currentTheme = useRecoilValue(themeAtom);
    const otpBoxReference = useRef([]);

    function handleChange(value, index) {
        let newArr = [...otp];
        newArr[index] = value;
        setOtp(newArr);

        if (value && index < 3) {
            otpBoxReference.current[index + 1].focus()
        }
    }

    function handleBackspaceAndEnter(e, index) {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            otpBoxReference.current[index - 1].focus()
        }
        if (e.key === "Enter" && e.target.value && index < 3) {
            otpBoxReference.current[index + 1].focus()
        }
    }

    return (
        <div className='flex items-center gap-4'>
            {otp.map((digit, index) => (
                <input key={index} value={digit} maxLength={1}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                    ref={(reference) => (otpBoxReference.current[index] = reference)}
                    className={`bg-transparent border-2 w-12 text-center text-lg p-2 rounded-md ${currentTheme === 'light' ? "border-black/60 text-black" : "border-white/60 text-white"}`}
                />
            ))}
        </div>
    );
}

export default OTPInputBox;
