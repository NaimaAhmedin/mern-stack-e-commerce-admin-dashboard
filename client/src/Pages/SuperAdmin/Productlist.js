import React from 'react'
import { Table } from 'antd';
//import { FiEdit } from "react-icons/fi";
//import { MdDelete } from "react-icons/md";
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

const Productlist = () => {
  return (
    <div className=''>
        <h3 className='mb-4 title'>Product List</h3>

    <div>
        <Table columns={columns} dataSource={data1}/>
     </div>
        
    </div>
  )
}

export default Productlist