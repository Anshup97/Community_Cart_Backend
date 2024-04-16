import { get_elevation } from "@/utils/maps";
import { setUserLocation } from "@/utils/resolvers/UserDataSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation'

export default function CheckLocation() {
  const dispatch = useDispatch();
  const Router = useRouter();

  useEffect(() => {
    let locationAvailable = false;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        let elevation = await get_elevation(position.coords.latitude, position.coords.longitude)
        if (elevation) {
          dispatch(setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            elevation
          }))

          locationAvailable = true;
        } else {
          console.error("Unable to get elevation!")
        }
      },
        (error) => {
          if (error.code === 1) {
            console.error("Please allow location to view nearby shops!")
            locationAvailable = false;
          }
        });
    } else {
      console.error("Geolocation is not supported by this browser.");
      locationAvailable = false;
    }
    
    if(!locationAvailable) {
      Router.push('/no-location')
    }
  }, []);

  return null;
}
