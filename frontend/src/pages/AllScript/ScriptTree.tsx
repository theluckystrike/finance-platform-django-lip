import React, { useEffect, useState } from 'react';
import ScriptChart from '../../Comopnent/Charts/ScriptChart';
import { useNavigate } from 'react-router-dom';
import Icon from '../../Comopnent/ui/icon/Icon';
import { useGetAllCategoryQuery } from '../../Redux/CategoryQuery';
import { FaPlus } from 'react-icons/fa';

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
  const { data: AllCategory, isError, refetch } = useGetAllCategoryQuery({
    token: loginUser.access,
  });

  // Add effect to refetch data when component mounts or when returning from other pages
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Also refetch when component mounts
    refetch();
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetch]);
  
  const categoryData = AllCategory?.results || [];
  const [categoryFilter, setCategoryFilter] = useState<any>([]);

  useEffect(() => {
    const categoryMap: any = {};
    const category_data = JSON.parse(JSON.stringify(categoryData));
    
    // Initialize all categories in the map
    category_data.forEach((cat: any) => {
      categoryMap[cat.id] = { ...cat, subcategories: [] };
    });
    
    // Build the hierarchy
    category_data.forEach((cat: any) => {
      if (cat.parent_category !== null) {
        const parent: any = categoryMap[cat.parent_category];
        if (parent) {
          parent.subcategories.push(categoryMap[cat.id]);
        }
      }
    });

    // Get root categories (level 0)
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
        <h3 className="h1 fw-bold d-flex">
          Script Tree By Category
        </h3>
      </div>
      <ScriptChart
        categoryFilter={categoryFilter}
        categoryData={categoryData}
        token={loginUser}
      />
    </div>
  );
};

export default ScriptTree;
