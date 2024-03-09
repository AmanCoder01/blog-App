import axios from "axios"
const url = "http://localhost:3000/api/"

export const signUpApi = async (data) => {
    return await axios.post(`${url}auth/signup`, data, { withCredentials: true });
}

export const signInApi = async (data) => {
    return await axios.post(`${url}auth/login`, data, { withCredentials: true });
}

export const googleSignInApi = async (data) => {
    return await axios.post(`${url}auth/google`, data, { withCredentials: true });
}


export const updateUserApi = async (id, data) => {
    return await axios.put(`${url}user/update/${id}`, data, { withCredentials: true });
}

export const deleteUserApi = async (id) => {
    return await axios.delete(`${url}user/delete/${id}`, { withCredentials: true });
}


export const logoutApi = async () => {
    return await axios.post(`${url}user/logout`, { withCredentials: true });
}


export const postAdminApi = async (data) => {
    return await axios.post(`${url}post/create`, data, { withCredentials: true });
}


export const getPostApi = async (query) => {
    return await axios.get(`${url}post/getposts?${query}`, { withCredentials: true });
}

export const deletePostApi = async (query) => {
    return await axios.delete(`${url}post/deletepost/${query}`, { withCredentials: true });
}

export const updatePostApi = async (query, data) => {
    return await axios.put(`${url}post/updatepost/${query}`, data, { withCredentials: true });
}

export const getUsersApi = async (query) => {
    return await axios.get(`${url}user/getusers?${query}`, { withCredentials: true });
}

export const getUserUnProtectedApi = async (query) => {
    return await axios.get(`${url}user/${query}`, { withCredentials: true });
}

export const createCommentApi = async (data) => {
    return await axios.post(`${url}comment/create`, data, { withCredentials: true });
}

export const getCommentApi = async (postId) => {
    return await axios.get(`${url}comment/getPostComments/${postId}`, { withCredentials: true });
}

export const likeCommentApi = async (commentId) => {
    return await axios.put(`${url}comment/likeComment/${commentId}`, { withCredentials: true });
}

export const editCommentApi = async (commentId, body) => {
    return await axios.put(`${url}comment/editComment/${commentId}`, body, { withCredentials: true });
}

export const deleteCommentApi = async (commentId) => {
    return await axios.delete(`${url}comment/deleteComment/${commentId}`, { withCredentials: true });
}