const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require('../utils/generateToken');


//Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Valid all fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All Fields are required",
            });
        }
        //Check existe user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        //Password hash
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Add user in Database
        await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            success: true,
            message: "User Register Successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: message.error,
        })
    }
}

//Login User 
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All Field required",
        })
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials",
        })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid Credentials",
        })
    }
    const token = generateToken(user._id);

    return res.status(200).json({
        success: true,
        message: "Login Successful.",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}


module.exports = {
    registerUser,
    loginUser,
}