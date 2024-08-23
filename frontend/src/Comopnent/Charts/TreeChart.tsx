import React, { useState } from "react";
import NewCategoryModal from "../ui/Modals/NewCategoryModal/NewCategoryModal";

const array = [
  {
    name: "Model Summaries",
    subcategory: [
      {
        name: "Model Summaries-Tape",
        innerCategory: ["Tape Summary", "Tape Summary"],
      },
    ],
  },
  {
    name: "Bonds",
    subcategory: [
      {
        name: "Cross Market",
        innerCategory: ["Summary-XCCY", "Regression-XCCY", "Studies-XCCY"],
      },
      {
        name: "USD Bonds",
        innerCategory: ["Summary-USD", "Regression-USD", "Studies-USD"],
      },
      {
        name: "CAD Bonds",
        innerCategory: ["Summary-CAD", "Regression-CAD", "Studies-CAD"],
      },
    ],
  },
  {
    name: "Tape",
    subcategory: [
      {
        name: "Trend",
        innerCategory: ["Trend 2.0"],
      },
    ],
  },
];

// Helper function to transform the data
const RenderTree = (data: any) => {
  const [selected, setSelected] = useState("");
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (value: any) => {
    console.log("am running");
    setSelected(value);
    setShow(true);
  };

  return (
    <>
      <ul className="tree-class">
        {data.map((item: any, index: any) => (
          <li key={index}>
            <span onClick={() => handleShow(item.name)}> {item.name}</span>
            {/* {item.subcategory  && RenderTree(item.subcategory)} */}
            {item.subcategory && (
              <ul>
                {item.subcategory.map((innerItem: any, innerIndex: any) => (
                  <li key={innerIndex}>
                    <span onClick={() => handleShow(innerItem.name)}>
                      {" "}
                      {innerItem.name}
                    </span>

                    {/* {innerItem.innerCategory  && RenderTree(innerItem.innerCategory)} */}
                    {innerItem.innerCategory && (
                      <ul>
                        {innerItem.innerCategory.map(
                          (subinnerItem: any, subinnerIndex: any) => (
                            <li key={subinnerIndex}>
                              <span onClick={() => handleShow(subinnerItem)}>
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
      {RenderTree(array)}
    </div>
  );
};

export default CategoryTree;
