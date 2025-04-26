import { FC, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { ActiveRoute } from '../../../../Menu';
import { Categoryarray } from '../../../../DummyData/TableData';
import { useCreateMutation } from '../../../../Redux/CategoryQuery';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { loginUSer } from '../../../../customHook/getrole';
import ArrowDown from '../../../../assest/image/arrow-down.png';

import { useRefreshTokenMutation } from '../../../../Redux/AuthSlice';
import useToast from '../../../../customHook/toast';

const NONE_CATEGORY = { id: '', name: 'None' }

interface CategoryModalProps {
  show: boolean;
  handleClose: () => void;
  categoryFilter: any;
}

const CategoryModal: FC<CategoryModalProps> = ({
  show,
  handleClose,
  categoryFilter,
}) => {
  const [create, { isLoading, isSuccess, isError, error, data }] =
    useCreateMutation();
  const [refreshtoken, Res] = useRefreshTokenMutation();

  const [selectedParentCat, setSelectedParentCat] = useState(-1);

  const navigate = useNavigate();
  const handleToast = useToast();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: '',
      category: '',
      parentName: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Category name is required'),
    }),
    onSubmit: (values, { setErrors }) => {
      if (selectedParentCat === -1) {
        setErrors({ category: 'Please select the Parent Category correctly' });
      } else {
        create({
          token: loginUSer.access,
          data: {
            ...values,
            parent_category: values.category,
            parentName: values.category ? values.parentName : '' },
        });
        handleClose();
      }
    },
  });

  useEffect(() => {
    if (isSuccess) {
      handleToast.SuccessToast(`New Category added successfully`);
    }

    if (isError) {
      if ((error as any)?.data) {
        handleToast.ErrorToast('Please login again.');
      } else {
        console.log('An unknown error occurred.');
      }
    }
  }, [isSuccess, isError, error, data]);

  const [FilterCategory, setFilterCategory] = useState([]);
  const [dataTypeOption, setDataTypeOption] = useState(false);
  const FilterData = (value: any) => {
    const trimmedValue = value.trim(); // Trim the input value
    if (trimmedValue !== '') {
      const categoryFilterWithNone: any = [...categoryFilter, NONE_CATEGORY];
      const res = categoryFilterWithNone.filter((i: any) =>
        i.name.toLowerCase().includes(trimmedValue.toLowerCase()),
      );
      setFilterCategory(res);
    } else {
      setFilterCategory([]);
    }
  };

  useEffect(() => {
    FilterData(formik.values.parentName);
    setSelectedParentCat(-1);
  }, [formik.values.parentName]);
  return (
    <>
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
            overflow: 'hidden',
          }}
        >
          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <div className="row mx-0 px-3">
                <div className="col-12 m-0">
                  <label htmlFor="category" className="form-label">
                    Category Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="form-control m-0"
                    required
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-danger">{formik.errors.name}</div>
                  ) : null}
                </div>

                <div className="col-12">
                  <label htmlFor="category" className="form-label">
                    Parent Category
                  </label>

                  <div className="dropdown">
                    <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input
                      type="text"
                      placeholder="Select a category"
                      value={formik.values.parentName}
                      onChange={(e) => {
                        const inputVal = e.target.value;
                        formik.setFieldValue('parentName', inputVal);

                        FilterData(inputVal);
                      }}
                      className={`form-control ${
                        formik.touched.category && formik.errors.category
                          ? 'input-error'
                          : ''
                      }`}
                      required
                    />
                    <div
                      className="dropdown-content"
                      style={{
                        maxHeight: '200px',
                        overflow: 'auto',
                        display: FilterCategory.length > 0 ? 'block' : 'none',
                      }}
                    >
                      {FilterCategory.length > 0 &&
                        FilterCategory.map((item: any, index: any) => (
                          <span
                            className="h6 hover-span"
                            key={item.name}
                            onClick={async () => {
                              await formik.setFieldValue(
                                'parentName',
                                item.name,
                              );
                              await formik.setFieldValue('category', item.id);
                              setSelectedParentCat(Number(`${item.id}`));
                              setFilterCategory([]);
                            }}
                          >
                            {item.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="col-12 row justify-content-evenly m-0">
                  <label
                    style={{ height: '33px' }}
                    htmlFor="category"
                    className="invisible"
                  >
                    Last Updated
                  </label>

                  <button
                    onClick={() =>
                      navigate(`/${ActiveRoute.CategoryManager.path}`)
                    }
                    className="btn border border-dark col-5 px-3 fw-bold"
                    type="button"
                  >
                    Edit All Categories
                  </button>
                  <button
                    className="btn btn-dark col-5 px-3 fw-bold"
                    type="submit"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CategoryModal;
