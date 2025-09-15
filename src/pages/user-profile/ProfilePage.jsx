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
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CiLogout } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { logout } from "../../redux_setup/slices/auth_slice/authSlice";
import API_URL, { IMAGE_API_URL } from "../../api/Api_url";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const userId = user?.id;
  const userToken = token;

  const [profileData, setProfileData] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${userToken}`,
          },
        });
        setProfileData(response.data);

        // Set image preview if image exists in response
        if (response.data.image) {
          setImagePreview(`${IMAGE_API_URL}/${response.data.image}`);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    fetchProfile();
  }, [userId, userToken]);

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
    <Box
      sx={{
        p: isMobile ? 2 : 4,
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Grid container spacing={isMobile ? 2 : 4} justifyContent="center">
        {/* Profile Section */}
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: isMobile ? 2 : 4,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            <Box
              sx={{
                height: isMobile ? 80 : 120,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                position: "relative",
              }}
            />

            <Box
              sx={{
                position: "relative",
                px: isMobile ? 2 : 4,
                pb: isMobile ? 2 : 4,
                mt: isMobile ? -6 : -8,
              }}
            >
              <Avatar
                src={imagePreview || "/default-avatar.png"}
                sx={{
                  width: isMobile ? 80 : 120,
                  height: isMobile ? 80 : 120,
                  border: "2px solid #667eea",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "flex-start",
                  mt: 2,
                  gap: isMobile ? 2 : 0,
                }}
              >
                <Box sx={{ width: isMobile ? "100%" : "auto" }}>
                  <Typography variant={isMobile ? "h6" : "h5"} fontWeight="600">
                    {profileData ? profileData.full_name : "Loading..."}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexDirection: isMobile ? "row" : "row",
                    width: isMobile ? "100%" : "auto",
                    justifyContent: isMobile ? "space-between" : "flex-end",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={!isMobile && <CiLogout />}
                    onClick={handleLogout}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      minWidth: isMobile ? "auto" : "64px",
                    }}
                  >
                    {isMobile ? <CiLogout /> : "Logout"}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={!isMobile && <EditIcon />}
                    onClick={handleEdit}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      boxShadow: "none",
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                      minWidth: isMobile ? "auto" : "64px",
                    }}
                  >
                    {isMobile ? <EditIcon /> : "Edit Profile"}
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Contact Information
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "#f0f4ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      ✉️
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {profileData?.email || "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "#f0f4ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        flexShrink: 0,
                      }}
                    >
                      📞
                    </Box>
                    <Typography variant="body1">
                      {profileData?.phone_number || "1234567890"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "#f0f4ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: 2,
                        flexShrink: 0,
                        mt: 0.5,
                      }}
                    >
                      📍
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {profileData
                        ? `${profileData.landmark || ""}, ${
                            profileData.street || ""
                          }, ${profileData.city || ""}, ${
                            profileData.state || ""
                          }, ${profileData.country || ""} - ${
                            profileData.pincode || ""
                          }`
                        : "N/A"}
                    </Typography>
                  </Box>
                </Grid>

                {/* Uncomment if you want to show permissions
                <Grid item xs={12}>
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
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          borderRadius: 1,
                          backgroundColor: "#f0f4ff",
                          color: "#667eea",
                          fontSize: isMobile ? "0.7rem" : "0.8125rem"
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
                */}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
