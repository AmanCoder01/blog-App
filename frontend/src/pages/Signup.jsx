import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { signUpApi } from '../services/apiCall';
import OAuth from '../components/OAuth';
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signUpApi(formData);
      // console.log(res);

      if (res.data.success === true) {
        setLoading(false);
        toast.success("Sign Up Successfully");
        navigate("/sign-in");
      } else {
        setError(res.data.message);
        setLoading(false);
      }

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 mx-auto max-w-3xl flex-col md:flex-row md:items-center gap-6'>
        {/* left side */}
        <div className='flex-1'>
          <Link to="/" className=' text-4xl font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Aman's</span>
            Blog
          </Link>
          <p className='text-sm mt-5 '>This is a demo project. You can sign up with your email and password or with Google.</p>
        </div>

        {/* right side */}
        <div className='flex-1 '>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value="Your Username" />
              <TextInput type="text" placeholder="Username" id='username' onChange={handleChange} />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput type="email" placeholder="Email" id='email' onChange={handleChange} />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput type="password" placeholder="Password" id='password' onChange={handleChange} />
            </div>

            <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className='pl-3'>Loading...</span></>
                ) : "Sign Up"
              }
            </Button>

            <OAuth/>
            
          </form>

          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to="/sign-in" className='text-blue-500'>Login</Link>
          </div>
          {error &&
            <Alert className='mt-5' color="failure">
              {error}
            </Alert>
          }
        </div>
      </div>
    </div>
  )
}

export default Signup