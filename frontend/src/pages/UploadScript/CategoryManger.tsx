import React, { useEffect, useState } from 'react'
import OrgChartTree from '../../Comopnent/Charts/TreeChart'
import { useNavigate } from 'react-router-dom'
import Icon from '../../Comopnent/ui/icon/Icon'
import { useGetAllCategoryQuery } from '../../Redux/CategoryQuery'
import { loginUSer } from '../../customHook/getrole'

const CategoryManger = () => {
  const Navigate =useNavigate()

  const { data: AllCategory, isError } = useGetAllCategoryQuery({ token: loginUSer.access });

  const categoryData = AllCategory?.categories || [];




const [categoryFilter,setCategoryFilter ]=useState<any>([])

useEffect(() => {
  const categoryMap: any = {};

  // Initialize categories in the map
  categoryData.forEach((cat: any) => {
    categoryMap[cat.id] = { ...cat, subcategories: [] };
  });

  // Populate the subcategories
  categoryData.forEach((cat: any) => {
    if (cat.parent_name === null) {
      // Root category, do nothing here
    } else {
      // Find the parent category and add the current category as a subcategory
      const parent:any = Object.values(categoryMap).find(
        (parentCat: any) => parentCat.name === cat.parent_name
      );
      if (parent) {
        parent.subcategories.push(categoryMap[cat.id]);
      }
    }
  });

  // Extract root categories
  const structuredCategories = Object.values(categoryMap).filter(
    (cat: any) => cat.parent_name === null
  );
console.log(structuredCategories);

  setCategoryFilter(structuredCategories);

}, [categoryData]);










  return (
    <div className='m-4'>
         <div className="d-flex justify-content-start flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 text-center">
       <button className='btn mb-3' onClick={()=>Navigate(-1)}><Icon icon='ArrowBack'size='45px'  color="dark"/></button> <h3 className="h1 fw-bold">Category manager</h3>
      </div>
        <OrgChartTree categoryFilter={categoryFilter}/>
    </div>
  )
}

export default CategoryManger