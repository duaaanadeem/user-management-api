const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const {
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService
} = require("../services/userService");

// ==================== REGISTER ====================

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        next(error);
    }
};

// ==================== LOGIN ====================

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        next(error);
    }
};

// ==================== GET ALL USERS ====================

const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();

        res.status(200).json({
            users
        });

    } catch (error) {
        next(error);
    }
};

// ==================== GET USER BY ID ====================

const getUserById = async (req, res, next) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await getUserByIdService(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        next(error);
    }
};

// ==================== UPDATE USER ====================

const updateUser = async (req, res, next) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const userId = req.params.id;

        // Authorization
        if (req.userId !== userId) {
            return res.status(403).json({
                message: "You can only update your own account"
            });
        }

        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({
                message: "Please provide name or email to update"
            });
        }

        const updateData = {};

        if (name) {
            updateData.name = name;
        }

        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Please provide a valid email"
                });
            }

            const existingUser = await User.findOne({
                email,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already in use"
                });
            }

            updateData.email = email;
        }

        const user = await updateUserService(
            userId,
            updateData
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User updated successfully",
            user
        });

    } catch (error) {
        next(error);
    }
};

// ==================== DELETE USER ====================

const deleteUser = async (req, res, next) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const userId = req.params.id;

        // Authorization
        if (req.userId !== userId) {
            return res.status(403).json({
                message: "You can only delete your own account"
            });
        }

        const user = await deleteUserService(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

// ==================== EXPORTS ====================

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};