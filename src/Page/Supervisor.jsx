import { useEffect, useState } from "react";
import { HiOutlineUsers, HiOutlineDocumentText } from "react-icons/hi2";
import CreateSupervisorModal from "./CreateSupervisorModal";
import { FiSearch, FiEdit, FiTrash2, FiPlusCircle } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";

const supervisors = [
  {
    name: "Jasin Saim",
    email: "amina@domain.com",
    phone: "0300-1234567",
    type: "Supervisor",
    joined: "2023-05-10",
    status: "Active",
  },
  {
    name: "Zain Raza",
    email: "zain@domain.com",
    phone: "0311-2223344",
    type: "Supervisor",
    joined: "2023-06-15",
    status: "Inactive",
  },
  {
    name: "Nadia Khan",
    email: "nadia@domain.com",
    phone: "0322-5566778",
    type: "Supervisor",
    joined: "2024-01-20",
    status: "Active",
  },
  {
    name: "Ali Khan",
    email: "ali@domain.com",
    phone: "0345-1122334",
    type: "Supervisor",
    joined: "2024-04-01",
    status: "Active",
  },
];

const surveyors = [
  {
    id: "SR101",
    name: "Charlie Brown",
    email: "charlie@surveywise.com",
    phone: "0301-8888888",
    type: "Surveyor",
    joined: "2024-02-12",
    status: "Active",
  },
  {
    id: "SR102",
    name: "Diana Prince",
    email: "diana@surveywise.com",
    phone: "0309-9999999",
    type: "Surveyor",
    joined: "2024-03-05",
    status: "Inactive",
  },
];

export default function Supervisor() {
  const [activeTab, setActiveTab] = useState("Supervisors");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const filteredData = (activeTab === "Supervisors" ? supervisors : surveyors).filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const handleEdit = (item) => {
    console.log("Edit clicked for:", item);
  };

  const handleDelete = (item) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${item.name}?`);
    if (confirmDelete) {
      console.log("Deleted:", item);
    }
  };

  return (
    <div className="px-3 py-6">
      <div className="flex items-center gap-3">
        <FaUsersCog className="text-2xl mb-3 text-blue-600" />
        <h1 className="text-base font-semibold mb-3"> Supervisor & Surveyor Management</h1>
      </div>
     

      <div className="grid grid-cols-1 w-[50%] sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">{supervisors.length}</h2>
              <p className="text-base font-medium text-blue-600">Total Supervisors</p>
              <p className="text-xs text-gray-500 mt-1">in your system</p>
            </div>
            <div className="bg-indigo-100 rounded-full p-1">
              <HiOutlineUsers className="text-4xl text-indigo-600 p-2" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">{surveyors.length}</h2>
              <p className="text-base font-medium text-blue-600">Total Surveyors</p>
              <p className="text-xs text-gray-500 mt-1">in your team</p>
            </div>
            <div className="bg-indigo-100 rounded-full p-1">
              <HiOutlineDocumentText className="text-4xl text-indigo-600 p-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b mb-4">
        {["Supervisors", "Surveyors"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">
          {activeTab === "Supervisors" ? "All Supervisors" : "All Surveyors"}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded text-xs flex items-center gap-2"
        >
          <span className="text-xs"><FiPlusCircle/></span>{" "}
          {activeTab === "Supervisors" ? "Create Supervisor" : "Create Surveyor"}
        </button>
      </div>

      <div className="relative my-3">
        <input
          type="text"
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          className="w-full pl-4 pr-10 py-2 border border-gray-100 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute top-0 right-0 h-full">
          <button className="h-full px-3 bg-blue-600 hover:bg-blue-700 border-l border-gray-300 rounded-r flex items-center justify-center transition">
            <FiSearch className="text-white w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-left text-sm font-medium text-gray-600">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {paginatedData.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{item.joined}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 gap-4">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className={`p-2 rounded-full border transition ${
      currentPage === 1
        ? "text-gray-400 border-gray-200"
        : "text-blue-600 border-blue-300 hover:bg-blue-100"
    }`}
  >
    <FiChevronLeft className="w-3 h-3" />
  </button>
  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className={`p-2 rounded-full border transition ${
      currentPage === totalPages
        ? "text-gray-400 border-gray-200"
        : "text-blue-600 border-blue-300 hover:bg-blue-100"
    }`}
  >
    <FiChevronRight className="w-3 h-3" />
  </button>
</div>

      <CreateSupervisorModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        activeTab={activeTab}
      />
    </div>
  );
}
