"use client"

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { get_category_by_id, update_a_category } from '@/Services/Admin/category';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setCatUpdate, setNavActive } from '@/utils/resolvers/SellerSlice';
import Cookies from 'js-cookie';
import { CategorySchema } from '@/model/Category';
import { UserSessionSchema } from '@/model/User';
import IconPicker from '@/components/IconPicker';
import Modal from 'react-modal';
import { GrClose } from 'react-icons/gr';
import GetData from '@/components/GetData'

type Inputs = {
    categoryId: number,
    name: string,
    description: string,
}

interface pageParam {
    id: string
}

export default function Page({ params, searchParams }: { params: pageParam, searchParams: any }) {


    const [loader, setLoader] = useState(false)
    const Router = useRouter();
    const dispatch = useDispatch();
    const [catData, setCatData] = useState<CategorySchema | undefined>(undefined);
    const [icon, setIcon] = useState("")
    const [showIconModal, setShowIconModal] = useState<boolean>(false)

    useEffect(() => {
        const user: UserSessionSchema | null = JSON.parse(localStorage.getItem('user') || '{}');
        if (!Cookies.get('token') || user?.role !== 'SELLER') {
            Router.push('/')
        }
        dispatch(setNavActive('Base'))
    }, [dispatch, Cookies, Router])



    useEffect(() => {
        const getCat = async () => {
            const res = await get_category_by_id(params.id)
            if (res?.status !== 200) toast.error(res?.statusText)
            setCatData(res?.data)
            setIcon(res?.data.catIconUrl)
            setLoader(false)
        }
        getCat()
    }, [])


    const { register, setValue, formState: { errors }, handleSubmit } = useForm<Inputs>({
        criteriaMode: "all"
    });





    const setValueofFormData = useCallback(
        () => {
            setValue('name', catData?.categoryName ?? '')
            setValue('description', catData?.categoryDescription ?? '')
        },
        [catData]
    );


    useEffect(() => {
        if (catData) {
            setValueofFormData();
        }
    }, [catData]);

    const onSubmit: SubmitHandler<Inputs> = async data => {
        setLoader(false)

        if (catData) {
            const updatedData: CategorySchema = {
                categoryId: Number(params.id),
                categoryName: data.name !== catData.categoryName ? data.name : catData.categoryName,
                categoryDescription: data.description !== catData.categoryDescription ? data.description : catData.categoryDescription,
                categorySlug: catData.categorySlug,
                catIconUrl: icon
            };

            const res = await update_a_category(updatedData)
            if (res?.status === 200) {
                toast.success("Action successful");
                dispatch(setNavActive('Base'))
                setTimeout(() => {
                    dispatch(setCatUpdate(true))
                    Router.push("/Dashboard")
                }, 2000);
                setLoader(false)
            } else {
                toast.error(res?.statusText)
                setLoader(false)
            }
        }
    }


    const handleClick = (iconSrc: string) => {
        let iconSrcParts = iconSrc.split('.')
        let iconRelPath = iconSrcParts[0].split('/')
        let iconName = iconRelPath[iconRelPath.length - 1];
        let iconExtn = iconSrcParts[iconSrcParts.length - 1]

        let iconFullName = iconName + '.' + iconExtn

        setIcon(iconFullName);
    };




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
                            Update Category
                        </li>
                    </ul>
                </div>
                <div className='w-full h-20 my-2 text-center'>
                    <h1 className='text-2xl py-2 '>Update Category</h1>
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
                            <p className='text-sm mt-2 font-semibold text-orange-500'>updating Category Hold Tight ....</p>
                        </div>
                    ) : (

                        <div id='cat-update' className='w-full h-full flex items-start justify-center'>
                            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg  py-2 flex-col ">
                                <div className="form-control w-full mb-2">
                                    <label className="label">
                                        <span className="label-text">Category Name</span>
                                    </label >
                                    <input    {...register("name")} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                    {errors.name && <span className='text-red-500 text-xs mt-2'>This field is required</span>}
                                </div >
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Category Description</span>
                                    </label>
                                    <textarea  {...register("description")} className="textarea textarea-bordered h-24" placeholder="Description"></textarea>
                                    {errors.description && <span className='text-red-500 text-xs mt-2'>This field is required</span>}

                                </div>
                                {
                                    catData && (

                                        <div className="form-control">
                                            <label className="label float-left">
                                                <span className="label-text">Category Icon: </span>
                                            </label>
                                            <Image onClick={() => { setShowIconModal(true) }} className='cursor-pointer' src={icon ? `/icons/${icon}` : "/no-photo.jpg"} alt='No Image Found' width={32} height={32} />
                                            <Modal
                                                isOpen={showIconModal}
                                                contentLabel="Minimal Modal Example"
                                                shouldCloseOnOverlayClick={true}
                                                overlayClassName="Overlay"
                                                className="Modal"
                                            >
                                                <GrClose onClick={() => { setShowIconModal(false) }} className="absolute cursor-pointer top-5 right-5 w-6 h-6 stroke-current" />
                                                <div className='p-10 w-96 h-96 mx-auto self-center'>
                                                    <IconPicker handleClick={handleClick} />
                                                </div>
                                            </Modal>
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


