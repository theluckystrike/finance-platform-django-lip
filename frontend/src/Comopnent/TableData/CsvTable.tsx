import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

type CsvRow = string[]; // Each row is an array of strings
type CsvData = CsvRow[]; // The entire CSV is an array of rows

const CsvTable: any = ({ScriptData}:any) => {
  const [tableData, setTableData] = useState<CsvData>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    const fetchCSV = async () => {
      const response = await fetch(ScriptData?.table_data?.csv_data);
      const reader = response.body?.getReader();
      const result = await reader?.read();
      const decoder = new TextDecoder('utf-8');
      const csvData = decoder.decode(result?.value);
      parseCSV(csvData);
    };

    const parseCSV = (data: string | undefined) => {
      if (!data) return;

      Papa.parse(data, {
        complete: function (results: any) {
          const rows = results.data;
          setHeaders(rows[0]); // Assuming the first row is the header
          setTableData(rows.slice(1)); // Remaining rows are data
        },
        skipEmptyLines: true,
      });
    };

    fetchCSV();
  }, []);

  return (
    <div>
      <h1>CSV Data</h1>
      {tableData.length > 0 ? (
        <table  >
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
 
  
 
  );
};

export default CsvTable;
