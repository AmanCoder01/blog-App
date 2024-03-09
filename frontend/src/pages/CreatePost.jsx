import React, { useState } from 'react'
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { postAdminApi } from "../services/apiCall"
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);

    const navigate = useNavigate();

    const handleUpdloadImage = async () => {
        try {
            if (!file) {
                setImageFileUploadError("Please select an image");
                return;
            }

            setImageFileUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    setImageFileUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageFileUploadError(
                        'Could not upload image'
                    );
                    setImageFileUploadProgress(null);
                    setFile(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageFileUploadProgress(null);
                        setFile(null);
                        setFormData({ ...formData, image: downloadURL });
                    });
                }
            );

        } catch (error) {
            setImageFileUploadError("Image upload failed");
            setImageFileUploadProgress(null);
        }
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await postAdminApi(formData);

            if (res.status === 200) {
                if (res.data.status === 200) {
                    setPublishError(null);
                    navigate(`/post/${res.data.data.slug}`);
                }
                if (res.data.status === 400) {
                    setPublishError(res.data.message);
                }
            } else {
                setPublishError(res.message);
            }
        } catch (err) {
            setPublishError("Something went wrong");
        }
    }

    return (
        <div className='p-3 max-w-3xl mx-auto min-h-screen'>
            <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col sm:flex-row gap-4 justify-between'>
                    <TextInput type='text'
                        placeholder='Title'
                      
                        id='title'
                        className='flex-1'
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <Select onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                    }>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                    </Select>
                </div>
                <div className='p-3 flex items-center justify-between gap-4 border-4 border-teal-500 border-dotted'>
                    <FileInput type="file" accept="images/*" onChange={(e) => setFile(e.target.files[0])} />
                    <Button
                        type='button'
                        gradientDuoTone='purpleToBlue'
                        size='sm'
                        outline
                        onClick={handleUpdloadImage}
                        disabled={imageFileUploadProgress}
                    >{imageFileUploadProgress ? (
                        <div className='w-16 h-16'>
                            <CircularProgressbar
                                value={imageFileUploadProgress}
                                text={`${imageFileUploadProgress || 0}%`}
                            />
                        </div>
                    ) : (
                        'Upload Image'
                    )} </Button>
                </div>

                {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}

                <ReactQuill theme="snow" placeholder='Write something' className='h-72 mb-12' required onChange={(value) => {
                    setFormData({ ...formData, content: value });
                }} />
                <Button type='submit' gradientDuoTone='purpleToPink'>
                    Publish
                </Button>

                {publishError && (
                    <Alert className='mt-5' color='failure'>
                        {publishError}
                    </Alert>
                )}
            </form>
        </div>
    )
}

export default CreatePost
