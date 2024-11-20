import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Box,
  Paper,
  Typography,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { categoriesApi } from "@/server/Categories";
import BaseCard from "@/components/shared/DashboardCard";
import { useToastNotification } from "@/hook/useToastNotification";
import { styled } from "@mui/system";

// Styled Header Box
const HeaderBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4, 2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(2, 2, 0, 0),
}));

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
      setCategories(data.message?.results);
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
      fetchCategories();
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
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        notifyError("Lỗi khi xóa danh mục");
      }
    }
    setOpenConfirmDialog(false);
    setCategoryToDelete(null);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Tên",
      flex: 1,
      minWidth: 600,
    },
    {
      field: "url",
      headerName: "URL",
      flex: 1,
      minWidth: 500,
    },
    {
      field: "actions",
      headerName: "Hành động",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <IconButton
              onClick={() => handleOpenDialog(params.row)}
              sx={{ marginRight: "10px" }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton onClick={() => handleOpenConfirmDialog(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <BaseCard>
      <HeaderBox>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Danh sách Danh Mục
        </Typography>
      </HeaderBox>
      <Box display="flex" justifyContent="flex-end" mt={2} mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(null)}
        >
          Thêm danh mục
        </Button>
      </Box>

      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={categories}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.id}
        />
      </Paper>

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
