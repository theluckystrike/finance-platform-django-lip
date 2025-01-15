import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import AutoComplete from '../../Comopnent/AutoComplete';

import { useGetUserByTokenQuery } from '../../Redux/AuthSlice';
import { useGetAllCategoryQuery, Category } from '../../Redux/CategoryQuery';

import Icon from '../../Comopnent/ui/icon/Icon';
import CategoryModal from '../../Comopnent/ui/Modals/CategoryModal/CategoryModal';

import { CreateScripts } from '../../Redux/Script/ScriptSlice';
import useToast from '../../customHook/toast';

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
  const fileRef = useRef<any>(null);
  // Effect to retrieve loginUser from localStorage on component mount
  useEffect(() => {
    localStorage.removeItem('filterquery');

    const storedLoginUser = localStorage.getItem('login');
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);

  const { data: AllCategory, isError } = useGetAllCategoryQuery(
    { token: loginUser?.access, page_no: 1, page_size: 1000 },
    {
      skip: !loginUser, // Skip query execution if loginUser is null
    },
  );

  const categoryData = AllCategory?.results || [];

  const level2Categories = useMemo(
    () => categoryData.filter((cate: Category) => cate.level === 2),
    [categoryData],
  );

  const handleToast = useToast();

  const { data, error, isLoading } = useGetUserByTokenQuery(
    { token: loginUser?.access, page_no: 1, page_size: 1000 },
    {
      skip: !loginUser, // Skip query execution if loginUser is null
    },
  );
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formik = useFormik({
    initialValues: {
      category: '',
      output_type: '',
      name: '',
      file: null,
      description: '',
      parentName: '',
      for_summary: 0,
    },
    validationSchema,
    onSubmit: async (values: any, { resetForm }) => {
      // Dispatch the action with FormData
      const res = await dispatch(
        CreateScripts({
          formData: { ...values },
          token: loginUser?.access,
        }) as any,
      );

      if (!res.error) {
        handleToast.SuccessToast(`New Script added successfully`);
        reset();
      } else {
        handleToast.ErrorToast(res.payload.error);
      }
    },
  });

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedOutputType, setSelectedOutputType] = useState<string | null>(
    null,
  );

  const onCategoryChange = (
    event: React.SyntheticEvent,
    category: Category | null,
  ) => {
    setSelectedCategory(category);
    formik.setFieldValue('category', category ? category.id : null);
  };

  const onOuputChange = (event: React.SyntheticEvent, value: string | null) => {
    formik.setFieldValue('output_type', value);
    setSelectedOutputType(value);
  };

  const reset = () => {
    formik.resetForm();
    setSelectedCategory(null);
    setSelectedOutputType(null);
    fileRef.current.value = '';
  };

  return (
    <>
      <div className="UploadScript_main_wrap mt-3">
        <h1 className="h1 fw-bold">Upload a Script</h1>
        <div className="d-flex justify-content-center">
          <form
            className="w-75"
            style={{ maxWidth: '600px' }}
            onSubmit={formik.handleSubmit}
            encType="multipart/form-data"
          >
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <div className="row mx-0 p-0">
                <div className="col-10 col-sm-10 col-md-11 m-0 p-0 pe-1">
                  <AutoComplete
                    disablePortal
                    options={level2Categories}
                    getOptionLabel={(option: Category) => option.name}
                    label="Select a category"
                    value={selectedCategory}
                    onChange={onCategoryChange}
                  />
                </div>
                <button
                  className="btn btn-dark col-2 col-sm-2 col-md-1 p-0 justify-content-center"
                  type="button"
                  onClick={handleShow}
                >
                  <Icon icon="Add" size="30px" />
                </button>
              </div>
              {formik.touched.category && formik.errors.category ? (
                <div className="error-message">
                  {formik.errors.category as any}
                </div>
              ) : null}
            </div>

            <div className="mb-3">
              <label htmlFor="output_type" className="form-label">
                How would you like to view data?
              </label>
              <AutoComplete
                disablePortal
                options={['Chart', 'Table', 'Chart and Table']}
                label="Select a view data type"
                value={selectedOutputType}
                onChange={onOuputChange}
              />

              {formik.touched.output_type && formik.errors.output_type ? (
                <div className="error-message">
                  {formik.errors.output_type as any}
                </div>
              ) : null}
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
                  formik.touched.name && formik.errors.name ? 'input-error' : ''
                }`}
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="error-message">{formik.errors.name as any}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <label
                htmlFor="file"
                className="form-label"
                title="Select only .py files"
              >
                Select a file <Icon icon="InfoOutline" size="18px" />
              </label>
              <input
                type="file"
                id="file"
                name="file"
                ref={fileRef}
                accept=".py" // Restrict to only .py files
                className={`form-control ${
                  formik.touched.file && formik.errors.file ? 'input-error' : ''
                }`}
                onChange={(event: any) =>
                  formik.setFieldValue('file', event.target.files[0])
                }
              />
              {formik.touched.file && formik.errors.file ? (
                <div className="error-message">{formik.errors.file as any}</div>
              ) : null}
            </div>

            <div className="mb-3">
              <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                  For Summary
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  value={formik.values.for_summary} // Bind the value to Formik
                  onChange={(ev, v) => formik.setFieldValue('for_summary', v)}
                  name="radio-buttons-group"
                >
                  <FormControlLabel value={0} control={<Radio />} label="No" />
                  <FormControlLabel value={1} control={<Radio />} label="Yes" />
                </RadioGroup>
              </FormControl>
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
                onClick={reset}
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
