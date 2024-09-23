import { FC, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import {
  useRemoveMutation,
  useUpdateMutation,
} from "../../../../Redux/CategoryQuery";
import { log } from "console";
import useToast from "../../../../customHook/toast";
import DeleteModal from "../DeleteModal/DeleteModal";

interface NewCategoryModalProps {
  show: boolean;
  handleClose: () => void;
  selected: string;
  editingCategory: any | null;
  token: any;
  data: any;
  selectedPERnt: any;
  showDel: any;
}

const NewCategoryModal: FC<NewCategoryModalProps> = ({
  show,
  selected,
  handleClose,
  data,
  editingCategory,
  token,
  selectedPERnt,
  showDel,
}) => {
  const navigate = useNavigate();
  const [update, update_res] = useUpdateMutation();

  const handleToast = useToast();

  const [categoryName, setCategoryName] = useState(selected);
  const [parentCategory, setParentCategory] = useState(selectedPERnt);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.name);
      setParentCategory(selectedPERnt);
      setIsEditing(true);
    } else {
      setCategoryName("");
      setIsEditing(false);
    }
  }, [editingCategory, selected]);

  const handleSave = async () => {
    await update({
      token: token.access,
      id: editingCategory.id,
      data: {
        name: categoryName,
        parent_category: parentCategory.id,
      },
    });

    handleToast.SuccessToast(`Category updated successfully`);

    handleClose();
  };

  const handleDelete = async () => {
    handleClose();

    showDel(editingCategory);
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
        style={{ borderRadius: "25px", overflow: "hidden" }}
      >
        <h4>{isEditing ? "Edit Category" : "Create a Category"}</h4>
        <form method="post" encType="multipart/form-data">
          <div className="mb-3">
            <div className="row mx-0 px-3">
              <div className="col-12 m-0">
                <label htmlFor="category" className="form-label">
                  Category Name
                </label>
                <input
                  id="category"
                  name="category"
                  className="form-control m-0"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="col-12">
                <label htmlFor="parent_category" className="form-label">
                  parent_category Category
                </label>

                <div className="dropdown">
                  <input
                    type="text"
                    placeholder="All"
                    value={parentCategory.name}
                    readOnly
                  />
                  <div
                    className="dropdown-content"
                    style={{ height: "200px", overflow: "auto" }}
                  >
                    <span className="h6  ">
                      <span
                        className="hover-span text-muted"
                        onClick={() => setParentCategory({ name: "", id: "" })}
                      >
                        Null
                      </span>
                    </span>
                    {data.length > 0 &&
                      data.map((item: any, index: any) => (
                        <span className="h6  " key={item.name}>
                          <span
                            className="hover-span "
                            onClick={() => setParentCategory(item)}
                          >
                            {item.name}
                          </span>
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
                  Actions
                </label>
                {isEditing && (
                  <button
                    onClick={handleDelete}
                    className="btn btn-danger col-3 px-3 fw-bold"
                    type="button"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="btn btn-light border border-2 border-dark col-3 px-3 fw-bold"
                  type="button"
                >
                  Close
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-dark col-3 px-3 fw-bold"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default NewCategoryModal;
