"use Client"

import React, { useEffect, useState } from 'react'

import { useSWRConfig } from "swr"
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Image from 'next/image';
import Loading from '@/components/loading';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { delete_a_product } from '@/Services/Admin/product';
import { delete_a_bookmark_item, get_all_bookmark_items } from '@/Services/common/bookmark';
import { setBookmark } from '@/utils/resolvers/CustomerDataSlice';
import { BookmarkSchema } from '@/model/Bookmark';
import { UserSessionSchema } from '@/model/User';
import { ProductSchema } from '@/model/Product';

export default function FavouriteProductDataTable() {
    const Router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.User.userData) as UserSessionSchema | null
    const [bookmarkData, setBookmarkData] = useState<ProductSchema[]>([]);
    const data = useSelector((state: RootState) => state.Customer.bookmark)
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState<ProductSchema[]>([]);

    useEffect(() => {
        if(data) setBookmarkData(data.products)
    }, [data])

    useEffect(() => {
        setFilteredData(bookmarkData);
    }, [bookmarkData])

    const columns = [
        {
            name: 'Product Name',
            selector: (row: ProductSchema) => row?.productName,
            sortable: true,
        },
        {
            name: 'Price',
            selector: (row: ProductSchema) => row?.productPrice,
            sortable: true,
        },
        {
            name: 'Image',
            cell: (row: ProductSchema) => <Image src={row?.productImageUrl || "/no-photo.jpg"} alt='No Image Found' className='py-2' width={100} height={100} />
        },
        {
            name: 'Action',
            cell: (row: ProductSchema) => (
                <div className='flex items-start justify-start px-2 h-20'>
                    <button onClick={() => handleDeleteProduct(row?.productId)} className=' w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700'>Delete</button>
                </div>
            )
        },

    ];

    const fetchBookmarkData = async () => {
        if (!user?.customerId) return Router.push('/')
        const cartData = await get_all_bookmark_items(user?.customerId)
        if (cartData?.status === 200) {
            dispatch(setBookmark(cartData?.data))
        } else {
            toast.error(cartData?.statusText)
        }
    }




    const handleDeleteProduct = async (productId: number) => {
        if (!user?.customerId) return Router.push('/')
        const res = await delete_a_bookmark_item(user?.customerId, productId);
        if (res?.status === 200) {
            toast.success("Bookmark deleted")
            fetchBookmarkData()
        }
        else {
            toast.error(res?.statusText)
        }
    }


    useEffect(() => {
        if (search === '') {
            setFilteredData(bookmarkData);
        } else {
            setFilteredData(bookmarkData?.filter((item) => {
                const itemData = item?.productName.toUpperCase();
                const textData = search.toUpperCase();
                return itemData.indexOf(textData) > -1;
            }))
        }


    }, [search, bookmarkData])



    return (
        <div className='w-full h-full'>
            <DataTable
                columns={columns}
                data={filteredData || []}
                key={'ThisProductData'}
                pagination
                keyField="id"
                title={`Favourite Products list`}
                fixedHeader
                fixedHeaderScrollHeight='750px'
                selectableRows
                selectableRowsHighlight
                persistTableHead
                subHeader
                subHeaderComponent={
                    <input className='w-60 dark:bg-transparent py-2 px-2  outline-none  border-b-2 border-orange-600' type={"search"}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={"Product Name"} />
                }
                className="bg-white px-4 h-5/6 "
            />

        </div>
    )
}

