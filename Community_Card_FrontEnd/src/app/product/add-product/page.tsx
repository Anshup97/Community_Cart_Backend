"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import Cookies from 'js-cookie';
import { add_new_product, upload_product_photo } from '@/Services/Admin/product';
import { CreateProductSchema } from '@/model/Product';
import { CategorySchema } from '@/model/Category';
import { UserSessionSchema } from '@/model/User';
import { get_all_categories } from '@/Services/Admin/category';
import { setProdUpdate } from '@/utils/resolvers/SellerSlice';
import GetData from '@/components/GetData'



type Inputs = {
    name: string,
    description: string,
    slug: string,
    feature: boolean,
    price: number,
    quantity: number,
    categoryId: number,
    image: Array<File>,
}

const maxSize = (value: File) => {
    const fileSize = value.size / 1024 / 1024;
    return fileSize < 1 ? false : true
}



export default function AddProduct() {

    const [loader, setLoader] = useState(false)
    const [categories, setCategories] = useState<CategorySchema[]>([])
    const Router = useRouter();
    const dispatch = useDispatch();
    const sellerId = useSelector((state: RootState) => state.Seller.seller?.sellerId) as number
    const allCats = useSelector((state: RootState) => state.Seller.allCategories)

    useEffect(() => {
        const user: UserSessionSchema | null = JSON.parse(localStorage.getItem('user') || '{}');
        if (!Cookies.get('token') || user?.role !== 'SELLER') {
            Router.push('/')
        }

    }, [Router])

    useEffect(() => {
        const getCatForDropdown = async () => {
            setLoader(true)
            const categoryRes = await get_all_categories();
            if (categoryRes?.status !== 200) toast.error(categoryRes?.statusText)
            setCategories(categoryRes?.data)
            setLoader(false)
        }
        if (Object.keys(allCats).length === 0) getCatForDropdown()
        else {
            setCategories(Object.values(allCats))
            setLoader(false)
        }
    }, [])

    const { register, formState: { errors }, handleSubmit } = useForm<Inputs>({
        criteriaMode: "all"
    });

    const onSubmit: SubmitHandler<Inputs> = async data => {
        setLoader(true)
        const CheckFileSize = maxSize(data.image[0]);
        if (CheckFileSize) return toast.error('Image size must be less then 1MB')

        const prdData: CreateProductSchema = { productName: data.name, productDescription: data.description, productSlug: "", productFeatured: data.feature, productPrice: data.price, productQuantity: data.quantity, categoryId: data.categoryId, sellerId: sellerId }
        const regRes = await add_new_product(prdData)
        if (regRes?.status === 201) {
            toast.success("Product added");
            dispatch(setProdUpdate(true));
            if (data.image[0]) {
                const photoRes = await upload_product_photo(data.image[0], regRes.data.productId)
                if (photoRes?.status === 201) {
                    toast.success("Error uploading product image");
                }
            }
            setTimeout(() => {
                Router.push('/Dashboard')
            }, 2000);
            setLoader(false)
        } else {
            toast.error(regRes?.statusText)
            setLoader(false)
        }
    }






    return (
        <GetData>
            <div className='w-full  p-4 min-h-screen  bg-gray-50 flex flex-col '>
                <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
                    <ul className='dark:text-black'>
                        <li>
                            <Link href={"/Dashboard"}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Home
                            </Link>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Add Product
                        </li>
                    </ul>
                </div>
                <div className='w-full h-20 my-2 text-center'>
                    <h1 className='text-2xl py-2 dark:text-black '>Add Product</h1>
                </div>
                {
                    loader ? (
                        <div className='w-full  flex-col h-96 flex items-center justify-center '>
                            <TailSpin
                                height="50"
                                width="50"
                                color="orange"
                                ariaLabel="tail-spin-loading"
                                radius="1"
                                wrapperStyle={{}}
                                wrapperClass=""
                                visible={true}
                            />
                            <p className='text-sm mt-2 font-semibold text-orange-500'>Loading ....</p>
                        </div>
                    ) : (

                        <div className='w-full h-full flex items-start justify-center'>
                            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg  py-2 flex-col ">
                                <div className="form-control w-full max-w-full">
                                    <label className="label">
                                        <span className="label-text">Choose Category</span>
                                    </label>
                                    <select   {...register("categoryId", { required: true })} className="select select-bordered">
                                        <option disabled selected>Pick  one category </option>
                                        {
                                            categories?.map((item) => {
                                                return (
                                                    <option key={item.categoryId} value={item.categoryId}>{item.categoryName}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-control w-full mb-2">
                                    <label className="label">
                                        <span className="label-text">Product Name</span>
                                    </label >
                                    <input {...register("name", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                    {errors.name && <span className='text-red-500 text-xs mt-2'>This field is required</span>}
                                </div >
                                <div className="form-control w-full mb-2">
                                    <label className="label">
                                        <span className="label-text">Product Price</span>
                                    </label>
                                    <input  {...register("price", { required: true })} type="number" placeholder="Type here" className="input input-bordered w-full" />
                                    {errors.slug && <span className='text-red-500 text-xs mt-2'>This field is required</span>}

                                </div>
                                <div className="form-control w-full mb-2">
                                    <label className="label">
                                        <span className="label-text">Product Quantity</span>
                                    </label>
                                    <input  {...register("quantity", { required: true })} type="number" placeholder="Type here" className="input input-bordered w-full" />
                                    {errors.slug && <span className='text-red-500 text-xs mt-2'>This field is required</span>}

                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Product Description</span>
                                    </label>
                                    <textarea  {...register("description", { required: true })} className="textarea textarea-bordered h-24" placeholder="Description"></textarea>
                                    {errors.description && <span className='text-red-500 text-xs mt-2'>This field is required</span>}

                                </div>
                                <div className="form-control py-2">
                                    <label className="label cursor-pointer">
                                        <span className="label-text">Featured Product</span>
                                        <input {...register("feature")} type="checkbox" className="checkbox dark:border-black" />
                                    </label>
                                </div>
                                <div className="form-control w-full ">
                                    <label className="label">
                                        <span className="label-text">Add product Image</span>
                                    </label>
                                    <input accept="image/*" max="1000000"  {...register("image", { required: true })} type="file" className="file-input file-input-bordered w-full " />
                                    {errors.image && <span className='text-red-500 text-xs mt-2'>This field is required and the image must be less than or equal to 1MB.</span>}

                                </div>

                                <button className='btn btn-block mt-3'>Done !</button>

                            </form >
                        </div >

                    )
                }

                <ToastContainer />
            </div >
        </GetData>
    )
}

