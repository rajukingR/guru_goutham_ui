import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Box,
  Typography,
  Grid,
  MenuItem,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import API_URL, { IMAGE_API_URL, POSTAL_API } from "../../api/Api_url";
import { useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditProfile = () => {
  const { id } = useParams();

  const { user, token } = useSelector((state) => state.auth);

  const userToken = token;

  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    first_name: "",
    last_name: "",
    login_id: "",
    branch: "",
    phone_number: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
    landmark: "",
    street: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/${id}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        const data = await response.json();
        setFormData({
          full_name: data.full_name,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          login_id: data.login_id,
          branch: data.branch,
          phone_number: data.phone_number,
          pincode: data.pincode,
          country: data.country,
          state: data.state,
          city: data.city,
          landmark: data.landmark,
          street: data.street,
        });
        if (data.image) {
          setImagePreview(`${IMAGE_API_URL}/${data.image}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append image if it exists
      if (image) {
        formDataToSend.append("image", image);
      }

      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: {
          "Authorization": `Bearer ${userToken}`,
        },
        method: "PUT",
        body: formDataToSend,

      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "Profile updated successfully!",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/dashboard/profile");
        }, 1500);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbar({
        open: true,
        message: "Error updating profile",
        severity: "error",
      });
    }
  };



  const [postOffices, setPostOffices] = useState([]);

  useEffect(() => {
    const fetchLocationFromPincode = async () => {
      const pincode = formData.pincode;

      if (pincode && pincode.length === 6) {
        try {
          const response = await fetch(`${POSTAL_API}/${pincode}`);
          const result = await response.json();

          // Check if PostOffice exists
          if (Array.isArray(result) && result.length > 0 && result[0]?.PostOffice?.length > 0) {
            const firstOffice = result[0].PostOffice[0];

            // Update formData with first post office info
            setFormData((prev) => ({
              ...prev,
              country: firstOffice.Country || "India",
              state: firstOffice.State,
              city: firstOffice.District,
              street: firstOffice.Name,
            }));

            // Set all post offices for this pincode
            setPostOffices(result[0].PostOffice);
          } else {
            setSnackbar({
              open: true,
              message: "Invalid Pincode. Please enter a valid one.",
              severity: "error",
            });
            setPostOffices([]);
          }
        } catch (error) {
          console.error("Error fetching pincode details:", error);
          setSnackbar({
            open: true,
            message: "Error fetching location. Try again.",
            severity: "error",
          });
          setPostOffices([]);
        }
      }
    };

    fetchLocationFromPincode();
  }, [formData.pincode]);


  return (
    <Box
      sx={{
        padding: "20px",
        minHeight: "100vh",
        width: { xs: "200%", md: "80%" },
      }}
    >
      <Typography variant="h6" gutterBottom>
        Profile / Edit Profile
      </Typography>
      <Container
        maxWidth="lg"
        sx={{ mt: 4, p: 3, background: "#f9f9fc", borderRadius: 3 }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={imagePreview || "/profile-pic.jpg"}
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="icon-button-file"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="icon-button-file">
                  <IconButton sx={{ mt: -4, ml: 10 }} component="span">
                    <EditIcon />
                  </IconButton>
                </label>
                <Typography mt={1}>Profile Picture</Typography>
              </Box>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    label="First Name"
                    name="first_name"
                    fullWidth
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Last Name"
                    name="last_name"
                    fullWidth
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Login ID*"
                    name="login_id"
                    fullWidth
                    value={formData.login_id}
                    onChange={handleChange}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Email ID*"
                    name="email"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    required
                    type="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number*"
                    name="phone_number"
                    fullWidth
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Address:</Typography>
              <TextField
                label="Street"
                name="street"
                fullWidth
                value={formData.street}
                onChange={handleChange}
                sx={{ mt: 2 }}
                required
              />
              <TextField
                label="Landmark"
                name="landmark"
                fullWidth
                value={formData.landmark}
                onChange={handleChange}
                sx={{ mt: 2 }}
              />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    label="Country*"
                    name="country"
                    fullWidth
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="State*"
                    name="state"
                    fullWidth
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="City*"
                    name="city"
                    fullWidth
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Pincode*"
                    name="pincode"
                    fullWidth
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ width: { xs: "100%", sm: "60%", md: "30%" } }}
            >
              Update
            </Button>
          </Box>
        </form>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%", whiteSpace: "pre-line" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProfile;
