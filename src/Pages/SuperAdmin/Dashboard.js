import React from 'react';
import { GoArrowDownRight, GoArrowUpRight } from "react-icons/go";
import { Column } from '@ant-design/plots';
import { Table } from 'antd';
const columns = [
    {
        title: 'SNo',
        dataIndex: 'key',
      },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Product',
      dataIndex: 'product',
    },
   
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
        title: 'Date',
        dataIndex: 'data',
      },
    {
        title: 'Total',
        dataIndex: 'total',
      },
  ];
  const data1 = [];
  for (let i=0; i<46; i++)
    {
        data1.push({
    key: i,
    name: `Edward King ${i}`,
    product: 32,
    status: `London, Park Lane no. ${i}`,
  });}
const Dashboard = () => {
    // Data and configuration for the chart
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
    <div>
      <h3 className="mb-4 title">Dashboard</h3>
      <div className="d-flex justify-conyent-between align-items-center gap-3">
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className='subtitle'>Total</p>
            <h2 className="mb-0 sub-title">$1100</h2>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="green">
              <GoArrowUpRight />
              32%
            </h6>
            <p className="mb-0 subtitle">Compared to April 2023</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className='subtitle'>Total</p>
            <h2 className="mb-0 sub-title">$1100</h2>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="red">
              <GoArrowDownRight />
              12%
            </h6>
            <p className="mb-0 subtitle">Compared to April 2023</p>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-end flex-grow-1 bg-white p-3 rounded-3">
          <div>
            <p className='subtitle'>Total</p>
            <h2 className="mb-0 sub-title">$1100</h2>
          </div>
          <div className="d-flex flex-column align-items-end">
            <h6 className="green">
              <GoArrowUpRight />
              32%
            </h6>
            <p className="mb-0 subtitle">Compared to April 2023</p>
          </div>
        </div>
      </div>
     
     <div className="">
        <h3 className="mb-4">Income Statistics</h3>
       <div>
      <Column {...config} />
    </div>       
    </div>
      <div className='mt-4'>
         <h3 className='mb-4'> Recent Orders</h3>
         <div>
            <Table columns={columns} dataSource={data1} />
        </div>
      </div>
    
    <div className='my-4'>
<h3 className='mb-4'>Recent Reviews</h3>
<div className='d-flex'>
    <div></div>
    <div></div>
</div>
  </div>
</div>
  );
};

export default Dashboard;