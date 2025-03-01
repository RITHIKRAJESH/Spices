import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Typography, CircularProgress, Box 
} from "@mui/material";

export default function ViewOrderedProducts() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
 const token = localStorage.getItem("token");
   let userId = null;
   if (token) {
     try {
       const decoded = jwtDecode(token);
       userId = decoded?.payload?._id; // Ensure correct token structure
     } catch (error) {
       console.error("Invalid token:", error);
     }
   }
 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const url = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${url}/user/vieworders`,{headers:{id:userId}});
        setOrders(response.data);
        console.log(orders.length)
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const orderings= orders.filter((order) => order.status != "paid");
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Ordered Products
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>Order ID</strong></TableCell>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {orderings.length > 0 ? (
    orderings.map((order, index) => (
      <TableRow key={index}>
        <TableCell>{order._id}</TableCell>
        <TableCell>{order.productId?.productName || "N/A"}</TableCell>
        <TableCell>{order.quantity}</TableCell>
        <TableCell>{order.productId?.date || "N/A"}</TableCell>
        <TableCell>{order.status || "N/A"}</TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={5} align="center">
        No orders to be collected
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
