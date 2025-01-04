import React, { useRef } from 'react';
import '../../assest/css/AllScript.css';

// Define the type for table data props
interface TableDataRow {
  [key: string]: string | number;
}

interface TapeSummaryResltTableProps {
  TableData: TableDataRow[];
}

const TapeSummaryResltTable: React.FC<TapeSummaryResltTableProps> = ({
  TableData,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  // Event handlers for scrolling
  const mouseDownHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    isDown = true;
    const el = scrollRef.current;
    if (el) {
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    }
  };

  const mouseLeaveHandler = () => {
    isDown = false;
    const el = scrollRef.current;
    if (el) el.style.cursor = 'grab';
  };

  const mouseUpHandler = () => {
    isDown = false;
    const el = scrollRef.current;
    if (el) el.style.cursor = 'grab';
  };

  const mouseMoveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (el) {
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2; // Adjust multiplier as needed
      el.scrollLeft = scrollLeft - walk;
    }
  };

  // Transpose the data for horizontal display
  const transposeData = (data: TableDataRow[]) => {
    if (data.length === 0) return [];
    const keys = Object.keys(data[0]);
    return keys.map((key) => {
      return data.map((row) => ({ key, value: row[key] }));
    });
  };

  const transposedData = transposeData(TableData);

  return (
    <div className="chart-table-container">
      <div
        ref={scrollRef}
        onMouseDown={mouseDownHandler}
        onMouseLeave={mouseLeaveHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={mouseMoveHandler}
        style={{
          width: '100%',
          overflowX: 'auto',
          cursor: 'grab',
        }}
      >
        {transposedData.length > 0 ? (
          <table style={{ borderCollapse: 'collapse', width: 'max-content' }}>
            <thead>
              <tr className="mb-2 p-2 text-center fw-bold">
                {TableData.map((_, index) => (
                  <th
                    key={index}
                    className="px-2"
                    style={{ minWidth: '150px' }}
                  >
                    <h5 className="text-capitalize">{`Data ${index + 1}`}</h5>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transposedData.map((column, idx) => (
                <tr
                  key={idx}
                  className="mb-4 p-3 rounded-3 text-center tr-value bg-light-green"
                  style={{
                    borderBottom: '5px white solid',
                    height: '60px',
                    padding: '0px 10px',
                    borderRadius: '5px',
                  }}
                >
                  {column.map((cell, index) => (
                    <td
                      key={index}
                      className="px-2"
                      style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                      <span className="fw-bold fs-6">{cell.value}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <span className="text-large">
            Upload scripts to generate reports with them
          </span>
        )}
      </div>
    </div>
  );
};

export default TapeSummaryResltTable;
