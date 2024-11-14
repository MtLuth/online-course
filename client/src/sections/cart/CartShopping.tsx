"use client";
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Checkbox,
    Divider,
    IconButton,
    TextField,
    Grid,
} from "@mui/material";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

interface Course {
    id: number;
    name: string;
    price: number;
    rating: number;
    image: string;
}

const initialCourses: Course[] = [
    {
        id: 1,
        name: "Complete Search Engine Optimisation (SEO) & ChatGPT Course",
        price: 1249000,
        rating: 4.5,
        image: "/images/course1.jpg",
    },
    {
        id: 2,
        name: "AI Copywriting Secrets: Work Less & Earn More With ChatGPT",
        price: 1499000,
        rating: 4.7,
        image: "/images/course2.jpg",
    },
];

export default function CartShopping() {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [selectedCourses, setSelectedCourses] = useState<number[]>(initialCourses.map((course) => course.id));
    const [coupon, setCoupon] = useState<string>("");
    const router = useRouter();

    const handleSelectCourse = (courseId: number) => {
        setSelectedCourses((prevSelected) =>
            prevSelected.includes(courseId)
                ? prevSelected.filter((id) => id !== courseId)
                : [...prevSelected, courseId]
        );
    };

    const handleDeleteCourse = (courseId: number) => {
        setCourses((prevCourses) =>
            prevCourses.filter((course) => course.id !== courseId)
        );
        setSelectedCourses((prevSelected) =>
            prevSelected.filter((id) => id !== courseId)
        );
    };

    const total = courses
        .filter((course) => selectedCourses.includes(course.id))
        .reduce((sum, course) => sum + course.price, 0);

    const handleCheckout = () => {
        router.push("/checkout");
    };

    return (
        <Box
            sx={{
                padding: { xs: 2, md: 4 },
                maxWidth: 1200,
                margin: "0 auto",
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: courses.length === 0 ? "center" : "flex-start",
            }}
        >
            <Typography variant="h3" gutterBottom>
                Shopping Cart
            </Typography>

            {courses.length === 0 ? (
                <Box
                    sx={{
                        textAlign: "center",
                        padding: 3,
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        maxWidth: 600,
                        width: "100%",
                    }}
                >
                    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                        Giỏ hàng của bạn hiện chưa có khóa học nào. Hãy khám phá thêm để tìm khóa học phù hợp!"                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/"
                        sx={{ mt: 3 }}
                    >
                        Khám phá thêm
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                            Có {selectedCourses.length} khóa học trong giỏ hàng
                        </Typography>
                        {courses.map((course) => (
                            <Box
                                key={course.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                    border: "1px solid #e0e0e0",
                                    padding: 2,
                                    borderRadius: 1,
                                }}
                            >
                                <Checkbox
                                    checked={selectedCourses.includes(course.id)}
                                    onChange={() => handleSelectCourse(course.id)}
                                />
                                <Image
                                    src={course.image}
                                    alt={`Image of ${course.name}`}
                                    width={80}
                                    height={80}
                                />
                                <Box sx={{ ml: 2, flexGrow: 1 }}>
                                    <Typography variant="h6">{course.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Rating: {course.rating} ⭐
                                    </Typography>
                                    <Typography variant="body2">Price: {course.price.toLocaleString()}₫</Typography>
                                </Box>
                                <IconButton
                                    onClick={() => handleDeleteCourse(course.id)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                    </Grid>

                    {courses.length > 0 && (
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Tổng cộng:
                            </Typography>
                            <Box
                                sx={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: 1,
                                    padding: 2,
                                }}
                            >
                                <Typography variant="h4" color="primary" gutterBottom>
                                    {total.toLocaleString()}₫
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleCheckout}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    disabled={selectedCourses.length === 0}
                                >
                                    Thanh Toán
                                </Button>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="subtitle1" gutterBottom>
                                    Khuyến mãi
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="Nhập mã"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    sx={{ mb: 2 }}
                                />
                                <Button variant="contained" color="secondary" fullWidth>
                                    Áp dụng
                                </Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            )}
        </Box>
    );
}
