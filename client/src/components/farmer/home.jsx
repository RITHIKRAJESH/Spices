import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  CssBaseline,
  IconButton,
  Divider,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";
import PaymentIcon from "@mui/icons-material/Payment";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Profile from "./profile";
import ViewProducts from "./viewproducts";
import ViewTips from "./tips";
import ViewOrderedProducts from "./myproduct";
import Orderhistory from "./orderhistory";
import Fertilizers from "./fertilizers";
import Cart from "./viewcart";
import FertilizerOrders from "./fertilizerorder";

const drawerWidth = 240;

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check for mobile screen
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile drawer state

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/"); // Redirect user to homepage or login page
  };
  
  const menuItems = [
    { text: "View Market", path: "/farmer/market", icon: <StorefrontIcon  /> },
    { text: "My Products", path: "/farmer/my-products", icon: <ShoppingCartIcon /> },
    { text: "Order History", path: "/farmer/order-history", icon: <HistoryIcon /> },
    { text: "Fertilisers", path: "/farmer/fertilizers", icon:<ShoppingCartIcon/> },
    { text: "Tips", path: "/farmer/viewtips", icon: <TipsAndUpdatesIcon /> },
    { text: "Mycart", path: "/farmer/viewcart", icon: <ShoppingCartIcon/> },
    {text:"Fertilizer Order", path:"/farmer/view-orders",icon:<ShoppingCartIcon/>},
    { text: "Profile", path: "/farmer/profile", icon: <AccountCircleIcon /> },
    { text: "Logout", path: "/", icon: <ExitToAppIcon />, onClick: handleLogout },
  ];
  

  const drawerContent = (
    <Box sx={{ width: drawerWidth, bgcolor: "#1E3A8A",height:'100vh' }}>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon style={{color: "white"}}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} style={{color: "white"}} />
          </ListItem>
        ))}
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
            Farmer Dashboard
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
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
         
        }}
      
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Routes>
        <Route path="/" element={<ViewProducts/>}/>
        <Route path="/profile" element={<Profile />} />
        <Route path="/market" element={<ViewProducts />} />
        <Route path="/viewtips" element={<ViewTips />} />
        <Route path="/my-products" element={<ViewOrderedProducts />} />
        <Route path="/order-history" element={<Orderhistory />} />
        <Route path="/fertilizers" element={<Fertilizers/>}/>
        <Route path="/viewcart" element={<Cart/>}/>
        <Route path="/view-orders" element={<FertilizerOrders/>}/>
        </Routes>
      </Box>
    </Box>
  );
}
