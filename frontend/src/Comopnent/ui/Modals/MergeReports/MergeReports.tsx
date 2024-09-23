import { FC, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { GetAllScripts } from "../../../../Redux/Script/ScriptSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select, { MultiValue } from "react-select";
import { Createreports, mergereports } from "../../../../Redux/Report/Slice";

// Define type for the script option
interface ScriptOption {
  value: string;
  label: string;
}

interface CreateReportsProps {
  show: boolean;
  handleClose: () => void;
  allreport:any
}

const CreateReports: FC<CreateReportsProps> = ({ show, handleClose,allreport }) => {
  const dispatch = useDispatch();
  const store: any = useSelector((i) => i);
  const allscripts = store?.script?.Scripts?.results || [];
  const [loginUser, setLoginUser] = useState<any>(null);

  useEffect(() => {
    const storedLoginUser = localStorage.getItem("login");
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);

  useEffect(() => {
    if(loginUser){

      const getDAta = async () => {
        try {
          await dispatch(GetAllScripts({ token: loginUser?.access }));
        } catch (error) {
          console.log(error);
        }
      };
      getDAta();
    }
  }, [loginUser, dispatch]);

  // Convert scripts to options for react-select
  const scriptOptions: ScriptOption[] =allreport && allreport.map((report: any) => ({
    value: report.id,
    label: report.name,
  }));

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    scripts: Yup.array().of(Yup.string()).min(1, "At least one script must be selected")
  });

  // Handle form submission
  const handleSubmit = (values: any) => {

    dispatch(mergereports({values:values,token:loginUser.access}));

    handleClose(); // Close modal after submission
  };

  return (
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
          borderRadius: "25px",
          overflow: "hidden",
        }}
      >
        <h5>Merge Reports</h5>

        <Formik
          initialValues={{ name: '', reports: [] }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <div className="mb-3">
                <div className="row mx-0 px-3">
                  <div className="col-12 m-0">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <Field
                      id="name"
                      name="name"
                      className="form-control m-0"
                      required
                    />
                    <ErrorMessage name="name" component="div" className="text-danger" />
                  </div>

                  <div className="col-12">
                    <label htmlFor="scripts" className="form-label">
                    Reports
                    </label>
                    <Select
                      id="reports"
                      name="reports"
                      isMulti
                      options={scriptOptions}
                      onChange={(selectedOptions: MultiValue<ScriptOption> | null) => {
                        const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                        setFieldValue("reports", values);
                      }}
                      // value={scriptOptions.filter((option) => values.scripts.includes(option.value))}
                      placeholder="Select Scripts"
                    />
                    <ErrorMessage name="scripts" component="div" className="text-danger" />
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
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default CreateReports;
