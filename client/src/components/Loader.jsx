import React from 'react'
import 'ldrs/hourglass'

const Loader = ({ message }) => {
    return (
        <div
            className={`fixed h-screen w-screen flex flex-col gap-10 text-white items-center justify-center bg-black/80 z-30 top-0 left-0`}
        >
            <l-hourglass
                size="50"
                bg-opacity="0.3"
                speed="1.8"
                color="white"
            />
            <p className='sm:text-xl'>{message}</p>
        </div>
    )
}

export default Loader
