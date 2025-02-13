import React from 'react';

interface DataItem {
  [key: string]: string | number;
}

interface JsonTableProps {
  data: DataItem[];
}

const JsonTable: React.FC<JsonTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div style={{ overflow: 'auto' }}>
      <table className="TableData" style={{ minWidth: '800px', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} style={{ border: '1px solid black', padding: '8px' }}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JsonTable;