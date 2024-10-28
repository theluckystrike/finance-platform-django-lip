import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Icon from "../../Comopnent/ui/icon/Icon";
import CategoryModal from "../../Comopnent/ui/Modals/CategoryModal/CategoryModal";
import ArrowDown from "../../assest/image/arrow-down.png";
import { useGetUserByTokenQuery } from "../../Redux/AuthSlice";
import { useGetAllCategoryQuery } from "../../Redux/CategoryQuery";
import { useDispatch } from "react-redux";
import { CreateScripts } from "../../Redux/Script/ScriptSlice";
import useToast from "../../customHook/toast";

// Define validation schema using Yup
const validationSchema = Yup.object({
  category: Yup.string().required("Category is required"),
  output_type: Yup.string().required("Output type is required"),
  name: Yup.string().required("Script name is required"),
  file: Yup.mixed().required("File is required"),
});

const UploadScriptForm = () => {
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

  const { data: AllCategory, isError } = useGetAllCategoryQuery(
    { token: loginUser?.access, page_no: 1, page_size: 1000 },
    {
      skip: !loginUser, // Skip query execution if loginUser is null
    }
  );

  const categoryData = AllCategory?.results || [];

  const handleToast = useToast();

  const [categoryFilter, setCategoryFilter] = useState<any>([]);

  const { data, error, isLoading } = useGetUserByTokenQuery(
    { token: loginUser?.access, page_no: 1, page_size: 1000 },
    {
      skip: !loginUser, // Skip query execution if loginUser is null
    }
  );
  const [show, setShow] = useState(false);
  const [selectValue, setSelectValue] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formik = useFormik({
    initialValues: {
      category: "",
      output_type: "",
      name: "",
      file: null,
      description: "",
      parentName: "",
    },
    validationSchema,
    onSubmit: async (values: any, { resetForm }) => {
      // Create FormData object
      const formData = new FormData();
      formData.append("category", values.category);
      formData.append("output_type", "plt");
      formData.append("name", values.name);
      formData.append("file", values.file);
      formData.append("description", values.description);
      // Dispatch the action with FormData
      await dispatch(
        CreateScripts({ formData, token: loginUser?.access }) as any
      );
      resetForm();
      fileRef.current.value = "";
      handleToast.SuccessToast(`New Script added successfully`);
    },
  });
const [FilterCategory,setFilterCategory]=useState([])
const [dataTypeOption ,setDataTypeOption]=useState(false)
const FilterData = (value: any) => {
  const trimmedValue = value.trim(); // Trim the input value
  if (trimmedValue !== '') {
    const res = categoryData.filter((i: any) =>
      i.name.toLowerCase().includes(trimmedValue.toLowerCase())
    );
    setFilterCategory(res);
  } else {
    setFilterCategory([]);
  }
}


useEffect(()=>{
  FilterData(formik.values.parentName)
},[formik.values.parentName])
  return (
    <>
      <div className="UploadScript_main_wrap mt-3">
        <h1 className="h1 fw-bold">Upload a Script</h1>
        <div className="d-flex justify-content-center">
          <form
            className="w-75"
            style={{ maxWidth: "600px" }}
            onSubmit={formik.handleSubmit}
            encType="multipart/form-data"
          >
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <div className="row mx-0 p-0">
                <div className="col-10 col-sm-10 col-md-11 m-0 p-0 pe-1">
                  <div className="dropdown">
                    <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input
                      type="text"
                      placeholder="Select a category"
                      value={formik.values.parentName}
                      onChange={(e) => {
                      formik.setFieldValue("parentName", e.target.value)
                      FilterData( e.target.value)
                      }}
                      className={`form-control ${
                        formik.touched.category && formik.errors.category
                          ? "input-error"
                          : ""
                      }`}
                    />
                  <div className="dropdown-content"
                   style={{ maxHeight: "200px", overflow: "auto", display: FilterCategory.length > 0  ? 'block' : 'none' }}>
                      {FilterCategory.length > 0  &&
                        FilterCategory.map((item: any, index: any) => (
                          <span
                            className="h6 hover-span"
                            key={item.name}
                            onClick={async () => {
                             await formik.setFieldValue("parentName", item.name);
                             await  formik.setFieldValue("category", item.id);
                             setFilterCategory([])
                            }} >
                            {item.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-dark col-2 col-sm-2 col-md-1 p-0 justify-content-center"
                  type="button"
                  onClick={handleShow}
                >
                  <Icon icon="Add" size="30px" />
                </button>
                {formik.touched.category && formik.errors.category ? (
                  <div className="error-message">
                    {formik.errors.category as any}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="output_type" className="form-label">
                How would you like to view data?
              </label>
              <div className="dropdown">
                <div className="arrow_down">
                  <img src={ArrowDown} alt="" />
                </div>
                <input
                  type="text"
                  id="output_type"
                  placeholder="Select a view data type"
                  value={formik.values.output_type}
               readOnly
                     onFocus={()=>setDataTypeOption(true)}
                    //  onBlur={()=>setDataTypeOption(false)}
                  className={`form-control ${
                    formik.touched.output_type && formik.errors.output_type
                      ? "input-error"
                      : ""
                  }`}
                />
                <div className="dropdown-content" style={{ maxHeight: "200px", overflow: "auto", display: dataTypeOption ? 'block' : 'none' }}>
                  <span
                    className="hover-span"
                    onClick={async() => { await formik.setFieldValue("output_type", "pd")
                      setDataTypeOption(false)
                    }}
                  >
                    Chart
                  </span>
                  <span
                    className="hover-span"
                    onClick={async() => {await formik.setFieldValue("output_type", "plt")
                      setDataTypeOption(false)
                    }}
                  >
                    Table
                  </span>
                  <span
                    className="hover-span"
                    onClick={ async() =>
                    { await formik.setFieldValue("output_type", "pd plt")
                      setDataTypeOption(false)
                    }
                    }
                  >
                    Chart and Table
                  </span>
                </div>
                {formik.touched.output_type && formik.errors.output_type ? (
                  <div className="error-message">
                    {formik.errors.output_type as any}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Script name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter script name"
                className={`form-control ${
                  formik.touched.name && formik.errors.name ? "input-error" : ""
                }`}
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="error-message">{formik.errors.name as any}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <label htmlFor="file" className="form-label" title="Select only .py files">
                Select a file <Icon icon="InfoOutline" size="18px" />
              </label>
              <input
  type="file"
  id="file"
  name="file"
  ref={fileRef}
  accept=".py" // Restrict to only .py files
  className={`form-control ${
    formik.touched.file && formik.errors.file ? "input-error" : ""
  }`}
  onChange={(event: any) =>
    formik.setFieldValue("file", event.target.files[0])
  }
/>
              {formik.touched.file && formik.errors.file ? (
                <div className="error-message">{formik.errors.file as any}</div>
              ) : null}
            </div>

            <div className="mx-auto text-center d-flex justify-content-between row ">
              <button
                type="submit"
                className="btn btn-dark my-1 first-line:col-12 col-sm-12 col-md-5"
              >
                Upload
              </button>
              <button
                type="reset"
                className="btn btn-light bordered-button my-1  col-12 col-sm-12 col-md-5"
                onClick={() => formik.resetForm()}
              >
                Reset
              </button>
            </div>
          </form>

          <CategoryModal
            show={show}
            handleClose={handleClose}
            categoryFilter={categoryData}
          />
        </div>
      </div>
    </>
  );
};

export default UploadScriptForm;
