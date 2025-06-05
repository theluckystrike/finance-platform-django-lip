import React, { useEffect, useState } from 'react';
import ScriptChart from '../../Comopnent/Charts/ScriptChart';
import { useNavigate } from 'react-router-dom';
import Icon from '../../Comopnent/ui/icon/Icon';
import { useGetAllCategoryQuery } from '../../Redux/CategoryQuery';

const ScriptTree = () => {
  const [loginUser, setLoginUser] = useState<any>(
    JSON.parse(localStorage.getItem('login') as any),
  );

  useEffect(() => {
    const storedLoginUser = localStorage.getItem('login');
    if (storedLoginUser) {
    }
  }, []);

  const Navigate = useNavigate();
  const { data: AllCategory, isError } = useGetAllCategoryQuery({
    token: loginUser.access,
  });
  
  const categoryData = AllCategory?.results || [];
  const parentCategory = categoryData.filter((item: any) => item.level !== 2);
  const [categoryFilter, setCategoryFilter] = useState<any>([]);

  useEffect(() => {
    const categoryMap: any = {};
    const category_data = JSON.parse(JSON.stringify(categoryData));
    category_data.forEach((cat: any) => {
      categoryMap[cat.id] = { ...cat, subcategories: [] };
    });
    category_data.forEach((cat: any) => {
      if (cat.parent_category === null) {
      } else {
        const parent: any = Object.values(categoryMap).find(
          (parentCat: any) => parentCat.id === cat.parent_category,
        );
        if (parent) {
          parent.subcategories.push(categoryMap[cat.id]);
        }
      }
    });

    const structuredCategories = Object.values(categoryMap).filter(
      (cat: any) => cat.parent_category === null,
    );
    setCategoryFilter(structuredCategories);
  }, [categoryData]);

  return (
    <div className="m-4">
      <div className="d-flex justify-content-start flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 text-center">
        <button className="btn mb-3" onClick={() => Navigate(-1)}>
          <Icon icon="ArrowBack" size="45px" color="dark" />
        </button>{' '}
        <h3 className="h1 fw-bold">Script Tree By Category</h3>
      </div>
      <ScriptChart
        categoryFilter={categoryFilter}
        categoryData={parentCategory}
        token={loginUser}
      />
    </div>
  );
};

export default ScriptTree;
