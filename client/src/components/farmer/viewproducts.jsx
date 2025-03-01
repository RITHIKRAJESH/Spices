import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { 
  Card, CardMedia, CardContent, Typography, Button, 
  TextField, Grid, Container 
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ViewProducts() {
  const [products, setViewProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [pickupLocations, setPickupLocations] = useState({});
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]); 
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
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* <Button onClick={() => navigate('/farmer')}>BACK TO DASHBOARD</Button> */}

      {/* Search Filter */}
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
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={product.productImage}
                  alt={product.productName}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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

                  {/* Quantity Input */}
                  <TextField
                    fullWidth
                    type="number"
                    label="Quantity"
                    variant="outlined"
                    size="small"
                    sx={{ mt: 2 }}
                    value={quantities[product._id] || ""}
                    placeholder="Amount of qty you want to sell"
                    onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                    required
                  />

                  {/* Pickup Location Input */}
                  <TextField
  fullWidth
  label="Pickup Location"
  variant="outlined"
  size="large"
  sx={{mt: 2,}}
  value={pickupLocations[product._id] || ""}
  placeholder="Enter pickup location"
  onChange={(e) => handlePickupLocationChange(product._id, e.target.value)}
  required
/>

                  {/* Add Product Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleAddProduct(product)}
                    disabled={!quantities[product._id] || !pickupLocations[product._id]}
                  >
                    Add Product
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}
