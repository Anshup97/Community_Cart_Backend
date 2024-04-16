import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const catIconsFolder = '../../public/icons'
function importAll(r: any) {
  return r.keys().map(r);
}

export default function IconPicker({handleClick}:{handleClick: Function}) {
  const [icons, setIcons] = useState<any[]>([]);
  const [activeIcon, setActiveIcon] = useState(0);
  useEffect(()=>{
    const images = importAll(require.context('../../public/icons', false, /\.(png|jpe?g|svg)$/));
    const deDupImages = Array.from(new Set<any>(images))
    setIcons(deDupImages)
    handleClick(deDupImages[activeIcon].default.src)
  },[])

  return (
    <div className='w-full h-48 relative items-center grid grid-cols-4 overflow-y-auto'>
      {
        icons.map((icon: any, index: number) => {
          return (
            <div key={index} className={`justify-self-center p-2 ${index === activeIcon ? 'bg-gray-200':''}`}>
              <Image onClick={event => {
                setActiveIcon(index);
                handleClick(icon.default.src);
              }} src={icon.default} alt='no Image' className="w-10 h-10 cursor-pointer" />
            </div>
          )
        })
      }
    </div>
  )
}
