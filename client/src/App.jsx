import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DeskNavbar from './components/DeskNavbar'
import MobileNavbar from './components/MobileNavbar'
import { useRecoilValue } from 'recoil';
import { themeAtom } from './store/themeAtom';
import Events from "./pages/Events"
import Organizers from "./pages/Organizers"
import Login from './pages/Login';

function App() {
  const currentTheme = useRecoilValue(themeAtom);
  return (
    <div className={`py-[12px] px-[16px] sm:py-[20px] sm:px-[60px] w-full ${currentTheme === "light" ? "bg-white" : "bg-black"} min-h-[100vh]`}>
      <Router>
        <span className='block md:hidden'><MobileNavbar /></span>
        <span className='hidden md:block'><DeskNavbar /></span>
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events" element={<Events />} />
          <Route path="/organizers" element={<Organizers />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
