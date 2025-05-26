import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signinRequest } from "../../redux_setup/slices/auth_slice/authSlice";
import { TextField, Button, Grid, Box, Typography, CircularProgress, Paper, FormControlLabel, Checkbox } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import HomePagePanner from "../../assets/logos/HomePagePanner.svg";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  // Redirect to dashboard if user is already logged in
  React.useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    rememberMe: Yup.boolean(),
  });

  const handleSubmit = (values) => {
    dispatch(signinRequest(values));
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Side Image */}
      <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
        <Box
          component="img"
          src={HomePagePanner}
          alt="Login"
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
            Sign In
          </Typography>

          {error && <Typography color="error">{error}</Typography>}

          <Formik
            initialValues={{ email: "", password: "", rememberMe: false }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, values, setFieldValue }) => (
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

                {/* Remember Me Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.rememberMe}
                      onChange={(e) => setFieldValue("rememberMe", e.target.checked)}
                    />
                  }
                  label="Remember Me"
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Sign In"}
                </Button>

                <Typography sx={{ mt: 2, textAlign: "center" }}>
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </Typography>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignIn;

















// import React from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { signinRequest } from "../../redux_setup/slices/auth_slice/authSlice";
// import { TextField, Button, Grid, Box, Typography, CircularProgress, Paper } from "@mui/material";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import HomePagePanner from "../../assets/logos/HomePagePanner.svg";

// const SignIn = () => {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.auth);

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
//   });

//   const handleSubmit = (values) => {
//     dispatch(signinRequest(values));
//   };

//   return (
//     <Grid container sx={{ height: "100vh" }}>
//       {/* Left Side Image */}
//       <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
//         <Box
//           component="img"
//           src={HomePagePanner}
//           alt="Login"
//           sx={{ width: "100%", height: "100%",  }}
//         />
//       </Grid>

//       {/* Right Side Form */}
//       <Grid item xs={12} md={6} component={Paper} elevation={6} square>
//         <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4,alignContent:"center",      justifyContent: "center",
//       height: "100%",  }}>
//           <Typography variant="h5" sx={{ mb: 3 }}>
//             Sign In
//           </Typography>

//           {error && <Typography color="error">{error}</Typography>}

//           <Formik
//             initialValues={{ email: "", password: "" }}
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ touched, errors }) => (
//               <Form style={{ width: "100%", maxWidth: 360 }}>
//                 <Field
//                   as={TextField}
//                   name="email"
//                   label="Email"
//                   type="email"
//                   fullWidth
//                   margin="normal"
//                   error={touched.email && !!errors.email}
//                   helperText={<ErrorMessage name="email" />}
//                 />

//                 <Field
//                   as={TextField}
//                   name="password"
//                   label="Password"
//                   type="password"
//                   fullWidth
//                   margin="normal"
//                   error={touched.password && !!errors.password}
//                   helperText={<ErrorMessage name="password" />}
//                 />

//                 <Button
//                   type="submit"
//                   variant="contained"
//                   color="primary"
//                   fullWidth
//                   sx={{ mt: 2 }}
//                   disabled={loading}
//                 >
//                   {loading ? <CircularProgress size={24} /> : "Sign In"}
//                 </Button>

//                 <Typography sx={{ mt: 2, textAlign: "center" }}>
//                   Don't have an account? <Link to="/signup">Sign Up</Link>
//                 </Typography>
//               </Form>
//             )}
//           </Formik>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// };

// export default SignIn;