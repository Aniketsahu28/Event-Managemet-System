import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeskNavbar from './components/DeskNavbar'
import MobileNavbar from './components/MobileNavbar'
import { useRecoilValue } from 'recoil';
import { themeAtom } from './store/themeAtom';
import { isAuthenticated } from './store/userAtom';
import Events from "./pages/Events"
import Organizers from "./pages/Organizers"
import Login from './pages/Login';
import Footer from './components/Footer';
import AddNewEvent from './pages/AddNewEvent';
import Profile from './pages/Profile'

function App() {
  const currentTheme = useRecoilValue(themeAtom);
  const isUserAuthenticated = useRecoilValue(isAuthenticated)
  return (
    <Router>
      <div className={`pt-3 sm:pt-5 w-full ${currentTheme === "light" ? "bg-white" : "bg-black"} min-h-[100vh]`} id='appTop'>
        <span className='block md:hidden'><MobileNavbar /></span>
        <span className='hidden md:block'><DeskNavbar /></span>
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events" element={<Events />} />
          <Route path="/organizers" element={<Organizers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addevent" element={<AddNewEvent />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
