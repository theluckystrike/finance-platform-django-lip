import { FC, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllScripts } from '../../../../Redux/Script/ScriptSlice';
import { ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import Select, { MultiValue } from 'react-select';
import { Createreports } from '../../../../Redux/Report/Slice';
import useToast from '../../../../customHook/toast';
import { getAllSummaries } from '../../../../Redux/TapeSummary/Slice';

// Define type for the script and summary selectbox option
interface SelectBoxOption {
  value: string;
  label: string;
}

// Define the type for Formik values
interface FormValues {
  name: string;
  scripts: string[]; // 'scripts' is an array of strings (ids)
  summaries: string[]; // 'summaries' is an array of strings (ids)
}

interface CreateReportsProps {
  show: boolean;
  handleClose: () => void;
  selectedScripts: any;
}

const CreateReports: FC<CreateReportsProps> = ({
  show,
  handleClose,
  selectedScripts,
}) => {
  const dispatch = useDispatch();
  const store: any = useSelector((i) => i);
  const handleToast = useToast();
  const allscripts = store.script.scripts || [];
  const allsummaries = store.summary.summaries || [];
  const [loginUser, setLoginUser] = useState<any>(null);
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    scripts: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one script must be selected'),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      scripts: selectedScripts,
      summaries: [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      await dispatch(Createreports({ values, token: loginUser.access }));
      handleToast.SuccessToast('Report create successfully.');
      handleClose();
    },
  });

  useEffect(() => {
    const storedLoginUser = localStorage.getItem('login');
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);

  useEffect(() => {
    if (loginUser) {
      const getData = async () => {
        try {
          // await dispatch(GetAllScripts({ token: loginUser?.access }));
          await dispatch(getAllSummaries({ page: 1 }));
        } catch (error) {
          console.log(error);
        }
      };
      getData();
    }
  }, [loginUser, dispatch]);

  const scriptOptions: SelectBoxOption[] = allscripts.map((script: any) => ({
    value: script.id,
    label: script.name,
  }));

  const summaryOptions: SelectBoxOption[] = allsummaries.map((summary: any) => ({
    value: summary.id,
    label: summary.name,
  }));

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
        style={{
          borderRadius: '25px',
        }}
      >
        <h5>Create Reports</h5>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <div className="row mx-0 px-3">
              <div className="col-12 m-0">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="form-control m-0"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              <div className="col-12 mb-2">
                <label htmlFor="scripts" className="form-label">
                  Scripts
                </label>
                <Select
                  id="scripts"
                  styles={{
                    valueContainer: (provided) => ({
                      ...provided,
                      maxHeight: '100px', // Set max height for the selected values container
                      overflowY: 'auto', // Add scroll when content exceeds max height
                    }),
                    control: (provided) => ({
                      ...provided,
                      maxHeight: '150px', // Set max height for the entire control
                      overflowY: 'auto', // Add scroll when options exceed height
                      border: '2px solid #011c05',
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999, // Ensure dropdown is visible over other content
                    }),
                  }}
                  name="scripts"
                  isMulti
                  options={scriptOptions}
                  onChange={(
                    selectedOptions: MultiValue<SelectBoxOption> | null,
                  ) => {
                    const values = selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : [];
                    formik.setFieldValue('scripts', values);
                  }}
                  value={scriptOptions.filter((option: SelectBoxOption) =>
                    formik.values.scripts.includes(option.value),
                  )}
                  placeholder="Select Scripts"
                />
              </div>

              <div className="col-12 mb-2">
                <label htmlFor="summaries" className="form-label">
                  Summaries
                </label>
                <Select
                  id="summaries"
                  styles={{
                    valueContainer: (provided) => ({
                      ...provided,
                      maxHeight: '100px', // Set max height for the selected values container
                      overflowY: 'auto', // Add scroll when content exceeds max height
                    }),
                    control: (provided) => ({
                      ...provided,
                      maxHeight: '150px', // Set max height for the entire control
                      overflowY: 'auto', // Add scroll when options exceed height
                      border: '2px solid #011c05',
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999, // Ensure dropdown is visible over other content
                    }),
                  }}
                  name="summaries"
                  isMulti
                  options={summaryOptions}
                  onChange={(
                    selectedOptions: MultiValue<SelectBoxOption> | null,
                  ) => {
                    const values = selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : [];
                    formik.setFieldValue('summaries', values);
                  }}
                  value={summaryOptions.filter((option: SelectBoxOption) =>
                    formik.values.summaries.includes(option.value),
                  )}
                  placeholder="Select Summaries"
                />
              </div>

              <div className="col-12 row justify-content-evenly m-0">
                <button
                  onClick={handleClose}
                  className="btn btn-dark col-5 px-3 fw-bold"
                  type="button"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-dark col-5 px-3 fw-bold"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateReports;
