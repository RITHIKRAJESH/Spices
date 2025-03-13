import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); // To toggle the popup
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [formErrors, setFormErrors] = useState({}); // Store form validation errors

  const token = jwtDecode(localStorage.getItem("token"));
  const userId = token.payload._id;

  // Fetch cart items when the userId is available
  useEffect(() => {
    if (userId) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/user/viewCart`, {
          headers: { id: userId },
        })
        .then((response) => {
          if (response.data && response.data.items && response.data.items.length > 0) {
            setCartItems(response.data.items);
            // Calculate total amount based on cart items
            updateTotalAmount(response.data.items);
          } else {
            setCartItems([]); // No items, set cart to an empty array
          }
        })
        .catch((err) => {
          setError("Error fetching cart items.");
          console.error(err);
        });
    } else {
      setError("No userId found in localStorage.");
    }
  }, [userId]);

  // Function to update the total amount
  const updateTotalAmount = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.productId.rate * item.quantity,
      0
    );
    setTotalAmount(total);
  };

  // Remove item from cart
  const handleRemove = (itemId) => {
    axios
      .delete(`${import.meta.env.VITE_BASE_URL}/user/removeCartItem`, {
        data: { itemId: itemId, _id: userId },
      })
      .then((response) => {
        setCartItems(cartItems.filter((item) => item._id !== itemId));
        updateTotalAmount(cartItems.filter((item) => item._id !== itemId)); // Recalculate total
      })
      .catch((err) => {
        setError("Error removing item from cart.");
        console.error(err);
      });
  };

  // Increment quantity of a product
  const incrementQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === itemId) {
        item.quantity += 1;
      }
      return item;
    });
    setCartItems(updatedCart);
    updateTotalAmount(updatedCart); // Recalculate total after increment
    axios
      .put(`${import.meta.env.VITE_BASE_URL}/user/incrementQuantity`, {
        itemId: itemId,
        quantity: updatedCart.find((item) => item._id === itemId).quantity,
        _id: userId,
      })
      .catch((err) => {
        console.error("Error updating quantity:", err);
        setError("Error updating quantity.");
      });
  };

  // Decrement quantity of a product
  const decrementQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === itemId && item.quantity > 1) {
        item.quantity -= 1;
      }
      return item;
    });
    setCartItems(updatedCart);
    updateTotalAmount(updatedCart); // Recalculate total after decrement
    axios
      .put(
        `${import.meta.env.VITE_BASE_URL}/user/decrementQuantity`,
        {
          itemId: itemId,
          quantity: updatedCart.find((item) => item._id === itemId).quantity,
          _id: userId,
        }
      )
      .catch((err) => {
        setError("Error updating quantity.");
        console.error("Error updating quantity:", err);
      });
  };

  // Show the payment modal
  const handleBuy = () => {
    setShowPopup(true);
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    if (!deliveryAddress) {
      errors.deliveryAddress = "Delivery address is required.";
    }

    if (paymentMethod === "Online") {
      const { cardNumber, expiryDate, cvc } = cardDetails;
      if (!cardNumber || !expiryDate || !cvc) {
        errors.cardDetails = "Please fill in all card details.";
      }

      const cardNumberRegex = /^\d{16}$/;
      const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      const cvcRegex = /^\d{3}$/;

      if (cardNumber && !cardNumberRegex.test(cardNumber)) {
        errors.cardNumber = "Invalid card number.";
      }
      if (expiryDate && !expiryDateRegex.test(expiryDate)) {
        errors.expiryDate = "Invalid expiry date.";
      }
      if (cvc && !cvcRegex.test(cvc)) {
        errors.cvc = "Invalid CVC.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle payment submission
  const handlePaymentSubmit = () => {
    if (validateForm()) {
      const cartId = cartItems[0]?._id;
      if (!cartId) {
        setError("Cart ID is missing.");
        return;
      }
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/user/checkout`, {
          cartId: cartId,
          userId: userId,
          deliveryAddress: deliveryAddress,
          paymentMethod: paymentMethod,
          cardDetails: paymentMethod === "Online" ? cardDetails : null,
          totalAmount: totalAmount,
        })
        .then((response) => {
          setCartItems([]);
          setShowPopup(false); // Close the popup
        })
        .catch((err) => {
          setError("Error processing your purchase.");
          console.error("Error during checkout:", err);
        });
    }
  };

  // If there's an error, display it
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <Row>
          {cartItems.map((item) => (
            <Col key={item._id} xs={12} md={4} lg={3}>
              <Card className="mb-3">
                <Card.Img
                  variant="top"
                  src={item.productId.productImage}
                  alt={item.productId.productName}
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <Card.Body>
                  <Card.Title>{item.productId.productName}</Card.Title>
                  <Card.Text>
                    Quantity: {item.quantity}
                    <br />
                    Price: ₹{item.productId.rate}
                  </Card.Text>
                  <Button
                    variant="warning"
                    onClick={() => incrementQuantity(item._id)}
                  >
                    +
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => decrementQuantity(item._id)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </Button>
                  <Button variant="danger" onClick={() => handleRemove(item._id)}>
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
          <Card.Text>
            <strong>Total Amount: ₹{totalAmount}</strong>
          </Card.Text>
        </Row>
      )}

      <Button variant="primary" onClick={handleBuy}>
        Proceed to Buy
      </Button>

      {/* Modal for adding delivery address and payment method */}
      <Modal show={showPopup} onHide={() => setShowPopup(false)} style={{ marginTop: "35px" }}>
        <Modal.Header closeButton>
          <Modal.Title>Delivery Address & Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDeliveryAddress">
              <Form.Label>Delivery Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              {formErrors.deliveryAddress && (
                <Alert variant="danger">{formErrors.deliveryAddress}</Alert>
              )}
            </Form.Group>

            <Form.Group controlId="formPaymentMethod">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                as="select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="COD">Cash on Delivery</option>
                <option value="Online">Online Payment</option>
              </Form.Control>
            </Form.Group>

            {paymentMethod === "Online" && (
              <>
                <Form.Group controlId="formCardNumber">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter card number"
                    value={cardDetails.cardNumber}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                    }
                  />
                  {formErrors.cardNumber && <Alert variant="danger">{formErrors.cardNumber}</Alert>}
                </Form.Group>

                <Form.Group controlId="formExpiryDate">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, expiryDate: e.target.value })
                    }
                  />
                  {formErrors.expiryDate && <Alert variant="danger">{formErrors.expiryDate}</Alert>}
                </Form.Group>

                <Form.Group controlId="formCVC">
                  <Form.Label>CVC</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter CVC"
                    value={cardDetails.cvc}
                    onChange={(e) =>
                      setCardDetails({ ...cardDetails, cvc: e.target.value })
                    }
                  />
                  {formErrors.cvc && <Alert variant="danger">{formErrors.cvc}</Alert>}
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopup(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePaymentSubmit}>
            Submit Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
