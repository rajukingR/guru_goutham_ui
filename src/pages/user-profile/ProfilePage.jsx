import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Avatar, Typography, Grid, Button, Box, FormControlLabel, Checkbox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CiLogout } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { logout } from "../../redux_setup/slices/auth_slice/authSlice";
import API_URL from "../../api/Api_url";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth); // get token here
  

  // Hardcoded userId for demo (replace with dynamic later if needed)
 const userId = user?.id;
  const userToken = token;

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${userToken}`  // or 'Beaver' if that's what your API expects
      }
    });
    setProfileData(response.data);
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
  }
};

    fetchProfile();
  }, [userId]);

  const handleEdit = () => {
    navigate(`/dashboard/profile/edit-profile/${userId}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const permissions = [
    "Add & Edit Users",
    "Delete User",
    "View Reports",
    "Manage Clients",
    "Manage Branches",
    "Handle Billing",
    "Tax Configuration",
    "Role Management",
  ];

  return (
    <Grid container spacing={3} sx={{ padding: 3, background: "#F8F8FC" }}>
      {/* Profile Section */}
      <Grid item xs={12} md={5}>
        <Card sx={{ padding: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Avatar
                  src="/default-avatar.png"
                  sx={{ width: 80, height: 80 }}
                />
              </Grid>
              <Grid item>
                <Typography variant="h6">
                  {profileData ? profileData.full_name : "Loading..."}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {profileData ? profileData.role_name : ""}
                </Typography>
              </Grid>
            </Grid>

            {profileData && (
              <>
                <Typography variant="body2" sx={{ marginTop: 2 }}>
                  📍 {profileData.landmark}, {profileData.street}, {profileData.city}, {profileData.state}, {profileData.country} - {profileData.pincode}
                </Typography>
                <Typography variant="body2">📞 {profileData.phone_number || "1234567890"}</Typography>
                <Typography variant="body2">✉️ {profileData.email}</Typography>
              </>
            )}

            <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<CiLogout />}
                onClick={handleLogout}
              >
                Logout
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Edit
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Permissions Section */}
      {/* <Grid item xs={12} md={7}>
        <Card sx={{ padding: 2 }}>
          <CardContent>
            <Typography variant="h6">Access:</Typography>
            <Grid container spacing={2}>
              {permissions.map((perm, index) => (
                <Grid item xs={6} key={index}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label={perm}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid> */}
    </Grid>
  );
};

export default ProfilePage;
