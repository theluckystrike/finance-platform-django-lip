import { FC, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "react-bootstrap/Modal";
import ArrowDown from "../../../../assest/image/arrow-down.png";
import { useGetAllCategoryQuery } from "../../../../Redux/CategoryQuery";
import { GetAllScripts, GetScriptbyCategorys } from "../../../../Redux/Script/ScriptSlice";
import { useDispatch } from "react-redux";

interface FilterModalProps {
  show: boolean;
  handleClose: () => void;
  filterQuery:any;
  setFilterQuery:any;
}

const FilterModal: FC<FilterModalProps> = ({ show, handleClose,filterQuery,setFilterQuery }) => {
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
 
  const [Categorylist,setCategorylist]=useState([])
  const [subCategory1,setSubcategory1]=useState([])
  const [subCategory2,setSubcategory2]=useState([])
  

  // Define the form validation schema using Yup
  const validationSchema = Yup.object({
    parentName: Yup.string().required("Parent category is required"),
    category: Yup.string().required("Category is required"),
  });

  // Use Formik to manage form state
  const formik = useFormik({
    initialValues: {
      parentName: filterQuery?.parentName || "",
      category: filterQuery?.category || "",
      parentName1: filterQuery?.parentName1 || "",
      category1: filterQuery?.category1 || "",
      parentName2: filterQuery?.parentName2 || "",
      category2: filterQuery?.category2 || "",
      number:1,
    },
    validationSchema,
    enableReinitialize:true,
    onSubmit:async (values,{ resetForm }) => {

      setFilterQuery(values)
      localStorage.setItem('filterquery',JSON.stringify(values))
   await dispatch(
        GetScriptbyCategorys({
          token: loginUser?.access,
          value: values ,
        })
      );
      // Handle form submission logic here
        // Reset the form after dispatch
    // resetForm();
      handleClose(); // Close modal on form submission
    },
  });
  const reset = async() =>{ 
    localStorage.removeItem('filterquery')

    await  dispatch(GetAllScripts({token:loginUser?.access}))
    setFilterQuery(null)
    handleClose()
  };

const [cateDropDown,setCateDropDown]=useState(false)
const [cateDropDown1,setCateDropDown1]=useState(false)
const [cateDropDown2,setCateDropDown2]=useState(false)
  useEffect(()=>{
    const  Cate = categoryData.filter((i:any)=>i?.parent_category === null)
    const res = categoryData.filter((i: any) =>
      i.name.toLowerCase().includes(formik.values.parentName.toLowerCase())
    );

    setCategorylist(res)
    if(formik.values.parentName !== '' ){
    const  subCate = categoryData.filter((i:any)=>i?.parent_category === formik.values.category)
    
 
    const res = subCate.filter((i: any) =>
      i.name.toLowerCase().includes(formik.values.parentName1.toLowerCase())
    );
      setSubcategory1(res)
    }
   if(formik.values.parentName1 !== '' ){
      const  subCate2 = categoryData.filter((i:any)=>i?.parent_category === formik.values.category1)
      const res = subCate2.filter((i: any) =>
        i.name.toLowerCase().includes(formik.values.parentName2.toLowerCase())
      );
      
 
      setSubcategory2(res)
      }
  },[formik.values.parentName,formik.values.parentName1, formik.values.parentName2,categoryData])
 
 
 
 
 
 
 
 
 
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
              <div className="col-12 col-sm-12 col-md-6 m-0 p-0 pe-1">
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
                      onFocus={()=>{setCateDropDown(true)
                        setCateDropDown1(false)
                        setCateDropDown2(false)
                      }}
                       
                      value={formik.values.parentName}
                       onChange={(e)=>{
                        formik.setFieldValue("parentName", e.target.value)
                       }}
                      className={`form-control ${
                        formik.touched.parentName && formik.errors.parentName
                          ? "input-error"
                          : ""
                      }`}
                    />
                    {formik.touched.parentName && formik.errors.parentName && (
                      <div className="text-danger">
                        {formik.errors.parentName as any}
                      </div>
                    )}
                    <div
                      className="dropdown-content"
                      style={{ maxHeight: "200px", overflow: "auto",display :cateDropDown?'block':'none' }}
                    >
                      {Categorylist.length > 0 &&
                        Categorylist.map((item: any, index: any) => (
                          <span
                            className="h6 hover-span"
                            key={item.id}
                            onClick={async() => {
 
                              await formik.setFieldValue("parentName", item.name);
                             await formik.setFieldValue("category", item.id);
                             const  subCate = categoryData.filter((i:any)=>i?.parent_category === item.id)
                             setSubcategory1(subCate)
    
                             
                             setCateDropDown(false)
                            }}
                          >
                            {item.name}
                          </span> 
                        ))}
                    </div>
                  </div>
              </div>

              <div className="col-12 col-sm-12 col-md-6 m-0 p-0 pe-1">
                <label htmlFor="sub category 1" className="form-label">
                Sub Category 1
                </label>
                <div className="dropdown">
                  <div className="arrow_down">
                    <img src={ArrowDown} alt="Arrow down" />
                  </div>
                  <input
                    type="text"
                    placeholder="All"
                    value={formik.values.parentName1}
                    onFocus={()=>{setCateDropDown(false)
                      setCateDropDown1(true)
                      setCateDropDown2(false)}}
                    onChange={(e)=>{
                      formik.setFieldValue("parentName1", e.target.value)
                     }}
                    className={`form-control ${
                      formik.touched.parentName1 && formik.errors.parentName1
                        ? "input-error"
                        : ""
                    }`}
                  />
                  {formik.touched.parentName1 && formik.errors.parentName1 && (
                    <div className="text-danger">
                      {formik.errors.parentName1 as any}
                    </div>
                  )}
                  <div
                    className="dropdown-content"
                    style={{ maxHeight: "200px", overflow: "auto" ,display :cateDropDown1?'block':'none'}}
                  >
                    {subCategory1.length > 0 ?
                      subCategory1.map((item: any, index: any) => (
                        <span
                          className="h6 hover-span"
                          key={item.id}
                          onClick={async() => {
   
                          await  formik.setFieldValue("parentName1", item.name);
                        await    formik.setFieldValue("category1", item.id);
                          
      const  subCate2 = categoryData.filter((i:any)=>i?.parent_category === item.id)
      setSubcategory2(subCate2)
                        
                        setCateDropDown1(false)
                          }}
                        >
                          {item.name}
                        </span>
                      ))
                    :

                    <span
                          className="h6 hover-span"
                         
                           
                        >
                      Please select a category first.
                        </span>
                    }
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-6 m-0 p-0 pe-1">
                <label htmlFor="sub category 2" className="form-label">
                Sub Category 2
                </label>
                <div className="dropdown">
                  <div className="arrow_down">
                    <img src={ArrowDown} alt="Arrow down" />
                  </div>
                  <input
                    type="text"
                    placeholder="All"
                    value={formik.values.parentName2}
                    onFocus={()=>{setCateDropDown(false)
                      setCateDropDown1(false)
                      setCateDropDown2(true)}}
                    onChange={(e)=>{
                      formik.setFieldValue("parentName2", e.target.value)
                     }}
                    className={`form-control ${
                      formik.touched.parentName2 && formik.errors.parentName2
                        ? "input-error"
                        : ""
                    }`}
                  />
                  {formik.touched.parentName2 && formik.errors.parentName2 && (
                    <div className="text-danger">
                      {formik.errors.parentName2 as any}
                    </div>
                  )}
                  <div
                    className="dropdown-content"
                    style={{ maxHeight: "200px", overflow: "auto",display :cateDropDown2?'block':'none' }}
                  >
                    {subCategory2.length > 0 ?
                      subCategory2.map((item: any, index: any) => (
                        <span
                          className="h6 hover-span"
                          key={item.id}
                          onClick={() => {
                            formik.setFieldValue("parentName2", item.name);
                            formik.setFieldValue("category2", item.id);
                            setCateDropDown2(false)
                         
                          }}
                        >
                          {item.name}
                        </span>
                      ))
                    :
                    <span
                    className="h6 hover-span " >
              Please select a category and Subcategory 1 first.
                  </span>
                    
                    }
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-12 col-md-6 m-0 p-0 pe-1">
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
                    value={formik.values.number}
                    onFocus={()=>{setCateDropDown(false)
                      setCateDropDown1(false)
                      setCateDropDown2(false)}}
                    readOnly
                    className={`form-control ${
                      formik.touched.number && formik.errors.number
                        ? "input-error"
                        : ""
                    }`}
                  />
                  {formik.touched.number && formik.errors.number && (
                    <div className="text-danger">{formik.errors.number}</div>
                  )}
                 <div className="dropdown-content">
  {[...Array(10)].map((_, index) => (
    <span key={index}  onClick={() => {
      formik.setFieldValue("number", index + 1);
      
    }}>{index + 1}</span>
  ))}
</div>
                </div>
              </div>

              <div className="col-12 row m-0 p-0 my-2">
                <label
                  htmlFor="category"
                  className="form-label col-12  invisible"
                >
                  Last Updated
                </label>

                <button
                  onClick={reset}
                  style={{
                    width: "45%",
                  }}
                  className="btn form-control btn-light  border-2px col-12 col-sm-12 col-md-5 mx-auto fw-bold"
                  type="button"
                >
                  Reset
                </button>
                <button
                  style={{
                    width: "45%",
                  }}
                  className="btn form-control  btn-dark col-12 col-sm-12 col-md-5 mx-auto fw-bold"
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
