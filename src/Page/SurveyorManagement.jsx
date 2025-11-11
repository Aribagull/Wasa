import { useState, useEffect } from "react";
import {
  FiSearch,
  FiPlusCircle,
  FiChevronLeft,
  FiChevronRight
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

  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setPage(1); // Reset page on resize
      if (window.innerWidth >= 1536) { 
        setItemsPerPage(20);
      } else {
        setItemsPerPage(8);
      }
    };

    updateItemsPerPage(); 
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchSurveyors = async () => {
      try {
        setLoading(true);
        const data = await getSurveyors();
        const sortedData = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setSurveyors(sortedData);
      } catch (error) {
        console.error("Error fetching surveyors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveyors();
  }, []);

  const handleAddSurveyor = (newSurveyor) => {
    setSurveyors((prev) => [newSurveyor, ...prev]);
  };

  const filteredSurveyors = surveyors.filter(
    (s) =>
      (s.full_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSurveyors.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentSurveyors = filteredSurveyors.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="px-3 py-6">
      <h1 className="text-base font-semibold mb-3 flex items-center gap-2 
                     2xl:text-2xl 3xl:text-3xl">
        <FaUsersCog className="text-xl 2xl:text-2xl 3xl:text-3xl" />
        Surveyor Management
      </h1>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold 2xl:text-xl 3xl:text-2xl">All Surveyors</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white 
                     px-3 py-2 2xl:px-5 2xl:py-3 3xl:px-6 3xl:py-4 
                     rounded text-xs 2xl:text-sm 3xl:text-base 
                     flex items-center gap-2 2xl:gap-3 3xl:gap-4"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlusCircle className="text-xs 2xl:text-sm 3xl:text-base" />
          Create Surveyor
        </button>
      </div>

      <div className="relative my-4">
        <input
          type="text"
          placeholder="Search surveyors..."
          className="w-full pl-4 pr-4 py-2 border border-gray-100 rounded 
                     text-sm 2xl:text-base 3xl:text-lg 
                     focus:outline-none focus:ring-1 focus:ring-blue-500
                     2xl:py-3 3xl:py-4"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="bg-white overflow-x-auto">
        <table className="min-w-full">
          <thead className="text-left text-sm font-medium text-gray-600 
                            2xl:text-lg 3xl:text-xl">
            <tr>
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Phone</th>
              <th className="py-4 px-4">Joined Date</th>
              <th className="py-4 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700 2xl:text-base 3xl:text-lg">
            {currentSurveyors.map((item) => (
              <tr key={item.user_id} className="border-t">
                <td className="px-4 py-3 2xl:py-4 3xl:py-5">{item.full_name}</td>
                <td className="px-4 py-3 2xl:py-4 3xl:py-5">{item.email}</td>
                <td className="px-4 py-3 2xl:py-4 3xl:py-5">{item.phone}</td>
                <td className="px-4 py-3 2xl:py-4 3xl:py-5">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 2xl:py-4 3xl:py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium 
                                2xl:text-sm 3xl:text-base
                      ${
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

        {filteredSurveyors.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-4 
                        2xl:text-base 3xl:text-lg">
            No surveyors found.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-4">
          <button
            onClick={() => page > 1 && setPage(page - 1)}
            disabled={page === 1}
            className={`p-3 2xl:p-4 3xl:p-5 rounded-full border 
              ${page === 1
                ? "text-black bg-gray-300 border-gray-200"
                : "text-white bg-blue-500 border-blue-500 hover:bg-blue-600"
              }`}
          >
            <FiChevronLeft className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
          </button>
          <button
            onClick={() => page < totalPages && setPage(page + 1)}
            disabled={page === totalPages}
            className={`p-3 2xl:p-4 3xl:p-5 rounded-full border 
              ${page === totalPages
                ? "text-black bg-gray-300 border-gray-200"
                : "text-white bg-blue-500 border-blue-500 hover:bg-blue-600"
              }`}
          >
            <FiChevronRight className="w-4 h-4 2xl:w-5 2xl:h-5 3xl:w-6 3xl:h-6" />
          </button>
        </div>
      )}

      <CreateUserModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setUsers={handleAddSurveyor}  
        role="surveyor"
      />
    </div>
  );
}
