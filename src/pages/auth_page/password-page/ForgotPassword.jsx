// ForgotPassword.jsx (updated)
import React from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Grid, Box, Typography, CircularProgress, Paper, Alert } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import HomePagePanner from "../../../assets/logos/HomePagePanner.svg";

const ForgotPassword = ({ onSubmit, loading, apiError, successMessage }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const initialValues = { email: "" };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Side Image */}
      <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
        <Box
          component="img"
          src={HomePagePanner}
          alt="Forgot Password"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Grid>

      {/* Right Side Form */}
      <Grid item xs={12} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            p: 4,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3 }}>
            Forgot Password
          </Typography>

          {apiError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {apiError}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ touched, errors }) => (
              <Form style={{ width: "100%", maxWidth: 360 }}>
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  error={touched.email && !!errors.email}
                  helperText={<ErrorMessage name="email" />}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={loading || successMessage}
                >
                  {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
                </Button>

                <Typography sx={{ mt: 2, textAlign: "center" }}>
                  <Link to="/signin">Back to Sign In</Link>
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;