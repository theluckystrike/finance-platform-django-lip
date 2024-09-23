import { FC, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import ArrowDown from "../../../../assest/image/arrow-down.png";
import { useGetAllCategoryQuery } from "../../../../Redux/CategoryQuery";
 
import { GetScriptbyCategorys } from "../../../../Redux/Script/ScriptSlice";
import { useDispatch } from "react-redux";

interface FilterModalProps {
  show: boolean;
  handleClose: () => void;
}

const FilterModal: FC<FilterModalProps> = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const [loginUser, setLoginUser] = useState<any>(null);
  const fileRef: any = useRef(null);
  // Effect to retrieve loginUser from localStorage on component mount
  useEffect(() => {
    const storedLoginUser = localStorage.getItem("login");
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);

  const { data: AllCategory, isError } = useGetAllCategoryQuery({
    token: loginUser?.access,
    page_no: 1,
    page_size: 1000,
  },
  {
    skip: !loginUser, // Skip query execution if loginUser is null
  });
  const categoryData = AllCategory?.results || [];
  // Define the form validation schema using Yup
  const validationSchema = Yup.object({
    parentName: Yup.string().required("Parent category is required"),
    category: Yup.string().required("Category is required"),
  });

  // Use Formik to manage form state
  const formik = useFormik({
    initialValues: {
      parentName: "",
      category: "",
    },
    validationSchema,
    onSubmit:async (values) => {
      console.log("Form values:", values);

   await   dispatch(
        GetScriptbyCategorys({
          token: loginUser?.access,
          value: values?.category,
        })
      );
      // Handle form submission logic here
      handleClose(); // Close modal on form submission
    },
  });

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
        <div>
          <h5 className="m-3"> Filter by Category</h5>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <div className="mb-3">
            <div className="row mx-0 px-5">
              <div className="col-12 m-0 p-0 pe-1">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <div className="dropdown">
                  <div className="arrow_down">
                    <img src={ArrowDown} alt="Arrow down" />
                  </div>
                  <input
                    type="text"
                    placeholder="All"
                    value={formik.values.parentName}
                    readOnly
                    className={`form-control ${
                      formik.touched.parentName && formik.errors.parentName
                        ? "input-error"
                        : ""
                    }`}
                  />
                  {formik.touched.parentName && formik.errors.parentName && (
                    <div className="text-danger">
                      {formik.errors.parentName}
                    </div>
                  )}
                  <div
                    className="dropdown-content"
                    style={{ height: "200px", overflow: "auto" }}
                  >
                    {categoryData.length > 0 &&
                      categoryData.map((item: any, index: any) => (
                        <span
                          className="h6 hover-span"
                          key={item.id}
                          onClick={() => {
                            formik.setFieldValue("parentName", item.name);
                            formik.setFieldValue("category", item.id);
                          }}
                        >
                          {item.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <div className="col-6 m-0 p-0 my-2">
                <label htmlFor="category" className="form-label">
                  Add Script
                </label>
                <div className="dropdown">
                  <div className="arrow_down">
                    <img src={ArrowDown} alt="Arrow down" />
                  </div>
                  <input
                    type="text"
                    placeholder="All"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    readOnly
                    className={`form-control ${
                      formik.touched.category && formik.errors.category
                        ? "input-error"
                        : ""
                    }`}
                  />
                  {formik.touched.category && formik.errors.category && (
                    <div className="text-danger">{formik.errors.category}</div>
                  )}
                  <div className="dropdown-content">
                    <span>Returns</span>
                    <span>USD</span>
                    <span>Bonds</span>
                    <span>CAD</span>
                    <span>Breadth</span>
                  </div>
                </div>
              </div>

              <div className="col-6 row m-0 p-0 my-2">
                <label
                  htmlFor="category"
                  className="form-label col-12 invisible"
                >
                  Last Updated
                </label>

                <button
                  onClick={handleClose}
                  style={{
                    width: "45%",
                  }}
                  className="btn form-control btn-light  border-2px col-5 mx-auto fw-bold"
                  type="button"
                >
                  Reset
                </button>
                <button
                  style={{
                    width: "45%",
                  }}
                  className="btn form-control  btn-dark col-5 mx-auto fw-bold"
                  type="submit"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default FilterModal;
