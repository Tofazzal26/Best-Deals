import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import SectionHeader from '../ReUsableComponent/SectionHeader';
import ProductsCard from '../ProductsCard/ProductsCard';



const FeaturedProducts = () => {

  
  const axiosCommon = useAxiosCommon();

  // Use React Query to fetch the featured products
  const { data :featuredProducts, isLoading, isError } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const res = await axiosCommon.get(`/all-products?isFeatured=true`);
      return res.data;
    },
  });

  // Loading state
  if (isLoading) return <div>Loading...</div>;

  // Error state
  if (isError) return <div>Error loading featured products</div>;

  // Render the featured products
  return (
    <div className="my-10">
      <SectionHeader 
      title={'Featured Products Collections'}
      description={'Find all Featured Products, On Going Discount and sales, HurryUP..!!'}
      ></SectionHeader>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {
          featuredProducts.map(featuredProduct=>
          <ProductsCard
          key={featuredProduct._id}
          product={featuredProduct}
          ></ProductsCard>)
        }
      </div>
    </div>
  );
};

export default FeaturedProducts;
