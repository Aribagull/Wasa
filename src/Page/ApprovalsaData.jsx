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
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1536);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 
  const mapSurveyEntry = (entry, i) => {
    const consumer = entry?.consumer || {};
    const property = entry?.property || {};
    const connection = entry?.connection || {};
    const survey = entry?.survey || {};

    return {
      old_code: consumer.old_code || "N/A",
      cid: consumer.consumer_code || connection.consumer_id || "N/A",
      name: consumer.full_name || "N/A",
      cnic: consumer.cnic || "N/A",
      uc: property.uc || survey.uc || "N/A",
      status: property.status || connection.connection_status || "N/A",
      zone: property.zone || survey.zone || "N/A",
      category: property.category || "N/A",
      ward: property.ward || survey.ward || "N/A",
      water_unit: connection.water_unit || "N/A",
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

        
        const mappedQuick = data
          .slice(-25) 
          .reverse()
          .map(mapSurveyEntry);

        setTableData(mappedQuick);
        setLoading(false);

    
        setTimeout(() => {
          const mappedFull = data
            .map(mapSurveyEntry)
            .filter((row) => row.name !== "N/A" && row.cnic !== "N/A");

          mappedFull.sort((a, b) => {
            if (!a.surveyedAt) return 1;
            if (!b.surveyedAt) return -1;
            return new Date(b.surveyedAt) - new Date(a.surveyedAt);
          });

          setTableData(mappedFull);
        }, 300); 
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
    const columnMap = { category: 6, status: 5, uc: 8, uc: 8, ward: 9 };
    const columnIndex = columnMap[name];
    tableInstance.current
      .column(columnIndex)
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
        const dateColumn = data[11];
        if (!dateColumn || dateColumn === "N/A") return false;

        const rowDate = new Date(dateColumn);
        const from = updated.fromDate ? new Date(updated.fromDate) : null;
        const to = updated.toDate ? new Date(updated.toDate) : null;
        if (to) to.setHours(23, 59, 59, 999);

        if (from && to) {
          return rowDate >= from && rowDate <= to;
        } else if (from) {
          return rowDate >= from;
        } else if (to) {
          return rowDate <= to;
        }
        return true;
      });
    }

    tableInstance.current.draw();
    return updated;
  });
};


  const handleClearFilters = () => {
  setFilters({ category: "", status: "", uc: "", ward: "" });
  const columnMap = { category: 6, status: 5, uc: 8, ward: 9 };
  Object.values(columnMap).forEach((index) => {
    tableInstance.current.column(index).search("").draw();
  });
  setDateRange({ fromDate: "", toDate: "" });
  document.querySelector('input[name="fromDate"]').value = "";
  document.querySelector('input[name="toDate"]').value = "";
  $.fn.dataTable.ext.search = [];
  tableInstance.current.draw();
  };



  const saveTicketToLocalStorage = (ticket) => {
    const existing = JSON.parse(localStorage.getItem("tickets") || "[]");
    const updated = [...existing.filter((t) => t.cid !== ticket.cid), ticket];
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  useEffect(() => {
    if (!tableData || tableData.length === 0) return;
    const $table = $(tableRef.current);

    if ($.fn.dataTable.isDataTable(tableRef.current)) {
      $table.DataTable().destroy();
    }

    const pageLength = isLargeScreen ? 25 : 10;

    tableInstance.current = $table.DataTable({
      data: tableData,
      columns: [
        { title: "#", data: null, render: (data, type, row, meta) => meta.row + 1 },
        { title: "Old Consumer Code", data: "old_code", render: (data) => data ?? "N/A" },
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
      pageLength: pageLength,
      createdRow: function (row) {
        if (isLargeScreen) {
          $(row).css("font-size", "1.125rem");
        }
      },
    });

    $table.on("click", ".view-btn", function () {
      const cid = $(this).data("cid");
      const row = tableData.find((r) => r.cid === cid);
      setSelectedRow(row?.fullData || null);
      setIsModalOpen(true);
    });

    return () => {
      $table.off("click", ".view-btn");
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
  
      <div className="flex flex-wrap gap-4">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className={`border rounded px-3 py-1 text-sm bg-transparent ${
            isLargeScreen ? "text-lg 2xl:text-xl" : ""
          }`}
        >
          <option value="">Category</option>
          {[...new Set(tableData.map((d) => d.category))]
            .sort()
            .map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className={`border rounded px-3 py-1 text-sm bg-transparent ${
            isLargeScreen ? "text-lg 2xl:text-xl" : ""
          }`}
        >
          <option value="">Status</option>
          {[...new Set(tableData.map((d) => d.status))]
            .sort()
            .map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
        </select>
        <select
          name="ward"
          value={filters.ward}
          onChange={handleFilterChange}
          className={`border rounded px-3 py-1 text-sm bg-transparent ${
            isLargeScreen ? "text-lg 2xl:text-xl" : ""
          }`}
        >
          <option value="">Ward No</option>
          {[...new Set(tableData.map((d) => d.ward))]
            .sort((a, b) => a - b)
            .map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
        </select>
        <select
  name="uc"
  value={filters.uc}
  onChange={handleFilterChange}
  className={`border rounded px-3 py-1 text-sm bg-transparent ${
    isLargeScreen ? "text-lg 2xl:text-xl" : ""
  }`}
>
  <option value="">UC</option>
  {[...new Set(tableData.map((d) => d.uc))]
    .sort()
    .map((val) => (
      <option key={val} value={val}>
        {val}
      </option>
    ))}
</select>

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

    
        {loading && (
  <div className="flex justify-center items-center mt-10">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
)}


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

      <ApprovalAction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        row={selectedRow}
        onUpdateStatus={handleUpdateStatus}
      />

   
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
