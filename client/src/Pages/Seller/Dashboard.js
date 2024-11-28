import React from 'react';
import { GoArrowDownRight, GoArrowUpRight } from "react-icons/go";
import { Column, Pie } from '@ant-design/plots';
import '../../App.css';

const Dashboard = () => {
  const data1 = [
    { type: 'Jan', sales: 30 },
    { type: 'Feb', sales: 48 },
    { type: 'Mar', sales: 28 },
    { type: 'Apr', sales: 34 },
    { type: 'May', sales: 30 },
    { type: 'Jun', sales: 44 },
    { type: 'Jul', sales: 48 },
    { type: 'Aug', sales: 30 },
    { type: 'Sep', sales: 28 },
    { type: 'Oct', sales: 48 },
    { type: 'Nov', sales: 44 },
    { type: 'Dec', sales: 40 },
  ];

  const config = {
    data: data1, // Pass data correctly here
    xField: 'type',
    yField: 'sales',
    color: '#ffd333',
    label: {
      position: 'top', 
      style: {
        fill: '#ffffff',
        opacity: 1,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: 'Month',
      },
      sales: {
        alias: 'Income',
      },
    },
  };

  const [pieData, setPieData] = React.useState([]);

  React.useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setPieData([
        { type: 'Category 1', value: 27 },
        { type: 'Category 2', value: 25 },
        { type: 'Category 3', value: 18 },
        { type: 'Category 4', value: 15 },
        { type: 'Category 5', value: 10 },
        { type: 'Category 6', value: 5 },
      ]);
    }, 1000);
  }, []);

  const config2 = {
    data: pieData, // Ensure data is passed correctly here
    angleField: 'value',
    colorField: 'type',
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    legend: {
      position: 'right',
    },
  };

  return (
    <div style={{ backgroundColor: 'rgb(255, 255, 255)', minHeight: '100vh', color: '#fff' }}>
      <div className="app-header h-11" style={{ backgroundColor: '#ffd333', padding: '10px', textAlign: 'center' }}>
        <h2 className='text-black text-lg'>Merkato Ecommerce App</h2>
      </div>

      <h3 className='my-4 text-2xl text-black'>Seller Dashboard</h3>
      <div className='d-flex justify-content-between align-items-center gap-3'>
        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-dark p-3 rounded-3 '>
          <div>
            <p className='mb-0' style={{ color: '#ccc' }}>Total</p>
            <h4 className='mb-0'>1100</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <h6 className='text-red-500'><GoArrowDownRight /> 32%</h6>
            <p className='mb-0' style={{ color: '#ccc' }}>Compared To yesterday</p>
          </div>
        </div>

        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-dark p-3 rounded-3'>
          <div>
            <p className='mb-0' style={{ color: '#ccc' }}>Total</p>
            <h4 className='mb-0'>1100</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <h6 className='text-red-500'><GoArrowDownRight /> 32%</h6>
            <p className='mb-0' style={{ color: '#ccc' }}>Compared To Last Week</p>
          </div>
        </div>

        <div className='d-flex justify-content-between align-items-end flex-grow-1 bg-dark p-3 rounded-3'>
          <div>
            <p className='mb-0' style={{ color: '#ccc' }}>Total</p>
            <h4 className='mb-0'>1100</h4>
          </div>
          <div className='d-flex flex-column align-items-end'>
            <h6 className='text-green-400'><GoArrowUpRight /> 32%</h6>
            <p className='mb-0' style={{ color: '#ccc' }}>Compared To Last Month</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mt-4">
        <div className="flex-1 bg-white p-4 rounded shadow">
          <h3 className="my-4 text-3xl font-bold text-black">Order Statistics</h3>
          <Column {...config} /> {/* Ensure config is passed correctly */}
        </div>
        <div className="w-1/3 bg-white p-4 rounded shadow">
          <h3 className="my-4 text-2xl font-bold text-black">Delivery Statistics</h3>
          <Pie {...config2} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
