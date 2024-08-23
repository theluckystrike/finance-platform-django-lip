import React, { useState } from "react";
import NewCategoryModal from "../ui/Modals/NewCategoryModal/NewCategoryModal";
import { Categoryarray } from "../../DummyData/TableData";

 

// Helper function to transform the data
const RenderTree = (data: any) => {
  const [selected, setSelected] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (value: any) => {
 
    setSelected(value);
    setShow(true);
  };

  return (
    <>
      <ul className="tree-class">
        {data.map((item: any, index: any) => (
          <li key={index}>
            <span onClick={() => handleShow(item.name)}  style={{cursor: 'pointer'}}> {item.name}</span>
            {/* {item.subcategory  && RenderTree(item.subcategory)} */}
            {item.subcategory && (
              <ul>
                {item.subcategory.map((innerItem: any, innerIndex: any) => (
                  <li key={innerIndex}>
                    <span onClick={() => handleShow(innerItem.name)}  style={{cursor: 'pointer'}}>
                      {" "}
                      {innerItem.name}
                    </span>

                    {/* {innerItem.innerCategory  && RenderTree(innerItem.innerCategory)} */}
                    {innerItem.innerCategory && (
                      <ul>
                        {innerItem.innerCategory.map(
                          (subinnerItem: any, subinnerIndex: any) => (
                            <li key={subinnerIndex}>
                              <span onClick={() => handleShow(subinnerItem)}  style={{cursor: 'pointer'}}>
                                {subinnerItem}
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
          </li>
        ))}
      </ul>
      <NewCategoryModal
        show={show}
        handleClose={handleClose}
        selected={selected}
      />
    </>
  );
};

const CategoryTree = () => {
  return (
    <div className="category-tree mx-auto w-25">
      <h3>Category Tree</h3>
      {RenderTree(Categoryarray)}
    </div>
  );
};

export default CategoryTree;
