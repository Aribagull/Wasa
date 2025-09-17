import { useState, useEffect } from 'react';
import { GoHomeFill } from "react-icons/go";
import { MdSupervisorAccount } from "react-icons/md";
import { BiSolidDetail } from "react-icons/bi";
import { CheckCircle } from 'lucide-react';
import { TiTicket } from "react-icons/ti";
import { IoIosLogOut } from "react-icons/io";
import { FaAnglesRight, FaAnglesLeft  } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../Assets/Logo/wasa-logo.png';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); 
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser?.role) {
    setUserRole(storedUser.role); 
  }
}, []);


  const handleLogout = () => {
    localStorage.removeItem('user'); 
    navigate('/'); 
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-[80px]' : 'w-[220px]'
      } transition-all duration-300 min-h-screen bg-[#FCFBFF] flex flex-col justify-between`}
    >
      <div>
        <div className="flex justify-end p-2">
          <button
            className="p-2 hover:rounded-md hover:bg-blue-100 transition"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <FaAnglesRight size={16} className="text-blue-500" />
            ) : (
              <FaAnglesLeft  size={16} className="text-blue-500" />
            )}
          </button>
        </div>

        <div className="p-4 flex items-center gap-5">
          <img
            src={logo}
            alt="Logo"
            className={`transition-all duration-300 ${collapsed ? 'w-12 h-12' : 'w-16 h-16'}`}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
            }`}
          >
            <div className="font-serif text-center">
              <h3>Wasa</h3>
              <p className="text-sm">Rawalpindi</p>
            </div>
          </div>
        </div>

        <div className="px-2 mt-4 space-y-4 text-sm">
          <MenuItem
            icon={<GoHomeFill size={18} />}
            label="Dashboard"
            to="/dashboard"
            collapsed={collapsed}
            active={location.pathname === '/dashboard'}
          />

       
          {(userRole === 'admin' || userRole === 'Super Admin') && (
  <MenuItem
    icon={<MdSupervisorAccount size={18} />}
    label="Supervisor Management"
    to="/dashboard/supervisor"
    collapsed={collapsed}
    active={location.pathname === '/dashboard/supervisor'}
  />
)}


          
          {userRole === 'Supervisor' && (
            <MenuItem
              icon={<MdSupervisorAccount size={18} />}
              label="Surveyor Management"
              to="/dashboard/surveyor-management"
              collapsed={collapsed}
              active={location.pathname === '/dashboard/surveyor-management'}
            />
          )}

          <MenuItem
            icon={<BiSolidDetail size={18} />}
            label="Consumer Details"
            to="/dashboard/consumer-details"
            collapsed={collapsed}
            active={location.pathname === '/dashboard/consumer-details'}
          />

          <MenuItem
            icon={<CheckCircle size={18} />}
            label="Survey Details"
            to="/dashboard/survey-details"
            collapsed={collapsed}
            active={location.pathname === '/dashboard/survey-details'}
          />

          <MenuItem
            icon={<TiTicket size={18} />}
            label="Ticket Status"
            to="/dashboard/ticket-status"
            collapsed={collapsed}
            active={location.pathname === '/dashboard/ticket-status'}
          />
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={handleLogout} 
          className="w-full flex items-center justify-center gap-6 py-2 bg-blue-600 text-white hover:text-gray-200 hover:bg-blue-800 rounded-lg text-sm font-medium shadow transition"
        >
          <div
            className={`overflow-hidden transition-all duration-300 ${
              collapsed ? 'max-w-0 opacity-0' : 'max-w-[100px] opacity-100'
            }`}
          >
            <span>Logout</span>
          </div>
          <IoIosLogOut size={18} />
        </button>
      </div>
    </aside>
  );
}

function MenuItem({ icon, label, to, active, collapsed }) {
  return (
    <Link
      to={to}
      className={`flex items-center p-3 rounded cursor-pointer transition-all
        ${active ? 'text-blue-600 border-r-4 border-blue-600 bg-[#eff3ff]' : 'hover:text-blue-600'}
        ${collapsed ? 'justify-center' : 'gap-3'}`}
    >
      {icon}
      <div className="overflow-hidden">
        <span
          className={`inline-block whitespace-nowrap transition-all duration-300 ${
            collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[200px] ml-2'
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}
