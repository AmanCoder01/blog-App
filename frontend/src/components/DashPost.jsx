import React, { useEffect, useState } from 'react'
import { deletePostApi, getPostApi } from '../services/apiCall'
import { useSelector } from 'react-redux';
import { Modal, Table, Button, Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';


const DashPost = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await getPostApi(`userId=${currentUser._id}`);

                if (res.status === 200) {
                    setUserPosts((prev) => [...prev, ...res.data.posts]);
                    if (res.data.posts.length < 9) {
                        setShowMore(false);
                    }
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        if (currentUser.isAdmin) {
            fetchPost();
        }
    }, [currentUser._id])


    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        try {
            const res = await getPostApi(`userId=${currentUser._id}&startIndex=${startIndex}`)

            if (res.status === 200) {
                setUserPosts((prev) => [...prev, ...res.data.posts]);
                if (res.data.posts.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    const handleDeletePost = async () => {
        try {
            const res = await deletePostApi(`${postIdToDelete}/${currentUser._id}`);

            if (res.status === 200) {
                if (res.data.status === 200) {
                    setShowModal(false);
                    setPostIdToDelete("");
                    setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
                } else {
                    console.log(res.data.message);
                }
            } else {
                console.log(res.message);
            }
        } catch (err) {
            console.log(err);
        }
    }


    if (loading)
        return (
            <div className='w-full flex justify-center items-center min-h-screen'>
                <Spinner size='xl' />
            </div>
        );
    return (
        <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser.isAdmin && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>
                                <span>Edit</span>
                            </Table.HeadCell>
                        </Table.Head>
                        {userPosts.map((post, i) => (
                            <Table.Body className='divide-y' key={i}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(post.updatedAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className='w-20 h-10 object-cover bg-gray-500'
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='font-medium text-gray-900 dark:text-white'
                                            to={`/post/${post.slug}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostIdToDelete(post._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            className='text-teal-500 hover:underline'
                                            to={`/update-post/${post._id}`}
                                        >
                                            <span>Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p className='my-4 text-xl'>You have no posts yet!</p>
            )}



            <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                    </div>

                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are  you sure you want to delete your post ?</h3>

                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={handleDeletePost}>
                            Yes, I'm sure
                        </Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>
                            No, cancel
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default DashPost
