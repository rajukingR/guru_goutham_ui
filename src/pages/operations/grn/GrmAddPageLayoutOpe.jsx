import React from 'react';
import { TextField, Button, MenuItem, Grid, Paper, Typography } from '@mui/material';

const GrmAddPageLayoutOpe = () => {
  return (
    <div className="p-6">
      <Typography variant="h6" gutterBottom>
        Create Goods Return Note
      </Typography>

      <Grid container spacing={2}>
        {/* Basic Details */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4 shadow-md rounded-lg">
            <Typography variant="subtitle1" gutterBottom>
              Basic Details:
            </Typography>
            <TextField fullWidth label="GRN ID" margin="dense" />
            <TextField fullWidth label="GRN Title" margin="dense" />
            <TextField fullWidth label="Select Customer" margin="dense" select>
              <MenuItem value="">Select</MenuItem>
            </TextField>
            <TextField fullWidth label="Customer ID*" margin="dense" />
            <TextField fullWidth label="Email ID*" margin="dense" />
            <TextField fullWidth label="Phone No*" margin="dense" />
            <TextField
              fullWidth
              label="GRN Date"
              type="date"
              margin="dense"
              InputLabelProps={{ shrink: true }}
            />
            <TextField fullWidth label="GST Number" margin="dense" />
            <TextField fullWidth label="PAN" margin="dense" />
            <TextField fullWidth label="GRN Created By" margin="dense" disabled value="rounder" />
            <TextField fullWidth label="Industry" margin="dense" />
          </Paper>
        </Grid>

        {/* To Address */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4 shadow-md rounded-lg">
            <Typography variant="subtitle1" gutterBottom>
              To Address:
            </Typography>
            <TextField fullWidth label="Company Name*" margin="dense" />
            <TextField fullWidth label="Pincode*" margin="dense" />
            <TextField fullWidth label="Country*" margin="dense" />
            <TextField fullWidth label="State*" margin="dense" />
            <TextField fullWidth label="City*" margin="dense" />
            <TextField fullWidth label="Street*" margin="dense" />
            <TextField fullWidth label="Landmark" margin="dense" />
          </Paper>
        </Grid>

        {/* Person Info */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4 shadow-md rounded-lg">
            <Typography variant="subtitle1" gutterBottom>
              Person Info:
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField fullWidth label="Informed Person Name*" margin="dense" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Informed Person Phone No*" margin="dense" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Returner Name" margin="dense" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Returner Phone No" margin="dense" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Receiver Name*" margin="dense" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Receiver Phone No*" margin="dense" />
              </Grid>
            </Grid>
            <TextField fullWidth label="Description" margin="dense" />
            <TextField fullWidth label="Vehicle Number" margin="dense" />
          </Paper>
        </Grid>
      </Grid>

      <div className="mt-4">
        <Typography variant="subtitle1">Selected Products:</Typography>
        <Button variant="contained" color="inherit" className="mt-2">
          Select Product
        </Button>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </div>
  );
};

export default GrmAddPageLayoutOpe;
