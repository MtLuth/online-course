import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import messageController from "../controllers/messageController.js";

const messageRouter = e.Router();

messageRouter.post(
  "/:receiver",
  authMiddleware.validateUser,
  messageController.sendMessage
);

export default messageRouter;
