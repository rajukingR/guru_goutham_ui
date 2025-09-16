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

                {/* Remember Me Checkbox and Forgot Password Link */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.rememberMe}
                        onChange={(e) => setFieldValue("rememberMe", e.target.checked)}
                      />
                    }
                    label="Remember Me"
                  />
                  
                  <Link to="/forgot-password" style={{ textDecoration: "none", fontSize: "0.875rem" }}>
                    Forgot Password?
                  </Link>
                </Box>

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

                {/* <Typography sx={{ mt: 2, textAlign: "center" }}>
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </Typography> */}
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
// 



// import React, { useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { signinRequest } from "../../redux_setup/slices/auth_slice/authSlice";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import HomePagePanner from "../../../src/assets/logos/guru-goutham-logo.svg";
// import { keyframes } from "@emotion/react";
// import styled from "@emotion/styled";

// const SignIn = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, user } = useSelector((state) => state.auth);
//   const [showPassword, setShowPassword] = React.useState(false);
//   const shake = keyframes`
//   0% { transform: translateX(0); }
//   25% { transform: translateX(-5px); }
//   50% { transform: translateX(5px); }
//   75% { transform: translateX(-5px); }
//   100% { transform: translateX(0); }
// `;

//   const AnimatedEmoji = styled.span`
//     display: inline-block;
//     animation: ${shake} 0.5s ease-in-out infinite;
//     font-size: 1.2em;
//   `;
//   // Redirect to dashboard if user is already logged in
//   useEffect(() => {
//     if (user) navigate("/dashboard");
//   }, [user, navigate]);

//   const validationSchema = Yup.object().shape({
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     password: Yup.string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//     rememberMe: Yup.boolean(),
//   });

//   const handleSubmit = (values) => {
//     dispatch(signinRequest(values));
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         position: "relative",
//         overflow: "hidden",
//         background:
//           "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
//       }}
//     >
//       {/* Ultra Modern Tech Gradient Background */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: `
//           radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 40%),
//           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 40%),
//           radial-gradient(circle at 50% 50%, #06b6d4 0%, transparent 40%),
//           radial-gradient(circle at 80% 20%, #10b981 0%, transparent 40%),
//           radial-gradient(circle at 20% 80%, #f59e0b 0%, transparent 40%)
//         `,
//           opacity: 0.15,
//           filter: "blur(120px)",
//           animation: "techMorphing 25s ease-in-out infinite",
//         }}
//       />

//       {/* Animated Circuit Pattern */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundImage: `
//           linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
//           linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
//         `,
//           backgroundSize: "60px 60px",
//           animation: "circuitFlow 40s linear infinite",
//         }}
//       />

//       {/* Animated Laptop 1 */}
//       <div
//         style={{
//           position: "absolute",
//           top: "10%",
//           right: "8%",
//           transform: "rotate(-15deg)",
//           animation: "laptopFloat1 12s ease-in-out infinite",
//           opacity: 0.3,
//         }}
//       >
//         <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
//           <rect
//             x="10"
//             y="5"
//             width="100"
//             height="60"
//             rx="4"
//             fill="url(#laptopGradient1)"
//           />
//           <rect x="12" y="7" width="96" height="56" rx="2" fill="#1e293b" />
//           <rect
//             x="15"
//             y="10"
//             width="90"
//             height="50"
//             rx="1"
//             fill="#3b82f6"
//             opacity="0.8"
//           />
//           <path
//             d="M5 65 L115 65 L110 75 L10 75 Z"
//             fill="url(#laptopGradient2)"
//           />
//           <defs>
//             <linearGradient
//               id="laptopGradient1"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#475569" />
//             </linearGradient>
//             <linearGradient
//               id="laptopGradient2"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#334155" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* Animated Desktop 1 */}
//       <div
//         style={{
//           position: "absolute",
//           top: "50%",
//           left: "3%",
//           transform: "rotate(10deg)",
//           animation: "desktopFloat1 15s ease-in-out infinite",
//           opacity: 0.25,
//         }}
//       >
//         <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
//           <rect
//             x="10"
//             y="10"
//             width="80"
//             height="60"
//             rx="4"
//             fill="url(#desktopGradient1)"
//           />
//           <rect x="12" y="12" width="76" height="56" rx="2" fill="#1e293b" />
//           <rect
//             x="15"
//             y="15"
//             width="70"
//             height="50"
//             rx="1"
//             fill="#8b5cf6"
//             opacity="0.8"
//           />
//           <rect
//             x="42"
//             y="70"
//             width="16"
//             height="20"
//             rx="2"
//             fill="url(#desktopGradient2)"
//           />
//           <rect
//             x="30"
//             y="90"
//             width="40"
//             height="8"
//             rx="4"
//             fill="url(#desktopGradient2)"
//           />
//           <rect
//             x="70"
//             y="75"
//             width="25"
//             height="40"
//             rx="3"
//             fill="url(#desktopGradient3)"
//           />
//           <rect x="72" y="77" width="21" height="36" rx="2" fill="#334155" />
//           <defs>
//             <linearGradient
//               id="desktopGradient1"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#475569" />
//             </linearGradient>
//             <linearGradient
//               id="desktopGradient2"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#334155" />
//             </linearGradient>
//             <linearGradient
//               id="desktopGradient3"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#475569" />
//               <stop offset="100%" stopColor="#334155" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* Animated Laptop 2 */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: "15%",
//           right: "12%",
//           transform: "rotate(20deg)",
//           animation: "laptopFloat2 18s ease-in-out infinite",
//           opacity: 0.2,
//         }}
//       >
//         <svg width="100" height="70" viewBox="0 0 100 70" fill="none">
//           <rect
//             x="8"
//             y="4"
//             width="84"
//             height="50"
//             rx="4"
//             fill="url(#laptopGradient3)"
//           />
//           <rect x="10" y="6" width="80" height="46" rx="2" fill="#1e293b" />
//           <rect
//             x="12"
//             y="8"
//             width="76"
//             height="42"
//             rx="1"
//             fill="#06b6d4"
//             opacity="0.8"
//           />
//           <path d="M4 54 L96 54 L92 64 L8 64 Z" fill="url(#laptopGradient4)" />
//           <defs>
//             <linearGradient
//               id="laptopGradient3"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#475569" />
//             </linearGradient>
//             <linearGradient
//               id="laptopGradient4"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#334155" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* Animated Desktop 2 */}
//       <div
//         style={{
//           position: "absolute",
//           top: "20%",
//           left: "15%",
//           transform: "rotate(-8deg)",
//           animation: "desktopFloat2 20s ease-in-out infinite",
//           opacity: 0.15,
//         }}
//       >
//         <svg width="90" height="100" viewBox="0 0 90 100" fill="none">
//           <rect
//             x="5"
//             y="5"
//             width="80"
//             height="50"
//             rx="4"
//             fill="url(#desktopGradient4)"
//           />
//           <rect x="7" y="7" width="76" height="46" rx="2" fill="#1e293b" />
//           <rect
//             x="10"
//             y="10"
//             width="70"
//             height="40"
//             rx="1"
//             fill="#10b981"
//             opacity="0.8"
//           />
//           <rect
//             x="37"
//             y="55"
//             width="16"
//             height="15"
//             rx="2"
//             fill="url(#desktopGradient5)"
//           />
//           <rect
//             x="25"
//             y="70"
//             width="40"
//             height="6"
//             rx="3"
//             fill="url(#desktopGradient5)"
//           />
//           <defs>
//             <linearGradient
//               id="desktopGradient4"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#475569" />
//             </linearGradient>
//             <linearGradient
//               id="desktopGradient5"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#334155" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* Animated Laptop 3 */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: "25%",
//           left: "8%",
//           transform: "rotate(-25deg)",
//           animation: "laptopFloat3 14s ease-in-out infinite",
//           opacity: 0.25,
//         }}
//       >
//         <svg width="110" height="75" viewBox="0 0 110 75" fill="none">
//           <rect
//             x="9"
//             y="5"
//             width="92"
//             height="55"
//             rx="4"
//             fill="url(#laptopGradient5)"
//           />
//           <rect x="11" y="7" width="88" height="51" rx="2" fill="#1e293b" />
//           <rect
//             x="13"
//             y="9"
//             width="84"
//             height="47"
//             rx="1"
//             fill="#f59e0b"
//             opacity="0.8"
//           />
//           <path
//             d="M5 60 L105 60 L100 70 L10 70 Z"
//             fill="url(#laptopGradient6)"
//           />
//           <defs>
//             <linearGradient
//               id="laptopGradient5"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#475569" />
//             </linearGradient>
//             <linearGradient
//               id="laptopGradient6"
//               x1="0%"
//               y1="0%"
//               x2="100%"
//               y2="100%"
//             >
//               <stop offset="0%" stopColor="#64748b" />
//               <stop offset="100%" stopColor="#334155" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </div>

//       {/* Floating Code Elements */}
//       <div
//         style={{
//           position: "absolute",
//           top: "40%",
//           right: "25%",
//           animation: "codeFloat 16s ease-in-out infinite",
//           opacity: 0.15,
//         }}
//       >
//         <span
//           style={{
//             fontFamily: "monospace",
//             fontSize: "12px",
//             color: "#3b82f6",
//             transform: "rotate(15deg)",
//             display: "block",
//           }}
//         >
//           {"{ code: 'awesome' }"}
//         </span>
//       </div>

//       <div
//         style={{
//           position: "absolute",
//           top: "70%",
//           right: "30%",
//           animation: "codeFloat 12s ease-in-out infinite reverse",
//           opacity: 0.2,
//         }}
//       >
//         <span
//           style={{
//             fontFamily: "monospace",
//             fontSize: "10px",
//             color: "#8b5cf6",
//             transform: "rotate(-10deg)",
//             display: "block",
//           }}
//         >
//           {"console.log('tech')"}
//         </span>
//       </div>

//       {/* Main Container */}
//       <div
//         style={{
//           height: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           position: "relative",
//           zIndex: 1,
//           padding: "0 20px",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             width: "100%",
//             maxWidth: "1200px",
//             height: "80vh",
//             borderRadius: "24px",
//             overflow: "hidden",
//             boxShadow: "0 25px 100px rgba(0, 0, 0, 0.4)",
//             backdropFilter: "blur(20px)",
//             border: "1px solid rgba(255, 255, 255, 0.1)",
//           }}
//         >
//           {/* Left Side - Hero Section */}
//           <div
//             style={{
//               flex: 1,
//               background:
//                 "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
//               position: "relative",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               flexDirection: "column",
//               padding: "48px",
//               minHeight: "100%",
//             }}
//           >
//             {/* Tech Grid Overlay */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 background:
//                   'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="techgrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="%23ffffff" stroke-width="0.5" opacity="0.15"/><circle cx="10" cy="10" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23techgrid)"/></svg>\')',
//                 opacity: 0.4,
//               }}
//             />

//             <div style={{ textAlign: "center", color: "white", zIndex: 1 }}>
//               {/* Laptop Icon */}
//               <div
//                 style={{
//                   marginBottom: "24px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
//                   <rect
//                     x="5"
//                     y="3"
//                     width="50"
//                     height="30"
//                     rx="2"
//                     fill="white"
//                     opacity="0.9"
//                   />
//                   <rect
//                     x="7"
//                     y="5"
//                     width="46"
//                     height="26"
//                     rx="1"
//                     fill="#667eea"
//                   />
//                   <path
//                     d="M2 33 L58 33 L55 37 L5 37 Z"
//                     fill="white"
//                     opacity="0.9"
//                   />
//                 </svg>
//               </div>

//               <h1
//                 style={{
//                   fontSize: "3rem",
//                   fontWeight: 800,
//                   marginBottom: "16px",
//                   letterSpacing: "-0.02em",
//                   margin: "0 0 16px 0",
//                 }}
//               >
//                 Premium Laptops
//               </h1>
//               <h2
//                 style={{
//                   fontSize: "3rem",
//                   fontWeight: 300,
//                   marginBottom: "32px",
//                   letterSpacing: "-0.02em",
//                   margin: "0 0 32px 0",
//                 }}
//               >
//                 Rent & Own
//               </h2>
//               <p
//                 style={{
//                   opacity: 0.9,
//                   fontWeight: 300,
//                   lineHeight: 1.6,
//                   maxWidth: "400px",
//                   fontSize: "1.125rem",
//                   margin: "0 auto 32px auto",
//                 }}
//               >
//                 Access the latest laptops through flexible rental plans or
//                 purchase options. Your tech needs, our solutions.
//               </p>

//               <div
//                 style={{
//                   display: "flex",
//                   gap: "16px",
//                   justifyContent: "center",
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <div
//                   style={{
//                     backgroundColor: "rgba(255,255,255,0.2)",
//                     color: "white",
//                     backdropFilter: "blur(10px)",
//                     padding: "8px 16px",
//                     borderRadius: "20px",
//                     fontSize: "0.875rem",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                   }}
//                 >
//                   ⭐ Premium Quality
//                 </div>
//                 <div
//                   style={{
//                     backgroundColor: "rgba(255,255,255,0.2)",
//                     color: "white",
//                     backdropFilter: "blur(10px)",
//                     padding: "8px 16px",
//                     borderRadius: "20px",
//                     fontSize: "0.875rem",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                   }}
//                 >
//                   🔒 Secure Transactions
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Form */}
//           <div
//             style={{
//               flex: 1,
//               background: "rgba(255, 255, 255, 0.98)",
//               backdropFilter: "blur(20px)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               padding: "48px",
//             }}
//           >
//             <div style={{ width: "100%", maxWidth: "400px" }}>
//               {/* Header */}
//               <div style={{ textAlign: "center", marginBottom: "40px" }}>
//                 <h1
//                   style={{
//                     fontWeight: 700,
//                     color: "#1a1a1a",
//                     marginBottom: "8px",
//                     letterSpacing: "-0.02em",
//                     fontSize: "2.5rem",
//                     margin: "0 0 8px 0",
//                   }}
//                 >
//                   <img
//                     src={HomePagePanner}
//                     alt="Logo"
//                     style={{
//                       height: "60px",
//                       width: "auto",
//                       marginBottom: "1rem",
//                     }}
//                   />
//                 </h1>
//                 <p
//                   style={{
//                     color: "#6b7280",
//                     fontWeight: 400,
//                     fontSize: "1rem",
//                     margin: 0,
//                   }}
//                 >
//                   Continue your journey with Guru Goutham
//                 </p>
//               </div>

//               {error && (
//                 <div
//                   style={{
//                     backgroundColor: "#fee2e2",
//                     color: "#b91c1c",
//                     padding: "12px",
//                     borderRadius: "8px",
//                     marginBottom: "24px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "8px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "8px",
//                     }}
//                   >
//                     <AnimatedEmoji>😕</AnimatedEmoji>
//                     <span>Wrong credentials. Please try again.</span>
//                   </div>{" "}
//                 </div>
//               )}

//               <Formik
//                 initialValues={{ email: "", password: "", rememberMe: false }}
//                 validationSchema={validationSchema}
//                 onSubmit={handleSubmit}
//               >
//                 {({ values, setFieldValue, touched, errors }) => (
//                   <Form style={{ width: "100%" }}>
//                     {/* Email Field */}
//                     <div style={{ marginBottom: "24px" }}>
//                       <label
//                         style={{
//                           color: "#374151",
//                           fontWeight: 500,
//                           marginBottom: "8px",
//                           display: "block",
//                           fontSize: "0.875rem",
//                         }}
//                       >
//                         Email Address
//                       </label>
//                       <div style={{ position: "relative" }}>
//                         <span
//                           style={{
//                             position: "absolute",
//                             left: "16px",
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             color: "#9ca3af",
//                             zIndex: 1,
//                           }}
//                         >
//                           ✉️
//                         </span>
//                         <Field
//                           type="email"
//                           name="email"
//                           placeholder="Enter your email"
//                           style={{
//                             width: "100%",
//                             padding: "16px 16px 16px 48px",
//                             borderRadius: "12px",
//                             backgroundColor: "#f9fafb",
//                             border:
//                               errors.email && touched.email
//                                 ? "2px solid #ef4444"
//                                 : "2px solid transparent",
//                             fontSize: "1rem",
//                             transition: "all 0.3s ease",
//                             outline: "none",
//                             boxSizing: "border-box",
//                           }}
//                           onFocus={(e) => {
//                             e.target.style.backgroundColor = "white";
//                             e.target.style.border = "2px solid #667eea";
//                             e.target.style.boxShadow =
//                               "0 0 0 3px rgba(102, 126, 234, 0.1)";
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.backgroundColor = "#f9fafb";
//                             e.target.style.border =
//                               errors.email && touched.email
//                                 ? "2px solid #ef4444"
//                                 : "2px solid transparent";
//                             e.target.style.boxShadow = "none";
//                           }}
//                         />
//                       </div>
//                       <ErrorMessage name="email">
//                         {(msg) => (
//                           <p
//                             style={{
//                               color: "#ef4444",
//                               fontSize: "0.875rem",
//                               marginTop: "4px",
//                               margin: "4px 0 0 0",
//                             }}
//                           >
//                             {msg}
//                           </p>
//                         )}
//                       </ErrorMessage>
//                     </div>

//                     {/* Password Field */}
//                     {/* Password Field */}
//                     <div style={{ marginBottom: "24px" }}>
//                       <label
//                         style={{
//                           color: "#374151",
//                           fontWeight: 500,
//                           marginBottom: "8px",
//                           display: "block",
//                           fontSize: "0.875rem",
//                         }}
//                       >
//                         Password
//                       </label>
//                       <div style={{ position: "relative" }}>
//                         <span
//                           style={{
//                             position: "absolute",
//                             left: "16px",
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             color: "#9ca3af",
//                             zIndex: 1,
//                           }}
//                         >
//                           🔒
//                         </span>
//                         <Field
//                           type={showPassword ? "text" : "password"}
//                           name="password"
//                           placeholder="Enter your password"
//                           style={{
//                             width: "100%",
//                             padding: "16px 48px 16px 48px",
//                             borderRadius: "12px",
//                             backgroundColor: "#f9fafb",
//                             border:
//                               errors.password && touched.password
//                                 ? "2px solid #ef4444"
//                                 : "2px solid transparent",
//                             fontSize: "1rem",
//                             transition: "all 0.3s ease",
//                             outline: "none",
//                             boxSizing: "border-box",
//                           }}
//                           onFocus={(e) => {
//                             e.target.style.backgroundColor = "white";
//                             e.target.style.border = "2px solid #667eea";
//                             e.target.style.boxShadow =
//                               "0 0 0 3px rgba(102, 126, 234, 0.1)";
//                           }}
//                           onBlur={(e) => {
//                             e.target.style.backgroundColor = "#f9fafb";
//                             e.target.style.border =
//                               errors.password && touched.password
//                                 ? "2px solid #ef4444"
//                                 : "2px solid transparent";
//                             e.target.style.boxShadow = "none";
//                           }}
//                         />
//                         {/* Eye icon for toggling password visibility */}
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           style={{
//                             position: "absolute",
//                             right: "16px",
//                             top: "50%",
//                             transform: "translateY(-50%)",
//                             background: "none",
//                             border: "none",
//                             cursor: "pointer",
//                             color: "#9ca3af",
//                             fontSize: "1.25rem",
//                             padding: "4px",
//                           }}
//                         >
//                           {showPassword ? "🐵	" : "🙈"}
//                         </button>
//                       </div>
//                       <ErrorMessage name="password">
//                         {(msg) => (
//                           <p
//                             style={{
//                               color: "#ef4444",
//                               fontSize: "0.875rem",
//                               marginTop: "4px",
//                               margin: "4px 0 0 0",
//                             }}
//                           >
//                             {msg}
//                           </p>
//                         )}
//                       </ErrorMessage>
//                     </div>

//                     {/* Remember Me & Forgot Password */}
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         marginBottom: "32px",
//                       }}
//                     >
//                       <label
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "8px",
//                           cursor: "pointer",
//                         }}
//                       >
//                         <input
//                           type="checkbox"
//                           name="rememberMe"
//                           checked={values.rememberMe}
//                           onChange={(e) =>
//                             setFieldValue("rememberMe", e.target.checked)
//                           }
//                           style={{
//                             width: "16px",
//                             height: "16px",
//                             accentColor: "#667eea",
//                           }}
//                         />
//                         <span
//                           style={{
//                             color: "#6b7280",
//                             fontWeight: 500,
//                             fontSize: "0.875rem",
//                           }}
//                         >
//                           Remember me
//                         </span>
//                       </label>
//                       <Link
//                         to="/forgot-password"
//                         style={{
//                           textDecoration: "none",
//                           color: "#667eea",
//                           fontSize: "0.875rem",
//                           fontWeight: 500,
//                           transition: "color 0.3s ease",
//                         }}
//                       >
//                         Forgot password?
//                       </Link>
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                       type="submit"
//                       disabled={loading}
//                       style={{
//                         width: "100%",
//                         padding: "16px",
//                         borderRadius: "12px",
//                         background:
//                           "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
//                         color: "white",
//                         border: "none",
//                         fontSize: "1rem",
//                         fontWeight: 600,
//                         cursor: loading ? "not-allowed" : "pointer",
//                         boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
//                         marginBottom: "32px",
//                         transition: "all 0.3s ease",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: "8px",
//                       }}
//                       onMouseOver={(e) => {
//                         if (!loading) {
//                           e.target.style.background =
//                             "linear-gradient(135deg, #5a6fd8 0%, #6a42a0 100%)";
//                           e.target.style.boxShadow =
//                             "0 15px 35px rgba(102, 126, 234, 0.4)";
//                           e.target.style.transform = "translateY(-2px)";
//                         }
//                       }}
//                       onMouseOut={(e) => {
//                         if (!loading) {
//                           e.target.style.background =
//                             "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
//                           e.target.style.boxShadow =
//                             "0 10px 25px rgba(102, 126, 234, 0.3)";
//                           e.target.style.transform = "translateY(0)";
//                         }
//                       }}
//                     >
//                       {loading ? (
//                         <div
//                           style={{
//                             width: "20px",
//                             height: "20px",
//                             border: "2px solid #ffffff",
//                             borderTop: "2px solid transparent",
//                             borderRadius: "50%",
//                             animation: "spin 1s linear infinite",
//                           }}
//                         />
//                       ) : (
//                         <>
//                           Sign In
//                           <span>→</span>
//                         </>
//                       )}
//                     </button>

//                     {/* Sign Up Link */}
//                     <div style={{ textAlign: "center" }}>
//                       <p
//                         style={{
//                           color: "#6b7280",
//                           fontWeight: 500,
//                           fontSize: "0.875rem",
//                           margin: 0,
//                         }}
//                       >
//                         Don't have an account?{" "}
//                         <Link
//                           to="/signup"
//                           style={{
//                             textDecoration: "none",
//                             color: "#667eea",
//                             fontWeight: 700,
//                             transition: "color 0.3s ease",
//                           }}
//                         >
//                           Create Account
//                         </Link>
//                       </p>
//                     </div>
//                   </Form>
//                 )}
//               </Formik>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced CSS Animations for Tech Elements */}
//       <style jsx>{`
//         @keyframes spin {
//           0% {
//             transform: rotate(0deg);
//           }
//           100% {
//             transform: rotate(360deg);
//           }
//         }

//         @keyframes techMorphing {
//           0%,
//           100% {
//             transform: scale(1) rotate(0deg);
//             opacity: 0.15;
//           }
//           25% {
//             transform: scale(1.2) rotate(90deg);
//             opacity: 0.2;
//           }
//           50% {
//             transform: scale(0.8) rotate(180deg);
//             opacity: 0.15;
//           }
//           75% {
//             transform: scale(1.1) rotate(270deg);
//             opacity: 0.18;
//           }
//         }

//         @keyframes circuitFlow {
//           0% {
//             transform: translate(0, 0);
//           }
//           100% {
//             transform: translate(60px, 60px);
//           }
//         }

//         @keyframes laptopFloat1 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(-15deg) scale(1);
//           }
//           50% {
//             transform: translateY(-30px) rotate(-15deg) scale(1.05);
//           }
//         }

//         @keyframes laptopFloat2 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(20deg) scale(1);
//           }
//           50% {
//             transform: translateY(20px) rotate(20deg) scale(0.95);
//           }
//         }

//         @keyframes laptopFloat3 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(-25deg) scale(1);
//           }
//           50% {
//             transform: translateY(15px) rotate(-25deg) scale(1.03);
//           }
//         }

//         @keyframes desktopFloat1 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(10deg) scale(1);
//           }
//           50% {
//             transform: translateY(-20px) rotate(10deg) scale(1.02);
//           }
//         }

//         @keyframes desktopFloat2 {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(-8deg) scale(1);
//           }
//           50% {
//             transform: translateY(25px) rotate(-8deg) scale(0.98);
//           }
//         }

//         @keyframes codeFloat {
//           0%,
//           100% {
//             transform: translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translateY(-15px) rotate(5deg);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SignIn;
