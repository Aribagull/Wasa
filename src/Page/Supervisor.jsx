import { useEffect, useState } from "react";
import { HiOutlineUsers, HiOutlineDocumentText } from "react-icons/hi2";
import CreateSupervisorModal from "./CreateSupervisorModal";
import { FiSearch, FiPlusCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
import { getSupervisors, getSurveyors } from "../API/index.js";
import CreateUserModal from "./CreateSurveyorForm.jsx";

export default function Supervisor() {
  const [activeTab, setActiveTab] = useState("Supervisors");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [supervisors, setSupervisors] = useState([]);
  const [surveyors, setSurveyors] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === "Supervisors") {
          const data = await getSupervisors();
          const sortedSupervisors = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setSupervisors(sortedSupervisors);
        } else {
          const data = await getSurveyors();
          const sortedSurveyors = data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setSurveyors(sortedSurveyors);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const filteredData = (activeTab === "Supervisors" ? supervisors : surveyors).filter(
    (item) =>
      item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  return (
    <div className="px-3 py-6">
 
      <div className="flex items-center gap-3">
        <FaUsersCog className="text-2xl 2xl:text-4xl mb-3 text-blue-600" />
        <h1 className="text-base 2xl:text-2xl font-semibold mb-3">
          Supervisor & Surveyor Management
        </h1>
      </div>

      <div className="grid grid-cols-1 w-[50%] sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-4 2xl:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl 2xl:text-5xl font-bold">{supervisors.length}</h2>
              <p className="text-base 2xl:text-xl font-medium text-blue-600">Total Supervisors</p>
              <p className="text-xs 2xl:text-lg text-gray-500 mt-1">in your system</p>
            </div>
            <div className="bg-indigo-100 rounded-full p-1">
              <HiOutlineUsers className="text-4xl 2xl:text-6xl text-indigo-600 p-2" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 2xl:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl 2xl:text-5xl font-bold">{surveyors.length}</h2>
              <p className="text-base 2xl:text-xl font-medium text-blue-600">Total Surveyors</p>
              <p className="text-xs 2xl:text-lg text-gray-500 mt-1">in your team</p>
            </div>
            <div className="bg-indigo-100 rounded-full p-1">
              <HiOutlineDocumentText className="text-4xl 2xl:text-6xl text-indigo-600 p-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b mb-4">
        {["Supervisors", "Surveyors"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm 2xl:text-lg font-medium ${
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
        <h2 className="text-lg 2xl:text-2xl font-semibold">
          {activeTab === "Supervisors" ? "All Supervisors" : "All Surveyors"}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 2xl:px-4 2xl:py-3 rounded text-xs 2xl:text-lg flex items-center gap-2"
        >
          <span className="text-xs 2xl:text-lg">
            <FiPlusCircle />
          </span>{" "}
          {activeTab === "Supervisors" ? "Create Supervisor" : "Create Surveyor"}
        </button>
      </div>

      
      <div className="relative my-3">
        <input
          type="text"
          placeholder={`Search ${activeTab.toLowerCase()}...`}
          className="w-full pl-4 pr-10 py-2 2xl:py-3 border border-gray-100 rounded text-sm 2xl:text-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
         <div className="absolute top-0 right-0 h-full">
          <button className="h-full px-3 bg-blue-600 hover:bg-blue-700 border-l border-gray-300 rounded-r flex items-center justify-center transition
                       2xl:px-5 2xl:h-full 3xl:px-6 3xl:h-full">
            <FiSearch className="text-white w-4 h-4 2xl:w-6 2xl:h-6 3xl:w-7 3xl:h-7" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center py-6 text-gray-500 2xl:text-xl">Loading...</p>
      ) : (
        <div className="bg-white overflow-x-auto">
          <table className="min-w-full">
            <thead className="text-left text-sm 2xl:text-lg font-medium text-gray-600">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm 2xl:text-lg text-gray-700">
              {paginatedData.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3">{item.full_name}</td>
                  <td className="px-4 py-3">{item.email}</td>
                  <td className="px-4 py-3">{item.phone}</td>
                  <td className="px-4 py-3">{item.role_id}</td>
                  <td className="px-4 py-3">{item.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs 2xl:text-base font-medium ${
                        item.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end mt-4 gap-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-full border transition ${
            currentPage === 1
              ? "text-black bg-gray-300 border-gray-200"
              : "text-white bg-blue-500 border-blue-500 hover:bg-blue-600"
          }`}
        >
          <FiChevronLeft className="w-3 h-3 2xl:w-5 2xl:h-5" />
        </button>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full border transition ${
            currentPage === totalPages
              ? "text-black bg-gray-300 border-gray-200"
              : "text-white bg-blue-500 border-blue-500 hover:bg-blue-600"
          }`}
        >
          <FiChevronRight className="w-3 h-3 2xl:w-5 2xl:h-5" />
        </button>
      </div>

      {activeTab === "Supervisors" ? (
        <CreateSupervisorModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setUsers={(newUser) => setSupervisors((prev) => [newUser, ...prev])}
        />
      ) : (
        <CreateUserModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setUsers={(newUser) => setSurveyors((prev) => [newUser, ...prev])}
          role="surveyor"
        />
      )}
    </div>
  );
}
