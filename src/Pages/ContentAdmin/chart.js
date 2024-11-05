import React from 'react';
import { Pie } from '@ant-design/plots';

const Chart = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setData([
        { type: 'Category 1', value: 27 },
        { type: 'Category 2', value: 25 },
        { type: 'Category 3', value: 18 },
        { type: 'Category 4', value: 15 },
        { type: 'Category 5', value: 10 },
        { type: 'Category 6', value: 5 },
      ]);
    }, 1000);
  }, []);

  const config = {
    data,
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };

  return (
    <div>
      <h3 className="my-4 text-2xl font-bold text-black">Category Statistics</h3>
      <Pie {...config} />
    </div>
  );
};

export default Chart;
