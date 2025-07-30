import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  Avatar, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  Divider,
  Paper,
  Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CiLogout } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { logout } from "../../redux_setup/slices/auth_slice/authSlice";
import API_URL from "../../api/Api_url";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  
  const userId = user?.id;
  const userToken = token;

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`
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
    <Box sx={{ 
      p: 4, 
      // background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      minHeight: "100vh"
    }}>
      <Grid container spacing={4} justifyContent="start">
        {/* Profile Section */}
        <Grid item xs={12} md={8} lg={6}>
          <Paper elevation={3} sx={{ 
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
          }}>
            <Box sx={{
              height: 120,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              position: "relative"
            }} />
            
            <Box sx={{ 
              position: "relative",
              px: 4,
              pb: 4,
              mt: -8
            }}>
              <Avatar
                src="/default-avatar.png"
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: "4px solid white",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
                }}
              />
              
              <Box sx={{ 
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mt: 2
              }}>
                <Box>
                  <Typography variant="h5" fontWeight="600">
                    {profileData ? profileData.full_name : "Loading..."}
                  </Typography>
                  {/* <Chip 
                    label={profileData ? profileData.role_name : ""} 
                    color="primary" 
                    size="small"
                    sx={{ 
                      mt: 1,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white"
                    }}
                  /> */}
                </Box>
                
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CiLogout />}
                    onClick={handleLogout}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2
                    }}
                  >
                    Logout
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "none"
                    }}
                  >
                    Edit Profile
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Contact Information
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "#f0f4ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2
                    }}>
                      ✉️
                    </Box>
                    <Typography variant="body1">
                      {profileData?.email || "N/A"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "#f0f4ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2
                    }}>
                      📞
                    </Box>
                    <Typography variant="body1">
                      {profileData?.phone_number || "1234567890"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: "#f0f4ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      flexShrink: 0
                    }}>
                      📍
                    </Box>
                    <Typography variant="body1">
                      {profileData ? 
                        `${profileData.landmark}, ${profileData.street}, ${profileData.city}, ${profileData.state}, ${profileData.country} - ${profileData.pincode}` : 
                        "N/A"}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Permissions
                  </Typography>
                  <Box sx={{ 
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1
                  }}>
                    {permissions.map((permission, index) => (
                      <Chip
                        key={index}
                        label={permission}
                        sx={{
                          borderRadius: 1,
                          backgroundColor: "#f0f4ff",
                          color: "#667eea"
                        }}
                      />
                    ))}
                  </Box>
                </Grid> */}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;