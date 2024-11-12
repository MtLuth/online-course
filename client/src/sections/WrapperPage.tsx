import { PropsWithChildren } from "react";
import { Divider, Box, Typography } from "@mui/material";

interface Props extends PropsWithChildren {
  title: string;
}

export default function WrapperPage({ children, title }: Props) {
  return (
    <Box sx={{ paddingBottom: 6 }}>
      <Typography variant="h4" component="h4" gutterBottom>
        {title}
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />

      {children}
    </Box>
  );
}
