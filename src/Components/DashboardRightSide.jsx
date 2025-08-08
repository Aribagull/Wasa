
function WeekSummaryCard({ color, icon, label, count }) {
  return (
    <div className="bg-white rounded-md p-4 flex items-center shadow-custom-deep mb-4">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full border-4 ${color.border}`}
      >
        <span className={`${color.text} text-xl`}>{icon}</span>
      </div>
      <div className="ml-4">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-semibold text-gray-800">{count} Projects</p>
      </div>
    </div>
  );
}

export default function RightSide() {
  return (
    <div className="w-[230px] px-4 flex flex-col  ">
     
      

      <div className="mt-6">
        <h2 className="text-md font-semibold text-gray-800 mb-4">Week Summary</h2>

        <WeekSummaryCard
          color={{ border: "border-blue-500", text: "text-blue-500" }}
          icon="↙"
          label="Completed"
          count={23}
        />
        <WeekSummaryCard
          color={{ border: "border-yellow-400", text: "text-yellow-500" }}
          icon="↗"
          label="In Progress"
          count={15}
        />
        <WeekSummaryCard
          color={{ border: "border-red-500", text: "text-red-500" }}
          icon="↙"
          label="Pending"
          count={23}
        />
      </div>
    </div>
  );
}