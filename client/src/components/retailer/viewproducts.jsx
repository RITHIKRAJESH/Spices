import { useEffect, useState } from "react";
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Fab 
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function RetailerViewproducts() {
  const [openForm, setOpenForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [product, setProduct] = useState({
    productName: "",
    productImage: null,
    quantity: "",
    rate: "",
  });
  const [record, setRecord] = useState([]);
  const token = jwtDecode(localStorage.getItem("token"));

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/retailer/viewproduct`)
      .then((res) => {
        setRecord(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
    formData.append("productImage", product.productImage); // Ensure file is included
    formData.append("quantity", product.quantity);
    formData.append("rate", product.rate);
    formData.append("userid", token.payload._id);

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/retailer/addproduct`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        alert(res.data.message);
      })
      .catch((err) => {
        console.error(err);
      });

    setOpenForm(false);
    setProduct({ productName: "", productImage: null, quantity: "", rate: "" });
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setProduct({
      productName: product.productName,
      productImage: product.productImage,
      quantity: product.quantity,
      rate: product.rate,
    });
    setOpenEditForm(true);
  };
  const handleUpdate = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("productImage", product.productImage); // Ensure file is included
    formData.append("quantity", product.quantity);
    formData.append("rate", product.rate);
    formData.append("userid", token.payload._id);
  
    // Update product by sending the formData with the selected product id
    axios
      .put(`${import.meta.env.VITE_BASE_URL}/retailer/updateproduct/${selectedProduct._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        alert(res.data.message);
        setOpenEditForm(false); // Close edit form
        setProduct({ productName: "", productImage: null, quantity: "", rate: "" }); // Clear form
        setSelectedProduct(null); 
        window.location.reload()
        // Reset selected product
      })
      .catch((err) => {
        console.error("Error updating product:", err);
        alert("Error updating product.");
      });
  };
  

  const handleDelete = (productId) => {
    axios
      .delete(`${import.meta.env.VITE_BASE_URL}/retailer/deleteproduct/${productId}`)
      .then((res) => {
        alert(res.data.message);
        setRecord((prevRecord) => prevRecord.filter((item) => item._id !== productId));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>View Products</Typography>

      {/* Table to Display Products */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Image</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {record.length > 0 ? (
              record.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </TableCell>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>₹{product.rate}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(product)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Product Floating Action Button */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        onClick={() => setOpenForm(true)}
      >
        <Add />
      </Fab>

      {/* Add Product Form Dialog */}
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
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: "16px" }}
          />
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
          <Button onClick={() => setOpenForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Form Dialog */}
      <Dialog open={openEditForm} onClose={() => setOpenEditForm(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Product Name"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {/* <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginBottom: "16px" }}
          /> */}
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
          <Button onClick={() => setOpenEditForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update Product
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
