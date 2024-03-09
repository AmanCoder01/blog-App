import React, { useEffect, useState } from 'react'
import { Sidebar } from "flowbite-react"
import { Link, useLocation } from "react-router-dom"

import {
    HiUser,
    HiArrowSmRight,
    HiDocumentText,
    HiOutlineUserGroup,
    HiAnnotation,
    HiChartPie,
} from 'react-icons/hi';
import { signOutSuccess } from '../redux/slices/userSlice';
import { logoutApi } from '../services/apiCall';
import { useDispatch ,useSelector} from "react-redux";


const DashSidebar = () => {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    
    const {currentUser} = useSelector((state)=>state.user);


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');

        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleSignOut = async () => {
        try {
            const res = await logoutApi();

            if (res.status === 200) {
                dispatch(signOutSuccess());
            } else {
                console.log(res.message);
            }

        } catch (error) {
            console.log(error);
        }
    }



    return (
        <Sidebar className='md:w-56 w-full'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab === "profile"} icon={HiUser} label={currentUser.isAdmin ? "Admin":"User"} labelColor="dark" as="div">Profile</Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && <Link to='/dashboard?tab=posts'>
                        <Sidebar.Item active={tab === "posts"} icon={HiDocumentText} as="div">Posts</Sidebar.Item>
                    </Link>}
                    {currentUser.isAdmin && <Link to='/dashboard?tab=users'>
                        <Sidebar.Item active={tab === "users"} icon={HiOutlineUserGroup} as="div">Users</Sidebar.Item>
                    </Link>}
                    <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignOut}>Sign Out</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar
