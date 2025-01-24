import React from 'react'

const Loader = ({ message }) => {
    return (
        <div
            className={`fixed h-screen w-screen flex flex-col gap-10 text-white items-center justify-center bg-black/80 z-30 top-0 left-0`}
        >
            <div class="loader"></div>
            <p className='sm:text-xl'>{message}</p>
        </div>
    )
}

export default Loader
