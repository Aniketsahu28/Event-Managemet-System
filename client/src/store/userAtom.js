import { atom, selector } from "recoil";
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

export const userAtom = atom({
    key: "userAtom",
    default: null,
    effects_UNSTABLE: [persistAtom]
})

export const isAuthenticated = selector({
    key: "isAuthenticatedSelector",
    get: ({ get }) => {
        const user = get(userAtom)
        return user !== null
    }
})