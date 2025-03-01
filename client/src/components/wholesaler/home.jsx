import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  ListItemText,
  Box,
  CssBaseline,
  IconButton,
  Divider,
  useMediaQuery,
  ListItemButton,
  List,
  Collapse,
  Paper
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Profile from "./profile";
import AddProductDetails from "./addproducts";
import ViewOrders from "./vieworders";
import OrderHistory from "./orderhistory";  // Importing the OrderHistory component
import { Logout, Person, ShoppingCart, Store, HistoryEdu, ExpandMore, ExpandLess } from "@mui/icons-material";
import RetailerViewproducts from "./addretailproduct";

const drawerWidth = 240;

export default function WholesaleDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screen
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer state
  // const [openProducts, setOpenProducts] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth, bgcolor: "#1E3A8A" }}>
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton sx={{ color: "white" }} onClick={() => navigate("/wholesaler/products")}>
        <Store sx={{ mr: 2, color: "white" }} />
          <ListItemText primary="View Products" sx={{ color: "white" }} />
        </ListItemButton>

        {/* Orders Dropdown */}
        <ListItemButton onClick={() => setOpenOrders(!openOrders)} sx={{ color: "white" }}>
          <ShoppingCart sx={{ mr: 2, color: "white" }} />
          <ListItemText primary="Orders" sx={{ color: "white" }} />
          {openOrders ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
        </ListItemButton>
        <Collapse in={openOrders} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4, color: "white" }} onClick={() => navigate("/wholesaler/vieworders")}>
              <ListItemText primary="Farmer Selections" sx={{ color: "white" }} />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, color: "white" }} onClick={() => navigate("/wholesaler/order-history")}>
              <ListItemText primary="Order History" sx={{ color: "white" }} />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Profile */}
        <ListItemButton onClick={() => navigate("/wholesaler/profile")} sx={{ color: "white" }}>
          <Person sx={{ mr: 2, color: "white" }} />
          <ListItemText primary="Profile" sx={{ color: "white" }} />
        </ListItemButton>

        {/* Logout */}
        <ListItemButton
          onClick={() => {
            navigate("/");
            localStorage.clear();
          }}
          sx={{ color: "white" }}
        >
          <Logout sx={{ mr: 2, color: "white" }} />
          <ListItemText primary="Logout" sx={{ color: "white" }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* App Bar with Menu Icon for Mobile */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "#1E3A8A" }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Wholesale Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar for Desktop (Permanent) */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box", bgcolor: "#1E3A8A" },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: "#F3F4F6" }}>
        <Routes>
          <Route path="/" element={<ViewOrders />} />
          <Route path="products" element={<AddProductDetails />} />
          <Route path="vieworders" element={<ViewOrders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="order-history" element={<OrderHistory />} />
        </Routes>
      </Box>
    </Box>
  );
}
