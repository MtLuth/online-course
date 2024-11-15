import React, { useRef } from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "./logo/Logo";

interface Course {
  courseId: string;
  title: string;
  price: number;
}

interface Purchase {
  code: string;
  boughtAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  sku: Course[];
  total: number;
}

interface PurchaseDetailsModalProps {
  open: boolean;
  handleClose: () => void;
  purchase: Purchase | null;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "8px",
};

const PurchaseDetailsModal: React.FC<PurchaseDetailsModalProps> = ({
  open,
  handleClose,
  purchase,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (printRef.current && purchase) {
      const element = printRef.current;
      const currentDate = dayjs().format("YYYY-MM-DD_HH-mm-ss");
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
      const fileName = `HoaDon_${currentDate}.pdf`;
      pdf.save(fileName);
    }
  };

  if (!purchase) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <div ref={printRef}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Logo />
            <Typography variant="h5">Hóa Đơn</Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Chi Tiết Đơn Hàng
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1">
              <strong>Mã Đơn Hàng:</strong> {purchase.code}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Ngày Mua:</strong>{" "}
              {dayjs(
                purchase.boughtAt._seconds * 1000 +
                  purchase.boughtAt._nanoseconds / 1e6
              ).format("DD/MM/YYYY HH:mm:ss")}
            </Typography>
          </Box>

          <Table sx={{ mt: 2 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell>
                  <strong>Khóa Học</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Giá</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {purchase.sku.map((course) => (
                <TableRow key={course.courseId}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell align="right">
                    {course.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Tổng Cộng
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {purchase.total.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose} sx={{ mr: 2 }}>
            Đóng
          </Button>
          <Button variant="contained" color="primary" onClick={handlePrint}>
            In Hóa Đơn
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PurchaseDetailsModal;
