import { useRecoilValue } from "recoil";
import { popupAtom } from '../store/popupAtom'

const PopupScreen = ({ children }) => {
    const popup = useRecoilValue(popupAtom)

    return (
        <div
            className={`${popup ? "fixed" : "hidden"
                } h-full w-full bg-black/80 z-30 top-0 left-0`}
        >
            {children}
        </div>
    );
};

export default PopupScreen;