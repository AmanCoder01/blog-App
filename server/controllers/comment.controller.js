import Comment from "../models/comment.model.js"
import jsonGenerate from "../utils/helper.js"

export const createComment = async (req, res) => {
    if (req.user.id !== req.body.userId) {
        return res.json(jsonGenerate(401, "'You are not allowed to create this comment"));
    }

    const { content, postId, userId } = req.body;

    try {
        const newComment = await Comment.create({
            content,
            postId,
            userId,
        })

        return res.json(jsonGenerate(200, "Comment Done", newComment));

    } catch (error) {
        return res.json(jsonGenerate(500, `Server error: ${error}`))
    }
}



export const getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1,
        });
        return res.json(jsonGenerate(200, "Comment Fetched", comments));
    } catch (error) {
        return res.json(jsonGenerate(500, `Server error: ${error}`))
    }
}




export const editComment = async (req, res) => {
    if (!req.user.id) {
        return res.status(404).json({ message: 'Not Allowed' });
    }

    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(
                errorHandler(403, 'You are not allowed to edit this comment')
            );
        }

        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content,
            },
            { new: true }
        );

        return res.status(200).json({
            message: 'Comment updated',
            data: editedComment
        })

    } catch (error) {
        return res.status(500).send({
            message: 'server error',
            data: error
        });
    }
}


export const likeComment = async (req, res) => {
    if (!req.user.id) {
        return res.status(404).json({ message: 'Not Allowed' });
    }

    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const userIndex = comment.likes.indexOf(req.user.id);

        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        }
        else {
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1);
        }

        await comment.save();

        return res.status(200).json({
            message: 'Like updated',
            data: comment
        })

    } catch (error) {
        return res.status(500).send({
            message: 'server error',
            data: error
        });
    }
}

export const deleteComment = async (req, res) => {
    if (!req.user.id) {
        return res.status(404).json({ message: 'Not Allowed' });
    }

    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(
                errorHandler(403, 'You are not allowed to delete this comment')
            );
        }

        await Comment.findByIdAndDelete(req.params.commentId);

        return res.status(200).json({
            message: 'Comment deleted',
        })

    } catch (error) {
        return res.status(500).send({
            message: 'server error',
            data: error
        });
    }
}