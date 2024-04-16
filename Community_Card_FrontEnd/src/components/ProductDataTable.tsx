"use Client"

import React, { useEffect, useState } from 'react'

import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Image from 'next/image';
import Loading from '@/components/loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { delete_a_product, update_a_product } from '@/Services/Admin/product';
import { ProductSchema } from '@/model/Product';
import { setProdUpdate } from '@/utils/resolvers/SellerSlice';
import GetData from './GetData';
import QtyUpdate from './QtyUpdate';

export default function ProductDataTable() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [prodData, setprodData] = useState<ProductSchema[] | []>([]);
  const data = useSelector((state: RootState) => state.Seller.product)
  const allCats = useSelector((state: RootState) => state.Seller.allCategories)
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<ProductSchema[] | []>([]);

  useEffect(() => {
    setprodData(Object.values(data))
  }, [data])

  useEffect(() => {
    setFilteredData(prodData);
  }, [prodData])

  const updateProdData = async (updatedProd: ProductSchema) => {
    dispatch(setProdUpdate(true))
    let copyOfData = JSON.parse(JSON.stringify(data))
    copyOfData[updatedProd.productId] = updatedProd;

    setprodData(Object.values(copyOfData));
  }

  const columns = [
    {
      name: 'ID',
      selector: (row: ProductSchema) => row?.productId,
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row: ProductSchema) => row?.productName,
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row: ProductSchema) => allCats[row?.categoryId].categoryName,
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row: ProductSchema) => row?.available ? 'In stock' : 'Out of stock',
      sortable: true,
    },
    {
      name: 'Quantity',
      cell: (row: ProductSchema) => (
        <QtyUpdate key={row.productId} product={row} qty={row.productQuantity}
          toggleLoading={(isLoading: boolean) => setIsLoading(isLoading)}
          onProdUpdate={(updatedOrder: ProductSchema) => updateProdData(updatedOrder)}
        />
      )
    },
    {
      name: 'Image',
      cell: (row: ProductSchema) => <Image src={row?.productImageUrl ? `${row.productImageUrl}?${Date.now()}` : "/no-photo.jpg"} alt='No Image Found' className='py-2' width={100} height={100} />
    },
    {
      name: 'Action',
      cell: (row: ProductSchema) => (
        <div className='flex items-center justify-start px-2 h-20'>
          <button onClick={() => router.push(`/product/update-product/${row?.productId}`)} className=' w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700'>Update</button>
          {/* <button onClick={() => handleDeleteProduct(row?.productId)} className=' w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700'>Delete</button> */}
          {row?.productQuantity > 0 || row?.available ? <button onClick={() => handleOutOfStock(row?.productId)} className=' w-20 py-2 mx-2 text-xs text-yellow-600 hover:text-white my-2 hover:bg-yellow-600 border border-yellow-600 rounded transition-all duration-700'>Out of Stock</button> : ""}
        </div>
      )
    },

  ];


  const handleOutOfStock = async (id: number) => {
    setIsLoading(true);
    try {
      const updatedProd = {
        ...data[id],
        productQuantity: 0,
        available: false
      };
      const res = await update_a_product(updatedProd)
      if (res?.status === 200) {
        toast.success("Status updated")
        updateProdData(updatedProd);
        dispatch(setProdUpdate(true))
        setIsLoading(false);
      }
      else {
        toast.error("Unable to update stock status.")
        setIsLoading(false);
      }
    } catch {
      toast.error("Unable to update stock status.")
      setIsLoading(false);
    }
  }


  useEffect(() => {
    if (search === '') {
      setFilteredData(prodData);
    } else {
      setFilteredData(prodData?.filter((item) => {
        const itemData = item?.productName.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }))
    }


  }, [search, prodData])

  if (!isLoading)
    return (
      <GetData>
        <div className='w-full h-full'>
          <DataTable
            columns={columns}
            data={filteredData || []}
            key={'ThisProductData'}
            pagination
            keyField="id"
            title={`Products list`}
            fixedHeader
            fixedHeaderScrollHeight='500px'
            selectableRows
            selectableRowsHighlight
            persistTableHead
            progressPending={isLoading}
            progressComponent={<Loading />}
            subHeader
            subHeaderComponent={
              <input className='w-60 dark:bg-transparent py-2 px-2  outline-none  border-b-2 border-orange-600' type={"search"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={"Product Name"} />
            }
            className="bg-white px-4 h-4/6 "
          />
        </div>
      </GetData>
    )
  else return <Loading />
}

