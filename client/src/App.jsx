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
import ProtectiveRoutes from './components/ProtectiveRoutes';
import EventDetails from './pages/EventDetails';
import OrganizerDetails from './pages/OrganizerDetails';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast'
import AdminPanel from './pages/AdminPanel';
import AddNewApproval from './pages/AddNewApproval';
import Approvals from './pages/Approvals';
import Signup from './pages/Signup';

function App() {
  const currentTheme = useRecoilValue(themeAtom);
  return (
    <Router>
      <div className={`pt-3 sm:pt-5 w-full ${currentTheme === "light" ? "bg-white" : "bg-black"} min-h-[100vh]`} id='appTop'>
        <ScrollToTop />
        <Toaster />
        <span className='block md:hidden'><MobileNavbar /></span>
        <span className='hidden md:block'><DeskNavbar /></span>
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/organizers" element={<Organizers />} />
          <Route path="/organizers/:id" element={<OrganizerDetails />} />
          <Route path="/profile" element={<ProtectiveRoutes><Profile /></ProtectiveRoutes>} />
          <Route path="/approvals" element={<ProtectiveRoutes><Approvals /></ProtectiveRoutes>} />
          <Route path="/addevent" element={<ProtectiveRoutes><AddNewEvent /></ProtectiveRoutes>} />
          <Route path="/addapproval" element={<ProtectiveRoutes><AddNewApproval /></ProtectiveRoutes>} />
          <Route path="/adminpanel" element={<ProtectiveRoutes><AdminPanel /></ProtectiveRoutes>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
