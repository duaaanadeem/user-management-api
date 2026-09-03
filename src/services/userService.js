const User = require("../models/User");

// ==================== GET ALL USERS ====================

const getAllUsersService = async () => {
    return await User.find().select("-password");
};

// ==================== GET USER BY ID ====================

const getUserByIdService = async (userId) => {
    return await User.findById(userId).select("-password");
};

// ==================== UPDATE USER ====================

const updateUserService = async (userId, updateData) => {
    return await User.findByIdAndUpdate(
        userId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");
};

// ==================== DELETE USER ====================

const deleteUserService = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

module.exports = {
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService
};