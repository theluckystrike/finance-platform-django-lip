import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
 

const CsvDisplay = ({ csvUrl }: any) => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(csvUrl);
        Papa.parse(res.data, {
          header: true,
          complete: (result: any) => {
            setHeaders(result.meta.fields); // Set headers if CSV has header row
            setData(result.data); // Set CSV data
          },
          skipEmptyLines: true,
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
      }
    };

    fetchData();
  }, [csvUrl]);

  return (
    <div>
      <table className="TableData">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CsvDisplay;
