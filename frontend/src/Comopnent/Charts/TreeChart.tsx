import React from 'react';
 

const array = [
  {
    categoryName: 'Model Summaries',
    subcategory: [
      {
        subcategoryName: 'Model Summaries-Tape',
        innerCategory: ['Tape Summary'],
      },
    ],
  },
  {
    categoryName: 'Bonds',
    subcategory: [
      {
        subcategoryName: 'Cross Market',
        innerCategory: [
          'Summary-XCCY',
          'Regression-XCCY',
          'Studies-XCCY',
        ],
      },
      {
        subcategoryName: 'USD Bonds',
        innerCategory: [
          'Summary-USD',
          'Regression-USD',
          'Studies-USD',
        ],
      },
      {
        subcategoryName: 'CAD Bonds',
        innerCategory: [
          'Summary-CAD',
          'Regression-CAD',
          'Studies-CAD',
        ],
      },
    ],
  },
  {
    categoryName: 'Tape',
    subcategory: [
      {
        subcategoryName: 'Trend',
        innerCategory: ['Trend 2.0'],
      },
    ],
  },
];

// Helper function to transform the data
const renderTree = (data:any) => {
  return (
    <ul>
      {data.map((item:any, index:any) => (
        <li key={index}>
          {item.categoryName}
          {item.subcategory && renderTree(item.subcategory)}
          {item.innerCategory && (
            <ul>
              {item.innerCategory.map((innerItem:any, innerIndex:any) => (
                <li key={innerIndex}>{innerItem}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

const CategoryTree = () => {
  return (
    <div className="category-tree">
      <h3>Category Tree</h3>
      {renderTree(array)}
    </div>
  );
};

export default CategoryTree;
