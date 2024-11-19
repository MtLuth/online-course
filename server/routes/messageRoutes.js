import e from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import messageController from "../controllers/messageController.js";

const messageRouter = e.Router();

messageRouter
  .route("/:receiver")
  .post(authMiddleware.validateUser, messageController.sendMessage)
  .get(authMiddleware.validateUser, messageController.loadMessages);

messageRouter.get(
  "/listen/:receiver",
  authMiddleware.validateUser,
  messageController.listenToNewMessage
);

export default messageRouter;
