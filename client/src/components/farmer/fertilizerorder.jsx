import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

export default function FertilizerOrders() {
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState([]);
     const token = jwtDecode(localStorage.getItem("token"));
      const userId = token.payload._id
      console.log("order page")
    useEffect(() => {
        // Fetch orders
        console.log(userId)
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/user/fetchOrder`)
            .then((res) => {
                console.log(res.data);
                // Filter orders based on userId
                const filteredOrders = res.data.orders.filter(order => order.userId._id === userId);
                setOrders(filteredOrders);
            })
            .catch((err) => {
                console.log(err);
            });

        // Fetch cart data (assuming this is from the same endpoint or a different one)
        axios
            .get(`${import.meta.env.VITE_BASE_URL}/user/fetchOrder`)
            .then((res) => {
                console.log(res.data);
                // Filter cart based on userId
                const filteredCart = res.data.cart.filter(cartItem => cartItem.userId === userId);
                setCart(filteredCart);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [userId]); // Add userId to dependencies to refetch on change

    return (
        <div>
            <Typography variant="h4" gutterBottom>Orders</Typography>
            {orders.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Toatal Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Delivery Address</TableCell>
                                <TableCell>Payment Method</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>{order.totalAmount}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.deliveryAddress}</TableCell>
                                    <TableCell>{order.paymentMethod}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">No orders found for this user.</Typography>
            )}

            {/* <Typography variant="h4" gutterBottom>Cart</Typography>
            {cart.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="cart table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Cart ID</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cart.map((cartItem) => (
                                <TableRow key={cartItem._id}>
                                    <TableCell>{cartItem._id}</TableCell>
                                    <TableCell>{cartItem.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">No cart items found for this user.</Typography>
            )} */}
        </div>
    );
}
