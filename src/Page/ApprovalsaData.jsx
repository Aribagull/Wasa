import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import consumersData from "../Data/consumersData";
import ApprovalAction from "./SurveyAction";
import "../Page/UserTable.css";

export default function SurveyDetails() {
  const tableRef = useRef(null);
  const tableInstance = useRef(null);
  const [filters, setFilters] = useState({ category: "", status: "", ward: "" });
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    const columnMap = { category: 5, status: 4, ward: 8 };
    const columnIndex = columnMap[name];
    tableInstance.current.column(columnIndex).search(value ? "^" + value + "$" : "", true, false).draw();
  };

  const handleClearFilters = () => {
    setFilters({ category: "", status: "", ward: "" });
    const columnMap = { category: 5, status: 4, ward: 8 };
    Object.values(columnMap).forEach((index) => {
      tableInstance.current.column(index).search("").draw();
    });
  };

  useEffect(() => {
    const mappedData = consumersData.map((entry, i) => ({
      cid: entry.consumer.consumer_code,
      name: entry.consumer.full_name,
      cnic: entry.consumer.cnic,
      uc: entry.consumer.uc,
      status: entry.premiseDetails.status,
      zone: entry.consumer.zone,
      category: entry.premiseDetails.category,
      ward: entry.consumer.ward,
      water_unit: entry.connection_details.water_unit,
      index: i,
      fullData: entry,
      releaseReason: "",
    }));
    setTableData(mappedData);
  }, []);

  useEffect(() => {
    if (tableData.length === 0) return;
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
          render: (data) =>
            `<button class="view-btn text-black hover:text-blue-800" data-index="${data}">
              <i class="fa-regular fa-eye" style="font-size: 10px;"></i>
             </button>`,
        },
      ],
      paging: true,
      searching: true,
      ordering: true,
      info: true,
      lengthChange: false,
      pageLength: 10,
    });

    $table.on("click", ".view-btn", function () {
      const index = $(this).data("index");
      const fullData = tableData[index]?.fullData;
      setSelectedRow(fullData);
      setIsModalOpen(true);
    });

    return () => {
      $table.off("click", ".view-btn");
    };
  }, [tableData]);

  const saveTicketToLocalStorage = (ticket) => {
    const existing = JSON.parse(localStorage.getItem("tickets") || "[]");
    const updated = [...existing.filter(t => t.cid !== ticket.cid), ticket];
    localStorage.setItem("tickets", JSON.stringify(updated));
  };

  return (
    <div className="px-4 py-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Survey Details</h2>
      </div>

      <div className="flex flex-wrap gap-4">
        <select name="category" value={filters.category} onChange={handleFilterChange} className="border rounded px-3 py-1 text-sm bg-transparent">
          <option value="">Category</option>
          {[...new Set(consumersData.map((d) => d.premiseDetails.category))].sort().map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange} className="border rounded px-3 py-1 text-sm bg-transparent">
          <option value="">Status</option>
          {[...new Set(consumersData.map((d) => d.premiseDetails.status))].sort().map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
        <select name="ward" value={filters.ward} onChange={handleFilterChange} className="border rounded px-3 py-1 text-sm bg-transparent">
          <option value="">Ward No</option>
          {[...new Set(consumersData.map((d) => d.consumer.ward))].sort((a, b) => a - b).map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
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
        onUpdateStatus={(id, newStatus, reason) => {
          setTableData((prev) => {
            const updated = [...prev];
            const rowIndex = updated.findIndex((r) => r.cid === id);
            if (rowIndex !== -1) {
              updated[rowIndex].status = newStatus;
              if (newStatus === "Released") {
                updated[rowIndex].releaseReason = reason;
              }

             
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
                .find(i => tableInstance.current.row(i).data().cid === id);
              if (rowNode !== undefined) {
                tableInstance.current.row(rowNode).data(updated[rowIndex]).draw(false);
              }
            }
            return updated;
          });

          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
