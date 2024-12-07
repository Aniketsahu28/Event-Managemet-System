import { atom, selector } from "recoil";
import { recoilPersist } from 'recoil-persist'
const { persistAtom } = recoilPersist()

export const authTokenAtom = atom({
    key: "authTokenAtom",
    default: null,
    effects_UNSTABLE: [persistAtom]
})

// export const isAuthenticated = selector({
//     key: "isAuthenticatedSelector",
//     get: ({ get }) => {
//         const token = get(authTokenAtom)
//         return token !== null
//     }
// })