import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useFormikContext } from "formik";
import { categoriesApi } from "@/server/Categories";
import { getAuthToken } from "@/utils/auth";
const CategorySelect: React.FC = () => {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();
  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = getAuthToken();
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await categoriesApi.getCategories(token);
        const categoryOptions = data.message?.results.map(
          (category: { id: string; name: string }) => ({
            label: category.name,
            value: category.name,
          })
        );
        setCategories(categoryOptions);
      } catch (err) {
        setError("Không thể tải danh mục. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box sx={{ mb: 2 }}>
      <Autocomplete
        options={categories}
        getOptionLabel={(option) => option.label}
        loading={loading}
        value={
          categories.find((option) => option.value === values.category) || null
        }
        onChange={(event, newValue) => {
          setFieldValue("category", newValue ? newValue.value : "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Chọn danh mục"
            required
            error={touched.category && Boolean(errors.category)}
            helperText={touched.category && errors.category}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CategorySelect;
