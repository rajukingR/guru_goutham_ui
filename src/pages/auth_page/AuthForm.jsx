import React from "react";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AuthForm = ({ isSignup, onSubmit, loading, apiError }) => {
  const validationSchema = Yup.object().shape({
    name: isSignup ? Yup.string().required("Name is required") : null,
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3, textAlign: "center" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {isSignup ? "Sign Up" : "Sign In"}
      </Typography>

      {apiError && <Typography color="error">{apiError}</Typography>}

      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
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

            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : isSignup ? "Sign Up" : "Sign In"}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AuthForm;
