import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Icon from "../../Comopnent/ui/icon/Icon";
import CategoryModal from "../../Comopnent/ui/Modals/CategoryModal/CategoryModal";
import { Categoryarray } from "../../DummyData/TableData";
import ArrowDown from '../../assest/image/arrow-down.png';
import { useGetuserbytokenQuery } from "../../Redux/AuthSlice";
// import { loginUSer } from "../../customHook/getrole";
import { useGetAllCategoryQuery } from "../../Redux/CategoryQuery";
 

// Define validation schema using Yup
const validationSchema = Yup.object({
  category: Yup.string().required('Category is required'),
  outputType: Yup.string().required('Output type is required'),
  name: Yup.string().required('Script name is required'),
  file: Yup.mixed().required('File is required'),
});

const UploadScriptForm = () => {








const [loginUser, setLoginUser] = useState<any>(null);

// Effect to retrieve loginUser from localStorage on component mount
useEffect(() => {
  const storedLoginUser = localStorage.getItem("login");

  // Check if storedLoginUser is not null before parsing
  if (storedLoginUser) {
    setLoginUser(JSON.parse(storedLoginUser)); // Set the loginUser state if it's available
  }
}, []);
const { data: AllCategory, isError } = useGetAllCategoryQuery({token:loginUser?.access, page_no:1, page_size:1000 });
//  
  const categoryData = AllCategory?.categories || [];
  const [categoryFilter,setCategoryFilter ]=useState<any>([])

  const { data, error, isLoading } = useGetuserbytokenQuery({ token:loginUser?.access, page_no:1, page_size:1000 });
  const [show, setShow] = useState(false);
  const [selectValue, setSelectValue] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formik = useFormik({
    initialValues: {
      category: '',
      outputType: '',
      name: '',
      file: null,
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // Handle form submission
      // Example: navigate('account/upload');
    },
  });




  useEffect(() => {
    const categoryMap: any = {};
  
    // Initialize categories in the map
    categoryData.forEach((cat: any) => {
      categoryMap[cat.id] = { ...cat, subcategories: [] };
    });
  
    // Populate the subcategories
    categoryData.forEach((cat: any) => {
      if (cat.parent_name === null) {
        // Root category, do nothing here
      } else {
        // Find the parent category and add the current category as a subcategory
        const parent:any = Object.values(categoryMap).find(
          (parentCat: any) => parentCat.name === cat.parent_name
        );
        if (parent) {
          parent.subcategories.push(categoryMap[cat.id]);
        }
      }
    });
  
    // Extract root categories
    const structuredCategories = Object.values(categoryMap).filter(
      (cat: any) => cat.parent_name === null
    );
  
    setCategoryFilter(structuredCategories);
  
  }, [categoryData]);
  
  
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
                <div className="col-11 m-0 p-0 pe-1">
                  <div className="dropdown">
                    <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input
                      type="text"
                      placeholder="All"
                      {...formik.getFieldProps('category')}
                      readOnly
                  className={`form-control ${formik.touched.category && formik.errors.category ? 'input-error' : ''}`}

                    />
                    <div className="dropdown-content" style={{ height: '200px', overflow: 'auto' }}>
                    {categoryFilter.length > 0 && categoryFilter.map((item: any, index: any) => (
  <span className="h6" key={item.name}  onClick={() => formik.setFieldValue('category', item.name)}>
    {item.name}
    {item.subcategories?.map((subitem: any, subindex: any) => (
      <span className="text-muted" key={subindex}>
        {subitem.name}
        {subitem.subcategories?.map((inneritem: any, innerindex: any) => (
          <span 
            className="fs-6 hover-span"
            key={innerindex}
           
          >
            {inneritem.name}
          </span>
        ))}
      </span>
    ))}
  </span>
))}

                    </div>
                  
                  </div>
                </div>
                <button
                  className="btn btn-dark col col-1 p-0 justify-content-center"
                  type="button"
                  onClick={handleShow}
                >
                  <Icon icon="Add" size="30px" />
                </button>
                {formik.touched.category && formik.errors.category ? (
                  <div className="error-message">{formik.errors.category}</div>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="outputType" className="form-label">
                How would you like to view data?
              </label>
              <div className="dropdown">
                <div className="arrow_down">
                  <img src={ArrowDown} alt="" />
                </div>
                <input
                  type="text"
                  id="outputType"
               
                  placeholder="All"
                  className={`form-control ${formik.touched.outputType && formik.errors.outputType ? 'input-error' : ''}`}
                  {...formik.getFieldProps('outputType')}
                />
                <div className="dropdown-content">
                  <span className="hover-span" onClick={() => formik.setFieldValue('outputType', 'Chart')}>Chart</span>
                  <span className="hover-span" onClick={() => formik.setFieldValue('outputType', 'Table')}>Table</span>
                  <span className="hover-span" onClick={() => formik.setFieldValue('outputType', 'Chart and Table')}>Chart and Table</span>
                </div>
                {formik.touched.outputType && formik.errors.outputType ? (
                  <div className="error-message">{formik.errors.outputType}</div>
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
              
                className={`form-control ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="error-message">{formik.errors.name}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <label htmlFor="file" className="form-label">
                Select a file
              </label>
              <input
                type="file"
                id="file"
                name="file"
                className={`form-control ${formik.touched.file && formik.errors.file ? 'input-error' : ''}`}
                onChange={(event:any) => formik.setFieldValue('file', event.target.files[0])}
              />
              {formik.touched.file && formik.errors.file ? (
                <div className="error-message">{formik.errors.file}</div>
              ) : null}
            </div>

            <div className="mx-auto text-center d-flex justify-content-between">
              <button type="submit" className="btn btn-dark px-5">
                Upload
              </button>
              <button
                type="reset"
                className="btn btn-light bordered-button px-5"
                onClick={() => formik.resetForm()}
              >
                Reset
              </button>
            </div>
          </form>

          <CategoryModal show={show} handleClose={handleClose} categoryFilter={categoryFilter} />
        </div>
      </div>
    </>
  );
};

export default UploadScriptForm;
