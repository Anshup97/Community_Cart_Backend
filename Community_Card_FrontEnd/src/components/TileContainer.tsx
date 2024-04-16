"use client"

import React, { useEffect, useState } from 'react'
import StatsTiles from '@/components/StatsTiles';
import GettingDatasLength from '@/app/tilesDatas/Tiles';
import SellerBrief from './SellerHero';
import GetData from './GetData';

export default function TileContainer() {

  return (
    <GetData>
      <SellerBrief />
      <GettingDatasLength />
    </GetData>
  )
}
