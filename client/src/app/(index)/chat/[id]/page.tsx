"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { messageApi } from "@/server/Message";
import { useToastNotification } from "@/hook/useToastNotification";
import { getAuthToken } from "@/utils/auth";
import { useParams } from "next/navigation";

const ChatPage = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]); // Tin nhắn giữa người dùng và chuyên gia
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>(""); // Tin nhắn mới
  const { notifyError } = useToastNotification();
  const token = getAuthToken();

  const fetchMessages = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await messageApi.listenMessage(id as string, token);
      if (response.status === "Successfully") {
        setMessages(response.message || []);
      } else {
        notifyError("Không thể tải tin nhắn.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      notifyError("Đã xảy ra lỗi khi tải tin nhắn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMessages();
    }
  }, [id]);

  const handleSendMessage = async () => {
    if (!newMessage) return;
    try {
      const response = await messageApi.messageSend(
        id as string,
        newMessage,
        "text",
        token
      );
      if (response.status === "Successfully") {
        setNewMessage("");
        fetchMessages();
      } else if (response.status === "fail") {
        notifyError(response.message || " Không thể gửi tin nhắn.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      notifyError("Đã xảy ra lỗi khi gửi tin nhắn.");
    }
  };

  const renderMessageContent = (message: any) => {
    switch (message.message.contentType) {
      case "text":
        return (
          <Typography variant="body2">{message.message.content}</Typography>
        );
      case "image":
        return (
          <Box
            component="img"
            src={message.message.content}
            alt="Sent Image"
            sx={{ maxWidth: "200px", marginTop: 1, borderRadius: 1 }}
          />
        );
      default:
        return <Typography variant="body2">[Unsupported content]</Typography>;
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Trò Chuyện Với Chuyên Gia
      </Typography>

      {loading ? (
        <Box
          sx={{
            flex: 1, // Chiếm hết không gian còn lại
            overflowY: "auto", // Cho phép cuộn dọc nếu nội dung vượt quá chiều cao
            marginBottom: 3,
            maxHeight: "60vh", // Giới hạn chiều cao của khu vực tin nhắn
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1, // Chiếm hết không gian còn lại
            overflowY: "auto", // Cho phép cuộn dọc nếu nội dung vượt quá chiều cao
            marginBottom: 3,
            maxHeight: "60vh", // Giới hạn chiều cao của khu vực tin nhắn
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg) => (
              <Box
                key={msg.key}
                sx={{
                  marginBottom: 2,
                  display: "flex",
                  flexDirection:
                    msg.message.sender === "user-id" ? "row-reverse" : "row",
                }}
              >
                <Avatar
                  src="/avatar-placeholder.png" // Replace with user/instructor avatar
                  sx={{ width: 40, height: 40, margin: "0 8px" }}
                />
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor:
                      msg.message.sender === "user-id" ? "#f0f0f0" : "#e1f5fe",
                    borderRadius: 2,
                    maxWidth: "80%",
                  }}
                >
                  {renderMessageContent(msg)}
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body2">Chưa có tin nhắn nào.</Typography>
          )}
        </Box>
      )}

      <Box display="flex" alignItems="center" sx={{ marginTop: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          label="Nhắn tin..."
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ marginLeft: 2 }}
          onClick={handleSendMessage}
        >
          Gửi
        </Button>
      </Box>
    </Box>
  );
};

export default ChatPage;
