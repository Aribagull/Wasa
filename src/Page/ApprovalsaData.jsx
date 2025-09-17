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
  const [filters, setFilters] = useState({ category: "", status: "", ward: "" });
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    const columnMap = { category: 5, status: 4, ward: 8 };
    const columnIndex = columnMap[name];
    tableInstance.current
      .column(columnIndex)
      .search(value ? "^" + value + "$" : "", true, false)
      .draw();
  };

  const handleClearFilters = () => {
    setFilters({ category: "", status: "", ward: "" });
    const columnMap = { category: 5, status: 4, ward: 8 };
    Object.values(columnMap).forEach((index) => {
      tableInstance.current.column(index).search("").draw();
    });
  };

  const saveTicketToLocalStorage = (ticket) => {
    const existing = JSON.parse(localStorage.getItem("tickets") || "[]");
    const updated = [...existing.filter((t) => t.cid !== ticket.cid), ticket];
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getAllSurveys(); 
        const data = res?.data || []; 

        const mappedData = data.map((entry, i) => {
  const consumer = entry?.consumer || {};
  const property = entry?.property || {}; 
  const connection = entry?.connection || {};
  const survey = entry?.survey || {};

  return {
    cid: consumer.consumer_code || connection.consumer_id || "N/A",
    name: consumer.full_name || "N/A",
    cnic: consumer.cnic || "N/A",
    uc: property.uc || survey.uc || "N/A",     
    status: property.status || connection.connection_status || "N/A",
    zone: property.zone || survey.zone || "N/A",
    category: property.category || "N/A",
    ward: property.ward || survey.ward || "N/A",
    water_unit: connection.water_unit || "N/A",
    index: i,
    fullData: entry,
    releaseReason: "",
  };
})
  .filter((row) => row.name !== "N/A" && row.cnic !== "N/A"); 




        setTableData(mappedData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!tableData || tableData.length === 0) return;
    const $table = $(tableRef.current);
    if ($.fn.dataTable.isDataTable(tableRef.current)) {
      $table.DataTable().destroy();
    }

    tableInstance.current = $table.DataTable({
      data: tableData,
      columns: [
        { title: "#", data: null, render: (data, type, row, meta) => meta.row + 1 },
        { title: "Consumer Code", data: "cid" },
        { title: "Name", data: "name" },
        { title: "CNIC", data: "cnic" },
        { title: "Status", data: "status" },
        { title: "Category", data: "category" },
        { title: "Zone", data: "zone" },
        { title: "UC", data: "uc" },
        { title: "Ward", data: "ward" },
        { title: "Water Unit", data: "water_unit" },
        {
          title: "Action",
          data: "index",
          orderable: false,
         render: (data, type, row) =>
  `<button class="view-btn text-black hover:text-blue-800" data-cid="${row.cid}">
      <i class="fa-regular fa-eye" style="font-size: 10px;"></i>
  </button>`

        },
      ],
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: false,
      pageLength: 10
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
  }, [tableData]);

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
          tableInstance.current
            .row(rowNode)
            .data(updated[rowIndex])
            .draw(false);
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
        <select name="category" value={filters.category} onChange={handleFilterChange} className="border rounded px-3 py-1 text-sm bg-transparent">
          <option value="">Category</option>
          {[...new Set(tableData.map((d) => d.category))].sort().map((val) => <option key={val} value={val}>{val}</option>)}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="border rounded px-3 py-1 text-sm bg-transparent">
          <option value="">Status</option>
          {[...new Set(tableData.map((d) => d.status))].sort().map((val) => <option key={val} value={val}>{val}</option>)}
        </select>
        <select name="ward" value={filters.ward} onChange={handleFilterChange} className="border rounded px-3 py-1 text-sm bg-transparent">
          <option value="">Ward No</option>
          {[...new Set(tableData.map((d) => d.ward))].sort((a, b) => a - b).map((val) => <option key={val} value={val}>{val}</option>)}
        </select>
        <button onClick={handleClearFilters} className="text-blue-600 py-1 rounded text-sm hover:text-blue-800">Clear Filters</button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table ref={tableRef} className="display w-full text-sm text-gray-700"></table>
      </div>

      <ApprovalAction
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        row={selectedRow}
        onUpdateStatus={handleUpdateStatus}
      />

    
      {toast && (
        <div className="fixed top-5 right-5 bg-green-100 text-black text-sm px-4 py-2 rounded shadow-lg animate-slide-in">
          {toast}
        </div>
      )}
    </div>
  );
}
