import { FC, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Createschedules, DeleteReportEmailByIDs, GetAllreports, GetReportSchedulesByIDs } from '../../../../Redux/Report/Slice';
import useToast from '../../../../customHook/toast';

interface ScheduleEmailModalProps {
  show: boolean;
  handleClose: () => void;
  data: any;
}
const initialValues = {
  email: '',
  day: '1',
};
const ScheduleEmailModal: FC<ScheduleEmailModalProps> = ({
  show,
  handleClose,
  data,
}) => {
  const dispatch = useDispatch();
  const [loginUser, setLoginUser] = useState<any>(null);
  const store: any = useSelector((i) => i);
  const allreport = store?.report?.reports?.results;
  const handleToast = useToast();
  useEffect(() => {
    const storedLoginUser = localStorage.getItem('login');
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);

  useEffect(() => {
    const getDAta = async () => {
      try {
        await dispatch(GetAllreports({ page: 1 }));
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    if (loginUser?.access) {
      getDAta();
    }
  }, [loginUser, dispatch]);

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    day: Yup.string().required('Please select a day'),
  });

  // Day choices
  const dayChoices = [
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
    { value: '7', label: 'Sunday' },
    { value: '*', label: 'Every Day' },
  ];

  const onSubmit = async (values: any) => {
    await dispatch(
      Createschedules({
        values: { ...values, report: data.id },
        token: loginUser?.access
      }),
    );
    handleToast.SuccessToast(`Schedules added successfully`);
    handleClose(); // Close the modal after submitting
  };

  const handleDeleteExistingEmailSchedule = async (schedule: any) => {
    await dispatch(
      DeleteReportEmailByIDs({
        id: schedule.id,
      }),
    );
    dispatch(GetReportSchedulesByIDs({ id: schedule.report }));
  }

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Body
          className="bg-light-green"
          style={{
            borderRadius: '25px',
            overflow: 'hidden',
          }}
        >
          <h5>Schedule Email</h5>

          <div className="px-5 mt-4 mb-4">
            <h5>Existing schedules</h5>
            <div className="row schedule-item">
              <div className="col-6 form-label">Email</div>
              <div className="col-5 form-label">Day of the Week</div>
              <div className="col-1 form-label"></div>
            </div>
            {data.schedules.map((schedule: any) => {
              const dayOfWeek = dayChoices.find(choice => choice.value === schedule.day);
              return (
                <div className="row schedule-item">
                  <div className="col-6">{schedule.email}</div>
                  <div className="col-5">{dayOfWeek ? dayOfWeek.label : ''}</div>
                  <div className="col-1">
                    <DeleteIcon
                      onClick={() => handleDeleteExistingEmailSchedule(schedule)}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form>
                <div className="mb-3">
                  <div className="row mx-0 px-5">
                    <div className="col-6 m-0 px-4">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="form-control m-0"
                        required
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="col-6 m-0 px-4">
                      <label htmlFor="day" className="form-label">
                        Day of the Week
                      </label>
                      <Field
                        as="select"
                        id="day"
                        name="day"
                        className="form-select m-0"
                        required
                      >
                        <option value="" disabled>
                          Select a day
                        </option>
                        {dayChoices.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="day"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="col-12 row m-0 px-4">
                      <label
                        style={{ height: '33px' }}
                        htmlFor="category"
                        className="invisible"
                      >
                        Last Updated
                      </label>
                      <button
                        className="btn btn-dark px-3 fw-bold form-control"
                        type="submit"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="col-12 row mt-3 px-4">
                      <p className="text-center mb-0">
                        All reports are sent at 12:00 PM UTC
                      </p>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ScheduleEmailModal;
