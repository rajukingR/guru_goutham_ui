import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  MenuItem,
  Button,
  Divider,
  Box,
} from "@mui/material";

const InvoicesAddPage = () => {
  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create Invoice
        </Typography>

        <Grid container spacing={2}>
          {/* Basic Details */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Basic Details:
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}><TextField fullWidth label="Invoice Number" /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Invoice Title" /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Select Customer" /></Grid>

                  <Grid item xs={4}><Button variant="outlined">Previous Month</Button></Grid>
                  <Grid item xs={4}><Button variant="outlined">Current Month</Button></Grid>
                  <Grid item xs={4}><Button variant="outlined">Next Month</Button></Grid>

                  <Grid item xs={6}><TextField fullWidth label="Invoice Start Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Invoice End Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>

                  <Grid item xs={6}><TextField fullWidth label="Previous End Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Credit Note Start Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Credit Note End Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>

                  <Grid item xs={6}><TextField fullWidth label="Customer ID" /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Email ID" /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Phone No" /></Grid>

                  <Grid item xs={6}>
                    <TextField fullWidth select label="Payment Type">
                      <MenuItem value="Prepaid">Prepaid</MenuItem>
                      <MenuItem value="Postpaid">Postpaid</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={6}>
                    <TextField fullWidth select label="Invoice Status">
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Pending">Pending</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={6}><TextField fullWidth label="Invoice Date" type="date" InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Amount" /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="GST Number" /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="PAN" /></Grid>

                  <Grid item xs={6}><TextField fullWidth label="Invoice Created By" value="rounder" disabled /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Transaction Type" value="Rent" disabled /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Industry" /></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* To Address */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  To Address:
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}><TextField fullWidth label="Company Name" /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Pincode" /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="Country" /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="State" /></Grid>
                  <Grid item xs={6}><TextField fullWidth label="City" /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Street" /></Grid>
                  <Grid item xs={12}><TextField fullWidth label="Landmark" /></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography gutterBottom>Selected Products:</Typography>
          <Button variant="contained">Select Product</Button>
        </Box>

        <Box mt={3} display="flex" gap={2} justifyContent="center">
          <Button variant="contained" color="success">Fetch/Refresh Invoice Items</Button>
          <Button variant="outlined">Cancel</Button>
          <Button variant="contained" color="primary">Submit</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvoicesAddPage;
