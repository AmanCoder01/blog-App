import jsonGenerate from "../utils/helper.js";
import Post from "../models/post.model.js";
import { log } from "console";

export const create = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.json(jsonGenerate(400, 'You are not allowed to create a post'))
    }

    if (!req.body.title || !req.body.content) {
        return res.json(jsonGenerate(400, 'Please provide all required fields'));
    }

    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');

    try {
        const newPost = await Post.create({
            ...req.body,
            slug,
            userId: req.user.id,
        })
        return res.json(jsonGenerate(200, "Post Successfully", newPost));
    } catch (error) {
        return res.json(jsonGenerate(500, "Server error during posting", error));
    }
}



export const getPosts = async (req, res) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    } catch (error) {
        return res.json(jsonGenerate(500, "Server error during posting", error));
    }
}



export const deletePost = async (req, res) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return res.json(jsonGenerate(403, "You don't have permission to perform this action"));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        return res.json(jsonGenerate(200, "Successfully deleted post"));
    } catch (error) {
        return res.json(jsonGenerate(500, "Server error during posting", error));

    }
}




export const updatePost = async (req, res) => {

    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this post'));
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image,
                },
            },
            { new: true }
        );

        return res.json(jsonGenerate(200, "Post Updated Successfully", updatedPost));

    } catch (error) {
        return res.json(jsonGenerate(500, "Server error during posting", error.message));
    }
}