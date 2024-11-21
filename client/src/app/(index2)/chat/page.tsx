"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useToastNotification } from "@/hook/useToastNotification";
import { getAuthToken } from "@/utils/auth";
import { useRouter } from "next/navigation"; // Import useRouter
import { messageApi } from "@/server/Message";
import { userApi } from "@/server/User";
import { jwtDecode } from "jwt-decode";

const ConversationsPage = () => {
  const router = useRouter(); // Initialize useRouter for navigation
  const [uid, setUid] = useState<string | undefined>(""); // User ID from token
  const [conversationList, setConversationList] = useState<any[]>([]); // List of conversations
  const { notifyError, notifySuccess } = useToastNotification(); // Toast notifications
  const token = getAuthToken();

  const conversationsRef = useRef<HTMLDivElement>(null); // Ref to conversations list

  // State để lưu trữ hồ sơ của người dùng hiện tại
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

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
        setUid(undefined);
        notifyError("Phiên đăng nhập không hợp lệ.");
      }
    } else {
      setUid(undefined);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, [token]);

  // Fetch conversation list từ API và lấy thông tin hồ sơ người dùng
  const fetchConversations = async () => {
    try {
      const response = await messageApi.conversationMsg(token);
      if (response.status === "Successfully") {
        const conversations = response.message; // Giả sử response.message là một mảng các cuộc trò chuyện
        // Giả sử mỗi cuộc trò chuyện có trường uid là ID của người tham gia
        const conversationsWithProfile = await Promise.all(
          conversations.map(async (conversation: any) => {
            try {
              const profileResponse = await userApi.profileUser(
                conversation.uid,
                token
              );

              if (profileResponse.status === "Successfully") {
                return {
                  ...conversation,
                  profile: profileResponse.message, // Thêm thông tin hồ sơ vào cuộc trò chuyện
                };
              } else {
                notifyError(
                  `Không thể lấy hồ sơ của người dùng ID: ${conversation.uid}`
                );
                return conversation;
              }
            } catch (error) {
              console.error(
                `Error fetching profile for UID: ${conversation.uid}`,
                error
              );
              notifyError(
                `Đã xảy ra lỗi khi lấy hồ sơ của người dùng ID: ${conversation.uid}`
              );
              return conversation;
            }
          })
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

  // Scroll to top of conversations list
  const scrollToTop = () => {
    conversationsRef.current?.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar: Only Conversation List */}
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
                onClick={() => router.push(`/chat/${conversation.uid}`)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#81d4fa", // Darker blue background for selected item
                    "&:hover": {
                      backgroundColor: "#4fc3f7", // Even darker on hover
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={conversation.profile?.avt}
                    alt={conversation.profile?.fullName}
                  >
                    {conversation.profile?.fullName.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.profile?.fullName || "Người dùng"}
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
    </Box>
  );
};

export default ConversationsPage;
