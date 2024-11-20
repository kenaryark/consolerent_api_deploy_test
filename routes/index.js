import express from "express";
import { Payment } from "../controllers/Payment.js";
// import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import {
  getTenants,
  createTenant,
  updateTenant,
  deleteTenant,
  getTenantById,
  editStatusComplete,
} from "../controllers/Tenant.js";
// import { refreshToken } from "../controllers/RefreshToken.js";
// import { verifyToken } from "../middleware/VerifyToken.js";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/Users.js";

import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

import { Login, logOut, Me } from "../controllers/Auth.js";

const router = express.Router();

//Payment API
router.post("/process-transaction", Payment);

//Users API
// router.get("/users", getUsers);
// router.get("/users/:id", verifyUser, getUserById);
router.post("/users", createUser);
// router.patch("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);
router.get("/users", verifyUser, adminOnly, getUsers);
router.get("/users/:id", verifyUser, getUserById);
// router.post("/users", verifyUser, adminOnly, createUser);
router.patch("/users/:id", verifyUser, updateUser);
router.delete("/users/:id", verifyUser, adminOnly, deleteUser);

//Auth API
router.get("/me", Me);
router.post("/login", Login);
router.delete("/logout", logOut);

//Data API
router.get("/tenants", verifyUser, getTenants);
router.post("/tenants", verifyUser, createTenant);
router.get("/tenants/:id", verifyUser, getTenantById);
router.put("/tenants/:id", verifyUser, adminOnly, updateTenant);
router.patch(
  "/tenants/:id/complete",
  verifyUser,
  adminOnly,
  editStatusComplete
);
router.delete("/tenants/:id", verifyUser, adminOnly, deleteTenant);

//Users API Old
// router.get("/users", verifyToken, getUsers);
// router.post("/users", Register);
// router.post("/login", Login);
// router.get("/token", refreshToken);
// router.delete("/logout", Logout);

export default router;
