import { FC } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useToast from '../../customHook/toast';
import {
  DeleteReportsByIDs,
  RemoveScriptFromReports,
  RemoveSummaryFromReports
} from '../../Redux/Report/Slice';

interface DeleteModalProps {
  show: boolean;
  handleClose: () => void;
  deleteTargetName: string;
  report: any;
  data: any;
  requestUpdateReport: () => void;
}

const DeleteModal: FC<DeleteModalProps> = ({
  show,
  handleClose,
  deleteTargetName,
  report,
  data,
  requestUpdateReport
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleToast = useToast();

  const handleDelete = () => {
    if (deleteTargetName === 'report') {
      removeReport();
    } else if (deleteTargetName === 'script') {
      removeScript();
    } else if (deleteTargetName === 'summary') {
      removeSummary();
    } 
  };

  const removeReport = () => {
    dispatch(DeleteReportsByIDs({ id: report.id }));

    handleClose();
    navigate(-1);
  };

  const removeScript = async () => {
    try {
      await dispatch(
        RemoveScriptFromReports({ reportId: report.id, scriptId: data.id }),
      );
      handleToast.SuccessToast(`Remove Script successfully`);
    } catch (error) {
      handleToast.ErrorToast(`Failed remove script`);
    } finally {
      requestUpdateReport();
    }
  };

  const removeSummary = async () => {
    try {
      await dispatch(
        RemoveSummaryFromReports({ reportId: report.id, summaryId: data.id }),
      );
      handleToast.SuccessToast(`Remove Summary successfully`);
    } catch (error) {
      handleToast.ErrorToast(`Failed remove summary`);
    } finally {
      requestUpdateReport();
    }
  };

  return (
    <Modal
      size="lg"
      fullscreen="md-down"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
    >
      <Modal.Body
        className="bg-light-green"
        style={{ borderRadius: '25px', overflow: 'hidden' }}
      >
        <div className="mb-3">
          <div className="row mx-0 px-3">
            <div className="col-12 m-0"></div>
            <div className="col-12  ">
              {/* <label htmlFor="parent_category" className="form-label" style={{
                    width:'400px'
                  }}>
                   Delete {report.name} script 
                  </label> */}
              <h4>Delete Report</h4>
              {deleteTargetName === 'report' ? (
                <p>Are you sure you want to delete {report.name} report?</p>
              ): (
                <p>Are you sure you want to delete {data.name} from {report.name}?</p>
              )}
            </div>
            <div className="col-12 row justify-content-evenly m-0">
              <button
                onClick={handleDelete}
                className="btn btn-danger col-3 px-3 fw-bold"
                type="button"
              >
                Delete
              </button>

              <button
                onClick={handleClose}
                className="btn btn-light border border-2 border-dark col-3 px-3 fw-bold"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
