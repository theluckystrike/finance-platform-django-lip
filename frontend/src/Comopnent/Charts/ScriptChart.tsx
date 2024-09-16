import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Categoryarray2, ScriptData } from "../../DummyData/TableData";
import NewCategoryModal from "../ui/Modals/NewCategoryModal/NewCategoryModal";
import { useNavigate } from "react-router-dom";
import { ActiveRoute } from "../../Menu";

const RenderTree = (data: any, level = 0) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [show, setShow] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

const navigate =useNavigate()

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
                {/* <FaEdit
                  onClick={(e: any) => {
                    e.stopPropagation();
                    startEditing(item.name);
                  }}
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                /> */}
              </span>
              {expandedCategories.includes(item.name) && item.subcategory && (
                <ul>
                  {item.subcategory.map((innerItem: any, innerIndex: any) => (
                    <li key={innerIndex}>
                      <span
                        onClick={() => toggleExpand(innerItem.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        {innerItem.name}
                        {/* <FaEdit
                          onClick={(e: any) => {
                            e.stopPropagation();
                            startEditing(innerItem.name);
                          }}
                          style={{ marginLeft: '8px', cursor: 'pointer' }}
                        /> */}
                      </span>
                      {expandedCategories.includes(innerItem.name) && innerItem.innerCategory && (
                        <ul>
                          {innerItem.innerCategory.map(
                            (subinnerItem: any, subinnerIndex: any) => (
                              <li key={subinnerIndex}>
                                <span
                                onClick={() => toggleExpand(subinnerItem)}
                                  // onClick={() => handleShow(subinnerItem)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {subinnerItem}
                                </span>
                                {expandedCategories.includes(subinnerItem) && subinnerItem && (
                        <ul>
                          {ScriptData.slice(0,5).map(
                            (scriptItem: any, scriptItemIndex: any) => (
                              <li key={scriptItemIndex} style={{width:'200%'}}>
                                <span
                                  onClick={() => navigate(`/account/${ActiveRoute.ScriptDetails.path}?chartname=${scriptItem.chart}`)}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {scriptItem.title}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      )}
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
        token={''}
        data={''}
      />
    </>
  );
};

const ScriptChart = () => {
  return (
    <div className="category-tree mx-auto w-25">
      <h3>Script Tree</h3>
      {RenderTree(Categoryarray2)}
    </div>
  );
};

export default ScriptChart;
