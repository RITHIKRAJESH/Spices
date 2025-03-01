import { useEffect, useState } from "react";
import { 
  Container, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  Fab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function RetailerViewProducts() {
  const [openForm, setOpenForm] = useState(false);
  const token = jwtDecode(localStorage.getItem("token"));
  const [product, setProduct] = useState({
    productName: "",
    productImage: null,
    quantity: "",
    rate: "",
  });

  const [record, setRecord] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/retailer/viewproducts`, { headers: { userid: token.payload._id } })
      .then((res) => {
        console.log(res.data);
        setRecord(res.data);
      }).catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, productImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productImage", product.productImage);
    formData.append("quantity", product.quantity);
    formData.append("rate", product.rate);
    formData.append("userid", token.payload._id);

    axios.post(`${import.meta.env.VITE_BASE_URL}/retailer/addproduct`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        alert(res.data.message);
        setRecord([...record, res.data.product]); // Update UI after adding product
      })
      .catch((err) => console.error(err));

    setOpenForm(false);
    setProduct({ productName: "", productImage: null, quantity: "", rate: "" });
  };

  const handleUpdateQuantity = (productId, newQty) => {
    axios.put(`${import.meta.env.VITE_BASE_URL}/retailer/updateproduct`, { productId, quantity: newQty })
      .then((res) => {
        alert("Quantity updated successfully!");
        setRecord(record.map(item => item._id === productId ? { ...item, quantity: newQty } : item));
      })
      .catch((err) => console.error(err));
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>View Products</Typography>

      {record.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell><strong>Product Image</strong></TableCell>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Rate (₹)</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Update Qty</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {record.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img src={product.productImage} alt={product.productName} width="50" height="50" />
                  </TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>₹{product.rate}</TableCell>
                  <TableCell>
                    {product.quantity === 0 ? (
                      <Typography color="error"><strong>Out of Stock</strong></Typography>
                    ) : product.quantity < 10 ? (
                      <Typography color="warning.main"><strong>Limited Stock</strong></Typography>
                    ) : (
                      <Typography color="success.main"><strong>In Stock</strong></Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      variant="outlined"
                      defaultValue={product.quantity}
                      onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                    />
                    <Button variant="contained" color="primary" sx={{ ml: 1 }} onClick={() => handleUpdateQuantity(product._id, product.quantity)}>
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>No products available.</Typography>
      )}

      {/* Floating Button to Add Product */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => setOpenForm(true)}
      >
        <Add />
      </Fab>

      {/* Dialog Form to Add Product */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Add a New Product</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Product Name"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: "16px" }} />
          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            type="number"
            value={product.quantity}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Rate"
            name="rate"
            type="number"
            value={product.rate}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Add Product</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
