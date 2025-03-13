import { useEffect, useState } from "react";
import { 
  Container,  
  Typography,
  Card,
  CardMedia,
  Grid,
  CardContent,
  Button,
  Badge
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
// import { jwtDecode } from "jwt-decode";

export default function Fertilizers() {
//   const token = jwtDecode(localStorage.getItem("token"));
  
  // State to store the fetched products
  const [record, setRecord] = useState([]);
  
  // State to store the cart items
  const [cart, setCart] = useState([]);
  const token = jwtDecode(localStorage.getItem("token"));
    const userId = token.payload._id;
  // Fetch products on component mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/retailer/viewproduct`)
      .then((res) => {
        console.log(res.data);  // Check the data being returned
        setRecord(res.data);    // Set the data to the record state
      })
      .catch((err) => {
        console.error(err);  // Log any errors
      });
  }, []);
  
  // Handle Add to Cart action
  const handleAddToCart = (product) => {
    const cartItem = {
      productId: product._id,
      productName: product.productName,
      quantity: 5, // You can change this based on the quantity selection in the UI
      rate: product.rate,
      userId: userId, // Use the decoded userId from the token
    };
  console.log(cartItem)
    // Call an API endpoint to add the product to the user's cart
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/user/addCart`, cartItem)
      .then((res) => {
        alert(res.data.message || "Product added to cart successfully.");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3,textAlign:'center'}}>FERTILIZERS!</Typography>
      
      {/* Grid to display product cards */}
      <Grid container spacing={3}>
        {record.length > 0 ? (
          record.map((product) => {
            let stockStatus = "";
            if (product.quantity === 0) {
              stockStatus = "Out of Stock";
            } else if (product.quantity < 10) {
              stockStatus = "Limited Quantity";
            } else {
              stockStatus = "Available";
            }

            return (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                  
                  {/* Display product image, with fallback if the image is not available */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.productImage || "https://via.placeholder.com/150"}  // Fallback image if productImage is missing
                    alt={product.productName}
                  />
                  
                  <CardContent>
                    <Typography variant="h6">{product.productName}</Typography>
                    <Typography color="text.secondary">
                      Quantity: {product.quantity}
                    </Typography>
                    <Typography color="text.secondary">
                      Rate: ₹{product.rate}
                    </Typography>

                    {/* Display stock status */}
                    <Typography 
                      color={stockStatus === "Out of Stock" ? "error" : (stockStatus === "Limited Quantity" ? "warning" : "text.primary")}
                      sx={{ mt: 1 }}
                    >
                      {stockStatus}
                    </Typography>

                    {/* Add to Cart button */}
                    {product.quantity > 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography>No products available.</Typography>  // Message if there are no products
        )}
      </Grid>

      {/* Show Cart Badge */}
      <Badge badgeContent={cart.length} color="secondary">
        <Button variant="outlined" color="primary" sx={{ mt: 3 }} href="/farmer/viewcart">
          View Cart
        </Button>
      </Badge>
    </Container>
  );
}
