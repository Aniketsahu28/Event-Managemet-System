import { atom } from "recoil"
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

export const themeAtom = atom({
    key: "themeAtom",
    default: "light",
    effects_UNSTABLE: [persistAtom]
})