import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

export default function ViewRetailOrders() {
    const [orders, setOrders] = useState([]);
    const [statusUpdate, setStatusUpdate] = useState({});
  const token = jwtDecode(localStorage.getItem("token"));
    const userId = token.payload._id;
    useEffect(() => {
        // Fetch orders without filtering by userId
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/user/fetchOrder`)
            .then((res) => {
                console.log(res.data);
                setOrders(res.data.orders); // Set all orders
            })
            .catch((err) => {
                console.log(err);
            });
    }, []); // Only fetch once on component mount

    const handleStatusChange = (orderId, newStatus) => {
        // Update the status locally first
        setOrders(orders.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
        ));

        // Send the updated status to the server
        axios
            .put(`${import.meta.env.VITE_BASE_URL}/user/updateOrderStatus`, {
                orderId: orderId,
                status: newStatus
            })
            .then((response) => {
                console.log(response.data);
                // You can show success message here or handle any other logic
            })
            .catch((err) => {
                console.log(err);
                // In case of error, we could revert the status change in UI
            });
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Orders</Typography>
            {orders.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Delivery Address</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Update Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.deliveryAddress}</TableCell>
                                    <TableCell>{order.paymentMethod}</TableCell>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={statusUpdate[order._id] || order.status}
                                                onChange={(e) => {
                                                    setStatusUpdate({ ...statusUpdate, [order._id]: e.target.value });
                                                    handleStatusChange(order._id, e.target.value);
                                                }}
                                            >
                                                <MenuItem value="Pending">Pending</MenuItem>
                                                <MenuItem value="Shipped">Shipped</MenuItem>
                                                <MenuItem value="Delivered">Delivered</MenuItem>
                                                <MenuItem value="Payment Successfull">Payment Successful</MenuItem>
                                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">No orders found.</Typography>
            )}
        </div>
    );
}
