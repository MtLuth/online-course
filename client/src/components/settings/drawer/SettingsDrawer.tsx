'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import BaseOptions from "@/components/settings/drawer/components/BaseOptions";
import PresetsOptions from "@/components/settings/drawer/components/PresetsOptions";
import Scrollbar from "@/components/scrollbar";
import Iconify from "@/components/iconify";

type SettingsDrawerProps = {
  open: boolean;
  themeMode: 'light' | 'dark';
  themeDirection: 'ltr' | 'rtl';
  themeColorPresets: string;
  canReset: boolean;
  onReset: () => void;
  onClose: () => void;
  onUpdate: (key: string, value: any) => void;
};

export default function SettingsDrawer({
  open,
  themeMode,
  themeDirection,
  themeColorPresets,
  canReset,
  onReset,
  onClose,
  onUpdate,
}: SettingsDrawerProps) {

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Settings
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onReset}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderMode = (
    <BaseOptions
      title="Mode"
      selected={themeMode === 'dark'}
      onClick={() => onUpdate('themeMode', themeMode === 'dark' ? 'light' : 'dark')}
      icons={['carbon:asleep', 'carbon:asleep-filled']}
    />
  );

  const renderDirection = (
    <BaseOptions
      title="Direction"
      selected={themeDirection === 'rtl'}
      onClick={() => onUpdate('themeDirection', themeDirection === 'rtl' ? 'ltr' : 'rtl')}
      icons={['carbon:align-horizontal-right', 'carbon:align-horizontal-left']}
    />
  );

  const renderPresets = (
    <PresetsOptions
      value={themeColorPresets}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        onUpdate('themeColorPresets', (event.target as HTMLInputElement).value)
      }
    />
  );

  return (
    <Drawer
      open={open}
      anchor="right"
      PaperProps={{
        sx: {
          width: 280,
        },
      }}
      onClose={onClose}
    >
      {renderHead}

      <Divider />

      <Scrollbar>
        <Box sx={{ pb: 10 }}>
          {renderMode}

          {renderDirection}

          {renderPresets}
        </Box>
      </Scrollbar>
    </Drawer>
  );
}
