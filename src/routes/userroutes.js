const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const router = express.Router();

// ==================== REGISTER ====================

router.post("/register", registerUser);

// ==================== LOGIN ====================

router.post("/login", loginUser);

// ==================== GET ALL USERS ====================

router.get("/all", protect, getAllUsers);

// ==================== GET USER BY ID ====================

router.get("/:id", protect, getUserById);

// ==================== UPDATE USER ====================

router.put("/:id", protect, updateUser);

// ==================== DELETE USER ====================

router.delete("/:id", protect, deleteUser);

module.exports = router;