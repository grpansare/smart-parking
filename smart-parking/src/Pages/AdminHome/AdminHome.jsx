import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { dummyDashboardStats, dummyParkingSlots } from "../../Utils/DummyData";

const AdminHome = () => {
      const [stats] = useState(dummyDashboardStats);
      const chartData = [
        { name: "Total Parkings", value: stats.totalActiveParkings },
        { name: "Daily Revenue", value: stats.dailyRevenue },
        { name: "Monthly Revenue", value: stats.monthlyRevenue },
        { name: "Pending Issues", value: stats.pendingIssues },
      ];
      const [parkingSlots] = useState(dummyParkingSlots);
  return (
    <div>
           {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-100 rounded-lg">
          <h2 className="text-lg font-semibold">🚗 Active Parkings</h2>
          <p className="text-2xl font-bold">{stats.totalActiveParkings}</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg">
          <h2 className="text-lg font-semibold">💳 Daily Revenue</h2>
          <p className="text-2xl font-bold">${stats.dailyRevenue}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg">
          <h2 className="text-lg font-semibold">📊 Monthly Revenue</h2>
          <p className="text-2xl font-bold">${stats.monthlyRevenue}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg">
          <h2 className="text-lg font-semibold">🛑 Pending Issues</h2>
          <p className="text-2xl font-bold">{stats.pendingIssues}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">📊 Parking Slot Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Parking Slots Table */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">🚗 Active & Pending Parkings</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Parking ID</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Start Time</th>
              <th className="border p-2">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {parkingSlots.map((slot) => (
              <tr key={slot.id} className="text-center">
                <td className="border p-2">{slot.id}</td>
                <td className={`border p-2 ${slot.status === "ACTIVE" ? "text-green-600" : "text-orange-600"}`}>
                  {slot.status}
                </td>
                <td className="border p-2">{slot.user}</td>
                <td className="border p-2">{slot.startTime}</td>
                <td className="border p-2">{slot.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminHome