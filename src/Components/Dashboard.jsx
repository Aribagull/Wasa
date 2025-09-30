import {
  ArrowUpRight,
  ArrowDownLeft,
  BadgeCheck,
  UserCheck,
  UserX,
} from 'lucide-react';
import { FaUsers } from "react-icons/fa";
import RightSide from './DashboardRightSide';

export default function Dashboard() {
  const stats = [
    {
      title: 'Monthly Servey',
      value: '7432+',
      icon: <BadgeCheck className="text-green-500 text-lg 2xl:text-2xl 3xl:text-3xl" />,
      iconBg: 'bg-green-100',
      trend: 'up',
      trendValue: '10.2',
      percent: '+1.01% this Month',
    },
    {
      title: 'Total Users',
      value: '7864+',
      icon: <FaUsers className="text-indigo-500 text-lg 2xl:text-2xl 3xl:text-3xl" />,
      iconBg: 'bg-indigo-100',
      trend: 'up',
      trendValue: '10.2',
      percent: '+1.01% this Month',
    },
    {
      title: 'Total Legal Users',
      value: '5937+',
      icon: <UserCheck className="text-green-400 text-lg 2xl:text-2xl 3xl:text-3xl" />,
      iconBg: 'bg-green-100',
      trend: 'up',
      trendValue: '10.2',
      percent: '+0.10% this Month',
    },
    {
      title: 'Total illegal Users',
      value: '2471+',
      icon: <UserX className="text-red-400 text-lg 2xl:text-2xl 3xl:text-3xl" />,
      iconBg: 'bg-red-100',
      trend: 'down',
      trendValue: '10.2',
      percent: '+1.01% this Month',
    },
  ];

  return (
    <div className="flex gap-1"> 
      <div className="flex-1 bg-[#F6F7FF] px-2 py-6">
        <h2 className="text-md 2xl:text-xl 3xl:text-2xl font-semibold text-gray-800 mb-4">
          Monthly Summary
        </h2>

        <div className="bg-white rounded-lg overflow-hidden flex divide-x">
          {stats.map((item, index) => (
            <div key={index} className="flex-1 px-4 py-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl 2xl:text-4xl 3xl:text-5xl font-bold text-[#1e1e60]">
                  {item.value}
                </h3>
                <div
                  className={`w-9 h-9 2xl:w-12 2xl:h-12 3xl:w-14 3xl:h-14 rounded-full ${item.iconBg} flex items-center justify-center`}
                >
                  {item.icon}
                </div>
              </div>

              <p className="text-sm 2xl:text-base 3xl:text-lg text-gray-500">
                {item.title}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs 2xl:text-sm 3xl:text-base">
                {item.trend === 'up' ? (
                  <ArrowUpRight className="text-green-500 text-sm 2xl:text-lg 3xl:text-xl" />
                ) : (
                  <ArrowDownLeft className="text-red-500 text-sm 2xl:text-lg 3xl:text-xl" />
                )}
                <span
                  className={`${
                    item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {item.trendValue}
                </span>
                <span className="text-gray-400">{item.percent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RightSide/>
    </div>
  );
}
