import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Payment } from "@mui/icons-material";

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState({});
  const [totalAmount, setTotalAmount] = useState({});
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
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

  useEffect(() => {
    // Fetch the initial orders data when the component mounts
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/wholesale/vieworders`)
      .then((res) => {
        setOrders(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const filteredOrders = orders.filter(
    (item) =>
      item.productId &&
      item.productId.userid === userId &&
      item.status !== "paid" &&
      item.status !== "cancelled"
  );

  const handleCollect = (orderId) => {
    const status = { message: "collected", id: orderId };
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/wholesale/updatestatus`, status)
      .then((res) => {
        alert(res.data);

        // Optimistically update the status of the order in the state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "collected" } : order
          )
        );
      })
      .catch((err) => console.log(err));
  };

  const handleCancel = (orderId) => {
    const status = { message: "cancelled", id: orderId };
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/wholesale/updatestatus`, status)
      .then((res) => {
        alert(res.data);

        // Optimistically update the status of the order in the state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );
      })
      .catch((err) => console.log(err));
  };

  const handlePayment = (orderId) => {
    const selectedOrder = orders.find((order) => order._id === orderId);
    setSelectedOrder(selectedOrder);
    setOpenPaymentModal(true);
  };

  const handleQualityChange = (orderId, quality, price) => {
    setSelectedQuality((prev) => ({
      ...prev,
      [orderId]: quality,
    }));

    setTotalAmount((prev) => ({
      ...prev,
      [orderId]: price * filteredOrders.find((order) => order._id === orderId).quantity,
    }));
  };

  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
    setPaymentSuccess(false);
  };

  const updateOrderAfterPayment = (orderId, updatedData) => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/wholesale/updatepayment`, {
        id: orderId,
        ...updatedData,
      })
      .then((response) => {
        console.log(response.data);
        setPaymentSuccess(true);
        
        // Update the order in the state after payment
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: "paid", quality: selectedOrder.quality, totalprice: totalAmount[selectedOrder._id] }
              : order
          )
        );

        setTimeout(() => {
          setOpenPaymentModal(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  };

  const handleMakePayment = () => {
    const updatedData = {
      status: "paid", 
      quality: selectedOrder.quality,
      totalprice: totalAmount[selectedOrder._id], 
    };

    updateOrderAfterPayment(selectedOrder._id, updatedData);
  };

  return (
    <Grid container spacing={3} sx={{ padding: 2 }}>
      {filteredOrders.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ width: "100%" }}>
          No orders found.
        </Typography>
      ) : (
        filteredOrders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order._id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent>
                <Typography variant="h6">{order.productId.productName}</Typography>
                <Typography variant="body1">Quantity: {order.quantity} KG</Typography>
                <Typography variant="body2">
                  Date: {new Date(order.productId.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">Status: {order.status.toUpperCase()}</Typography>

                {order.status === "collected" && (
                  <>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                      <InputLabel>Quality</InputLabel>
                      <Select
                        value={selectedQuality[order._id] || ""}
                        label="Quality"
                        onChange={(e) => {
                          const selectedOption = e.target.value;
                          const selectedProduct = order.productId.productCategory.find(
                            (item) => item.quality === selectedOption
                          );
                          handleQualityChange(order._id, selectedOption, selectedProduct.price);
                        }}
                      >
                        {order.productId.productCategory.map((category) => (
                          <MenuItem key={category._id} value={category.quality}>
                            {category.quality}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Total Amount: ₹{totalAmount[order._id] || "-"}
                    </Typography>
                  </>
                )}

                <div style={{ marginTop: "20px" }}>
                  {order.status !== "collected" && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ mr: 1, mt:2 }}
                      onClick={() => handleCollect(order._id)}
                    >
                      Collect
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel
                  </Button>

                  {order.status === "collected" && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => handlePayment(order._id)}
                    >
                      Pay Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}

      {/* Payment Modal */}
      <Dialog open={openPaymentModal} onClose={handleClosePaymentModal} maxWidth="sm" fullWidth>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <div>
              <Typography variant="h6">Account Number: {selectedOrder.userId.accountno}</Typography>
              <Typography variant="h6">IFSC: {selectedOrder.userId.ifsc}</Typography>
              <Typography variant="h6">Username: {selectedOrder.userId.username}</Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Total Amount: ₹{totalAmount[selectedOrder._id]}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleMakePayment} color="primary" variant="contained">
            Make Payment
          </Button>
        </DialogActions>
        {paymentSuccess && (
          <Typography variant="h6" color="success" align="center" sx={{ mt: 2 }}>
            <Payment /> Payment Successfully Completed
          </Typography>
        )}
      </Dialog>
    </Grid>
  );
}
