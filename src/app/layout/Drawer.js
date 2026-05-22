import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer'; // Renamed to avoid conflict with component name
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

export default function Drawer({ isOpen, onClose, children, title }) {
  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <InfoIcon sx={{ mr: 1 }} />
          {title}
        </Typography>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemText primary={children} sx={{ p: 2 }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <MuiDrawer anchor="right" open={isOpen} onClose={onClose}>
      {DrawerList}
    </MuiDrawer>
  );
}
