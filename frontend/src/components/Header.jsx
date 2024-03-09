import React, { useEffect, useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react"
import { Link, useLocation ,useNavigate} from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa'
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from '../redux/slices/themeSlice';
import { logoutApi } from '../services/apiCall';
import { signOutSuccess } from '../redux/slices/userSlice';



const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const path = useLocation().pathname;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleSignOut = async () => {
    try {
      const res = await logoutApi();
      // console.log(res);

      if (res.status === 200) {
        dispatch(signOutSuccess());
      } else {
        console.log(res.message);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search])


  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <Navbar className='border-b-2'>
      <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Aman's</span>
        Blog
      </Link>

      <form onSubmit={handleSubmit}>
        <TextInput type='text' placeholder='Search...' rightIcon={AiOutlineSearch} className='hidden lg:inline' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </form>

      <Button className='w-12 h-10 lg:hidden border border-gray' color='gray ' pill>
        <AiOutlineSearch />
      </Button>

      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline border border-gray' color='gray ' pill onClick={() => dispatch(toggleTheme())}>
          {
            theme === "light" ? <FaMoon /> : <FaSun />
          }

        </Button>

        {!currentUser && <Link to="/sign-in">
          <Button gradientDuoTone="purpleToBlue" outline>
            Sign In
          </Button>
        </Link>}


        {
          currentUser &&
          <Dropdown arrowIcon={false} inline label={
            <Avatar alt='user' img={currentUser.profilePicture} rounded />
          }>
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser.username}</span>
              <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
            </Dropdown.Header>

            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>
                Profile
              </Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignOut}>
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        }
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/" >
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link as={"div"}>
          <Link to="/projects">
            Projects
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
