import bcryptjs from "bcryptjs";
import User from "../models/user.model.js"
import jsonGenerate from "../utils/helper.js";

export const updateUser = async (req, res) => {

    if (req.user.id !== req.params.userId) {
        return res.json(jsonGenerate(400, 'You are not allowed to update this user'));
    }

    if (req.body.password) {
        if (req.body.password.length < 6) {
            return res.json(jsonGenerate(400, 'Password must be at least 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return res.json(jsonGenerate(400, 'Username should have between  7 and 20 characters'));
        }
        if (req.body.username.includes(' ')) {
            return res.json(jsonGenerate(400, 'Username cannot contain spaces'));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return res.json(jsonGenerate(400, 'Username should only include lowercase letters, numbers and underscore'));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return res.json(jsonGenerate(400, 'Username can only include letters and numbers'));
        }
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    profilePicture: req.body.profilePicture,
                    password: req.body.password,
                },
            },
            { new: true }
        );
        const { password, ...rest } = updatedUser._doc;

        return res.json(jsonGenerate(200, "Successfully updated the account", rest));
    } catch (error) {
        return res.jsonGenerate(500, `Server error updating user`);
    }
}



export const deleteUser = async (req, res) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return res.json(jsonGenerate(400, 'You are not allowed to delete this user'));
    }
    console.log(req.user.id);
    console.log(req.params.userId);
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        return res.json(jsonGenerate(200, "Successfully deleted this account"));

    } catch (error) {
        return res.jsonGenerate(500, `Server error deleting user`);
    }
}




export const getUsers = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.json(jsonGenerate(400, 'You are not allowed see user'));
    }

    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc;
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.json(jsonGenerate(200, "User fetched", {
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
        }));
    } catch (error) {
        return res.jsonGenerate(500, `Server error fetching user`, error);
    }
}



export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password').exec();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: 'Successfully retrieved the user',
            data: user
        })

    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving the user',
            data: error
        })
    }
}


export const logout = (req, res) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json('User has been signed out');
    } catch (error) {
        return res.jsonGenerate(500, `Server error logout user`, error);
    }
}