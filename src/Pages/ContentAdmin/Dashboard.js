import React from 'react';
import { GoArrowDownRight, GoArrowUpRight } from "react-icons/go";
import Chart from './chart';
import { Column } from '@ant-design/plots';

import '../../App.css';
const data1 = [];
  for (let i=0; i<46; i++)
    {
        data1.push({
    key: i,
    name: `Edward King ${i}`,
    product: 32,
    status: `London, Park Lane no. ${i}`,
  });}


const orderData = [];
for (let i = 0; i < 45; i++) {
  orderData.push({
    key: i,
    name: `Neima Ahemdin ${i}`,
    Product: 32,
    status: `Addis Abeba, Mexico no.${i}`,
  });
}


const Dashboard = () => {
    const data = [
        { type: 'Jan', sales: 30 },
        { type: 'Feb', sales: 48 },
        { type: 'Mar', sales: 28 },
        { type: 'Apr', sales: 34 },
        { type: 'May', sales: 30 },
        { type: 'Jun', sales: 44 },
        { type: 'July', sales: 48 },
        { type: 'Aug', sales: 30 },
        { type: 'Sept', sales: 28 },
        { type: 'Oct', sales: 48 },
        { type: 'Nov', sales: 44 },
        { type: 'Dec', sales: 40 },
    ];

   
  const config = {
    data,
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

  return (
    <div style={{ backgroundColor: '#a0d1ea;', minHeight: '100vh', color: '#fff' }}>
      {/* App Name Section */}
      <div className="app-header" style={{ backgroundColor: '#ffd333', padding: '10px', textAlign: 'center' }}>
        <h2 className="text-2xl "style={{ margin: 0, color: '#000' }}>Merkato Ecommerce App</h2>
      </div>

    
      <h3 className='mb-4 text-2xl text-black'>Content Admin Dashboard</h3>
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
            <h6 className='text-green-400'><GoArrowUpRight />
            32%</h6>
            <p className='mb-0' style={{ color: '#ccc' }}>Compared To Last Month</p>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
            <div className="flex-1 bg-white p-4 rounded shadow">
                <h3 className="my-4 text-3xl font-bold text-black">Product Statistics</h3>
                <div>
                    <Column {...config} />
                </div>
            </div>
            <div className="w-1/3 bg-white p-4 rounded shadow">
                <Chart/>
            </div>
        </div>
      {/* Any other sections can be added here */}
    </div>
  );
};

export default Dashboard;
