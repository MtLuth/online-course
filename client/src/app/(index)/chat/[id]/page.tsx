"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { useToastNotification } from "@/hook/useToastNotification";
import { getAuthToken } from "@/utils/auth";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { uploadApi } from "@/server/Upload";

const ChatPage = () => {
  const { id } = useParams();
  const [uid, setUid] = useState<string | undefined>(""); // User ID extracted from JWT
  const [messages, setMessages] = useState<any[]>([]); // Messages between the user and the expert
  const [newMessage, setNewMessage] = useState<string>(""); // New message
  const [imageFile, setImageFile] = useState<File | null>(null); // Image file to upload
  const { notifyError } = useToastNotification();
  const token = getAuthToken();

  // Decode the token and get the user ID
  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUid(decoded.user_id);
      } catch (error) {
        console.error("Invalid token format:", error);
        setUid(undefined);
      }
    } else {
      setUid(undefined);
    }
  }, [token]);

  // Fetch previous messages when the page loads
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
        // Check if the response contains an array of messages or a single message
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          notifyError("Không thể tải tin nhắn.");
        }
      } else {
        notifyError("Không thể tải tin nhắn.");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      notifyError("Đã xảy ra lỗi khi tải tin nhắn.");
    }
  };

  // UseEffect to initialize EventSource for real-time updates
  useEffect(() => {
    if (!id || !uid) return;

    const eventSource = new EventSource(
      `http://localhost:8080/api/v1/message/${id}/${uid}` // Token as query parameter
    );

    eventSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      if (data.status === "Successfully" && Array.isArray(data.messages)) {
        // Handle bulk message updates (e.g., on initial load)
        setMessages((prevMessages) => [...prevMessages, ...data.messages]);
      } else if (data.status === "NewMessage" && data.message) {
        // Handle new single message updates
        setMessages((prevMessages) => [...prevMessages, data.message]);
      } else {
        console.error("Received unexpected data format:", data);
      }
    });

    // Handle 'error' event
    eventSource.addEventListener("error", (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    });

    // Fetch messages on initial load
    fetchMessages();

    // Cleanup the EventSource connection when component unmounts
    return () => {
      eventSource.close();
    };
  }, [id, uid, token]); // Dependencies include token, id, and uid

  // Function to send a new message
  const handleSendMessage = async () => {
    if (!newMessage && !imageFile) return;

    let messageContent = newMessage;
    if (imageFile) {
      try {
        // Upload the image and get URL
        const response = await uploadApi.uploadImages([imageFile], token);
        if (response.status === "Successfully") {
          messageContent = response.message; // URL of uploaded image
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
            contentType: imageFile ? "image" : "text", // Set content type based on message
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setNewMessage(""); // Clear input after successful send
        setImageFile(null); // Clear the selected image
      } else {
        notifyError(data.message || "Không thể gửi tin nhắn.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      notifyError("Đã xảy ra lỗi khi gửi tin nhắn.");
    }
  };

  // Function to handle file input (for image upload)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0]);
    }
  };

  // Render message content based on the message type
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

      <Box
        sx={{
          flex: 1, // Takes up remaining space
          overflowY: "auto", // Allows scrolling if content overflows
          marginBottom: 3,
          maxHeight: "60vh", // Limits the height of the message area
        }}
      >
        {messages.length > 0 ? (
          messages.map((msgItem, index) => {
            const msg = msgItem.message || msgItem; // Handle both single message and bulk response
            return (
              <Box
                key={index}
                sx={{
                  marginBottom: 2,
                  display: "flex",
                  flexDirection: msg.sender === uid ? "row-reverse" : "row", // Display message based on sender
                }}
              >
                <Avatar
                  src="/avatar-placeholder.png" // Replace with actual user/instructor avatar
                  sx={{ width: 40, height: 40, margin: "0 8px" }}
                />
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: msg.sender === uid ? "#f0f0f0" : "#e1f5fe",
                    borderRadius: 2,
                    maxWidth: "80%",
                  }}
                >
                  {renderMessageContent(msg)}
                </Box>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2">Chưa có tin nhắn nào.</Typography>
        )}
      </Box>

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

        {/* Image upload button */}
        <Button variant="outlined" component="label" sx={{ marginLeft: 2 }}>
          Tải Ảnh
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>

        {/* Sticker buttons */}
        <Box sx={{ marginLeft: 2 }}>
          {/* Example sticker buttons */}
          <IconButton onClick={() => setNewMessage("🙂")}>🙂</IconButton>
          <IconButton onClick={() => setNewMessage("😂")}>😂</IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
