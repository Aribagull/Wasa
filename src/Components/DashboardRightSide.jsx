function WeekSummaryCard({ color, icon, label, count }) {
  return (
    <div className="bg-white rounded-md p-4 flex items-center shadow-custom-deep mb-4 
                    2xl:p-6 3xl:p-8">
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full border-4 ${color.border}
                    2xl:w-14 2xl:h-14 3xl:w-16 3xl:h-16`}
      >
        <span className={`${color.text} text-xl 2xl:text-3xl 3xl:text-4xl`}>
          {icon}
        </span>
      </div>
      <div className="ml-4 2xl:ml-6 3xl:ml-8">
        <p className="text-gray-500 text-sm 2xl:text-lg 3xl:text-xl">{label}</p>
        <p className="font-semibold text-gray-800 text-base 2xl:text-xl 3xl:text-2xl">
          {count} Projects
        </p>
      </div>
    </div>
  );
}

export default function RightSide() {
  return (
    <div className="w-[230px] px-4 flex flex-col 
                    2xl:w-[280px] 3xl:w-[320px]">
      <div className="mt-6">
        <h2 className="text-md font-semibold text-gray-800 mb-4 
                       2xl:text-xl 3xl:text-2xl">
          Week Summary
        </h2>

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
