"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { useToastNotification } from "@/hook/useToastNotification";
import { getAuthToken } from "@/utils/auth";
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import { uploadApi } from "@/server/Upload";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { messageApi } from "@/server/Message";
import { userApi } from "@/server/User";
import { jwtDecode } from "jwt-decode";

const ChatPage = () => {
  const { id } = useParams(); // Current conversation ID from route
  const router = useRouter(); // Initialize useRouter for navigation
  const [uid, setUid] = useState<string | undefined>(undefined); // User ID from token
  const [messages, setMessages] = useState<any[]>([]); // Messages in current conversation
  const [newMessage, setNewMessage] = useState<string>(""); // New message input
  const [stickerDialogOpen, setStickerDialogOpen] = useState<boolean>(false); // Sticker dialog state
  const [conversationList, setConversationList] = useState<any[]>([]); // List of conversations
  const { notifyError, notifySuccess } = useToastNotification(); // Toast notifications
  const token = getAuthToken();

  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to bottom
  const conversationsRef = useRef<HTMLDivElement>(null); // Ref to conversations list

  const [imageToSend, setImageToSend] = useState<File | null>(null); // Ảnh cần gửi
  const [isImageDialogOpen, setIsImageDialogOpen] = useState<boolean>(false); // Trạng thái mở hộp thoại xác nhận

  // State để lưu trữ hồ sơ của người dùng hiện tại
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Decode token to get user ID và lấy hồ sơ người dùng hiện tại
  useEffect(() => {
    const fetchCurrentUserProfile = async (userId: string) => {
      try {
        const profileResponse = await userApi.profileUser(userId, token);
        if (profileResponse.status === "Successfully") {
          setCurrentUserProfile(profileResponse.message);
        } else {
          notifyError("Không thể lấy thông tin hồ sơ của bạn.");
        }
      } catch (error) {
        console.error("Error fetching current user profile:", error);
        notifyError("Đã xảy ra lỗi khi lấy thông tin hồ sơ của bạn.");
      }
    };

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUid(decoded.user_id);
        fetchCurrentUserProfile(decoded.user_id);
      } catch (error) {
        console.error("Invalid token format:", error);
        setUid(undefined);
        notifyError("Phiên đăng nhập không hợp lệ.");
      }
    } else {
      setUid(undefined);
    }
  }, [token]);

  // Fetch conversation list when the component mounts hoặc token thay đổi
  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, [token]);

  // Fetch conversation list từ API và sử dụng dữ liệu trực tiếp từ response
  const fetchConversations = async () => {
    try {
      const response = await messageApi.conversationMsg(token);
      if (response.status === "Successfully") {
        const conversations = response.message;
        const conversationsWithProfile = conversations.map(
          (conversation: any) => {
            return {
              ...conversation,
            };
          }
        );

        setConversationList(conversationsWithProfile);
        scrollToTop();
      } else {
        notifyError("Không thể tải danh sách cuộc trò chuyện.");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      notifyError("Đã xảy ra lỗi khi tải danh sách cuộc trò chuyện.");
    }
  };

  const fetchMessages = async () => {
    if (!id) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/message/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
          scrollToBottom();
        } else {
          notifyError("Không thể tải tin nhắn.");
        }
      } else {
        notifyError(data.message || "Không thể tải tin nhắn.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      notifyError("Đã xảy ra lỗi khi tải tin nhắn.");
    }
  };

  useEffect(() => {
    if (!id || !uid) return;

    const eventSource = new EventSource(
      `http://localhost:8080/api/v1/message/${id}/${uid}`
    );

    eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      if (data.status === "Successfully" && Array.isArray(data.messages)) {
        setMessages((prevMessages) => [...prevMessages, ...data.messages]);
      } else if (data.status === "NewMessage" && data.message) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    });

    eventSource.addEventListener("error", (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    });

    fetchMessages(); // Fetch messages khi EventSource được khởi tạo

    return () => {
      eventSource.close();
    };
  }, [id, uid, token]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll to top of conversations list
  const scrollToTop = () => {
    conversationsRef.current?.scrollTo({ top: 0, behavior: "auto" });
  };

  const handleSendMessage = async () => {
    if ((!newMessage && !imageToSend) || !id) return;

    let messageContent = newMessage.trim();
    let contentType: "image" | "sticker" | "text" = "text";

    if (imageToSend) {
      try {
        const response = await uploadApi.uploadImages([imageToSend], token);
        if (response.status === "Successfully") {
          messageContent = response.message; // URL của ảnh đã tải lên
          contentType = "image";
        } else {
          notifyError("Không thể tải lên ảnh.");
          return;
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        notifyError("Đã xảy ra lỗi khi tải ảnh.");
        return;
      }
    }

    const hasSticker = stickers.some((sticker) =>
      messageContent.includes(sticker)
    );
    if (hasSticker) {
      contentType = "sticker";
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/message/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: messageContent,
            contentType: contentType,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setNewMessage("");
        setImageToSend(null);
        notifySuccess("Tin nhắn đã được gửi.");
        // Optionally, append the new message to messages state
        // setMessages((prevMessages) => [...prevMessages, data.message]);
      } else {
        notifyError(data.message || "Không thể gửi tin nhắn.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      notifyError("Đã xảy ra lỗi khi gửi tin nhắn.");
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageToSend(file);
      setIsImageDialogOpen(true); // Mở hộp thoại xác nhận gửi ảnh
    }
  };

  // Confirm sending image
  const confirmSendImage = async () => {
    setIsImageDialogOpen(false);
    await handleSendMessage();
  };

  // Cancel sending image
  const cancelSendImage = () => {
    setIsImageDialogOpen(false);
    setImageToSend(null);
  };

  // Handle sticker selection và chèn vào trường nhập tin nhắn
  const handleStickerSelect = (sticker: string) => {
    setNewMessage((prev) => prev + sticker);
    setStickerDialogOpen(false);
  };

  // Render message content based on type
  const renderMessageContent = (message: any) => {
    switch (message.contentType) {
      case "text":
        return <Typography variant="body2">{message.content}</Typography>;
      case "image":
        return (
          <Box
            component="img"
            src={message.content}
            alt="Sent Image"
            sx={{
              maxWidth: "200px",
              marginTop: 1,
              borderRadius: 1,
              cursor: "pointer",
            }}
            onClick={() => window.open(message.content, "_blank")}
          />
        );
      case "sticker":
        return (
          <Typography variant="body2" sx={{ fontSize: "1.5rem" }}>
            {message.content}
          </Typography>
        );
      default:
        return <Typography variant="body2">[Unsupported content]</Typography>;
    }
  };

  // Available stickers
  const stickers = ["🙂", "😂", "😎", "😍", "😜", "👍", "🎉", "❤️"];

  // Lấy hồ sơ của cuộc trò chuyện hiện tại
  const currentConversationProfile = conversationList.find(
    (conversation) => conversation.uid === id
  )?.profile;

  return (
    <Box sx={{ display: "flex", height: "85vh" }}>
      {/* Sidebar */}
      <Box
        ref={conversationsRef} // Attach ref directly to the conversations list container
        sx={{
          width: { xs: "200px", sm: "250px" }, // Responsive width
          backgroundColor: "#fff",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          paddingTop: 3,
        }}
      >
        <Typography variant="h6" sx={{ paddingLeft: 2, marginBottom: 2 }}>
          Cuộc Trò Chuyện
        </Typography>
        <List>
          {conversationList.length > 0 ? (
            conversationList.map((conversation) => (
              <ListItem
                button
                key={conversation.uid}
                onClick={() => router.push(`/chat/${conversation.uid}`)} // Navigate to the conversation
                selected={conversation.uid === id} // Highlight the selected conversation
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#81d4fa", // Darker blue background for selected item
                    "&:hover": {
                      backgroundColor: "#4fc3f7", // Even darker on hover
                    },
                  },
                  "&:hover": {
                    backgroundColor:
                      conversation.uid === id ? "#4fc3f7" : "#f5f5f5", // Hover effect
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar src={conversation.avt} alt={conversation.fullName}>
                    {conversation.fullName.charAt(0)}{" "}
                    {/* Fallback nếu không có avatar */}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.fullName || "Người dùng"} // Hiển thị tên đầy đủ
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText
                primary="Chưa có cuộc trò chuyện nào."
                primaryTypographyProps={{
                  align: "center",
                  color: "textSecondary",
                }}
              />
            </ListItem>
          )}
        </List>
      </Box>

      {/* Main Chat Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 4,
        }}
      >
        {/* Header: Display names of two participants */}
        <Box sx={{ marginBottom: 2 }}>
          <Typography variant="h5" align="center">
            {currentUserProfile?.fullName || "Bạn"} và{" "}
            {currentConversationProfile?.fullName || "Chuyên Gia"}
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            flex: 1,
            padding: 2,
            overflowY: "auto",
            marginBottom: 3,
            borderRadius: 2,
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.length > 0 ? (
            messages.map((msgItem, index) => {
              const msg = msgItem.message || msgItem;
              const isUser = msg.sender === uid;
              return (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: isUser ? "row-reverse" : "row",
                    alignItems: "flex-start",
                    marginBottom: 2,
                  }}
                >
                  <Avatar
                    src={
                      isUser
                        ? currentUserProfile?.avt || "/user-avatar.png"
                        : currentConversationProfile?.avt ||
                          "/expert-avatar.png"
                    }
                    alt={
                      isUser
                        ? currentUserProfile?.fullName || "Bạn"
                        : currentConversationProfile?.fullName || "Chuyên Gia"
                    }
                    sx={{ width: 40, height: 40, margin: "0 8px" }}
                  />
                  <Box
                    sx={{
                      maxWidth: "70%",
                      backgroundColor: isUser ? "#DCF8C6" : "#E1F5FE",
                      padding: 1.5,
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                  >
                    {/* Hiển thị tên người gửi */}
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                      {isUser
                        ? currentUserProfile?.fullName || "Bạn"
                        : currentConversationProfile?.fullName || "Chuyên Gia"}
                    </Typography>
                    {renderMessageContent(msg)}
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography
              variant="body2"
              align="center"
              color="textSecondary"
              sx={{ marginTop: 2 }}
            >
              Chưa có tin nhắn nào.
            </Typography>
          )}
          <div ref={messagesEndRef} /> {/* Dummy div to scroll into */}
        </Paper>

        {/* Input Section */}
        <Box
          display="flex"
          alignItems="center"
          sx={{ marginTop: 3, mx: "auto" }}
        >
          <TextField
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            label="Nhắn tin..."
            sx={{
              width: { xs: "100%", sm: 700 }, // Responsive width
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginLeft: 2, height: "56px" }}
            onClick={handleSendMessage}
          >
            Gửi
          </Button>

          <Button
            variant="outlined"
            component="label"
            sx={{ marginLeft: 2, height: "56px" }}
          >
            Tải Ảnh
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>

          <IconButton
            color="primary"
            sx={{ marginLeft: 2 }}
            onClick={() => setStickerDialogOpen(true)}
            aria-label="Chọn sticker" // Accessibility improvement
          >
            <InsertEmoticonIcon />
          </IconButton>
        </Box>

        {/* Image Confirmation Dialog */}
        <Dialog
          open={isImageDialogOpen}
          onClose={cancelSendImage}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Xác Nhận Gửi Ảnh</DialogTitle>
          <DialogContent>
            {imageToSend && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <img
                  src={URL.createObjectURL(imageToSend)}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "400px" }}
                />
              </Box>
            )}
            <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
              Bạn có chắc chắn muốn gửi ảnh này?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelSendImage} color="secondary">
              Hủy
            </Button>
            <Button
              onClick={confirmSendImage}
              color="primary"
              variant="contained"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Sticker Selection Dialog */}
        <Dialog
          open={stickerDialogOpen}
          onClose={() => setStickerDialogOpen(false)}
        >
          <DialogTitle>Chọn Sticker</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {stickers.map((sticker, index) => (
                <Grid item key={index}>
                  <IconButton
                    onClick={() => handleStickerSelect(sticker)}
                    sx={{ fontSize: 28 }}
                    aria-label={`Chọn sticker ${sticker}`} // Accessibility improvement
                  >
                    {sticker}
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ChatPage;
