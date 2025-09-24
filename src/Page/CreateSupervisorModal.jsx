import React, { useState, useEffect } from "react";
import { createSupervisor } from "../API/index.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function CreateSupervisorModal({ isModalOpen, setIsModalOpen, setUsers }) {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showPassword, setShowPassword] = useState(false);

  const SUPERVISOR_ROLE_ID = "9a9a41ca-4d6d-4827-949c-3f14f22c6aa5";

  const [newSupervisor, setNewSupervisor] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    status: "active",
    role_id: SUPERVISOR_ROLE_ID,
  });

  const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
  const isPhoneValid = (phone) => /^\d{11}$/.test(phone);

  const isFormValid = () => {
    return (
      newSupervisor.full_name.trim() !== "" &&
      isPhoneValid(newSupervisor.phone) &&
      isEmailValid(newSupervisor.email) &&
      newSupervisor.password.trim() !== ""
    );
  };

  const handleCreate = async () => {
    if (!isFormValid()) {
      setToastMessage("Please correct the form fields.");
      setToastType("error");
      return;
    }

    setLoading(true);
    try {
      const response = await createSupervisor(newSupervisor);
      const data = response.data;

      if (data && data.success) {
        const updatedSupervisor = {
          ...newSupervisor,
          id: data.user_id,
          created_at: new Date().toISOString(),
        };

        // update parent state
        setUsers((prev) => [...prev, updatedSupervisor]);

        setToastMessage(data.message || "Supervisor created successfully!");
        setToastType("success");

        // reset form
        setNewSupervisor({
          username: "",
          email: "",
          password: "",
          full_name: "",
          phone: "",
          status: "active",
          role_id: SUPERVISOR_ROLE_ID,
        });

        setIsModalOpen(false);
      } else {
        setToastMessage(data?.message || "Supervisor creation failed.");
        setToastType("error");
      }
    } catch (error) {
      console.error("Create Supervisor Error:", error);
      setToastMessage("Network error while creating supervisor.");
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

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[500px] max-w-full relative">
        {/* Close */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg font-bold"
        >
          ×
        </button>

        <h3 className="text-lg font-semibold mb-4">Create Supervisor</h3>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="supervisor01"
              value={newSupervisor.username}
              onChange={(e) =>
                setNewSupervisor({ ...newSupervisor, username: e.target.value })
              }
              className="border px-3 py-1 rounded w-full focus:outline-none text-sm"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={newSupervisor.full_name}
              onChange={(e) =>
                setNewSupervisor({ ...newSupervisor, full_name: e.target.value })
              }
              className="border px-3 py-1 rounded w-full focus:outline-none text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              placeholder="03001234567"
              value={newSupervisor.phone}
              onChange={(e) =>
                setNewSupervisor({ ...newSupervisor, phone: e.target.value })
              }
              className={`border px-3 py-1 rounded w-full focus:outline-none text-sm ${
                newSupervisor.phone && !isPhoneValid(newSupervisor.phone)
                  ? "border-red-500"
                  : "focus:border-blue-500"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={newSupervisor.email}
              onChange={(e) =>
                setNewSupervisor({ ...newSupervisor, email: e.target.value })
              }
              className={`border px-3 py-1 rounded w-full focus:outline-none text-sm ${
                newSupervisor.email && !isEmailValid(newSupervisor.email)
                  ? "border-red-500"
                  : "focus:border-blue-500"
              }`}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={newSupervisor.password}
                onChange={(e) =>
                  setNewSupervisor({ ...newSupervisor, password: e.target.value })
                }
                className="border px-3 py-1 rounded w-full focus:outline-none text-sm"
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={newSupervisor.status}
              onChange={(e) =>
                setNewSupervisor({ ...newSupervisor, status: e.target.value })
              }
              className="border px-3 py-1 rounded w-full focus:outline-none text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className={`px-4 py-2 rounded text-white ${
              isFormValid()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={loading || !isFormValid()}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div
            className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${
              toastType === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
