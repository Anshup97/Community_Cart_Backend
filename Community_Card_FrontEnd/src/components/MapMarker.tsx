import React from 'react'
import { GrLocation } from 'react-icons/gr'
interface IProps {
  setRatio: (value: number) => void;
}

//@ts-ignore
export default function MapMarker({lat, lng}) {
  return (
    <GrLocation className='w-10 h-10' />
  )
}
