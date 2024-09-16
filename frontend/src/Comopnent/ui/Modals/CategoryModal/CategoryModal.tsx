import { FC, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { ActiveRoute } from "../../../../Menu";
import { Categoryarray } from "../../../../DummyData/TableData";
import { useCreateMutation } from "../../../../Redux/CategoryQuery";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUSer } from "../../../../customHook/getrole";

import { useRefreshtokenMutation } from "../../../../Redux/AuthSlice";
import useToast from "../../../../customHook/toast";
import { useSelector } from "react-redux";

interface CategoryModalProps {
  show: boolean;
  handleClose: () => void;
  categoryFilter: any[];
}

const CategoryModal: FC<CategoryModalProps> = ({
  show,
  handleClose,
  categoryFilter,
}) => {
  const [create, { isLoading, isSuccess, isError, error, data }] =
    useCreateMutation();
  const [refreshtoken, Res] = useRefreshtokenMutation();

  console.log(categoryFilter);

  const navigate = useNavigate();
  const [selectValue, setSelectValue] = useState("");
  const handleToast = useToast();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      parent: "",
      parentName:""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Category name is required"),
    }),
    onSubmit: (values) => {
      // Handle form submission
      create({ token: loginUSer.access, data: values }); // Call mutation with form values
      handleClose();
    },
  });

  useEffect(() => {
    if (isSuccess) {
      handleToast.SuccessToast(`New Category added successfully`);
    }

    if (isError) {
      if ((error as any)?.data) {
        // console.log('Calling refresh token...');
        // refreshtoken({
        //   token: loginUSer.refresh,
        //   page_no: 1,
        //   page_size: 1000,
        // })
        // console.log('Refresh token data:');
        handleToast.ErrorToast(
          "Token is invalid or expired. Please login again."
        );
        navigate("/login");
        localStorage.removeItem("login");
        const apiError = (error as any).data as { detail?: string };
        console.log("Error:", apiError.detail || "An unknown error occurred");
      } else {
        console.log("An unknown error occurred.");
      }
    }
  }, [isSuccess, isError, error, data]);
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
            borderRadius: "25px",
            overflow: "hidden",
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
                  <label htmlFor="parent" className="form-label">
                    Parent Category
                  </label>

                  <div className="dropdown">
                    <input
                      type="text"
                      placeholder="All"
                      value={formik.values.parentName}
                      readOnly
                    />
                    <div
                      className="dropdown-content"
                      style={{ height: "200px", overflow: "auto" }}
                    >
                      {categoryFilter.length > 0 &&
                        categoryFilter.map((item: any, index: any) => (
                          <span className="h6  " key={item.name}>
                            <span
                              className="hover-span "
                              onClick={() =>
                               { formik.setFieldValue("parent", item.id)
                                formik.setFieldValue("parentName", item.name)
                               }
                              }
                            >
                              {item.name}
                            </span>
                            {item.subcategories?.map(
                              (subitem: any, subindex: any) => (
                                <span
                                  className="text-muted hover-span"
                                  key={subindex}
                                >
                                  <span
                                    className="hover-span  text-muted"
                                    onClick={() =>
                                      { formik.setFieldValue("parent", subitem.id)
                                        formik.setFieldValue("parentName", subitem.name)
                                       }
                                    }
                                  >
                                    {subitem.name}
                                  </span>
                                  {subitem.subcategories?.map(
                                    (inneritem: any, innerindex: any) => (
                                      <span className="fs-6 " key={innerindex}>
                                        <span
                                          className="hover-span  text-mute"
                                          onClick={() =>
                                            { formik.setFieldValue("parent", inneritem.id)
                                              formik.setFieldValue("parentName", inneritem.name)
                                             }
                                          }
                                        >
                                          {inneritem.name}
                                        </span>
                                      </span>
                                    )
                                  )}
                                </span>
                              )
                            )}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="col-12 row justify-content-evenly m-0">
                  <label
                    style={{ height: "33px" }}
                    htmlFor="category"
                    className="invisible"
                  >
                    Last Updated
                  </label>

                  <button
                    onClick={() =>
                      navigate(`/account/${ActiveRoute.CategoryManager.path}`)
                    }
                    className="btn border border-dark col-5 px-3 fw-bold"
                    type="button"
                  >
                    Edit All Category
                  </button>
                  <button
                    className="btn btn-dark col-5 px-3 fw-bold"
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
    </>
  );
};

export default CategoryModal;
