import React, { useEffect, useState } from 'react';
import { GoArrowDownRight, GoArrowUpRight } from 'react-icons/go';
import { Column, Pie } from '@ant-design/plots';
import '../../App.css';

const Dashboard = () => {
  const [performanceData, setPerformanceData] = useState({
    onTimeRate: 85,
    avgDeliveryTime: 35, // in minutes
    deliverySuccessRate: 92,
  });

  const [orderStats, setOrderStats] = useState({
    totalOrders: 1200,
    pendingDeliveries: 300,
    completedDeliveries: 900,
  });

  const [pieData, setPieData] = useState([]);
  
  useEffect(() => {
    // Simulating fetching delivery performance data
    setTimeout(() => {
      setPerformanceData({
        onTimeRate: 88,
        avgDeliveryTime: 30,
        deliverySuccessRate: 93,
      });

      // Simulating order statistics data
      setOrderStats({
        totalOrders: 1200,
        pendingDeliveries: 300,
        completedDeliveries: 900,
      });

      // Simulating Pie Chart Data
      setPieData([
        { type: 'On-Time', value: 88 },
        { type: 'Delayed', value: 12 },
      ]);
    }, 1000);
  }, []);

  const orderStatsCard = [
    {
      title: 'Active Orders',
      value: orderStats.totalOrders,
      percentageChange: 10,
      icon: <GoArrowUpRight />,
      color: 'text-green-400',
    },
    {
      title: 'Pending Deliveries',
      value: orderStats.pendingDeliveries,
      percentageChange: -5,
      icon: <GoArrowDownRight />,
      color: 'text-red-500',
    },
    {
      title: 'Completed Deliveries',
      value: orderStats.completedDeliveries,
      percentageChange: 15,
      icon: <GoArrowUpRight />,
      color: 'text-green-400',
    },
  ];

  const performanceMetrics = [
    {
      title: 'On-Time Delivery Rate',
      value: `${performanceData.onTimeRate}%`,
      icon: <GoArrowUpRight />,
      color: 'text-green-400',
    },
    {
      title: 'Average Delivery Time',
      value: `${performanceData.avgDeliveryTime} mins`,
      icon: <GoArrowDownRight />,
      color: 'text-red-500',
    },
    {
      title: 'Delivery Success Rate',
      value: `${performanceData.deliverySuccessRate}%`,
      icon: <GoArrowUpRight />,
      color: 'text-green-400',
    },
  ];

  const columnConfig = {
    data: [
      { month: 'Jan', deliveries: 80 },
      { month: 'Feb', deliveries: 90 },
      { month: 'Mar', deliveries: 75 },
      { month: 'Apr', deliveries: 120 },
      { month: 'May', deliveries: 95 },
      { month: 'Jun', deliveries: 110 },
      { month: 'Jul', deliveries: 85 },
      { month: 'Aug', deliveries: 90 },
    ],
    xField: 'month',
    yField: 'deliveries',
    color: '#ffd333',
    label: {
      position: 'top',
      style: { fill: '#fff', opacity: 1 },
    },
    xAxis: { label: { autoHide: true, autoRotate: false } },
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    legend: { position: 'right' },
  };

  return (
    <div className=" bg-gray-100 min-h-screen text-black">
      <div className="app-header bg-yellow-400 p-2 text-center">
        <h2 className="text-black text-2xl">Merkato Ecommerce Delivery Admin</h2>
      </div>

      <h3 className="my-4 text-2xl font-bold text-black">Delivery Admin Dashboard</h3>

      {/* Summary Cards Section */}
      <div className="flex space-x-6 my-4">
        {orderStatsCard.map((card, index) => (
          <div
            key={index}
            className="flex-1 bg-black text-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h4 className="text-xl font-bold">{card.value}</h4>
            </div>
            <div className="flex flex-col items-end">
              <h6 className={`${card.color} text-lg font-bold`}>
                {card.icon} {card.percentageChange}%
              </h6>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Overview */}
      <div className="flex space-x-6 my-4">
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            className="flex-1 bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <p className="text-sm text-gray-500">{metric.title}</p>
            <h4 className="text-xl font-bold">{metric.value}</h4>
            <div className={`${metric.color} text-2xl`}>{metric.icon}</div>
          </div>
        ))}
      </div>

      {/* Delivery Metrics */}
      <div className="flex space-x-4 my-4">
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">Delivery Overview</h3>
          <Column {...columnConfig} />
        </div>
        <div className="w-1/3 bg-white p-4 rounded shadow">
          <h3 className="text-2xl font-bold mb-4">On-Time vs Delayed</h3>
          <Pie {...pieConfig} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
