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
}

export default new MessageController();
