import { FC, useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

interface NewCategoryModalProps {
  show: boolean;
  handleClose: () => void;
  selected: string;
  editingCategory: string | null;
}

const NewCategoryModal: FC<NewCategoryModalProps> = ({
  show,
  selected,
  handleClose,
  editingCategory,
}) => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState(selected);
  const [parentCategory, setParentCategory] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory);
      setIsEditing(true);
    } else {
      setCategoryName("");
      setIsEditing(false);
    }
  }, [editingCategory, selected]);

  const handleSave = () => {
    console.log(
      "Saving category:",
      categoryName,
      "Parent Category:",
      parentCategory
    );
    handleClose();
  };

  const handleDelete = () => {
    console.log("Deleting category:", categoryName);
    handleClose();
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
              <div className="col-12 m-0">
                <label htmlFor="parentCategory" className="form-label">
                  Parent Category
                </label>
                <select
                  id="parentCategory"
                  name="parentCategory"
                  className="form-select m-0"
                  value={parentCategory}
                  onChange={(e) => setParentCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    All
                  </option>
                  {/* Populate this dynamically from your data */}
                  <option value="Returns">Returns</option>
                  <option value="USD">USD</option>
                  <option value="Bonds">Bonds</option>
                  <option value="CAD">CAD</option>
                  <option value="Breadth">Breadth</option>
                </select>
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
