import React, { useEffect, useState } from "react";
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale,
  Filler
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale,
  Filler
);

const DashBoard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [token] = useState(localStorage.getItem("token") || null);

  // Updated stats for laptop rental/sale
  const stats = [
    { title: "Active Rentals", value30: 12, value90: 45, color: "#4DB6AC", icon: "💻" },
    { title: "Laptops Sold", value30: 8, value90: 32, color: "#9575CD", icon: "💰" },
    { title: "Available Stock", value30: 25, value90: 89, color: "#64B5F6", icon: "📦" },
    { title: "Overdue Rentals", value30: 3, value90: 11, color: "#E57373", icon: "⚠️" },
  ];

  const doughnutData = {
    labels: ["Gaming", "Business", "Ultrabooks", "Budget", "Workstations", "Chromebooks"],
    datasets: [
      {
        data: [15, 25, 18, 22, 12, 8],
        backgroundColor: [
          "#FF8A65", "#7986CB", "#4DB6AC", "#F06292", 
          "#FFB74D", "#BA68C8"
        ],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Rentals",
        data: [120, 150, 180, 210, 240, 270, 300, 280, 250, 230, 200, 180],
        borderColor: "#625ac4",
        backgroundColor: "rgba(98, 90, 196, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#625ac4",
        pointBorderWidth: 2,
      },
      {
        label: "Sales",
        data: [80, 90, 100, 110, 120, 130, 140, 150, 140, 130, 120, 110],
        borderColor: "#ff4d4d",
        backgroundColor: "rgba(255, 77, 77, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#ff4d4d",
        pointBorderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'right',
        labels: {
          boxWidth: 12,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 12,
        usePointStyle: true,
      }
    },
    elements: {
      arc: {
        borderWidth: 0,
      }
    }
  };

  const lineOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: '#F4F1FA'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Table data for Recent Rentals
  const recentRentals = [
    { id: 'R1001', customer: 'John Doe', model: 'Dell XPS 15', startDate: '2023-06-01', endDate: '2023-07-01', status: 'Active' },
    { id: 'R1002', customer: 'Jane Smith', model: 'MacBook Pro M2', startDate: '2023-06-05', endDate: '2023-07-05', status: 'Active' },
    { id: 'R1003', customer: 'Mike Johnson', model: 'HP Spectre x360', startDate: '2023-05-20', endDate: '2023-06-20', status: 'Completed' },
    { id: 'R1004', customer: 'Sarah Williams', model: 'Lenovo ThinkPad X1', startDate: '2023-06-10', endDate: '2023-07-10', status: 'Active' },
    { id: 'R1005', customer: 'David Brown', model: 'Asus ROG Zephyrus', startDate: '2023-05-15', endDate: '2023-06-15', status: 'Overdue' },
  ];

  // Table data for Recent Sales
  const recentSales = [
    { id: 'S2001', customer: 'Alex Green', model: 'MacBook Air M1', date: '2023-06-12', price: '$999', status: 'Completed' },
    { id: 'S2002', customer: 'Emily White', model: 'Surface Laptop 4', date: '2023-06-08', price: '$1,299', status: 'Completed' },
    { id: 'S2003', customer: 'Robert Black', model: 'Acer Swift 3', date: '2023-06-05', price: '$699', status: 'Completed' },
    { id: 'S2004', customer: 'Lisa Gray', model: 'LG Gram 17', date: '2023-05-28', price: '$1,599', status: 'Completed' },
    { id: 'S2005', customer: 'Thomas Blue', model: 'Razer Blade 15', date: '2023-05-22', price: '$2,199', status: 'Completed' },
  ];

  return (
    <Box sx={{ 
      padding: 3, 
      backgroundColor: "#F4F1FA", 
      minHeight: "100vh"
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold" color="#000">
          Laptop Rental & Sales Dashboard
        </Typography>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Add New Laptop
          </Button>
          <Button variant="outlined" color="primary">
            Process Rental
          </Button>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              backgroundColor: "white", 
              color: "text.primary",
              height: "100%",
              boxShadow: theme.shadows[1],
              borderRadius: 2,
              transition: 'transform 0.3s',
              borderTop: `4px solid ${stat.color}`,
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[2]
              }
            }}>
              <CardContent sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" mb={1.5}>
                  <Typography 
                    variant="h4" 
                    mr={1}
                    sx={{ color: stat.color }}
                  >
                    {stat.icon}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="600">
                    {stat.title}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" gap={1}>
                  {/* 30 Days Box */}
                  <Box 
                    sx={{ 
                      flex: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      p: 1,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      30 Days
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {stat.value30}
                    </Typography>
                  </Box>
                  
                  {/* 90 Days Box */}
                  <Box 
                    sx={{ 
                      flex: 1,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      p: 1,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      90 Days
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {stat.value90}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts and Tables Section */}
      <Grid container spacing={3} mt={3}>
        {/* Left Column - Doughnut Chart and Recent Rentals */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: theme.shadows[2],
                borderRadius: 2,
                backgroundColor: "white"
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" mb={2} color="text.secondary">
                    Laptop Categories
                  </Typography>
                  <Box sx={{ height: isMobile ? '300px' : '350px' }}>
                    <Doughnut 
                      data={doughnutData} 
                      options={chartOptions} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item>
              <Card sx={{ 
                boxShadow: theme.shadows[2],
                borderRadius: 2,
                backgroundColor: "white"
              }}>
                <CardContent>
                  <Typography variant="h6" mb={2} color="text.secondary">
                    Recent Rentals
                  </Typography>
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Table size="small" aria-label="recent rentals table">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                          <TableCell>Rental ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Model</TableCell>
                          <TableCell>Start Date</TableCell>
                          <TableCell>End Date</TableCell>
                          <TableCell align="right">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentRentals.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.customer}</TableCell>
                            <TableCell>{row.model}</TableCell>
                            <TableCell>{row.startDate}</TableCell>
                            <TableCell>{row.endDate}</TableCell>
                            <TableCell align="right">
                              <Typography 
                                variant="body2" 
                                sx={{
                                  color: row.status === 'Overdue' ? 'error.main' : 
                                        row.status === 'Active' ? 'success.main' : 'text.secondary',
                                  fontWeight: 'bold'
                                }}
                              >
                                {row.status}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Line Chart and Recent Sales */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3} direction="column">
            <Grid item>
              <Card sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: theme.shadows[2],
                borderRadius: 2,
                backgroundColor: "white"
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" mb={2} color="text.secondary">
                    Rental & Sales Trends
                  </Typography>
                  <Box sx={{ height: isMobile ? '300px' : '350px' }}>
                    <Line 
                      data={lineData} 
                      options={lineOptions} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item>
              <Card sx={{ 
                boxShadow: theme.shadows[2],
                borderRadius: 2,
                backgroundColor: "white"
              }}>
                <CardContent>
                  <Typography variant="h6" mb={2} color="text.secondary">
                    Recent Sales
                  </Typography>
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Table size="small" aria-label="recent sales table">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                          <TableCell>Sale ID</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Model</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentSales.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.customer}</TableCell>
                            <TableCell>{row.model}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">
                              <Typography 
                                variant="body2" 
                                color="success.main"
                                fontWeight="bold"
                              >
                                {row.status}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashBoard;