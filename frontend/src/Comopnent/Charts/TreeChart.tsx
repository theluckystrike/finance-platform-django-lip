import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Categoryarray2 } from "../../DummyData/TableData";
import NewCategoryModal from "../ui/Modals/NewCategoryModal/NewCategoryModal";

const RenderTree = (data: any,token:any, level = 0) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [show, setShow] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const handleClose = () => {
    setShow(false);
    setEditingCategory(null);
  };

  const handleShow = (value: any) => {
    setSelected(value);
    setShow(true);
  };

  const toggleExpand = (name: string) => {
    setExpandedCategories(prev => 
      prev.includes(name) ? prev.filter(category => category !== name) : [...prev, name]
    );
  };

  const startEditing = (name: string) => {
    setEditingCategory(name);
    handleShow(name);
  };

  return (
    <>
      <ul className="tree-class">
        {data.map((item: any, index: any) => (
          <li key={index}>
            <div>
              <span
                onClick={() => toggleExpand(item.name)}
                style={{ cursor: 'pointer' }}
              >
                {item.name}
                <FaEdit
                  onClick={(e: any) => {
                    e.stopPropagation();
                    startEditing(item);
                  }}
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                />
              </span>
              {expandedCategories.includes(item.name) && item.subcategories && (
                <ul>
                  {item.subcategories.map((innerItem: any, innerIndex: any) => (
                    <li key={innerIndex}>
                      <span
                        onClick={() => toggleExpand(innerItem.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        {innerItem.name}
                        <FaEdit
                          onClick={(e: any) => {
                            e.stopPropagation();
                            startEditing(innerItem );
                          }}
                          style={{ marginLeft: '8px', cursor: 'pointer' }}
                        />
                      </span>
                      {expandedCategories.includes(innerItem.name) && innerItem.subcategories && (
                        <ul>
                          {innerItem.subcategories.map(
                            (subinnerItem: any, subinnerIndex: any) => (
                              <li key={subinnerIndex}>
                                <span
                                  onClick={() => handleShow(subinnerItem)}
                                  style={{ cursor: 'pointer' }}
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
        editingCategory={editingCategory} 
        data={data}
        token={token}
      />
    </>
  );
};

const CategoryTree = ({categoryFilter,token}:any) => {
  return (
    <div className="category-tree mx-auto w-25">
      <h3>Category Tree</h3>
      {RenderTree(categoryFilter,token)}
    </div>
  );
};

export default CategoryTree;
