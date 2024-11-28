import React, { useState } from 'react'
import Custominput from '../../Components/Custominput'
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const { Dragger } = Upload;

const props = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
const Addblog = () => {
  const [ desc, setDesc]=useState();
const handleDesc=(e)=>{
    setDesc(e);
};

  return (
    
    <div>
        <h3 className="mb-4 title">Add Blog</h3>
        <form action="">
      <div>
          <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </Dragger>
      </div>
        <div className='mt-4'>
            <Custominput type="text" label="Enter Blog Title" />
            </div>
            <select name="" id="">
                <option value="">Select Blog Category</option>
            </select>
           <div>
            <button type='submit' className='btn-success border-0 roundede-3 my-3'>Add Blog</button>
            </div>
            <ReactQuill theme='snow' 
        value={desc} onChange={(evt)=>{
            handleDesc(evt);
        }}/>
        </form>
        </div>
  )
}

export default Addblog