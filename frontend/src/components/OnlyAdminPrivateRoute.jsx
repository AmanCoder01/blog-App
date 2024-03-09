import React from 'react'
import { useSelector } from "react-redux"
import {Outlet,Navigate} from "react-router-dom"

const OnlyAdminPrivateRoute = ({children}) => {

    const { currentUser } = useSelector((state) => state.user);
    return currentUser?.isAdmin ? <Outlet/> : <Navigate to="/sign-in" />
}

export default OnlyAdminPrivateRoute
