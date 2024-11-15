import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IconButton, Badge } from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useAppContext } from "@/context/AppContext";

const Cart: React.FC = () => {
    const [cartCount, setCartCount] = useState<number>(0);
    const { sessionToken } = useAppContext();

    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                if (!sessionToken) return;

                const response = await fetch("http://localhost:8080/api/v1/cart", {
                    headers: {
                        Authorization: `Bearer ${sessionToken}`,
                        Accept: "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Lỗi khi tải dữ liệu giỏ hàng");
                }

                const data = await response.json();
                const count = data.message.total;

                setCartCount(count);
            } catch (error) {
                console.error("Error fetching cart count:", error);
            }
        };

        fetchCartCount();
    }, [sessionToken]);

    return (
        <Link href="/cart" passHref>
            <IconButton
                size="large"
                aria-label="go to cart"
                color="inherit"
                sx={{
                    width: 35,
                    height: 35,
                }}
            >
                <Badge
                    badgeContent={cartCount}
                    color="secondary"
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <ShoppingCartOutlinedIcon
                        sx={{
                            fontSize: 30,
                        }}
                    />
                </Badge>
            </IconButton>
        </Link>
    );
};

export default Cart;
