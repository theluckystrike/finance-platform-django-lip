import { FC } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';

import { Link } from 'react-router-dom';
import { formatIsoDate } from '../../utils/formatDate';
import Loader from '../../Comopnent/ui/Loader';

// Create new plugin instance

interface ReportSummaryTabViewProps {
  loading: boolean;
  remove: (val: any) => void;
  report: any;
}

const ReportSummaryTabView: FC<ReportSummaryTabViewProps> = ({ loading, remove, report }) => {
  return (
    <>
      <div>
        {!loading ? (
          <div id="customReportForm" style={{ overflow: 'auto' }}>
            <table className="table   w-100" style={{ minWidth: '1000px' }}>
              <thead>
                <tr className="fw-bold mb-2 p-2">
                  <th scope="col" className="col-5">
                    <h5>
                      <input type="checkbox" id="selectAllCheckbox" /> Name
                    </h5>
                  </th>
                  <th scope="col" className="col-2 text-center mx-auto">
                    Created
                  </th>
                  <th scope="col" className="col-1 text-center mx-auto">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody id="reportsCheckboxes">
                {report.summaries ? (
                  report.summaries.map((summary: any) => (
                    <>
                      <tr
                        key={summary.id}
                        className="table-card rounded-3 bg-light-green mb-2 p-3"
                      >
                        <td className="col-5">
                          <Link
                            to={`/model-summary-results/${summary.id}`}
                            className="text-decoration-none text-black"
                          >
                            <span className="fw-bold fs-6">
                              <input
                                className="chbx"
                                type="checkbox"
                                name="summarys"
                                value={summary.id}
                              />
                              {summary.name}
                            </span>
                          </Link>
                        </td>
                        <td className="col-2 text-center mx-auto">
                          {formatIsoDate(summary.created)}
                        </td>
                        <td className="col-1 text-center mx-auto">
                          <div className="col-actions">
                            <DeleteIcon
                              onClick={() => remove(summary.id)}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr style={{ height: '10px' }}></tr>
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <p>No summary found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default ReportSummaryTabView;
