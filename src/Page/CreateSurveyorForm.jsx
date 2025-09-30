import React, { useState, useEffect } from "react"; 
import { createSupervisor, getSurveyors } from "../API/index.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function CreateUserModal({ isModalOpen, setIsModalOpen, setUsers, role }) {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); 
  const [toastType, setToastType] = useState("success"); 
  const [showPassword, setShowPassword] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1536); 

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    status: "active",
    role_id: role === "supervisor" 
      ? "9a9a41ca-4d6d-4827-949c-3f14f22c6aa5" 
      : "882e8ff3-8062-443d-9ea5-09649a0d79b1",
  });


  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1536);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPhoneValid = (phone) => /^\d{11}$/.test(phone);
  const isFormValid = () =>
    newUser.full_name.trim() !== "" &&
    isPhoneValid(newUser.phone) &&
    isEmailValid(newUser.email) &&
    newUser.password.trim() !== "";

  const handleCreate = async () => {
    if (!isFormValid()) {
      setToastMessage("Please correct the form fields.");
      setToastType("error");
      return;
    }
    setLoading(true);
     try {
    const response = await createSupervisor(newUser);
    const { data, status } = response;
    if (data.success && (status === 200 || status === 201)) {
  setUsers({
    id: data.user_id,
    username: newUser.username,
    full_name: newUser.full_name,
    email: newUser.email,
    phone: newUser.phone,
    status: newUser.status,
    role_id: newUser.role_id,
    created_at: new Date().toISOString(), 
  });

  setToastMessage(`${role.charAt(0).toUpperCase() + role.slice(1)} created successfully!`);
  setToastType("success");
  setNewUser({ username: "", email: "", password: "", full_name: "", phone: "", status: "active", role_id: newUser.role_id });
  setIsModalOpen(false);
} else {
      setToastMessage(data.message || "User creation failed.");
      setToastType("error");
    }
  } catch (error) {
    console.error("Create User Error:", error);
    setToastMessage("Network error while creating user.");
    setToastType("error");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
         onClick={() => setIsModalOpen(false)}
         >
          
          <div
            className={`bg-white rounded shadow-lg relative max-w-full ${
              isLargeScreen ? "w-[800px] p-10" : "w-[500px] p-6"
            }`}
             onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-2 right-2 font-bold text-gray-500 hover:text-gray-800 ${
                isLargeScreen ? "text-2xl" : "text-lg"
              }`}
            >
              ×
            </button>

            <h3 className={`mb-4 font-semibold ${isLargeScreen ? "text-2xl" : "text-lg"}`}>
              Create {role.charAt(0).toUpperCase() + role.slice(1)}
            </h3>

            <div className={`grid grid-cols-2 gap-4 mb-4 ${isLargeScreen ? "gap-6" : ""}`}>
              <div>
                <label className={`block mb-1 font-medium ${isLargeScreen ? "text-lg" : "text-sm"}`}>Username</label>
                <input
                  type="text"
                  placeholder="surveyor01"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className={`border rounded w-full px-3 ${isLargeScreen ? "py-3 text-lg" : "py-1 text-sm"} focus:outline-none focus:border-blue-500`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isLargeScreen ? "text-lg" : "text-sm"}`}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  className={`border rounded w-full px-3 ${isLargeScreen ? "py-3 text-lg" : "py-1 text-sm"} focus:outline-none focus:border-blue-500`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isLargeScreen ? "text-lg" : "text-sm"}`}>Phone</label>
                <input
                  type="text"
                  placeholder="03001234567"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className={`border rounded w-full px-3 ${isLargeScreen ? "py-3 text-lg" : "py-1 text-sm"} focus:outline-none ${
                    newUser.phone && !isPhoneValid(newUser.phone) ? "border-red-500" : "focus:border-blue-500"
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isLargeScreen ? "text-lg" : "text-sm"}`}>Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className={`border rounded w-full px-3 ${isLargeScreen ? "py-3 text-lg" : "py-1 text-sm"} focus:outline-none ${
                    newUser.email && !isEmailValid(newUser.email) ? "border-red-500" : "focus:border-blue-500"
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isLargeScreen ? "text-lg" : "text-sm"}`}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className={`border rounded w-full px-3 ${isLargeScreen ? "py-3 text-lg" : "py-1 text-sm"} focus:outline-none focus:border-blue-500`}
                  />
                  <span
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500 ${
                      isLargeScreen ? "text-xl" : "text-base"
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-medium ${isLargeScreen ? "text-lg" : "text-sm"}`}>Status</label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                  className={`border rounded w-full px-3 ${isLargeScreen ? "py-3 text-lg" : "py-1 text-sm"} focus:outline-none focus:border-blue-500`}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className={`flex justify-between gap-2 ${isLargeScreen ? "mt-6" : ""}`}>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-4 rounded ${isLargeScreen ? "py-3 text-lg" : "py-2 text-sm"} bg-gray-200 hover:bg-gray-300`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className={`px-4 rounded ${isLargeScreen ? "py-3 text-lg" : "py-2 text-sm"} text-white ${
                  isFormValid() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={loading || !isFormValid()}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>

            {toastMessage && (
              <div
                className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${
                  toastType === "success" ? "bg-green-500" : "bg-red-500"
                } ${isLargeScreen ? "text-lg" : "text-sm"}`}
              >
                {toastMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
