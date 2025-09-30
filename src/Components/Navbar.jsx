import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaUsers,
  FaClipboardList,
  FaUserEdit,
  FaChartBar,
  FaHome,
} from "react-icons/fa";
import { MdCircleNotifications } from "react-icons/md";

export default function Navbar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  let page = {
    title: "Dashboard",
    icon: <FaHome className="text-[#1e1e60]" />,
  };

  if (location.pathname === "/") {
    page = { title: "Dashboard", icon: <FaHome className="text-[#1e1e60]" /> };
  } else if (location.pathname === "/dashboard/supervisor") {
    page = { title: "Supervisor Management" };
  } else if (location.pathname === "/dashboard/consumer-details") {
    page = {
      title: "Consumer Details",
      icon: <FaUserEdit className="text-[#1e1e60]" />,
    };
  } else if (location.pathname === "/dashboard/survey-details") {
    page = {
      title: "Survey Details",
      icon: <FaClipboardList className="text-[#1e1e60]" />,
    };
  } else if (location.pathname === "/dashboard/ticket-status") {
    page = {
      title: "Ticket Status",
      icon: <FaChartBar className="text-[#1e1e60]" />,
    };
  } else if (location.pathname === "/dashboard/surveyor-management") {
    page = {
      title: "Surveyor Management",
      icon: <FaUsers className="text-[#1e1e60]" />,
    };
  }

  return (
    <header className="bg-[#F6F7FF] py-4 px-8 2xl:py-5 3xl:py-6 2xl:px-10 3xl:px-14 flex justify-between items-center">
  
      <nav className="flex items-center gap-6 2xl:gap-8 3xl:gap-10 text-base 2xl:text-xl 3xl:text-2xl font-medium">
        <div className="flex items-center gap-2 2xl:gap-3 3xl:gap-4 text-[#1e1e60] font-serif font-bold">
          {page.icon && (
            <span className="text-xl 2xl:text-3xl 3xl:text-4xl">
              {page.icon}
            </span>
          )}
          {page.title}
        </div>
      </nav>

    
      <div className="flex items-center gap-3 2xl:gap-5 3xl:gap-6 text-base 2xl:text-xl 3xl:text-2xl text-[#1e1e60]">
        <div className="relative">
          <MdCircleNotifications className="text-xl 2xl:text-3xl 3xl:text-4xl text-[#1e1e60]" />
        </div>
        <div className="flex items-center gap-2 2xl:gap-3 3xl:gap-4 cursor-pointer hover:opacity-80 transition">
          <FaUserCircle className="text-lg 2xl:text-3xl 3xl:text-4xl" />
          <span>{user?.email || "Sign In"}</span>
        </div>
      </div>
    </header>
  );
}
