'use client';

import { useState } from 'react';
import { LayoutDashboard, Box, BarChart as BarChartIcon, UserCog, Settings, Plus, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import DashboardLayout from '@/components/layout/dashboard-layout';

const pieData = [
  { name: 'Electronics', value: 400 },
  { name: 'Furniture', value: 300 },
  { name: 'Vehicles', value: 300 },
];

const COLORS = ['#4F46E5', '#93C5FD', '#CBD5E1'];

const barData = [
  { name: 'Jan', value: 200000 },
  { name: 'Feb', value: 300000 },
  { name: 'Mar', value: 400000 },
  { name: 'Apr', value: 500000 },
  { name: 'May', value: 600000 },
  { name: 'Jun', value: 700000 },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={<Box />} label="Total Assets" value="128" />
          <StatCard icon={<ChevronDown />} label="Depreciated" value="24" />
          <StatCard icon={<BarChartIcon />} label="Total Value" value="1.23M" />
        </div>

        {/* Recent Activity & Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <ul className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
              {[
                { action: "Asset 'SD Printer' created", time: '2 hours ago' },
                { action: "Asset 'Office Chair' updated", time: '5 hours ago' },
                { action: "Asset 'Laptop' deleted", time: '1 day ago' },
                { action: "Asset 'Projector' created", time: '2 days ago' },
                { action: "Asset 'Tabler' updated", time: '2 days ago' },
              ].map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.action}</span>
                  <span className="text-gray-400">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Asset Categories</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={60}
                  innerRadius={40}
                  paddingAngle={5}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-1 text-sm">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 inline-block rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></span>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Asset Value Overview</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center gap-4">
      <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{value}</h3>
      </div>
    </div>
  );
} 