import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import ApprovalAction from "./SurveyAction";
import "../Page/UserTable.css";
import { getAllSurveys } from "../API/index.js";

export default function SurveyDetails() {
  const tableRef = useRef(null);
  const tableInstance = useRef(null);
  const [filters, setFilters] = useState({ category: "", status: "", ward: "", uc: "" });
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1536);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1536);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Null-safe mapping function
  const mapSurveyEntry = (entry) => {
    const consumer = entry?.consumer || {};
    const property = entry?.property || {};
    const connection = entry?.connection || {};
    const survey = entry?.survey || {};
    const supervisor = survey?.supervisor || {};
    const surveyor = survey?.surveyor || {};

    return {
      old_code: consumer.old_code || "",
      cid: consumer.consumer_code || connection.consumer_id || "",
      name: consumer.full_name || surveyor.full_name || supervisor.full_name || "",
      cnic: consumer.cnic || surveyor.cnic || supervisor.cnic || "",
      uc: property.uc || survey.uc || "",
      status: property.status?.toLowerCase() === "legal" ? "Legal" : "Illegal",
      zone: property.zone || survey.zone || "",
      category: property.category?.toLowerCase() === "commercial" ? "Commercial" : "Domestic",
      ward: property.ward || survey.ward || "",
      water_unit: connection.water_unit || "",
      fullData: entry,
      releaseReason: "",
      surveyedAt: survey.surveyed_at || entry.created_at || null,
    };
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAllSurveys();
        const data = res?.data || [];
        const mappedFull = data.map(mapSurveyEntry);
        mappedFull.sort((a, b) => new Date(b.surveyedAt || 0) - new Date(a.surveyedAt || 0));
        setTableData(mappedFull);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    const columnMap = { category: 6, status: 5, uc: 8, ward: 9 };
    const columnIndex = columnMap[name];
    tableInstance.current
      ?.column(columnIndex)
      .search(value ? "^" + value + "$" : "", true, false)
      .draw();
  };

  const handleDateRangeFilter = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => {
      const updated = { ...prev, [name]: value };
      $.fn.dataTable.ext.search = [];

      if (updated.fromDate || updated.toDate) {
        $.fn.dataTable.ext.search.push(function (settings, data) {
          const dateColumn = data[11]; // Surveyed At column
          if (!dateColumn || dateColumn === "N/A") return true;
          const rowDate = new Date(dateColumn);
          const from = updated.fromDate ? new Date(updated.fromDate) : null;
          const to = updated.toDate ? new Date(updated.toDate) : null;
          if (to) to.setHours(23, 59, 59, 999);

          if (from && to) return rowDate >= from && rowDate <= to;
          if (from) return rowDate >= from;
          if (to) return rowDate <= to;
          return true;
        });
      }

      tableInstance.current?.draw();
      return updated;
    });
  };

  const handleClearFilters = () => {
    setFilters({ category: "", status: "", uc: "", ward: "" });
    const columnMap = { category: 6, status: 5, uc: 8, ward: 9 };
    Object.values(columnMap).forEach((index) => {
      tableInstance.current?.column(index).search("").draw();
    });
    setDateRange({ fromDate: "", toDate: "" });
    document.querySelector('input[name="fromDate"]').value = "";
    document.querySelector('input[name="toDate"]').value = "";
    $.fn.dataTable.ext.search = [];
    tableInstance.current?.draw();
  };

  const saveTicketToLocalStorage = (ticket) => {
    const existing = JSON.parse(localStorage.getItem("tickets") || "[]");
    const updated = [...existing.filter((t) => t.cid !== ticket.cid), ticket];
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  // Initialize DataTable
  useEffect(() => {
    if (!tableData.length) return;

    const $table = $(tableRef.current);

    if ($.fn.dataTable.isDataTable($table)) {
      $table.DataTable().destroy();
    }

    tableInstance.current = $table.DataTable({
      data: tableData,
      columns: [
        { title: "#", data: null, render: (data, type, row, meta) => meta.row + 1 },
        { title: "Old Consumer Code", data: "old_code" },
        { title: "Consumer ID", data: "cid" },
        { title: "Name", data: "name" },
        { title: "CNIC", data: "cnic" },
        { title: "Status", data: "status" },
        { title: "Category", data: "category" },
        { title: "Zone", data: "zone" },
        { title: "UC", data: "uc" },
        { title: "Ward", data: "ward" },
        { title: "Water Unit", data: "water_unit" },
        {
          title: "Surveyed At",
          data: "surveyedAt",
          render: (data) => (data ? new Date(data).toLocaleString() : "N/A"),
        },
        {
          title: "Action",
          data: "cid",
          orderable: false,
          render: (data, type, row) =>
            `<button class="view-btn text-black hover:text-blue-800" data-cid="${row.cid}">
              <i class="fa-regular fa-eye" style="font-size: ${isLargeScreen ? "18px" : "10px"};"></i>
            </button>`,
        },
      ],
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: false,
      pageLength: isLargeScreen ? 25 : 10,
      createdRow: function (row) {
        if (isLargeScreen) $(row).css("font-size", "1.125rem");
      },
    });

    // Attach click handler on draw
    const attachClick = () => {
      $table.find(".view-btn").off("click").on("click", function () {
        const cid = $(this).data("cid");
        const row = tableData.find((r) => r.cid === cid);
        if (row) {
          setSelectedRow(row.fullData);
          setIsModalOpen(true);
        }
      });
    };

    attachClick();
    $table.on("draw.dt", attachClick);

    return () => {
      $table.off("draw.dt");
      $table.find(".view-btn").off("click");
    };
  }, [tableData, isLargeScreen]);

  const handleUpdateStatus = (id, newStatus, reason, resultData, toastMessage) => {
    setTableData((prev) => {
      const updated = [...prev];
      const rowIndex = updated.findIndex((r) => r.cid === id);
      if (rowIndex !== -1 && id) {
        updated[rowIndex].status = newStatus;
        if (newStatus === "Released") updated[rowIndex].releaseReason = reason;

        const fullEntry = {
          id,
          cid: updated[rowIndex].cid,
          status: newStatus,
          releaseReason: updated[rowIndex].releaseReason || "",
          ...updated[rowIndex].fullData,
        };

        saveTicketToLocalStorage(fullEntry);

        const rowNode = tableInstance.current
          .rows()
          .indexes()
          .toArray()
          .find((i) => tableInstance.current.row(i).data().cid === id);
        if (rowNode !== undefined) {
          tableInstance.current.row(rowNode).data(updated[rowIndex]).draw(false);
        }
      }
      return updated;
    });

    if (toastMessage) {
      setToast(toastMessage);
      setTimeout(() => setToast(""), 3000);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="px-4 py-2">
      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {["category", "status", "ward", "uc"].map((field) => (
          <select
            key={field}
            name={field}
            value={filters[field]}
            onChange={handleFilterChange}
            className={`border rounded px-3 py-1 text-sm bg-transparent ${
              isLargeScreen ? "text-lg 2xl:text-xl" : ""
            }`}
          >
            <option value="">{field.charAt(0).toUpperCase() + field.slice(1)}</option>
            {[...new Set(tableData.map((d) => d[field]).filter((v) => v && v.toString().trim() !== ""))]
              .sort()
              .map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
          </select>
        ))}

        {/* Date range */}
        <div className="flex items-center gap-2 border rounded px-3 py-1 bg-white">
          <label className="text-gray-600 text-sm font-medium">Date Range:</label>
          <input
            type="date"
            name="fromDate"
            value={dateRange.fromDate}
            onChange={handleDateRangeFilter}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            name="toDate"
            value={dateRange.toDate}
            onChange={handleDateRangeFilter}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleClearFilters}
          className={`text-blue-600 py-1 rounded text-sm hover:text-blue-800 ${
            isLargeScreen ? "text-lg 2xl:text-xl" : ""
          }`}
        >
          Clear Filters
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto mt-4">
          <table
            ref={tableRef}
            className={`display w-full text-sm text-gray-700 ${
              isLargeScreen ? "text-lg 2xl:text-xl" : ""
            }`}
          ></table>
        </div>
      )}

      {/* Modal */}
      <ApprovalAction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        row={selectedRow}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 bg-green-100 text-black text-sm px-4 py-2 rounded shadow-lg animate-slide-in ${
            isLargeScreen ? "text-lg 2xl:text-xl" : ""
          }`}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
