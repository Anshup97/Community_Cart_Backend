"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';
import useSWR from 'swr'
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setNavActive, setProdUpdate } from '@/utils/resolvers/SellerSlice';
import { RootState } from '@/Store/store';
import { get_product_by_id, update_a_product, upload_product_photo } from '@/Services/Admin/product';
import Cookies from 'js-cookie';
import { ProductSchema, UpdateProductSchema } from '@/model/Product';
import { CategorySchema } from '@/model/Category';
import { UserSessionSchema } from '@/model/User';
import { get_all_categories } from '@/Services/Admin/category';
import GetData from '@/components/GetData'


type Inputs = {
  _id: string,
  name: string,
  description: string,
  feature: boolean,
  price: number,
  quantity: number,
  categoryId: number,
}

interface pageParam {
  id: string
}

export default function Page({ params, searchParams }: { params: pageParam, searchParams: any }) {


  const [loader, setLoader] = useState(false)
  const [image, setImage] = useState<any>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const Router = useRouter();
  const dispatch = useDispatch();
  const [prodData, setprodData] = useState<ProductSchema | undefined>(undefined);
  const [categories, setCategories] = useState<CategorySchema[]>([])
  const allCats = useSelector((state: RootState) => state.Seller.allCategories)


  useEffect(() => {
    const user: UserSessionSchema | null = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Cookies.get('token') || user?.role !== 'SELLER') {
      Router.push('/')
    }

  }, [Router])



  useEffect(() => {
    const getProd = async () => {
      const res = await get_product_by_id(Number(params.id))
      if (res?.status !== 200) toast.error(res?.statusText)
      setprodData(res?.data)
      setLoader(false)
    }
    getProd()

    const getCatForDropdown = async () => {
      setLoader(true)
      const categoryRes = await get_all_categories();
      if (categoryRes?.status !== 200) toast.error(categoryRes?.statusText)
      setCategories(categoryRes?.data)
      setLoader(false)
    }
    if (Object.keys(allCats).length === 0) getCatForDropdown()
    else setCategories(Object.values(allCats))
  }, [])

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0])
      let url = URL.createObjectURL(event.target.files[0]);
      console.log("new url")
      console.log(url)
      setImageUrl(url);
    }
  }


  const { register, setValue, formState: { errors }, handleSubmit } = useForm<Inputs>({
    criteriaMode: "all"
  });


  const setValueofFormData = () => {
    if (prodData) {
      setValue('name', prodData?.productName)
      setValue('description', prodData?.productDescription)
      setValue('feature', prodData?.productFeatured)
      setValue('categoryId', prodData?.categoryId)
      setValue('quantity', prodData?.productQuantity)
      setValue('price', prodData?.productPrice)
      if (prodData.productImageUrl) setImageUrl(`${prodData.productImageUrl}?${Date.now()}`)
    }
  }

  useEffect(() => {
    console.log(prodData?.categoryId)
    if (prodData) setValueofFormData();
  }, [prodData])

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setLoader(false)

    if (!prodData?.productId) return;

    const updatedData: UpdateProductSchema = {
      ...prodData,
      productName: data.name !== prodData?.productName ? data.name : prodData?.productName,
      productDescription: data.description !== prodData?.productDescription ? data.description : prodData?.productDescription,
      productFeatured: data.feature !== prodData?.productFeatured ? data.feature : prodData?.productFeatured,
      productQuantity: data.quantity !== prodData?.productQuantity ? data.quantity : prodData?.productQuantity,
      productPrice: data.price !== prodData?.productPrice ? data.price : prodData?.productPrice,
      categoryId: data.categoryId !== prodData?.categoryId ? data.categoryId : prodData?.categoryId,
    };

    const res = await update_a_product(updatedData)
    if (prodData?.productImageUrl !== imageUrl) upload_product_photo(image, prodData?.productId)
    if (res?.status === 200) {
      toast.success("Action successful");
      dispatch(setProdUpdate(true))
      dispatch(setNavActive('Base'))
      setTimeout(() => {
        Router.push("/Dashboard")
      }, 2000);
      setLoader(false)
    } else {
      toast.error(res?.statusText)
      setLoader(false)
    }
  }

  return (
    <GetData>
      <div className='w-full dark:text-black p-4 min-h-screen  bg-gray-50 flex flex-col '>
        <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
          <ul>
            <li onClick={() => dispatch(setNavActive('Base'))}>
              <Link href={'/Dashboard'}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                Home
              </Link>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Update Product
            </li>
          </ul>
        </div>
        <div className='w-full h-20 my-2 text-center'>
          <h1 className='text-2xl py-2 '>Update Product</h1>
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
              <p className='text-sm mt-2 font-semibold text-orange-500'>updating product Hold Tight ....</p>
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
                  {errors.price && <span className='text-red-500 text-xs mt-2'>This field is required</span>}

                </div>
                <div className="form-control w-full mb-2">
                  <label className="label">
                    <span className="label-text">Product Quantity</span>
                  </label>
                  <input  {...register("quantity", { required: true })} type="number" placeholder="Type here" className="input input-bordered w-full" />
                  {errors.quantity && <span className='text-red-500 text-xs mt-2'>This field is required</span>}

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
                {
                  prodData && (

                    <div className="form-control">
                      <label htmlFor="profilePhoto">
                        <div className="mx-auto h-32 w-32 text-center">
                          <div className="relative w-32">
                            <Image className="w-32 h-32 rounded-md absolute" src={imageUrl || "/no-photo.jpg"} alt="" width={200} height={200} />
                            {
                              !imageUrl ?
                                <div className="w-32 h-32 group bg-gray-200 opacity-30 rounded-md absolute flex justify-center items-center cursor-pointer transition duration-500">
                                  <img className="block w-12" src="https://www.svgrepo.com/show/33565/upload.svg" alt="" />
                                </div> : ""
                            }
                          </div>
                        </div>
                      </label>

                      <input className="hidden" name="profilePhoto" id="profilePhoto" type="file" onChange={onImageChange} />

                    </div>
                  )
                }


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


