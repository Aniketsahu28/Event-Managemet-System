import React, { useState, useEffect } from 'react';

const EventTimer = ({ date, time }) => {
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeRemaining = () => {
            const eventDateTime = new Date(`${date}T${time}`);
            const now = new Date();
            const difference = eventDateTime - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / (1000 * 60)) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                setTimeRemaining({ days, hours, minutes, seconds });
            } else {
                setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        const timerInterval = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(timerInterval);
    }, [date, time]);

    return (
        <div className='flex gap-2 lg:gap-4 font-lato items-center'>
            <span className='flex flex-col border-2 border-white rounded-lg w-[59px] sm:w-[70px] py-1 sm:px-4 sm:py-2 items-center justify-center bg-black/30'>
                <p className='text-lg font-semibold'>{timeRemaining.days}</p>
                <p className='text-sm sm:text-base'>Days</p>
            </span>{":"}
            <span className='flex flex-col border-2 border-white rounded-lg w-[59px] sm:w-[70px] py-1 sm:px-4 sm:py-2 items-center justify-center bg-black/30'>
                <p className='text-lg font-semibold'>{timeRemaining.hours}</p>
                <p className='text-sm sm:text-base'>Hours</p>
            </span>{":"}
            <span className='flex flex-col border-2 border-white rounded-lg w-[59px] sm:w-[70px] py-1 sm:px-4 sm:py-2 items-center justify-center bg-black/30'>
                <p className='text-lg font-semibold'>{timeRemaining.minutes}</p>
                <p className='text-sm sm:text-base'>Mins</p>
            </span>{":"}
            <span className='flex flex-col border-2 border-white rounded-lg w-[59px] sm:w-[70px] py-1 sm:px-4 sm:py-2 items-center justify-center bg-black/30'>
                <p className='text-lg font-semibold'>{timeRemaining.seconds}</p>
                <p className='text-sm sm:text-base'>Secs</p>
            </span>
        </div>
    );
};

export default EventTimer;
