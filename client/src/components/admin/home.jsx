import { useEffect, useState } from "react";
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItemText, ListItemButton, 
  Collapse, Box, CssBaseline, IconButton, useMediaQuery, useTheme, Grid, Paper 
} from "@mui/material";
import { Home, People, ExpandLess, ExpandMore, Menu, Logout, Person, TipsAndUpdates, ShoppingCart, MessageOutlined } from "@mui/icons-material";
import { useNavigate, Routes, Route } from "react-router-dom";
import ViewUsers from "./viewuser"; 
import Profile from "./profile";
import Tips from "./addTips"; 
import axios from "axios";
import Msg from "./msg";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const drawerWidth = 240;

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Customize the primary color here
    },
    secondary: {
      main: "#9c27b0", // Customize the secondary color here
    },
    success: {
      main: "#4caf50", // Customize success color here
    },
    background: {
      default: "#f4f6f8", // Customize background color here
    },
    warning: {
      main: "#ff9800", // Customize warning color here
    },
    info: {
      main: "#29b6f6", // Customize info color here
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default function AdminDashboard() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); 
  const [openUsersMenu, setOpenUsersMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [count, setCount] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/admin/countuser`)
      .then((res) => setCount(res.data))
      .catch((err) => console.error("Error fetching counts:", err));
  }, []);
  
  const handleUsersClick = () => setOpenUsersMenu(!openUsersMenu);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Sidebar Drawer Component
  const drawer = (
    <List>
      <ListItemButton onClick={() => navigate("/admin")}>
        <Home sx={{ mr: 2 }} />
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton onClick={handleUsersClick}>
        <People sx={{ mr: 2 }} />
        <ListItemText primary="Users" />
        {openUsersMenu ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={openUsersMenu} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 4 }}>
          <ListItemButton onClick={() => navigate("/admin/users")}>
            <ListItemText primary="All Users" />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton onClick={() => navigate("/admin/tips")}>
        <TipsAndUpdates sx={{ mr: 2 }} />
        <ListItemText primary="Tips" />
      </ListItemButton>

      {/* <ListItemButton onClick={() => navigate("/admin/message")}>
        <MessageOutlined sx={{ mr: 2 }} />
        <ListItemText primary="Messages" />
      </ListItemButton> */}
      <ListItemButton onClick={() => navigate("/admin/profile")}>
        <Person sx={{ mr: 2 }} />
        <ListItemText primary="Profile" />
      </ListItemButton>

      <ListItemButton onClick={() => {
        navigate("/");
        localStorage.clear();
      }}>
        <Logout sx={{ mr: 2 }} />
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        
        {/* AppBar */}
        <AppBar position="fixed" sx={{ width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`, ml: isMobile ? 0 : `${drawerWidth}px` }}>
          <Toolbar>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                <Menu />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              Admin Dashboard
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawer}
        </Drawer>

        {/* Main Content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            ml: isMobile ? 0 : `${drawerWidth}px`, 
            transition: "margin 0.3s ease-in-out", 
            bgcolor: theme.palette.background.default 
          }}
        >
          <Toolbar />

          {/* Dashboard Stats */}
          <Grid container spacing={3}>
            {/* Users Count */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", bgcolor: theme.palette.primary.light }}>
                <People sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                <Typography variant="h6">Users</Typography>
                <Typography variant="h4">{count.users}</Typography>
              </Paper>
            </Grid>

            {/* Products Count */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", bgcolor: theme.palette.secondary.light }}>
                <ShoppingCart sx={{ fontSize: 40, color: theme.palette.secondary.main }} />
                <Typography variant="h6">Products</Typography>
                <Typography variant="h4">{count.products}</Typography>
              </Paper>
            </Grid>

            {/* Orders Count */}
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", bgcolor: theme.palette.success.light }}>
                <TipsAndUpdates sx={{ fontSize: 40, color: theme.palette.success.main }} />
                <Typography variant="h6">Orders</Typography>
                <Typography variant="h4">{count.orders}</Typography>
              </Paper>
            </Grid>

            {/* Message Count */}
            {/* <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", bgcolor: theme.palette.warning.main }}>
                <MessageOutlined sx={{ fontSize: 40, color: theme.palette.warning.contrastText }} />
                <Typography variant="h6">Messages</Typography>
                <Typography variant="h4">{count.messages}</Typography>
              </Paper>
            </Grid> */}
          </Grid>

          {/* Routes for Dynamic Content */}
          <Routes>
            <Route path="/users" element={<ViewUsers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/message" element={<Msg />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
