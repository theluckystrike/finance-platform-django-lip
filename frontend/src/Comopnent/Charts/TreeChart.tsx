import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Categoryarray2 } from "../../DummyData/TableData";
import NewCategoryModal from "../ui/Modals/NewCategoryModal/NewCategoryModal";
import DeleteModal from "../../pages/UploadScript/DeleteModal";

const RenderTree = (data: any, token: any, level = 0) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [selectedPERnt, setSelectedPREnt] = useState("");
  const [show, setShow] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryid, setEditingCategoryid] = useState<string | null>(
    null
  );

  const handleClose = () => {
    setShow(false);
    setEditingCategory(null);
  };

  const handleShow = (value: any) => {
    setSelected(value);
    setShow(true);
  };

  const toggleExpand = (name: string) => {
    setExpandedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((category) => category !== name)
        : [...prev, name]
    );
  };

  const startEditing = (name: any, value: any) => {
    setEditingCategory(name);
    setSelectedPREnt(value);

    handleShow(name);
  };

  const [del, setDel] = useState(false);
  const [delvalue, setDelete] = useState({});
  const showDel = (valuee: any) => {
    setDelete(valuee);
    setDel(true);
  };
  return (
    <>
      <ul className="tree-class">
        {data.map((item: any, index: any) => (
          <li key={index}>
            <div>
              <span
                onClick={() => toggleExpand(item.name)}
                style={{ cursor: "pointer" }}
              >
                {item.name}
                <FaEdit
                  onClick={(e: any) => {
                    e.stopPropagation();
                    startEditing(item, { name: "", id: "" });
                  }}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                />
              </span>
              {expandedCategories.includes(item.name) && item.subcategories && (
                <ul>
                  {item.subcategories.map((innerItem: any, innerIndex: any) => (
                    <li key={innerIndex}>
                      <span
                        onClick={() => toggleExpand(innerItem.name)}
                        style={{ cursor: "pointer" }}
                      >
                        {innerItem.name}
                        <FaEdit
                          onClick={(e: any) => {
                            e.stopPropagation();
                            startEditing(innerItem, item);
                          }}
                          style={{ marginLeft: "8px", cursor: "pointer" }}
                        />
                      </span>
                      {expandedCategories.includes(innerItem.name) &&
                        innerItem.subcategories && (
                          <ul>
                            {innerItem.subcategories.map(
                              (subinnerItem: any, subinnerIndex: any) => (
                                <li key={subinnerIndex}>
                                  <span
                                    onClick={() =>
                                      startEditing(
                                        { name: subinnerItem.name },
                                        innerItem
                                      )
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {subinnerItem.name}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
      <NewCategoryModal
        show={show}
        handleClose={handleClose}
        selected={selected}
        selectedPERnt={selectedPERnt}
        editingCategory={editingCategory}
        data={data}
        token={token}
        showDel={showDel}
      />

      <DeleteModal
        show={del}
        handleClose={() => setDel(false)}
        token={token}
        data={delvalue}
      />
    </>
  );
};

const CategoryTree = ({ categoryFilter, token }: any) => {
  return (
    <div className="category-tree mx-auto col-3">
      <h3>Category Tree</h3>
      {RenderTree(categoryFilter, token)}
    </div>
  );
};

export default CategoryTree;
