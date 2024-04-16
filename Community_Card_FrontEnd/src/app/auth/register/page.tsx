"use client"

import React, { useState, useEffect, FormEvent } from 'react'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register_me, upload_profile_photo } from '@/Services/auth';
import Cookies from 'js-cookie';
import { GrClose } from 'react-icons/gr'
import { TailSpin } from 'react-loader-spinner';
import { AddressSchema } from '@/model/User';
import GoogleMapReact from 'google-map-react';
import MapMarker from '@/components/MapMarker';
import { get_elevation } from '@/utils/maps';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { nanoid } from 'nanoid'

export default function Register() {
  const router = useRouter();
  const searchParams = useSearchParams();

  let initialAddress: Partial<AddressSchema> = {
    latitude: 28.3877096,
    longitude: 75.5895650,
    elevation: 75.5895650,
  }

  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    password: "",
    name: searchParams.get("name") || "",
    shopName: "",
    aadharNo: "",
    contactPhoneNo: "",
    profilePhoto: null as any,
    address: initialAddress,
    gstin: "",
    isSeller: false
  });
  const [error, setError] = useState({
    email: "",
    password: "",
    name: "",
    shopName: "",
    aadharNo: "",
    contactPhoneNo: "",
    profilePhoto: "",
    address1: "",
    address2: "",
    district: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    gstin: ""
  });


  async function getImageAsFile(url: string, fileName: string) {
    try {
      // Fetch the image using Axios
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      // Convert the array buffer to a Blob
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a File object from the Blob
      const file = new File([blob], fileName, { type: response.headers['content-type'] });

      setFormData({ ...formData, profilePhoto: file })
    } catch (error) {
      console.error('Error fetching and converting image:', error);
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        let elevation = position.coords.altitude;
        initialAddress = { latitude, longitude }
        setFormData({
          ...formData, address: {
            latitude: latitude,
            longitude: longitude
          }
        });

        if (elevation) {
          setFormData({
            ...formData, address: {
              ...formData.address, elevation: elevation
            }
          });
        }
      },
        (error) => {
          if (error.code === 1) {
            setTimeout(() => {
              toast.error("Please allow location access and try again!")
            }, 1000);

            router.push('/');
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    let profilePhotoUrl = searchParams.get("profilePhoto");

    if (profilePhotoUrl && profilePhotoUrl !== "") {
      let decodedUrl = decodeURIComponent(profilePhotoUrl);
      getImageAsFile(decodedUrl, nanoid());
    }
  }, [])

  useEffect(() => {
    if (formData.profilePhoto) {
      console.log("Got profile photo")
      setImage(URL.createObjectURL(formData.profilePhoto));
    }
  }, [formData.profilePhoto])

  useEffect(() => {
    if (Cookies.get('token')) {
      router.push('/');
    }
  }, [router])

  const otherProps = {
    bootstrapURLKeys: {
      key: process.env.NEXT_PUBLIC_PLACES_API_KEY || "",
      language: 'en',
      region: 'en',
      libraries: ['places'],
    },
    defaultCenter: { lat: 28.3877096, lng: 75.5895650 },
    defaultZoom: 11,
    //@ts-ignore
    onClick: ({ x, y, lat, lng, event }) => {
      setFormData({
        ...formData, address: {
          latitude: lat,
          longitude: lng
        }
      });
    }
  }

  const [loading, setLoding] = useState(false);
  const [image, setImage] = useState<string>("")

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setFormData({ ...formData, profilePhoto: event.target.files[0] })
    }
  }

  const handleCheckboxChange = () => {
    setFormData({
      ...formData, isSeller: !formData.isSeller
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();
    setLoding(true);
    if (!formData.email) {
      setError({ ...error, email: "Email Field is Required" })
      return;
    }
    if (!formData.password) {
      setError({ ...error, password: "Password Field is required" })
      return;
    }
    if (!formData.name) {
      setError({ ...error, name: "Name Field is required" })
      return;
    }
    if (!formData.contactPhoneNo) {
      setError({ ...error, contactPhoneNo: "Phone number Field is required" })
      return;
    }
    if (!formData.address.address1) {
      setError({ ...error, address1: "Address 1 Field is required" })
      return;
    }
    if (!formData.address.address2) {
      setError({ ...error, address2: "Address 2 Field is required" })
      return;
    }
    if (!formData.address.district) {
      setError({ ...error, district: "district Field is required" })
      return;
    }
    if (!formData.address.city) {
      setError({ ...error, city: "city Field is required" })
      return;
    }
    if (!formData.address.state) {
      setError({ ...error, state: "state Field is required" })
      return;
    }
    if (!formData.address.pinCode) {
      setError({ ...error, pinCode: "Postal Code Field is required" })
      return;
    }
    if (!formData.address.country) {
      setError({ ...error, country: "country Field is required" })
      return;
    }
    if (formData.isSeller && !formData.shopName) {
      setError({ ...error, shopName: "Shop Name Field is required" })
      return;
    }
    if (formData.isSeller && !formData.aadharNo) {
      setError({ ...error, aadharNo: "Aadhaar number Field is required" })
      return;
    }
    if (!formData.address.latitude || !formData.address.longitude) {
      toast.error("Unable to get location");
      return;
    }

    console.log("Before..");
    console.log(JSON.stringify(formData));
    console.log(!formData.address.elevation || initialAddress.latitude !== formData.address.latitude || initialAddress.longitude !== formData.address.longitude);
    if (!formData.address.elevation || initialAddress.latitude !== formData.address.latitude || initialAddress.longitude !== formData.address.longitude) {
      let elevation = await get_elevation(formData.address.latitude, formData.address.longitude)
      if (elevation) {
        console.log(elevation)
        setFormData({
          ...formData, address: {
            ...formData.address, elevation: elevation
          }
        });

        console.log(JSON.stringify(formData));
        const regRes = await register_me(formData, elevation);
        if (formData.profilePhoto && regRes?.status == 201) {
          await upload_profile_photo(formData.profilePhoto, formData.email, formData.isSeller);
        }
        if (regRes?.status == 201) {
          setLoding(false);
          toast.success("User created successfully");
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        }
        else {
          setLoding(false);
          toast.error(regRes?.statusText);
        }

      } else {
        toast.error("Unable to get elevation");
        return;
      }
    }
  }


  return (
    <div className='relative w-full h-screen bg-gray-50'>
      <Link href={'/'}><GrClose className="absolute top-5 right-5 w-10 h-10 stroke-current" /></Link>
      <div className="flex flex-col text-center items-center px-6 py-8 mx-auto h-screen lg:py-0 shadow-xl">

        <div className="w-full bg-white rounded-lg shadow text-black md:mt-0 sm:max-w-6xl xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Register your account
            </h1>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 xl:grid-cols-3 gap-4" action="#">
              <div className="image-upload md:col-span-2 xl:col-span-3">
                <label htmlFor="profilePhoto">
                  <div className="mx-auto h-32 w-32 text-center">
                    <div className="relative w-32">
                      <img className="w-32 h-32 rounded-full absolute" src={image ? image : "https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"} alt="" />
                      {
                        !image ?
                          <div className="w-32 h-32 group bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500">
                            <img className="block w-12" src="https://www.svgrepo.com/show/33565/upload.svg" alt="" />
                          </div> : ""
                      }
                    </div>
                  </div>
                </label>

                <input className="hidden" name="profilePhoto" id="profilePhoto" type="file" onChange={onImageChange} />
              </div>
              <div className='space-y-4 md:space-y-6'>
                <div className='text-left'>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 ">Your Name</label>
                  <input onChange={(e) => setFormData({ ...formData, name: e.target.value })} type="text" name="name" id="name" value={formData.name} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="Name" />
                  {
                    error.name && <p className="text-sm text-red-500">{error.name}</p>
                  }
                </div>
                <div className='text-left'>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label>
                  <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" name="email" id="email" value={formData.email} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="name@company.com" />
                  {
                    error.email && <p className="text-sm text-red-500">{error.email}</p>
                  }
                </div>
                <div className='text-left'>
                  <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 ">Your phone number</label>
                  <input onChange={
                    (e) => {
                      let isValidPhoneNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(e.target.value)
                      if(!isValidPhoneNumber) setError({...error, contactPhoneNo:"Please enter valid phone number"})
                      else setError({...error, contactPhoneNo:""})
                      setFormData({ ...formData, contactPhoneNo: e.target.value })
                    }} type="text" name="phoneNumber" id="phoneNumber" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="Phone number" />
                  {
                    error.contactPhoneNo && <p className="text-sm text-red-500">{error.contactPhoneNo}</p>
                  }
                </div>
                <div className='w-full h-48'>
                  <GoogleMapReact {...otherProps} >
                    <MapMarker lat={formData.address.latitude} lng={formData.address.longitude} />
                  </GoogleMapReact>
                </div>
                <div className='text-left'>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                  <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" />
                  {
                    error.password && <p className="text-sm text-red-500">{error.password}</p>
                  }
                </div>
              </div>
              <div className='space-y-4 md:space-y-6'>
                <div className='text-left'>
                  <label htmlFor="address1" className="block mb-2 text-sm font-medium text-gray-900 ">Address 1</label>
                  <input onChange={(e) => setFormData({ ...formData, address: { ...formData.address, address1: e.target.value } })} type="text" name="address1" id="address1" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="Address 1" />
                  {
                    error.address1 && <p className="text-sm text-red-500">{error.address1}</p>
                  }
                </div>
                <div className='text-left'>
                  <label htmlFor="address2" className="block mb-2 text-sm font-medium text-gray-900 ">Address 2</label>
                  <input onChange={(e) => setFormData({ ...formData, address: { ...formData.address, address2: e.target.value } })} type="text" name="address2" id="address2" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="Address 2" />
                  {
                    error.address2 && <p className="text-sm text-red-500">{error.address2}</p>
                  }
                </div>
                <div className='text-left'>
                  <label htmlFor="district" className="block mb-2 text-sm font-medium text-gray-900 ">District</label>
                  <input onChange={(e) => setFormData({ ...formData, address: { ...formData.address, district: e.target.value } })} type="text" name="district" id="district" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="District" />
                  {
                    error.district && <p className="text-sm text-red-500">{error.district}</p>
                  }
                </div>
                <div className='text-left'>
                  <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 ">City</label>
                  <input onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} type="text" name="city" id="city" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="City" />
                  {
                    error.city && <p className="text-sm text-red-500">{error.city}</p>
                  }
                </div>
                <div className='text-left'>
                  <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-900 ">State</label>
                  <input onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} type="text" name="state" id="state" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="State" />
                  {
                    error.state && <p className="text-sm text-red-500">{error.state}</p>
                  }
                </div>
                <div className='text-left'>
                  <label htmlFor="pinCode" className="block mb-2 text-sm font-medium text-gray-900 ">Postal Code</label>
                  <input onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pinCode: e.target.value } })} type="text" name="pinCode" id="pinCode" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="Postal Code" />
                  {
                    error.pinCode && <p className="text-sm text-red-500">{error.pinCode}</p>
                  }
                </div>
                <div className='text-left'>
                  <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-900 ">Country</label>
                  <input onChange={(e) => setFormData({ ...formData, address: { ...formData.address, country: e.target.value } })} type="text" name="country" id="country" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="Country" />
                  {
                    error.country && <p className="text-sm text-red-500">{error.country}</p>
                  }
                </div>
              </div>
              <div className='space-y-4 md:space-y-6'>
                <div className='text-center'>
                  <label className='themeSwitcherTwo shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-white p-1'>
                    <input
                      type='checkbox'
                      className='sr-only'
                      checked={formData.isSeller}
                      onChange={handleCheckboxChange}
                    />
                    <span
                      className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${!formData.isSeller ? 'text-primary bg-[#f4f7ff]' : 'text-body-color'
                        }`}
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        className='mr-[6px] fill-current'
                      >
                        <g clipPath='url(#clip0_3122_652)'>
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M8 0C8.36819 0 8.66667 0.298477 8.66667 0.666667V2C8.66667 2.36819 8.36819 2.66667 8 2.66667C7.63181 2.66667 7.33333 2.36819 7.33333 2V0.666667C7.33333 0.298477 7.63181 0 8 0ZM8 5.33333C6.52724 5.33333 5.33333 6.52724 5.33333 8C5.33333 9.47276 6.52724 10.6667 8 10.6667C9.47276 10.6667 10.6667 9.47276 10.6667 8C10.6667 6.52724 9.47276 5.33333 8 5.33333ZM4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8ZM8.66667 14C8.66667 13.6318 8.36819 13.3333 8 13.3333C7.63181 13.3333 7.33333 13.6318 7.33333 14V15.3333C7.33333 15.7015 7.63181 16 8 16C8.36819 16 8.66667 15.7015 8.66667 15.3333V14ZM2.3411 2.3424C2.60145 2.08205 3.02356 2.08205 3.28391 2.3424L4.23057 3.28906C4.49092 3.54941 4.49092 3.97152 4.23057 4.23187C3.97022 4.49222 3.54811 4.49222 3.28776 4.23187L2.3411 3.28521C2.08075 3.02486 2.08075 2.60275 2.3411 2.3424ZM12.711 11.7682C12.4506 11.5078 12.0285 11.5078 11.7682 11.7682C11.5078 12.0285 11.5078 12.4506 11.7682 12.711L12.7148 13.6577C12.9752 13.918 13.3973 13.918 13.6577 13.6577C13.918 13.3973 13.918 12.9752 13.6577 12.7148L12.711 11.7682ZM0 8C0 7.63181 0.298477 7.33333 0.666667 7.33333H2C2.36819 7.33333 2.66667 7.63181 2.66667 8C2.66667 8.36819 2.36819 8.66667 2 8.66667H0.666667C0.298477 8.66667 0 8.36819 0 8ZM14 7.33333C13.6318 7.33333 13.3333 7.63181 13.3333 8C13.3333 8.36819 13.6318 8.66667 14 8.66667H15.3333C15.7015 8.66667 16 8.36819 16 8C16 7.63181 15.7015 7.33333 15.3333 7.33333H14ZM4.23057 11.7682C4.49092 12.0285 4.49092 12.4506 4.23057 12.711L3.28391 13.6577C3.02356 13.918 2.60145 13.918 2.3411 13.6577C2.08075 13.3973 2.08075 12.9752 2.3411 12.7148L3.28776 11.7682C3.54811 11.5078 3.97022 11.5078 4.23057 11.7682ZM13.6577 3.28521C13.918 3.02486 13.918 2.60275 13.6577 2.3424C13.3973 2.08205 12.9752 2.08205 12.7148 2.3424L11.7682 3.28906C11.5078 3.54941 11.5078 3.97152 11.7682 4.23187C12.0285 4.49222 12.4506 4.49222 12.711 4.23187L13.6577 3.28521Z'
                          ></path>
                        </g>
                        <defs>
                          <clipPath id='clip0_3122_652'>
                            <rect width='16' height='16' fill='white'></rect>
                          </clipPath>
                        </defs>
                      </svg>
                      Buyer
                    </span>
                    <span
                      className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${formData.isSeller ? 'text-primary bg-[#f4f7ff]' : 'text-body-color'
                        }`}
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        className='mr-[6px] fill-current'
                      >
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M8.0547 1.67334C8.18372 1.90227 8.16622 2.18562 8.01003 2.39693C7.44055 3.16737 7.16651 4.11662 7.23776 5.07203C7.30901 6.02744 7.72081 6.92554 8.39826 7.60299C9.07571 8.28044 9.97381 8.69224 10.9292 8.76349C11.8846 8.83473 12.8339 8.5607 13.6043 7.99122C13.8156 7.83502 14.099 7.81753 14.3279 7.94655C14.5568 8.07556 14.6886 8.32702 14.6644 8.58868C14.5479 9.84957 14.0747 11.0512 13.3002 12.053C12.5256 13.0547 11.4818 13.8152 10.2909 14.2454C9.09992 14.6756 7.81108 14.7577 6.57516 14.4821C5.33925 14.2065 4.20738 13.5846 3.312 12.6892C2.41661 11.7939 1.79475 10.662 1.51917 9.42608C1.24359 8.19017 1.32569 6.90133 1.75588 5.71038C2.18606 4.51942 2.94652 3.47561 3.94828 2.70109C4.95005 1.92656 6.15168 1.45335 7.41257 1.33682C7.67423 1.31264 7.92568 1.44442 8.0547 1.67334ZM6.21151 2.96004C5.6931 3.1476 5.20432 3.41535 4.76384 3.75591C3.96242 4.37553 3.35405 5.21058 3.00991 6.16334C2.66576 7.11611 2.60008 8.14718 2.82054 9.13591C3.04101 10.1246 3.5385 11.0301 4.25481 11.7464C4.97111 12.4627 5.87661 12.9602 6.86534 13.1807C7.85407 13.4012 8.88514 13.3355 9.8379 12.9913C10.7907 12.6472 11.6257 12.0388 12.2453 11.2374C12.5859 10.7969 12.8536 10.3081 13.0412 9.78974C12.3391 10.0437 11.586 10.1495 10.8301 10.0931C9.55619 9.99813 8.35872 9.44907 7.45545 8.5458C6.55218 7.64253 6.00312 6.44506 5.90812 5.17118C5.85174 4.4152 5.9575 3.66212 6.21151 2.96004Z'
                        ></path>
                      </svg>
                      Seller
                    </span>
                  </label>
                </div>
                {
                  formData.isSeller ?
                    <div className='space-y-4'>
                      <div className='text-left'>
                        <label htmlFor="shopName" className="block mb-2 text-sm font-medium text-gray-900 ">Shop Name</label>
                        <input onChange={(e) => setFormData({ ...formData, shopName: e.target.value })} type="text" name="shopName" id="shopName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="Shop Name" />
                        {
                          error.shopName && <p className="text-sm text-red-500">{error.shopName}</p>
                        }
                      </div>
                      <div className='text-left'>
                        <label htmlFor="aadharNo" className="block mb-2 text-sm font-medium text-gray-900 ">Aadhar No</label>
                        <input onChange={(e) => setFormData({ ...formData, aadharNo: e.target.value })} type="text" name="aadharNo" id="aadharNo" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="Aadhaar No" />
                        {
                          error.aadharNo && <p className="text-sm text-red-500">{error.aadharNo}</p>
                        }
                      </div>
                      <div className='text-left'>
                        <label htmlFor="gstin" className="block mb-2 text-sm font-medium text-gray-900 ">GSTIN</label>
                        <input onChange={(e) => setFormData({ ...formData, gstin: e.target.value })} type="text" name="gstin" id="gstin" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-orange-600 focus:border-orange-600 block w-full p-2.5" placeholder="GSTIN" />
                        {
                          error.aadharNo && <p className="text-sm text-red-500">{error.gstin}</p>
                        }
                      </div>
                    </div>
                    :
                    ""
                }
                {
                  loading ? <button type="button" className="w-full flex items-center justify-center text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    <TailSpin
                      height="20"
                      width="20"
                      color="white"
                      ariaLabel="tail-spin-loading"
                      radius="1"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                    />
                  </button> :
                    <button type="submit" className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign up</button>
                }


                <p className="text-sm  text-gray-500 ">
                  Already have an account  <Link href="/auth/login" className="font-medium text-orange-600 hover:underline ">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  )
}
