import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { categoriesApi } from "@/server/Categories";
import BaseCard from "@/components/shared/DashboardCard";
import { useToastNotification } from "@/hook/useToastNotification";

const CategoriesList = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { notifySuccess, notifyError } = useToastNotification();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getCategories(token);
      setCategories(data.message);
    } catch (error) {
      notifyError("Lỗi khi tải danh mục");
    }
  };

  const handleOpenDialog = (category) => {
    if (category) {
      setEditCategory(category);
      setName(category.name);
      setUrl(category.url);
    } else {
      setEditCategory(null);
      setName("");
      setUrl("");
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveCategory = async () => {
    try {
      if (editCategory) {
        await categoriesApi.updateCategories(
          { id: editCategory.id, name, url },
          token
        );
        notifySuccess("Cập nhật danh mục thành công");
      } else {
        await categoriesApi.addCategories({ name, url }, token);
        notifySuccess("Thêm danh mục thành công");
      }
      setOpenDialog(false);
      fetchCategories(); // Reload danh mục
    } catch (error) {
      console.error("Error saving category:", error);
      notifyError("Lỗi khi lưu danh mục");
    }
  };

  const handleOpenConfirmDialog = (category) => {
    setCategoryToDelete(category);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await categoriesApi.deleteCategories(categoryToDelete.id, token);
        notifySuccess("Xóa danh mục thành công");
        fetchCategories(); // Reload danh mục
      } catch (error) {
        console.error("Error deleting category:", error);
        notifyError("Lỗi khi xóa danh mục");
      }
    }
    setOpenConfirmDialog(false);
    setCategoryToDelete(null);
  };

  return (
    <BaseCard title="Danh Sách Danh Mục">
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog(null)}
        >
          Thêm danh mục
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ minWidth: "1200px", margin: "0 auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Tên</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>URL</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.url}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenDialog(category)}
                    sx={{ marginRight: "10px" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenConfirmDialog(category)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog để thêm/sửa danh mục */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editCategory ? "Sửa danh mục" : "Thêm danh mục"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên danh mục"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: "15px" }}
          />
          <TextField
            label="URL"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa danh mục */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa danh mục này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleDeleteCategory} color="secondary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </BaseCard>
  );
};

export default CategoriesList;
