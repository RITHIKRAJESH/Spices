import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { 
  Card, CardMedia, CardContent, Typography, Button, 
  TextField, Grid, Container, Dialog, DialogActions, 
  DialogContent, DialogTitle, Box 
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ViewProducts() {
  const [products, setViewProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [pickupLocations, setPickupLocations] = useState({});
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // To control the dialog visibility
  const [currentProduct, setCurrentProduct] = useState(null); // Store product details to pass into dialog
  const navigate = useNavigate();

  // Get user ID from token
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
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/wholesale/viewproduct`)
      .then((res) => {
        setViewProducts(res.data);
        console.log("Fetched products:", res.data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handlePickupLocationChange = (id, value) => {
    setPickupLocations((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddProduct = (product) => {
    const quantity = quantities[product._id] || 1; // Default to 1 if not entered
    const pickupLocation = pickupLocations[product._id] || ""; // Default empty string
    const productData = {
      productId: product._id,
      userId: userId,
      quantity: quantity,
      pickupLocation: pickupLocation,
    };
    const url = import.meta.env.VITE_BASE_URL;
    
    // Update the selected products state
    setSelectedProducts((prev) => [...prev, productData]);

    axios.post(`${url}/wholesale/productpurchased`, productData)
      .then((res) => {
        alert(res.data);
      }).catch((err) => console.log(err));

    // Close the dialog
    setOpenDialog(false);
  };

  const handleOpenDialog = (product) => {
    setCurrentProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <TextField
        fullWidth
        label="Search Product"
        variant="outlined"
        size="small"
        sx={{ mt: 2, mb: 3 }}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <Grid container spacing={3}>
        {products
          .filter((product) => 
            product.productName.toLowerCase().includes(search)
          )
          .map((product) => (
            <Grid item key={product._id} xs={12} sm={8} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, display: 'flex', flexDirection: 'row' }}>
                {/* Image on the left */}
                <CardMedia
                  component="img"
                  height="300"
                  image={product.productImage}
                  alt={product.productName}
                  sx={{ objectFit: 'cover', width: '200px', borderRadius: 1 }}
                />

                {/* Product Details on the right */}
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 2 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
                      {product.productName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Categories:
                    </Typography>
                    {product.productCategory.map((cat, index) => (
                      <Typography key={index} variant="body2">
                        {cat.quality} - Rs.{cat.price}
                      </Typography>
                    ))}
                    <Typography variant="body2" color="textSecondary">
                      Date: {product.date}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Requires Quantity: {product.quantity}
                    </Typography>

                    {/* Trigger the dialog to add product */}
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2, width: '100%' }}
                      onClick={() => handleOpenDialog(product)}
                    >
                      Add 
                    </Button>
                  </CardContent>
                 
                </Box>
              
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Dialog for adding product */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Product to Cart</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Quantity"
            variant="outlined"
            size="small"
            value={quantities[currentProduct?._id] || ""}
            onChange={(e) => handleQuantityChange(currentProduct?._id, e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Enter quantity"
            required
          />

          <TextField
            fullWidth
            label="Pickup Location"
            variant="outlined"
            size="large"
            value={pickupLocations[currentProduct?._id] || ""}
            onChange={(e) => handlePickupLocationChange(currentProduct?._id, e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Enter pickup location"
            required
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={() => handleAddProduct(currentProduct)}
            variant="contained"
            color="primary"
            disabled={!quantities[currentProduct?._id] || !pickupLocations[currentProduct?._id]}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
