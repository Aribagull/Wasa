import React, { useState } from "react";
import { createSupervisor } from "../API/index.js";

export default function CreateSupervisorModal({ isModalOpen, setIsModalOpen, activeAdmin }) {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSupervisor, setNewSupervisor] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone: "",
    status: "active",
    role_id: "9a9a41ca-4d6d-4827-949c-3f14f22c6aa5",
  });

  const handleCreate = async () => {
    setLoading(true);

    try {
      const { success, data } = await createSupervisor(newSupervisor);

      if (success) {
        const updatedSupervisor = {
          name: newSupervisor.full_name,
          email: newSupervisor.email,
          phone: newSupervisor.phone,
          status: newSupervisor.status,
          surveyors: [],
        };

        activeAdmin.supervisor = updatedSupervisor;
        setSupervisors([...supervisors, updatedSupervisor]);
        setIsModalOpen(false);

        setNewSupervisor({
          username: "",
          email: "",
          password: "",
          full_name: "",
          phone: "",
          status: "active",
          role_id: "9a9a41ca-4d6d-4827-949c-3f14f22c6aa5",
        });

        console.log("Supervisor successfully created.");
      } else {
        console.error("Failed to create supervisor:", data);
        alert(`Error: ${data.message || "User creation failed"}`);
      }
    } catch (error) {
      console.error("Network or server error:", error);
      alert("Network error while creating supervisor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[500px] max-w-full">
            <h3 className="text-lg font-semibold mb-4">Create Supervisor</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={newSupervisor.username}
                  onChange={(e) =>
                    setNewSupervisor({ ...newSupervisor, username: e.target.value })
                  }
                  className="border px-3 py-1 rounded w-full focus:border-blue-500 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={newSupervisor.full_name}
                  onChange={(e) =>
                    setNewSupervisor({ ...newSupervisor, full_name: e.target.value })
                  }
                  className="border px-3 py-1 rounded w-full focus:border-blue-500 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={newSupervisor.phone}
                  onChange={(e) =>
                    setNewSupervisor({ ...newSupervisor, phone: e.target.value })
                  }
                  className="border px-3 py-1 rounded w-full focus:border-blue-500 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newSupervisor.email}
                  onChange={(e) =>
                    setNewSupervisor({ ...newSupervisor, email: e.target.value })
                  }
                  className="border px-3 py-1 rounded w-full focus:border-blue-500 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={newSupervisor.password}
                  onChange={(e) =>
                    setNewSupervisor({ ...newSupervisor, password: e.target.value })
                  }
                  className="border px-3 py-1 rounded w-full focus:border-blue-500 focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={newSupervisor.status}
                  onChange={(e) =>
                    setNewSupervisor({ ...newSupervisor, status: e.target.value })
                  }
                  className="border px-3 py-1 rounded w-full focus:border-blue-500 focus:outline-none focus:ring-0"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

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
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
