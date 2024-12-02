import React from "react";

const HamburgerButton = ({ status, setStatus }) => {
    const genericHamburgerLine = `h-[3px] w-6 my-[3px] rounded-full bg-white transition ease transform duration-300`;
    return (
        <>
            <button
                className="flex flex-col h-10 w-6 rounded justify-center items-center group "
                onClick={() => setStatus(!status)}
            >
                <div
                    className={`${genericHamburgerLine} ${status && "rotate-45 translate-y-[9px]"
                        }`}
                />
                <div className={`${genericHamburgerLine} ${status && "opacity-0"}`} />
                <div
                    className={`${genericHamburgerLine} ${status && "-rotate-45 -translate-y-[9px]"
                        }`}
                />
            </button>
        </>
    );
};

export default HamburgerButton;