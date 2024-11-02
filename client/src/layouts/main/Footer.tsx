import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from "@mui/material/IconButton";
import Iconify from "@/components/iconify";
import Logo from "@/components/logo/Logo";
import { _socials } from "@/layouts/main/data";

export default function Footer() {

  const mainFooter = (
    <>
      <Divider />
      <Container sx={{ py: { xs: 4, md: 8 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={5}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack spacing={2} sx={{ flex: 2 }}>
            <Logo />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Nền tảng E-learning giúp bạn tiếp cận tri thức từ những chuyên gia hàng đầu, giúp việc học trở nên dễ dàng và hiệu quả.
            </Typography>
          </Stack>
          <Stack spacing={2} sx={{ flex: 1.5 }}>
            <Typography variant="h6">Cộng đồng</Typography>
            <Link variant="body2" sx={{ color: 'text.primary' }} href="#">
              Tài liệu hướng dẫn
            </Link>
            <Link variant="body2" sx={{ color: 'text.primary' }} href="#">
              Nhật ký thay đổi
            </Link>
            <Link variant="body2" sx={{ color: 'text.primary' }} href="#">
              Đóng góp xây dựng
            </Link>
          </Stack>
          <Stack spacing={2} sx={{ flex: 1 }}>
            <Typography variant="h6">Mạng xã hội</Typography>
            <Stack direction="row" alignItems="center">
              {_socials.map((social) => (
                <IconButton key={social.value} color="primary">
                  <Iconify icon={social.icon} />
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>

      <Divider />

      <Container sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          © {new Date().getFullYear()} E-learning
        </Typography>
      </Container>
    </>
  );

  return <footer>{mainFooter}</footer>;
}
