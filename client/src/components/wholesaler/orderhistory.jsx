import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, MenuItem, Select, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState({});
  const [totalAmount, setTotalAmount] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);
  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded?.payload?._id;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/wholesale/vieworders`)
      .then((res) => {
        setOrders(res.data);
        // Filter orders with "paid" and "cancelled" status
        setFilteredOrders(res.data.filter(order => order.status === 'paid' || order.status === 'cancelled'));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleQualityChange = (orderId, quality, price) => {
    setSelectedQuality((prev) => ({
      ...prev,
      [orderId]: quality,
    }));

    setTotalAmount((prev) => ({
      ...prev,
      [orderId]: price * filteredOrders.find(order => order._id === orderId).quantity,
    }));
  };

  

  const handlePrintExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredOrders.map(order => ({
      "Product Name": order.productId.productName,
      "Quantity": `${order.quantity} KG`,
      "Date": new Date(order.productId.date).toLocaleDateString(),
      "Status": order.status.toUpperCase(),
    //   "Quality": selectedQuality[order._id] || "-",
      "Total Amount":order.totalprice ,
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order History");
    XLSX.writeFile(wb, "order-history.xlsx");
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 1200, margin: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        <strong>Order History</strong>
      </Typography>

      {filteredOrders.length === 0 ? (
        <Typography variant="body1" align="center">
          No orders found.
        </Typography>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                {/* <TableCell sx={{ fontWeight: "bold" }}>Quality</TableCell> */}
                <TableCell sx={{ fontWeight: "bold" }}>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.productId.productName}</TableCell>
                  <TableCell>{order.quantity} KG</TableCell>
                  <TableCell>{new Date(order.productId.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.status.toUpperCase()}</TableCell>
                  <TableCell>{order.totalprice}</TableCell>
              

                
                </TableRow>
              ))}
            </TableBody>
          </Table>

         
          <Button variant="contained" color="secondary" onClick={handlePrintExcel} sx={{ mt: 3 }}>
            Export to Excel
          </Button>
        </>
      )}

      {/* <Button onClick={() => navigate("/wholesale")}>BACK TO DASHBOARD</Button> */}
    </TableContainer>
  );
}
