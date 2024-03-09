import axios from "axios"
// const domainUrl = "http://localhost:3000/api/"
const domaindomainUrl = "https://blog-app-ofha.vercel.app/api/"

export const signUpApi = async (data) => {
    return await axios.post(`${domainUrl}auth/signup`, data, { withCredentials: true });
}

export const signInApi = async (data) => {
    return await axios.post(`${domainUrl}auth/login`, data, { withCredentials: true });
}

export const googleSignInApi = async (data) => {
    return await axios.post(`${domainUrl}auth/google`, data, { withCredentials: true });
}


export const updateUserApi = async (id, data) => {
    return await axios.put(`${domainUrl}user/update/${id}`, data, { withCredentials: true });
}

export const deleteUserApi = async (id) => {
    return await axios.delete(`${domainUrl}user/delete/${id}`, { withCredentials: true });
}


export const logoutApi = async () => {
    return await axios.post(`${domainUrl}user/logout`, { withCredentials: true });
}


export const postAdminApi = async (data) => {
    return await axios.post(`${domainUrl}post/create`, data, { withCredentials: true });
}


export const getPostApi = async (query) => {
    return await axios.get(`${domainUrl}post/getposts?${query}`, { withCredentials: true });
}

export const deletePostApi = async (query) => {
    return await axios.delete(`${domainUrl}post/deletepost/${query}`, { withCredentials: true });
}

export const updatePostApi = async (query, data) => {
    return await axios.put(`${domainUrl}post/updatepost/${query}`, data, { withCredentials: true });
}

export const getUsersApi = async (query) => {
    return await axios.get(`${domainUrl}user/getusers?${query}`, { withCredentials: true });
}

export const getUserUnProtectedApi = async (query) => {
    return await axios.get(`${domainUrl}user/${query}`, { withCredentials: true });
}

export const createCommentApi = async (data) => {
    return await axios.post(`${domainUrl}comment/create`, data, { withCredentials: true });
}

export const getCommentApi = async (postId) => {
    return await axios.get(`${domainUrl}comment/getPostComments/${postId}`, { withCredentials: true });
}

export const likeCommentApi = async (commentId) => {
    return await axios.put(`${domainUrl}comment/likeComment/${commentId}`, { withCredentials: true });
}

export const editCommentApi = async (commentId, body) => {
    return await axios.put(`${domainUrl}comment/editComment/${commentId}`, body, { withCredentials: true });
}

export const deleteCommentApi = async (commentId) => {
    return await axios.delete(`${domainUrl}comment/deleteComment/${commentId}`, { withCredentials: true });
}