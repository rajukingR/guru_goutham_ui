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
  Paper
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

  const stats = [
    { title: "Client Request", value30: 5, value90: 24, color: "#E57373", icon: "📋" },
    { title: "Hiring Engineer", value30: 2, value90: 8, color: "#9575CD", icon: "👨‍💻" },
    { title: "Placement", value30: 0, value90: 2, color: "#4DB6AC", icon: "✅" },
    { title: "Return to Bench", value30: 0, value90: 4, color: "#FF8A65", icon: "🔄" },
  ];

  const doughnutData = {
    labels: ["SOC Integ", "RTL", "Design Quality", "DFT", "Integ", "ATPG", "SCAN", "Power Mgmt", "Design Emulation", "Core Data Path"],
    datasets: [
      {
        data: [20, 30, 15, 25, 10, 18, 22, 12, 28, 14],
        backgroundColor: [
          "#E57373", "#9575CD", "#F06292", "#FF8A65", 
          "#64B5F6", "#4DB6AC", "#FFB74D", "#AED581", 
          "#7986CB", "#BA68C8"
        ],
        borderWidth: 0,
      },
    ],
  };
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Placement",
        data: [200, 250, 220, 280, 300, 320, 340, 360, 380, 400, 420, 440],
        borderColor: "#ff4d4d",
        backgroundColor: "rgba(255, 77, 77, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#ff4d4d",
        pointBorderWidth: 2,
      },
      {
        label: "Hiring",
        data: [0, 50, 100, 200, 300, 400, 500, 600, 700],
        borderColor: "#625ac4",
        backgroundColor: "rgba(98, 90, 196, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#625ac4",
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

  // Table data for High Paying Clients
  const highPayingClients = [
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', totalCost: '150K' },
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', totalCost: '150K' },
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', totalCost: '150K' },
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', totalCost: '150K' },
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', totalCost: '150K' },
  ];

  // Table data for Pending Payments
  const pendingPayments = [
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', balanceCost: '150 K' },
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', balanceCost: '150 K' },
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', balanceCost: '150 K' },
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', balanceCost: '150 K' },
    { customerCode: '1620', name: 'Anand', companyName: 'Anand Technologies Pvt Ltd', balanceCost: '150 K' },
  ];

  return (
    <Box sx={{ 
      padding: 3, 
      backgroundColor: "#F4F1FA", 
      minHeight: "100vh"
    }}>
      <Typography variant="h6" fontWeight="bold" mb={3} color="#000">
        Dashboard 
      </Typography>
      
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
        {/* Left Column - Doughnut Chart and High Paying Clients */}
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
                    Bench Status
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
                    High Paying Clients
                  </Typography>
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Table size="small" aria-label="high paying clients table">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                          <TableCell>Customer Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Company Name</TableCell>
                          <TableCell align="right">Total Cost</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {highPayingClients.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.customerCode}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.companyName}</TableCell>
                            <TableCell align="right">{row.totalCost}</TableCell>
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

        {/* Right Column - Line Chart and Pending Payments */}
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
                    Yearly Overview
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
                    Pending Payments
                  </Typography>
                  <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Table size="small" aria-label="pending payments table">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                          <TableCell>Customer Code</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Company Name</TableCell>
                          <TableCell align="right">Balance Cost</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingPayments.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.customerCode}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.companyName}</TableCell>
                            <TableCell align="right">{row.balanceCost}</TableCell>
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