import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Button } from '@mui/material';

const StudentBatchDetails = ({ open, onClose, selectedStudentCourses,studentDetails, selectedInstallmentType, paidFees, handlePay, handlePaymentDialogClose, setPaidFees, setSelectedInstallmentType }) => {
  const calculateTotalFees = (courses) => {
    const totalFees = courses.reduce((total, course) => total + Number(course.courseFees), 0);
    return totalFees;
  };

  const totalFees = calculateTotalFees(selectedStudentCourses);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Registered Courses</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Course Fees</TableCell>
                <TableCell>Course Batch</TableCell>
                <TableCell>Registration Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedStudentCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.courseFees}</TableCell>
                  <TableCell>{course.batch}</TableCell>
                  <TableCell>{new Date(course.registrationDate).toLocaleDateString()}</TableCell> {/* Display registration date */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TextField label="Total Fees" value={totalFees} disabled size="small" margin="normal" />&nbsp;&nbsp;
        <TextField select label="Installment Type" value={selectedInstallmentType} onChange={(e) => setSelectedInstallmentType(e.target.value)} size="small" margin="normal" disabled={Boolean(selectedInstallmentType)} sx={{ width: '200px' }}>
          <MenuItem value="full">Full Payment</MenuItem>
          <MenuItem value="3months">3 Months Installment</MenuItem>
          <MenuItem value="6months">6 Months Installment</MenuItem>
        </TextField>&nbsp;&nbsp;
        <TextField label="Paying Fees" type="number" value={paidFees} onChange={(e) => setPaidFees(Number(e.target.value))} size="small" margin="normal" />&nbsp;&nbsp;
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          onClick={handlePay}
          style={{
            backgroundColor: "Black",
            color: "white",
            pointerEvents: studentDetails.totalCourseFees === studentDetails.paidFees ? 'none' : 'auto',
            opacity: studentDetails.totalCourseFees === studentDetails.paidFees ? 0.5 : 1,
            cursor: studentDetails.totalCourseFees === studentDetails.paidFees ? 'not-allowed' : 'pointer',
          }}
          disabled={totalFees === paidFees}>
          Pay
        </Button>
        <Button onClick={handlePaymentDialogClose} variant='contained' color='inherit'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentBatchDetails;
