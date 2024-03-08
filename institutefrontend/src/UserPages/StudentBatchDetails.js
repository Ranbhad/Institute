import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Tab } from '@mui/material';
import { TabList, TabContext } from '@mui/lab';

const StudentBatchDetails = ({ open, batchDetails, updatedStudents, onClose, onDelete, onfetch }) => {
  const [activeCourses, setActiveCourses] = useState([]);
  const [inactiveCourses, setInactiveCourses] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');

  useEffect(() => {
    if (batchDetails && batchDetails.length > 0) {
      const currentDate = new Date();
      const active = batchDetails.filter(batch => new Date(batch.endDate) >= currentDate);
      const inactive = batchDetails.filter(batch => new Date(batch.endDate) < currentDate);

      setActiveCourses(active);
      setInactiveCourses(inactive);
    }
  }, [batchDetails]);

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      onDelete(studentId);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
      <DialogTitle>{`Batch Details`}</DialogTitle>
      <DialogContent>
        <TabContext value={selectedTab}>
          <TabList onChange={(event, newValue) => setSelectedTab(newValue)}>
          <Tab label="Active" value="active" style={{ color: 'green' }} />
            <Tab label="Inactive" value="inactive" style={{ color: 'red' }} />
          </TabList>
          {selectedTab === 'active' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow >
                    <TableCell>BatchId</TableCell>
                    <TableCell>StudentID</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Registered Students</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeCourses.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell>{batch.id}</TableCell>
                      <TableCell>{batch.studentId}</TableCell>
                      <TableCell>{batch.courseName}</TableCell>
                      <TableCell>{batch.name}</TableCell>
                      <TableCell>
                        {new Date(batch.registrationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant='contained' onClick={() => handleDeleteStudent(batch.id)} color='inherit'>
                          WITHDRAW
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {selectedTab === 'inactive' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow >
                    <TableCell>BatchId</TableCell>
                    <TableCell>StudentID</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Registered Students</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inactiveCourses.map((batch) => (
                    <TableRow key={batch.id} >
                      <TableCell>{batch.id}</TableCell>
                      <TableCell>{batch.studentId}</TableCell>
                      <TableCell>{batch.courseName}</TableCell>
                      <TableCell>{batch.name}</TableCell>
                      <TableCell>
                        {new Date(batch.registrationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant='contained' onClick={() => handleDeleteStudent(batch.id)} color='inherit'>
                          WITHDRAW
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentBatchDetails;
