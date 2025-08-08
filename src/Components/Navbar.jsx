import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserCircle, FaUsers, FaClipboardList, FaUserEdit, FaChartBar, FaHome } from "react-icons/fa";
import { MdCircleNotifications } from "react-icons/md";

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Navbar user data:", storedUser);
    setUser(storedUser);
  }, [location]);

 
  let page = {
    title: "Dashboard",
    icon: <FaHome className="text-[#1e1e60]" />
  };

  if (location.pathname === "/") {
    page = { title: "Dashboard", icon: <FaHome className="text-[#1e1e60]" /> };
  } else if (location.pathname === "/dashboard/supervisor") {
    page = { title: "Supervisor Management" };
  } else if (location.pathname === "/dashboard/consumer-details") {
    page = { title: "Consumer Details", icon: <FaUserEdit className="text-[#1e1e60]" /> };
  } else if (location.pathname === "/dashboard/survey-details") {
    page = { title: "Survey Details", icon: <FaClipboardList className="text-[#1e1e60]" /> };
  } else if (location.pathname === "/dashboard/ticket-status") {
    page = { title: "Ticket Status", icon: <FaChartBar className="text-[#1e1e60]" /> };
  } else if (location.pathname === "/dashboard/surveyor-management") {
    page = { title: "Surveyor Management", icon: <FaUsers className="text-[#1e1e60]" /> };
  }

  return (
    <header className="bg-[#F6F7FF] py-4 px-8 flex justify-between items-center">
      <nav className="flex items-center gap-8 text-sm font-medium">
        <div className="flex items-center gap-2 text-[#1e1e60] font-serif text-base font-bold">
          {page.icon}
          {page.title}
        </div>
      </nav>


      <div className="flex items-center gap-2 text-sm text-[#1e1e60]">
        <div className="relative w-8 h-8">
          <MdCircleNotifications
            size={22}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-[#1e1e60]"
          />
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <FaUserCircle size={18} />
          <span>{user?.email || "Sign In"}</span>
        </div>
      </div>
    </header>
  );
}
