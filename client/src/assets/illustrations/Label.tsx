import { memo } from "react";
import Box from "@mui/material/Box";
import Stack, { StackProps } from "@mui/material/Stack";

interface Props extends StackProps {
  text: string;
  icon: React.ReactElement;
}

function Label({ icon, text, sx, ...other }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        px: 2,
        py: 1.25,
        fontSize: 15,
        borderRadius: 2,
        letterSpacing: -0.5,
        color: "#000000",
        bgcolor: "#FFFFFF",
        fontWeight: 700,
        boxShadow: `0px 24px 48px rgba(0, 0, 0, 0.8), inset 0px -4px 10px rgba(97, 97, 97, 0.6)`,
        "& > div": { lineHeight: 0 },
        "& svg": { width: 44, height: 44 },
        ...sx,
      }}
      {...other}
    >
      {icon}
      <Box sx={{ ml: 1 }}>{text}</Box>
    </Stack>
  );
}

export default memo(Label);
