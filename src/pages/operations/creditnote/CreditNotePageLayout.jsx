import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';

const CreditNotePageLayout = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="p-6">
      <Grid container spacing={4}>
        {/* Basic Information */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4 shadow-md rounded-lg">
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>

            <Typography variant="body2" gutterBottom>
              Upload Product Image
            </Typography>
            <div className="flex items-center gap-2 mb-2">
              <IconButton color="primary" component="label">
                <UploadIcon />
                <input hidden accept="image/png, image/jpeg" type="file" />
              </IconButton>
              <Button variant="contained" component="label">
                Upload Image
                <input hidden accept="image/png, image/jpeg" type="file" />
              </Button>
            </div>
            <Typography variant="caption" color="textSecondary">
              Supported formats: JPG, PNG (max size: 2MB)
            </Typography>

            <TextField fullWidth label="Product ID" placeholder="Enter Product ID" margin="dense" />
            <TextField fullWidth label="Product Name" placeholder="Enter Product Name" margin="dense" />
          </Paper>
        </Grid>

        {/* Additional Details */}
        <Grid item xs={12} md={4}>
          <Paper className="p-4 shadow-md rounded-lg">
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label="Type" placeholder="Enter Type" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Priority" placeholder="Enter Priority" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Order No" placeholder="Enter Order No" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Client ID" placeholder="Enter Client ID" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Service Staff" placeholder="Enter Service Staff" />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date & Time"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date & Time"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Task Duration" placeholder="Enter Task Duration" />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Control */}
        <Grid item xs={12} md={2}>
          <Paper className="p-4 shadow-md rounded-lg h-full">
            <Typography variant="h6" gutterBottom>
              Control:
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={active} onChange={() => setActive(!active)} />}
              label="Active Status"
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Buttons */}
      <div className="flex justify-end mt-6 gap-4">
        <Button variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button variant="contained" color="primary">
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreditNotePageLayout;
