import React, { useState } from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { Categoryarray2 } from '../../DummyData/TableData';
import NewCategoryModal from '../ui/Modals/NewCategoryModal/NewCategoryModal';
import DeleteModal from '../../pages/UploadScript/DeleteModal';
import { useNavigate } from 'react-router-dom';

const RenderTree = (data: any, categoryData: any, token: any, level = 0) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const [selectedPERnt, setSelectedPREnt] = useState('');
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
    setExpandedCategories((prev) =>
      prev.includes(name)
        ? prev.filter((category) => category !== name)
        : [...prev, name],
    );
  };

  const startEditing = (name: any, value: any, type: string = "update") => {
    if (type === "update") {
      setEditingCategory(name);
      setSelectedPREnt(value);
    } else {
      setEditingCategory(null);
      setSelectedPREnt(name);
    }
    handleShow(name);
  };
  const [del, setDel] = useState(false);

  const [delvalue, setDelete] = useState({});
  const [deleteText, setDeleteText] = useState("");

  const showDel = (value: any, count: any) => {
    setDelete(value);
    if(count >= 0) {
      setDeleteText("You are deleting this branch <b>" + value.name + "</b> and there are <b>" + count + "</b> of scripts linked to this branch");
    } else {
      setDeleteText("You are deleting this branch <b>" + value.name + "</b>");
    }
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
                style={{ cursor: 'pointer' }}
              >
                {item.name}
                <FaEdit
                  onClick={(e: any) => {
                    e.stopPropagation();
                    startEditing(item, { name: '', id: '' });
                  }}
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                />
                <FaPlus
                  onClick={(e: any) => {
                    e.stopPropagation();
                    startEditing(item, { name: '', id: '' }, "add");
                  }}
                  style={{ marginLeft: '8px', cursor: 'pointer' }}
                />
              </span>
              {expandedCategories.includes(item.name) && item.subcategories && (
                <ul>
                  {item.subcategories.map((innerItem: any, innerIndex: any) => (
                    <li key={innerIndex}
                      onClick={() => {

                      }}
                    >
                      <span
                        onClick={() => toggleExpand(innerItem.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        {innerItem.name}
                        <FaEdit
                          onClick={(e: any) => {
                            e.stopPropagation();
                            startEditing(innerItem, item);
                          }}
                          style={{ marginLeft: '8px', cursor: 'pointer' }}
                        />
                        <FaPlus
                          onClick={(e: any) => {
                            e.stopPropagation();
                            startEditing(innerItem, item, "add");
                          }}
                          style={{ marginLeft: '8px', cursor: 'pointer' }}
                        />
                      </span>
                      {expandedCategories.includes(innerItem.name) &&
                        innerItem.subcategories && (
                          <ul>
                            {innerItem.subcategories.map(
                              (subinnerItem: any, subinnerIndex: any) => (
                                <li key={subinnerIndex}>
                                  <span
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <span
                                      onClick={() => {
                                        localStorage.setItem("filterquery", JSON.stringify({
                                          category: item.id,
                                          category1: innerItem.id,
                                          category2: subinnerItem.id,
                                          parentName: item.name,
                                          parentName1: innerItem.name,
                                          number: 1,
                                          parentName2: subinnerItem.name
                                        }));
                                        window.location.href = (`/filter-scripts?category=${item.name}&category1=${innerItem.name}&category2=${subinnerItem.name}`);
                                      }}
                                    >
                                      {subinnerItem.name}
                                    </span>
                                    <span
                                      onClick={() =>
                                        startEditing(subinnerItem, innerItem)
                                      }
                                    >
                                      <FaEdit
                                        style={{ marginLeft: '8px', cursor: 'pointer' }}
                                      />
                                    </span>
                                  </span>
                                </li>
                              ),
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
        categoryData={categoryData}
        showDel={showDel}
        rootParent={false}
      />

      <DeleteModal
        show={del}
        handleClose={() => setDel(false)}
        token={token}
        data={delvalue}
        text={deleteText}
      />
    </>
  );
};

const CategoryTree = ({ categoryFilter, categoryData, token }: any) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const [selectedPERnt, setSelectedPREnt] = useState('');
  const [show, setShow] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [del, setDel] = useState(false);
  const [delvalue, setDelete] = useState({});
  const handleClose = () => {
    setShow(false);
    setEditingCategory(null);
  };

  const handleShow = (value: any) => {
    setSelected(value);
    setShow(true);
  };

  const startEditing = (name: any, value: any, type: string = "update") => {
    if (type === "update") {
      setEditingCategory(name);
      setSelectedPREnt(value);
    } else {
      setEditingCategory(null);
      setSelectedPREnt(name);
    }
    handleShow(name);
  };
  const showDel = (valuee: any, count: any) => {
    setDelete(valuee);
    
    setDel(true);
  };
  return (
    <div className="category-tree mx-auto w-25">
      <h3 className="d-flex center">
        Script Tree
        <FaPlus size={20} style={{ marginLeft: '10px', cursor: 'pointer', marginTop: '5px' }} cursor="pointer"
          onClick={(e: any) => {
            e.stopPropagation();
            startEditing("", { name: '', id: '' }, "update");
          }}
        />
      </h3>
      {RenderTree(categoryFilter, categoryData, token)}
      <NewCategoryModal
        show={show}
        handleClose={() => {setShow(false)}}
        selected={selected}
        selectedPERnt={selectedPERnt}
        editingCategory={editingCategory}
        data={categoryData}
        token={token}
        categoryData={categoryData}
        showDel={showDel}
        rootParent={true}
      />
    </div>
  );
};

export default CategoryTree;
