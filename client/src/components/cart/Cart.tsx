import React from "react";
import Link from "next/link";
import { IconButton, Badge } from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
type CartProps = {
    cartCount: number;
};

const Cart: React.FC<CartProps> = ({ cartCount }) => {
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
