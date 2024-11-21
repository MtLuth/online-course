// src/pages/policy.tsx

"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import Image from "@/components/image"; // Nếu bạn muốn thêm hình ảnh minh họa

const PolicyPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Chính Sách và Quy Định
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Đảm bảo môi trường học tập chuyên nghiệp và an toàn cho mọi học viên
          và chuyên gia.
        </Typography>
      </Box>

      {/* Nội Quy và Quy Định của Các Khóa Học */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Những Nội Quy và Quy Định của Các Khóa Học
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Đăng Ký và Thanh Toán</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText
                  primary="Quy Định Đăng Ký"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Học viên cần cung cấp thông tin chính xác khi đăng ký khóa
                      học. Mỗi học viên chỉ được đăng ký một tài khoản duy nhất.
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Quy Định Thanh Toán"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Các phương thức thanh toán được chấp nhận bao gồm thẻ tín
                      dụng, PayPal, và chuyển khoản ngân hàng. Thanh toán phải
                      được hoàn tất trước khi truy cập vào nội dung khóa học.
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Điều Khoản Học Tập</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText
                  primary="Tham Gia Khóa Học"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Học viên cam kết tham gia đầy đủ các buổi học và hoàn
                      thành các bài tập được giao. Việc gian lận trong học tập
                      sẽ dẫn đến việc đình chỉ tài khoản.
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Đánh Giá và Phản Hồi"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Học viên được khuyến khích cung cấp phản hồi xây dựng để
                      cải thiện chất lượng khóa học. Đánh giá phải dựa trên kinh
                      nghiệm thực tế và không chứa nội dung không phù hợp.
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Chính Sách Hoàn Tiền</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText
                  primary="Điều Kiện Hoàn Tiền"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Học viên có thể yêu cầu hoàn tiền trong vòng 7 ngày kể từ
                      ngày đăng ký khóa học. Các yêu cầu hoàn tiền sau thời hạn
                      này sẽ không được chấp nhận.
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Thủ Tục Hoàn Tiền"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Học viên cần liên hệ với bộ phận hỗ trợ khách hàng để thực
                      hiện yêu cầu hoàn tiền. Quá trình hoàn tiền sẽ được xử lý
                      trong vòng 5-7 ngày làm việc.
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Bảo Mật và Quyền Riêng Tư</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText
                  primary="Bảo Mật Thông Tin"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      eLearning cam kết bảo vệ thông tin cá nhân của học viên và
                      không chia sẻ với bên thứ ba mà không có sự đồng ý của học
                      viên.
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Quyền Riêng Tư"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Học viên có quyền truy cập, chỉnh sửa, hoặc xóa thông tin
                      cá nhân của mình bất cứ lúc nào thông qua trang quản lý
                      tài khoản.
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Chính Sách Sử Dụng Nội Dung</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText
                  primary="Bản Quyền"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Tất cả nội dung khóa học thuộc bản quyền của eLearning
                      hoặc các chuyên gia giảng dạy. Học viên không được phép
                      sao chép, phân phối, hoặc sử dụng nội dung khóa học cho
                      mục đích thương mại mà không có sự cho phép.
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Sử Dụng Hợp Pháp"
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Học viên chỉ sử dụng nội dung khóa học cho mục đích học
                      tập cá nhân.
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Lợi Ích cho Các Chuyên Gia của eLearning */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Lợi Ích cho Các Chuyên Gia của eLearning
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Cơ Hội Phát Triển Bản Thân
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Nâng cao kỹ năng giảng dạy và xây dựng thương hiệu cá nhân thông
                qua các khóa đào tạo chuyên sâu và tài liệu hỗ trợ.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Chia Sẻ Doanh Thu
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Hưởng mức chia sẻ doanh thu hấp dẫn, đảm bảo rằng bạn nhận được
                phần thưởng xứng đáng cho công sức của mình.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Hỗ Trợ Kỹ Thuật và Marketing
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Nhận được sự hỗ trợ kỹ thuật chuyên nghiệp và chiến lược
                marketing hiệu quả để tăng cường độ phủ sóng và thu hút học
                viên.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Cộng Đồng Chuyên Gia
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tham gia vào một cộng đồng các chuyên gia để kết nối, chia sẻ
                kinh nghiệm, và hợp tác trong các dự án phát triển.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Đào Tạo và Tài Nguyên
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Truy cập vào các khóa đào tạo miễn phí và tài nguyên hỗ trợ để
                tối ưu hóa việc tạo và quản lý khóa học của bạn.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PolicyPage;
