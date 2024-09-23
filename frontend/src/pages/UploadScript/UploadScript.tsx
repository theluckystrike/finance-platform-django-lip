import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Icon from "../../Comopnent/ui/icon/Icon";
import CategoryModal from "../../Comopnent/ui/Modals/CategoryModal/CategoryModal";
import ArrowDown from '../../assest/image/arrow-down.png';
import { useGetuserbytokenQuery } from "../../Redux/AuthSlice";
import { useGetAllCategoryQuery } from "../../Redux/CategoryQuery";
import { useDispatch } from "react-redux";
import { CreateScripts } from "../../Redux/Script/ScriptSlice";
import useToast from "../../customHook/toast";

// Define validation schema using Yup
const validationSchema = Yup.object({
  category: Yup.string().required('Category is required'),
  output_type: Yup.string().required('Output type is required'),
  name: Yup.string().required('Script name is required'),
  file: Yup.mixed().required('File is required'),
});

const UploadScriptForm = () => {
  const dispatch = useDispatch();
  const [loginUser, setLoginUser] = useState<any>(null);
  const fileRef:any = useRef(null)
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

  const { data, error, isLoading } = useGetuserbytokenQuery({ token: loginUser?.access, page_no: 1, page_size: 1000 },
    {
      skip: !loginUser, // Skip query execution if loginUser is null
    });
  const [show, setShow] = useState(false);
  const [selectValue, setSelectValue] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formik = useFormik({
    initialValues: {
      category: '',
      output_type: '',
      name: '',
      file: null,
      description:'',
      parentName:''
    },
    validationSchema,
    onSubmit:async (values:any,{resetForm}) => {
      // Create FormData object
      const formData = new FormData();
      formData.append('category', values.category);
      formData.append('output_type', 'plt');
      formData.append('name', values.name);
      formData.append('file', values.file);
      formData.append('description',values.description)
      // Dispatch the action with FormData
   await   dispatch(CreateScripts({formData,token: loginUser?.access})as any);
resetForm()
fileRef.current.value=''
      handleToast.SuccessToast(`New Script added successfully`);
    },
  });

  useEffect(() => {
    const categoryMap: any = {};
    categoryData.forEach((cat: any) => {
      categoryMap[cat.id] = { ...cat, subcategories: [] };
    });
    categoryData.forEach((cat: any) => {
      if (cat?.parent_category !== null) {
        const parent:any = Object.values(categoryMap).find(
          (parentCat: any) => parentCat.name === cat?.parent_category
        );
        if (parent) {
          parent.subcategories.push(categoryMap[cat.id]);
        }
      }
    });
    const structuredCategories = Object.values(categoryMap).filter(
      (cat: any) => cat?.parent_category === null
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
              <label htmlFor="category" className="form-label">Category</label>
              <div className="row mx-0 p-0">
                <div className="col-11 m-0 p-0 pe-1">
                  <div className="dropdown">
                    <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input
                      type="text"
                      placeholder="All"
                      value={formik.values.parentName}
                      
                      readOnly
                      className={`form-control ${formik.touched.category && formik.errors.category ? 'input-error' : ''}`}
                    />
                    <div className="dropdown-content" style={{ height: '200px', overflow: 'auto' }}>
                      {categoryData.length > 0 && categoryData.map((item: any, index: any) => (
                        <span className="h6 hover-span" key={item.name} onClick={() => {
                          formik.setFieldValue("parentName", item.name)
                          formik.setFieldValue('category', item.id)}}>
                          {item.name}
                         
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
                  <div className="error-message">{formik.errors.category as any}</div>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="output_type" className="form-label">How would you like to view data?</label>
              <div className="dropdown">
                <div className="arrow_down">
                  <img src={ArrowDown} alt="" />
                </div>
                <input
                  type="text"
                  id="output_type"
                  placeholder="All"
                  className={`form-control ${formik.touched.output_type && formik.errors.output_type ? 'input-error' : ''}`}
                  {...formik.getFieldProps('output_type')}
                />
                <div className="dropdown-content">
                  <span className="hover-span" onClick={() => formik.setFieldValue('output_type', 'pd')}>Chart</span>
                  <span className="hover-span" onClick={() => formik.setFieldValue('output_type', 'plt')}>Table</span>
                  <span className="hover-span" onClick={() => formik.setFieldValue('output_type', 'pd plt')}>Chart and Table</span>
                </div>
                {formik.touched.output_type && formik.errors.output_type ? (
                  <div className="error-message">{formik.errors.output_type as any}</div>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">Script name</label>
              <input
                type="text"
                id="name"
                className={`form-control ${formik.touched.name && formik.errors.name ? 'input-error' : ''}`}
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="error-message">{formik.errors.name as any}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <label htmlFor="file" className="form-label">Select a file</label>
              <input
                type="file"
                id="file"
                name="file"
              ref={fileRef}
                className={`form-control ${formik.touched.file && formik.errors.file ? 'input-error' : ''}`}
                onChange={(event: any) => formik.setFieldValue('file', event.target.files[0])}
              />
              {formik.touched.file && formik.errors.file ? (
                <div className="error-message">{formik.errors.file as any}</div>
              ) : null}
            </div>

            <div className="mx-auto text-center d-flex justify-content-between">
              <button type="submit" className="btn btn-dark px-5">Upload</button>
              <button
                type="reset"
                className="btn btn-light bordered-button px-5"
                onClick={() => formik.resetForm()}
              >
                Reset
              </button>
            </div>
          </form>

          <CategoryModal show={show} handleClose={handleClose} categoryFilter={categoryData} />
        </div>
      </div>
    </>
  );
};

export default UploadScriptForm;
