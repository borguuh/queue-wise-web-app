import React, { useEffect } from 'react'
import { useAuth } from './Authcontext';

const Authenticator = () => {
    const { userData, accessToken, fetchUserData } = useAuth();


    useEffect(() => {
        if (window.location.pathname != "/"){
        if (!userData){
            console.log(window.location.pathname);
            const loggedUser = fetchUserData();
            if(!loggedUser){
                window.location.replace("/")
            }
        }
    }
      },[userData])

  return (
    <div>
    </div>
  )
}

export default Authenticator