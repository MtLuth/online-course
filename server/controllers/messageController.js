import conversationServices from "../services/conversationServices.js";
import MessageMediator from "../services/messageMediator.js";
import catchAsync from "../utils/catchAsync.js";
import { messageSchema } from "../validator/validationSchema.js";

class MessageController {
  sendMessage = catchAsync(async (req, res, next) => {
    const sender = req.uid;
    const receiver = req.params.receiver;

    const mediator = new MessageMediator(sender, receiver);

    const { content, contentType } = await messageSchema.validate(req.body);
    await mediator.sendMessage(sender, receiver, contentType, content);

    res.status(200).json({
      status: "Successfully",
    });
  });

  loadMessages = catchAsync(async (req, res, next) => {
    const sender = req.params.sender;
    const receiver = req.params.receiver;

    const mediator = new MessageMediator(sender, receiver);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const onMessagesLoaded = (messages) => {
      res.write(
        `data: ${JSON.stringify({ status: "Successfully", messages })}\n\n`
      );
    };

    const onNewMessage = (newMessage) => {
      res.write(
        `data: ${JSON.stringify({ status: "NewMessage", message: newMessage })}\n\n`
      );
    };

    mediator.loadMessagesRealtime(onMessagesLoaded, onNewMessage);

    req.on("close", () => {
      mediator.stopListening();
      res.end();
    });
  });

  listenToNewMessage = catchAsync(async (req, res, next) => {
    const sender = req.params.sender;
    const receiver = req.params.receiver;
    const mediator = new MessageMediator(sender, receiver);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    mediator.listenToNewMessage(res);

    req.on("close", () => {
      console.log("Client disconnected");
    });
  });

  getAllConversations = catchAsync(async (req, res, next) => {
    const uid = req.uid;
    const results = await conversationServices.getAllConversationKey(uid);
    res.status(200).json({
      status: "Successfully",
      message: results,
    });
  });
}

export default new MessageController();
