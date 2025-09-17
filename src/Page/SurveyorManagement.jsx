import { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlusCircle,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { FaUsersCog } from "react-icons/fa";
import { getSurveyors } from "../API/index.js";
import CreateUserModal from "./CreateSurveyorForm.jsx";


export default function SurveyorManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [surveyors, setSurveyors] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 8;

  
  useEffect(() => {
    const fetchSurveyors = async () => {
      try {
        setLoading(true);
        const data = await getSurveyors();
        setSurveyors(data); 
      } catch (error) {
        console.error("Error fetching surveyors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveyors();
  }, []);


  const filteredSurveyors = surveyors.filter(
  (s) =>
    (s.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (s.email?.toLowerCase() || "").includes(search.toLowerCase())
);


  const totalPages = Math.ceil(filteredSurveyors.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentSurveyors = filteredSurveyors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) {
    return <p className="text-center py-6">Loading surveyors...</p>;
  }

  return (
    <div className="px-3 py-6">
      <h1 className="text-base font-semibold mb-3 flex items-center gap-2">
        <FaUsersCog className="text-xl" />
        Supervisor Management
      </h1>

    
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">All Surveyors</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded text-xs flex items-center gap-2"
        onClick={() => setIsModalOpen(true)}
        >
          <FiPlusCircle className="text-xs" />
          Create Surveyor
        </button>
      </div>

      
      <div className="relative my-4">
        <input
          type="text"
          placeholder="Search surveyors..."
          className="w-full pl-4 pr-10 py-2 border border-gray-100 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
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
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {currentSurveyors.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-3">{item.full_name}</td>
                <td className="px-4 py-3">{item.email}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3">{item.type}</td>
                <td className="px-4 py-3">{item.created_at}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Active"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-3 items-center">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FiEdit />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSurveyors.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4">
            No surveyors found.
          </p>
        )}
      </div>

   
      {filteredSurveyors.length > itemsPerPage && (
        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className={`p-2 rounded-full border ${
              page === 1
                ? "text-gray-400 border-gray-200"
                : "text-blue-600 border-blue-300 hover:bg-blue-100"
            }`}
          >
            <FiChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`p-2 rounded-full border ${
              page === totalPages
                ? "text-gray-400 border-gray-200"
                : "text-blue-600 border-blue-300 hover:bg-blue-100"
            }`}
          >
            <FiChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
       <CreateUserModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setUsers={setSurveyors}
        role="surveyor" 
      />
    </div>
  );
}
