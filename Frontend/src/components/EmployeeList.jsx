import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const employees = [
  { name: 'John Doe', email: 'john@example.com', applications: 5 },
  { name: 'Jane Smith', email: 'jane@example.com', applications: 3 },
  // Add more sample data or fetch from API
];

const EmployeeList = () => (
  <Paper elevation={2} sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Employees</Typography>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Applications Filled</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.email}>
              <TableCell>{emp.name}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.applications}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

export default EmployeeList;