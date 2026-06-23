import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Card,
  CardContent,
  Divider,
  Stack,
  useTheme,
  Avatar,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  LinearProgress,
  Fade,
  Badge,
} from '@mui/material';
import {
  Download,
  Email,
  PictureAsPdf,
  FileCopy,
  Print,
  FilterList,
  Search,
  Refresh,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  Assignment,
  MoreVert,
  Visibility,
  Edit,
  DeleteOutline,
  CheckCircle,
  Cancel,
  Pending,
  DateRange,
  BarChart,
  PieChart as PieChartIcon,
  Percent,
  Store,
  LocationOn,
  Category,
  CompareArrows,
  ArrowUpward,
  ArrowDownward,
  Computer,
  Laptop,
  DesktopWindows,
  Memory,
  Storage,
  Speed,
  ShoppingCart,
  Inventory,
  Receipt,
  LocalShipping,
  Checkroom,
  Build,
  Monitor,
  Keyboard,
  Mouse,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

// ========== MOCK DATA ==========
const mockData = {
  // Rental & Sales Summary
  summary: {
    totalRevenue: 4250000,
    totalRentals: 1850,
    totalSales: 920,
    activeRentals: 245,
    pendingRentals: 38,
    returnedItems: 1567,
    totalCustomers: 2150,
    conversionRate: 28.4,
    growth: 15.7,
    targetAchieved: 96,
  },

  // Product Categories (Rental & Sales)
  productCategories: [
    { name: 'Laptops', rentalUnits: 520, salesUnits: 280, revenue: 1250000, growth: 18.5 },
    { name: 'Desktops', rentalUnits: 380, salesUnits: 210, revenue: 980000, growth: 12.3 },
    { name: 'Assembled PCs', rentalUnits: 290, salesUnits: 180, revenue: 760000, growth: 22.1 },
    { name: 'Accessories', rentalUnits: 410, salesUnits: 150, revenue: 580000, growth: 8.7 },
    { name: 'Servers', rentalUnits: 150, salesUnits: 60, revenue: 420000, growth: 5.2 },
    { name: 'Monitors', rentalUnits: 100, salesUnits: 40, revenue: 260000, growth: 14.8 },
  ],

  // Monthly Performance
  monthlyTrend: [
    { month: 'Jan', rentalRevenue: 140000, salesRevenue: 90000, totalTarget: 250000 },
    { month: 'Feb', rentalRevenue: 155000, salesRevenue: 95000, totalTarget: 260000 },
    { month: 'Mar', rentalRevenue: 170000, salesRevenue: 100000, totalTarget: 280000 },
    { month: 'Apr', rentalRevenue: 180000, salesRevenue: 110000, totalTarget: 290000 },
    { month: 'May', rentalRevenue: 195000, salesRevenue: 115000, totalTarget: 310000 },
    { month: 'Jun', rentalRevenue: 210000, salesRevenue: 125000, totalTarget: 330000 },
    { month: 'Jul', rentalRevenue: 200000, salesRevenue: 120000, totalTarget: 320000 },
    { month: 'Aug', rentalRevenue: 215000, salesRevenue: 130000, totalTarget: 340000 },
    { month: 'Sep', rentalRevenue: 230000, salesRevenue: 140000, totalTarget: 360000 },
    { month: 'Oct', rentalRevenue: 240000, salesRevenue: 150000, totalTarget: 380000 },
    { month: 'Nov', rentalRevenue: 250000, salesRevenue: 160000, totalTarget: 400000 },
    { month: 'Dec', rentalRevenue: 230000, salesRevenue: 145000, totalTarget: 380000 },
  ],

  // Top Products (Rental & Sales)
  topProducts: [
    { name: 'Dell XPS 15', type: 'Laptop', rentals: 85, sales: 42, revenue: 420000, growth: 15.2 },
    { name: 'HP EliteBook', type: 'Laptop', rentals: 72, sales: 38, revenue: 380000, growth: 10.8 },
    { name: 'Custom Gaming PC', type: 'Assembled', rentals: 58, sales: 45, revenue: 360000, growth: 22.5 },
    { name: 'Lenovo ThinkPad', type: 'Laptop', rentals: 65, sales: 30, revenue: 340000, growth: 8.3 },
    { name: 'Apple MacBook Pro', type: 'Laptop', rentals: 55, sales: 28, revenue: 320000, growth: 18.9 },
    { name: 'Workstation PC', type: 'Desktop', rentals: 48, sales: 25, revenue: 290000, growth: 12.1 },
    { name: 'Asus ROG Desktop', type: 'Desktop', rentals: 42, sales: 22, revenue: 260000, growth: 6.7 },
    { name: 'Dell PowerEdge Server', type: 'Server', rentals: 35, sales: 15, revenue: 240000, growth: 4.2 },
  ],

  // Employees Performance
  employees: [
    { id: 1, name: 'Aarav Sharma', role: 'Sales Manager', department: 'Sales', rentals: 145, sales: 82, revenue: 1120000, performance: 94, region: 'Mumbai', targetAchieved: 108 },
    { id: 2, name: 'Priya Patel', role: 'Rental Specialist', department: 'Rentals', rentals: 210, sales: 15, revenue: 680000, performance: 88, region: 'Mumbai', targetAchieved: 95 },
    { id: 3, name: 'Rahul Verma', role: 'Sales Executive', department: 'Sales', rentals: 98, sales: 65, revenue: 890000, performance: 76, region: 'Delhi', targetAchieved: 82 },
    { id: 4, name: 'Sneha Reddy', role: 'Rental Specialist', department: 'Rentals', rentals: 185, sales: 20, revenue: 520000, performance: 91, region: 'Hyderabad', targetAchieved: 105 },
    { id: 5, name: 'Vikram Singh', role: 'Regional Head', department: 'Management', rentals: 120, sales: 50, revenue: 650000, performance: 97, region: 'Mumbai', targetAchieved: 128 },
    { id: 6, name: 'Ananya Iyer', role: 'Sales Executive', department: 'Sales', rentals: 75, sales: 45, revenue: 560000, performance: 72, region: 'Chennai', targetAchieved: 68 },
    { id: 7, name: 'Karan Joshi', role: 'Rental Specialist', department: 'Rentals', rentals: 155, sales: 10, revenue: 430000, performance: 65, region: 'Delhi', targetAchieved: 58 },
    { id: 8, name: 'Meera Nair', role: 'Sales Executive', department: 'Sales', rentals: 85, sales: 52, revenue: 780000, performance: 81, region: 'Hyderabad', targetAchieved: 90 },
  ],

  // Recent Transactions
  recentTransactions: [
    { id: 'T-001', customer: 'TechCorp Ltd', product: 'Dell XPS 15', type: 'Rental', amount: 450, duration: '7 days', date: '2026-06-16', status: 'Active', rep: 'Priya Patel' },
    { id: 'T-002', customer: 'DataSolutions Inc', product: 'Dell PowerEdge Server', type: 'Sale', amount: 12000, duration: '-', date: '2026-06-16', status: 'Completed', rep: 'Aarav Sharma' },
    { id: 'T-003', customer: 'Creative Studios', product: 'Custom Gaming PC', type: 'Rental', amount: 350, duration: '5 days', date: '2026-06-15', status: 'Active', rep: 'Sneha Reddy' },
    { id: 'T-004', customer: 'FinTech Solutions', product: 'HP EliteBook', type: 'Sale', amount: 2400, duration: '-', date: '2026-06-15', status: 'Completed', rep: 'Rahul Verma' },
    { id: 'T-005', customer: 'EduTech Pvt Ltd', product: 'Lenovo ThinkPad', type: 'Rental', amount: 380, duration: '14 days', date: '2026-06-14', status: 'Pending', rep: 'Karan Joshi' },
    { id: 'T-006', customer: 'HealthCare Plus', product: 'Apple MacBook Pro', type: 'Sale', amount: 3200, duration: '-', date: '2026-06-14', status: 'Completed', rep: 'Meera Nair' },
    { id: 'T-007', customer: 'RetailChain Ltd', product: 'Workstation PC', type: 'Rental', amount: 280, duration: '10 days', date: '2026-06-13', status: 'Active', rep: 'Ananya Iyer' },
    { id: 'T-008', customer: 'MediaHouse Corp', product: 'Custom Gaming PC', type: 'Sale', amount: 2800, duration: '-', date: '2026-06-13', status: 'Completed', rep: 'Vikram Singh' },
    { id: 'T-009', customer: 'LogisticsPro', product: 'Asus ROG Desktop', type: 'Rental', amount: 320, duration: '6 days', date: '2026-06-12', status: 'Active', rep: 'Priya Patel' },
    { id: 'T-010', customer: 'SmartHome Solutions', product: 'Dell XPS 15', type: 'Sale', amount: 2200, duration: '-', date: '2026-06-12', status: 'Pending', rep: 'Aarav Sharma' },
  ],

  // Regional Performance
  regionalPerformance: [
    { region: 'Mumbai', rentals: 520, sales: 280, revenue: 1450000, growth: 15.3 },
    { region: 'Delhi', rentals: 450, sales: 220, revenue: 1120000, growth: 10.8 },
    { region: 'Hyderabad', rentals: 380, sales: 180, revenue: 980000, growth: 22.4 },
    { region: 'Chennai', rentals: 310, sales: 140, revenue: 780000, growth: 4.2 },
    { region: 'Bangalore', rentals: 190, sales: 100, revenue: 520000, growth: 18.7 },
  ],

  // Inventory Status
  inventoryStatus: [
    { product: 'Dell XPS 15', available: 45, rented: 85, inService: 12, total: 142 },
    { product: 'HP EliteBook', available: 38, rented: 72, inService: 8, total: 118 },
    { product: 'Custom Gaming PC', available: 32, rented: 58, inService: 6, total: 96 },
    { product: 'Lenovo ThinkPad', available: 40, rented: 65, inService: 10, total: 115 },
    { product: 'Apple MacBook Pro', available: 28, rented: 55, inService: 5, total: 88 },
    { product: 'Workstation PC', available: 25, rented: 48, inService: 4, total: 77 },
  ],
};

// ========== CHART COLORS ==========
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B', '#4ECDC4', '#45B7D1'];

// ========== MAIN COMPONENT ==========
const UnifiedRentalSalesDashboard = () => {
  const theme = useTheme();
  const tableRef = useRef(null);

  // ===== STATE =====
  const [data] = useState(mockData);
  const [filteredTransactions, setFilteredTransactions] = useState(mockData.recentTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [repFilter, setRepFilter] = useState('All');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('overview');

  // ===== DERIVED DATA =====
  const types = ['All', ...new Set(data.recentTransactions.map(t => t.type))];
  const statuses = ['All', ...new Set(data.recentTransactions.map(t => t.status))];
  const reps = ['All', ...new Set(data.recentTransactions.map(t => t.rep))];

  const totalRevenue = data.summary.totalRevenue;
  const totalRentals = data.summary.totalRentals;
  const totalSales = data.summary.totalSales;
  const conversionRate = data.summary.conversionRate;
  const growth = data.summary.growth;

  // ===== FILTER FUNCTION =====
  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = data.recentTransactions;

      if (searchTerm) {
        filtered = filtered.filter(
          t =>
            t.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.rep.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (typeFilter !== 'All') {
        filtered = filtered.filter(t => t.type === typeFilter);
      }

      if (statusFilter !== 'All') {
        filtered = filtered.filter(t => t.status === statusFilter);
      }

      if (repFilter !== 'All') {
        filtered = filtered.filter(t => t.rep === repFilter);
      }

      if (startDate && endDate) {
        filtered = filtered.filter(t => {
          const transDate = new Date(t.date);
          return transDate >= startDate && transDate <= endDate;
        });
      }

      filtered.sort((a, b) => {
        let valA = a[sortBy] || 0;
        let valB = b[sortBy] || 0;
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (sortOrder === 'asc') return valA > valB ? 1 : -1;
        return valA < valB ? 1 : -1;
      });

      setFilteredTransactions(filtered);
      setLoading(false);
    }, 300);
  };

  // ===== RESET FILTERS =====
  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('All');
    setStatusFilter('All');
    setRepFilter('All');
    setStartDate(null);
    setEndDate(null);
    setSortBy('date');
    setSortOrder('desc');
    setFilteredTransactions(data.recentTransactions);
  };

  // ===== EXPORT FUNCTIONS =====
  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Customer', 'Product', 'Type', 'Amount', 'Date', 'Status', 'Rep'];
    const rows = filteredTransactions.map(t => [
      t.id, t.customer, t.product, t.type, `$${t.amount}`, t.date, t.status, t.rep
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rental_Sales_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showSnackbar('CSV exported successfully!', 'success');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    doc.setFontSize(18);
    doc.text('Rental & Sales Performance Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 14, 36);
    doc.text(`Total Rentals: ${totalRentals} | Total Sales: ${totalSales}`, 14, 42);

    const tableData = filteredTransactions.map(t => [
      t.id, t.customer, t.product, t.type, `$${t.amount}`, t.date, t.status, t.rep
    ]);

    doc.autoTable({
      head: [['ID', 'Customer', 'Product', 'Type', 'Amount', 'Date', 'Status', 'Rep']],
      body: tableData,
      startY: 48,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`Rental_Sales_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    showSnackbar('PDF exported successfully!', 'success');
  };

  const exportToExcel = () => {
    const dataToExport = filteredTransactions.map(t => ({
      'Transaction ID': t.id,
      Customer: t.customer,
      Product: t.product,
      Type: t.type,
      Amount: t.amount,
      Duration: t.duration || '-',
      Date: t.date,
      Status: t.status,
      'Sales Rep': t.rep,
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, `Rental_Sales_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showSnackbar('Excel exported successfully!', 'success');
  };

  const emailReport = () => {
    const mailtoLink = `mailto:?subject=Rental & Sales Report - ${new Date().toISOString().slice(0, 10)}&body=Please find attached the rental and sales report. Total revenue: $${totalRevenue.toLocaleString()}`;
    window.location.href = mailtoLink;
    showSnackbar('Email client opened!', 'info');
  };

  const printReport = () => {
    window.print();
  };

  // ===== SNACKBAR =====
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ===== STATUS CHIP =====
  const getStatusChip = (status) => {
    const configs = {
      Active: { color: 'success', icon: <CheckCircle fontSize="small" /> },
      Completed: { color: 'info', icon: <CheckCircle fontSize="small" /> },
      Pending: { color: 'warning', icon: <Pending fontSize="small" /> },
      Returned: { color: 'default', icon: <LocalShipping fontSize="small" /> },
    };
    const config = configs[status] || configs.Pending;
    return <Chip label={status} color={config.color} size="small" icon={config.icon} />;
  };

  // ===== TYPE ICON =====
  const getTypeIcon = (type) => {
    if (type === 'Rental') return <Checkroom fontSize="small" />;
    if (type === 'Sale') return <ShoppingCart fontSize="small" />;
    return <Receipt fontSize="small" />;
  };

  // ===== ACTION MENU =====
  const handleMenuOpen = (event, transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
  };

  // ===== RENDER =====
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
        {/* ===== HEADER ===== */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2, background: 'linear-gradient(135deg, #1a2332 0%, #2c3e50 100%)' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="700" sx={{ color: '#ffffff' }}>
                💻 Rental & Sales Performance Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                Comprehensive analytics for laptops, desktops, and assembled PCs
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                icon={<AttachMoney sx={{ color: '#fff' }} />}
                label={`$${(totalRevenue / 1000000).toFixed(1)}M Revenue`}
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', '& .MuiChip-label': { color: '#fff' } }}
              />
              <Chip
                icon={<TrendingUp sx={{ color: '#4CAF50' }} />}
                label={`${growth}% Growth`}
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#4CAF50' }}
              />
              <Chip
                icon={<Percent sx={{ color: '#FFBB28' }} />}
                label={`${conversionRate}% Conversion`}
                sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#FFBB28' }}
              />
            </Stack>
          </Stack>
        </Paper>

        {/* ===== FILTERS ===== */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
              <Typography variant="h6" fontWeight="600" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterList fontSize="small" /> Filters
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button size="small" variant="outlined" onClick={resetFilters} color="secondary">
                  Reset
                </Button>
                <Button size="small" variant="contained" onClick={applyFilters} startIcon={<Search />}>
                  Apply Filters
                </Button>
              </Stack>
            </Stack>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by customer, product, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{ startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
                    {types.map(s => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                    {statuses.map(s => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Rep</InputLabel>
                  <Select value={repFilter} onChange={(e) => setRepFilter(e.target.value)} label="Rep">
                    {reps.map(r => (
                      <MenuItem key={r} value={r}>{r}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3} md={1.5}>
                <DatePicker
                  label="From"
                  value={startDate}
                  onChange={setStartDate}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={6} sm={3} md={1.5}>
                <DatePicker
                  label="To"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              </Grid>
            </Grid>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography variant="body2" color="text.secondary">Sort by:</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="rep">Rep</MenuItem>
                  </Select>
                </FormControl>
                <IconButton size="small" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                  {sortOrder === 'desc' ? <ArrowDownward fontSize="small" /> : <ArrowUpward fontSize="small" />}
                </IconButton>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredTransactions.length} of {data.recentTransactions.length} transactions
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* ===== STATS CARDS ===== */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                    <Typography variant="h4" fontWeight="700">${(totalRevenue / 1000000).toFixed(1)}M</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>
                    <AttachMoney sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  ↑ {growth}% from last period
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Rentals</Typography>
                    <Typography variant="h4" fontWeight="700">{totalRentals}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#2e7d32', width: 48, height: 48 }}>
                    <Checkroom sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {data.summary.activeRentals} active · {data.summary.returnedItems} returned
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: '#fff3e0' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Sales</Typography>
                    <Typography variant="h4" fontWeight="700">{totalSales}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#ed6c02', width: 48, height: 48 }}>
                    <ShoppingCart sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {data.summary.totalCustomers} total customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: 2, bgcolor: '#fce4ec' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">Target Achievement</Typography>
                    <Typography variant="h4" fontWeight="700">{data.summary.targetAchieved}%</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: '#c62828', width: 48, height: 48 }}>
                    <CompareArrows sx={{ fontSize: 28 }} />
                  </Avatar>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {data.summary.pendingRentals} pending rentals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ===== TABS ===== */}
        <Paper sx={{ mb: 3, borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
          <Tabs
            value={viewMode}
            onChange={(e, v) => setViewMode(v)}
            sx={{ bgcolor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}
          >
            <Tab value="overview" label="Overview" icon={<BarChart />} iconPosition="start" />
            <Tab value="transactions" label="Transactions" icon={<Receipt />} iconPosition="start" />
            <Tab value="employees" label="Employees" icon={<People />} iconPosition="start" />
            <Tab value="inventory" label="Inventory" icon={<Inventory />} iconPosition="start" />
          </Tabs>
        </Paper>

        {/* ===== TAB 1: OVERVIEW ===== */}
        {viewMode === 'overview' && (
          <Fade in={viewMode === 'overview'}>
            <Box>
              {/* Monthly Trend */}
              <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Monthly Revenue Trends (Rental vs Sales)
                </Typography>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={data.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="rentalRevenue" fill="#1976d2" name="Rental Revenue" />
                    <Bar dataKey="salesRevenue" fill="#4CAF50" name="Sales Revenue" />
                    <Line type="monotone" dataKey="totalTarget" stroke="#FF8042" name="Target" strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </Paper>

              {/* Product Categories & Regional */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, height: 300 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Product Category Performance
                    </Typography>
                    <ResponsiveContainer width="100%" height="90%">
                      <RechartsBar data={data.productCategories}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="rentalUnits" fill="#1976d2" name="Rentals" />
                        <Bar dataKey="salesUnits" fill="#4CAF50" name="Sales" />
                      </RechartsBar>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2, height: 300 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Regional Performance
                    </Typography>
                    <ResponsiveContainer width="100%" height="90%">
                      <RechartsBar data={data.regionalPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="rentals" fill="#1976d2" name="Rentals" />
                        <Bar dataKey="sales" fill="#4CAF50" name="Sales" />
                        <Bar dataKey="revenue" fill="#FFBB28" name="Revenue ($)" />
                      </RechartsBar>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>

              {/* Top Products */}
              <Paper sx={{ p: 2, mt: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  🏆 Top Performing Products
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="center">Rentals</TableCell>
                        <TableCell align="center">Sales</TableCell>
                        <TableCell align="right">Revenue</TableCell>
                        <TableCell align="right">Growth</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.topProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: COLORS[index % COLORS.length] }}>
                                {product.type === 'Laptop' ? <Laptop fontSize="small" /> :
                                 product.type === 'Desktop' ? <DesktopWindows fontSize="small" /> :
                                 product.type === 'Assembled' ? <Memory fontSize="small" /> :
                                 <Storage fontSize="small" />}
                              </Avatar>
                              <Typography variant="body2" fontWeight="500">{product.name}</Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip label={product.type} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell align="center">{product.rentals}</TableCell>
                          <TableCell align="center">{product.sales}</TableCell>
                          <TableCell align="right">${(product.revenue / 1000).toFixed(0)}K</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${product.growth > 0 ? '+' : ''}${product.growth}%`}
                              color={product.growth > 0 ? 'success' : 'error'}
                              size="small"
                              icon={product.growth > 0 ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Fade>
        )}

        {/* ===== TAB 2: TRANSACTIONS ===== */}
        {viewMode === 'transactions' && (
          <Fade in={viewMode === 'transactions'}>
            <Paper sx={{ borderRadius: 3, boxShadow: 2, overflow: 'hidden' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, bgcolor: '#fafafa', borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" fontWeight="600">
                  📋 Transaction Details
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Tooltip title="CSV">
                    <Button size="small" variant="outlined" startIcon={<FileCopy />} onClick={exportToCSV}>CSV</Button>
                  </Tooltip>
                  <Tooltip title="PDF">
                    <Button size="small" variant="outlined" startIcon={<PictureAsPdf />} onClick={exportToPDF}>PDF</Button>
                  </Tooltip>
                  <Tooltip title="Excel">
                    <Button size="small" variant="outlined" startIcon={<Download />} onClick={exportToExcel}>Excel</Button>
                  </Tooltip>
                  <Tooltip title="Email">
                    <Button size="small" variant="outlined" startIcon={<Email />} onClick={emailReport}>Email</Button>
                  </Tooltip>
                  <Tooltip title="Print">
                    <Button size="small" variant="outlined" startIcon={<Print />} onClick={printReport}>Print</Button>
                  </Tooltip>
                </Stack>
              </Stack>

              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Rep</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                          <CircularProgress />
                          <Typography variant="body2" sx={{ mt: 1 }}>Loading...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                          <Typography variant="body1" color="text.secondary">No transactions found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((t) => (
                        <TableRow key={t.id} hover>
                          <TableCell>
                            <Chip label={t.id} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="500">{t.customer}</Typography>
                          </TableCell>
                          <TableCell>{t.product}</TableCell>
                          <TableCell>
                            <Chip
                              label={t.type}
                              size="small"
                              icon={getTypeIcon(t.type)}
                              color={t.type === 'Rental' ? 'primary' : 'success'}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600" color="primary">
                              ${t.amount.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>{t.date}</TableCell>
                          <TableCell>{getStatusChip(t.status)}</TableCell>
                          <TableCell>{t.rep}</TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={(e) => handleMenuOpen(e, t)}>
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Fade>
        )}

        {/* ===== TAB 3: EMPLOYEES ===== */}
        {viewMode === 'employees' && (
          <Fade in={viewMode === 'employees'}>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      👥 Employee Performance
                    </Typography>
                    <ResponsiveContainer width="100%" height={280}>
                      <RechartsBar data={data.employees}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 120]} label={{ value: 'Performance %', angle: 90, position: 'insideRight' }} />
                        <RechartsTooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" fill="#1976d2" name="Revenue" />
                        <Bar yAxisId="left" dataKey="rentals" fill="#4CAF50" name="Rentals" />
                        <Bar yAxisId="left" dataKey="sales" fill="#FFBB28" name="Sales" />
                        <Bar yAxisId="right" dataKey="performance" fill="#FF8042" name="Performance %" />
                      </RechartsBar>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Employee Details
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Employee</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Region</TableCell>
                            <TableCell align="center">Rentals</TableCell>
                            <TableCell align="center">Sales</TableCell>
                            <TableCell align="right">Revenue</TableCell>
                            <TableCell align="center">Performance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.employees.map((emp, index) => (
                            <TableRow key={emp.id}>
                              <TableCell>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.7rem', bgcolor: COLORS[index % COLORS.length] }}>
                                    {emp.name.split(' ').map(n => n[0]).join('')}
                                  </Avatar>
                                  <Typography variant="body2" fontWeight="500">{emp.name}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <Chip label={emp.role} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell>{emp.department}</TableCell>
                              <TableCell>
                                <Chip label={emp.region} size="small" variant="outlined" />
                              </TableCell>
                              <TableCell align="center">{emp.rentals}</TableCell>
                              <TableCell align="center">{emp.sales}</TableCell>
                              <TableCell align="right">${(emp.revenue / 1000).toFixed(0)}K</TableCell>
                              <TableCell align="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={emp.performance}
                                    sx={{ width: 80, height: 8, borderRadius: 4 }}
                                    color={emp.performance >= 90 ? 'success' : emp.performance >= 70 ? 'warning' : 'error'}
                                  />
                                  <Typography variant="body2" fontWeight="600">
                                    {emp.performance}%
                                  </Typography>
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}

        {/* ===== TAB 4: INVENTORY ===== */}
        {viewMode === 'inventory' && (
          <Fade in={viewMode === 'inventory'}>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      📦 Inventory Status
                    </Typography>
                    <ResponsiveContainer width="100%" height={280}>
                      <RechartsBar data={data.inventoryStatus} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="product" width={120} />
                        <RechartsTooltip />
                        <Legend />
                        <Bar dataKey="available" fill="#4CAF50" name="Available" stackId="a" />
                        <Bar dataKey="rented" fill="#1976d2" name="Rented" stackId="a" />
                        <Bar dataKey="inService" fill="#FF8042" name="In Service" stackId="a" />
                      </RechartsBar>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                      Inventory Summary
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="center">Available</TableCell>
                            <TableCell align="center">Rented</TableCell>
                            <TableCell align="center">In Service</TableCell>
                            <TableCell align="center">Total</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.inventoryStatus.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="500">{item.product}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip label={item.available} size="small" color="success" />
                              </TableCell>
                              <TableCell align="center">
                                <Chip label={item.rented} size="small" color="primary" />
                              </TableCell>
                              <TableCell align="center">
                                <Chip label={item.inService} size="small" color="warning" />
                              </TableCell>
                              <TableCell align="center">
                                <Chip label={item.total} size="small" variant="outlined" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>

              {/* Inventory Pie Chart */}
              <Paper sx={{ p: 2, mt: 3, borderRadius: 3, boxShadow: 2 }}>
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                  Inventory Distribution
                </Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={data.inventoryStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="total"
                      label={({ product, percent }) => `${product} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.inventoryStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </RechartsPie>
                </ResponsiveContainer>
              </Paper>
            </Box>
          </Fade>
        )}

        {/* ===== ACTION POPOVER ===== */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <List dense>
            <ListItem button onClick={handleMenuClose}>
              <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
              <ListItemText primary="View Details" />
            </ListItem>
            <ListItem button onClick={handleMenuClose}>
              <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
              <ListItemText primary="Edit Transaction" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon><DeleteOutline fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
              <ListItemText primary="Cancel" />
            </ListItem>
          </List>
        </Popover>

        {/* ===== SNACKBAR ===== */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default UnifiedRentalSalesDashboard;