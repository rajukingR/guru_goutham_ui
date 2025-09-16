import React from "react";
import { Link } from "react-router-dom";
import { TextField, Button, Grid, Box, Typography, CircularProgress, Paper, FormControlLabel, Checkbox } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import HomePagePanner from "../../assets/logos/HomePagePanner.svg";

const AuthForm = ({ isSignup, onSubmit, loading, apiError, user,successMessage }) => {
  // Validation schema
  const validationSchema = Yup.object().shape({
    ...(isSignup && { name: Yup.string().required("Name is required") }),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    ...(!isSignup && { rememberMe: Yup.boolean() }),
  });

  // Initial values
  const initialValues = isSignup 
    ? { name: "", email: "", password: "" } 
    : { email: "", password: "", rememberMe: false };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Side Image */}
      <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
        <Box
          component="img"
          src={HomePagePanner}
          alt={isSignup ? "Sign Up" : "Sign In"}
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
            {isSignup ? "Sign Up" : "Sign In"}
          </Typography>

          {/* Display success message */}
  {successMessage && (
    <Typography color="success.main" sx={{ mb: 2, textAlign: "center" }}>
      {successMessage}
    </Typography>
  )}

  {/* Display API error */}
  {apiError && <Typography color="error">{apiError}</Typography>}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ touched, errors, values, setFieldValue }) => (
              <Form style={{ width: "100%", maxWidth: 360 }}>
                {isSignup && (
                  <Field
                    as={TextField}
                    name="name"
                    label="Name"
                    fullWidth
                    margin="normal"
                    error={touched.name && !!errors.name}
                    helperText={<ErrorMessage name="name" />}
                  />
                )}

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

                <Field
                  as={TextField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={touched.password && !!errors.password}
                  helperText={<ErrorMessage name="password" />}
                />

                {/* Remember Me Checkbox (only for sign in) */}
                {!isSignup && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.rememberMe}
                        onChange={(e) => setFieldValue("rememberMe", e.target.checked)}
                      />
                    }
                    label="Remember Me"
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : (isSignup ? "Sign Up" : "Sign In")}
                </Button>

                <Typography sx={{ mt: 2, textAlign: "center" }}>
                  {isSignup ? (
                    <>Already have an account? <Link to="/signin">Sign In</Link></>
                  ) : (
                    <>Don't have an account? <Link to="/signup">Sign Up</Link></>
                  )}
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default AuthForm;