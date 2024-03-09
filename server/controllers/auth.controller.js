import User from "../models/user.model.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import jsonGenerate from "../utils/helper.js";



export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        return res.status(200).json({
            success: false,
            message: "All fiels are required !"
        });
    }

    try {
        const existedUser = await User.findOne({ email: email });

        if (existedUser) {
            return res.status(200).json({
                success: false,
                message: "User already exists !"
            });
        }

        const existedUsername = await User.findOne({ username });

        if (existedUsername) {
            return res.status(200).json({
                success: false,
                message: "Username already exists !"
            });
        }

        const hashedPassword = bcryptjs.hashSync(password, 10);

        const user = await User.create({
            username,
            email: email,
            password: hashedPassword
        })

        return res.status(200).json({
            success: true,
            message: "Registered Successfully !",
            data: {
                username: user.username,
                email: user.email,
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err
        });
    }
}



export const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
        return res.json(jsonGenerate(400, "All Fiels are required !"))
    }

    try {
        const validUser = await User.findOne({ email: email });

        if (!validUser) {
            return res.json(jsonGenerate(400, "User not found!"))
        }

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.json(jsonGenerate(400, "Invalid Password!"))
        }

        const token = jwt.sign({
            id: validUser._id,
            isAdmin: validUser.isAdmin
        }, process.env.JWTSECRET);


        const { password: pass, ...rest } = validUser._doc;

        return res.status(200)
            .cookie('access_token', token, {
                httpOnly: true
            })
            .json(jsonGenerate(200, "Login Successfully !", rest));

    } catch (err) {
        return res.json(jsonGenerate(500, err.message));
    }
}



export const google = async (req, res) => {
    const { name, email, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({
                id: user._id,
                isAdmin: user.isAdmin
            }, process.env.JWTSECRET);

            const { password: pass, ...rest } = user._doc;

            return res.status(200)
                .cookie('access_token', token, {
                    httpOnly: true
                })
                .json({
                    success: true,
                    message: "Login Successfully !",
                    rest
                });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = await User.create({
                username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            })


            const token = jwt.sign({
                id: newUser._id,
                isAdmin: newUser.isAdmin
            }, process.env.JWTSECRET);

            const { password: pass, ...rest } = newUser._doc;

            return res.status(200)
                .cookie('access_token', token, {
                    httpOnly: true
                })
                .json({
                    success: true,
                    message: "Login Successfully !",
                    rest
                });
        }

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Something  went wrong",
            data: err
        });
    }
}