import { useState } from "react";
import { Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography, Box, IconButton, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, Route, useNavigate } from "react-router-dom";
import {Routes} from "react-router-dom";
import { HistoryEdu, Logout, Payment, Person, ShoppingCart, Store } from "@mui/icons-material";
import RetailerViewproducts from "./viewproducts";
import RetailerProfile from "./profile";
// const menuItems = [
  
//   { text: "View Products", path: "/retailer/viewproducts" },
//   { text: "View Orders", path: "/retailer/vieworders" },
//   { text: "Payments", path: "/retailer/payments" },
//   { text: "Profile", path: "/retailer/profile" },
//   {text:"Logout",path:"/",onclick:()=>localStorage.clear()}
// ];

export default function Retailerhome() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Retailer Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
          display: { xs: "block", sm: "none" }
        }}
      >
        
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
          display: { xs: "none", sm: "block" }
        }}
      >
        <Toolbar />
        <List>
        <ListItemButton onClick={() => navigate("/retailer/viewproducts")}> 
          <Store sx={{ mr: 2 }} /> <ListItemText primary="Products" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/retailer/vieworders")}> 
          <ShoppingCart sx={{ mr: 2 }} /> <ListItemText primary="Orders" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/retailer/order-history")}> 
          <HistoryEdu sx={{ mr: 2 }} /> <ListItemText primary="Order History" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/retailer/payments")}> 
          <Payment sx={{ mr: 2 }} /> <ListItemText primary="Payment" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/retailer/profile")}> 
          <Person sx={{ mr: 2 }} /> <ListItemText primary="Profile" />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            navigate("/"); 
            localStorage.clear();
          }}
        >
          <Logout sx={{ mr: 2 }} /> <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Routes>
          <Route path="/viewproducts" element={<RetailerViewproducts />} />
          <Route path="/profile" element={<RetailerProfile/>} />
          </Routes>
        <Outlet />
      </Box>
    </Box>
  );
}
