import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const stats = [
  { label: 'Total Employees', value: 42 },
  { label: 'Applications Filled', value: 128 },
  { label: 'Pending Applications', value: 7 },
];

const DashboardOverview = () => (
  <Grid container spacing={3} sx={{ mb: 3 }}>
    {stats.map((stat) => (
      <Grid item xs={12} sm={4} key={stat.label}>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">{stat.label}</Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>{stat.value}</Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

export default DashboardOverview;