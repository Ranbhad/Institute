import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TableHead, Table, TableBody, TableRow, TableCell, Paper, TableContainer } from '@mui/material';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const AdminDashboard = ({ loggedInUser }) => {
  const [courses, setCourses] = useState([]);
  const [instituteKey, setInstituteKey] = useState('');
  const [adminDetails, setAdminDetails] = useState({});

  useEffect(() => {
    fetchAdminDetails();
    fetchCourses();
  }, [loggedInUser, instituteKey]);

  const fetchCourses = async () => {
    try {
      if (loggedInUser && loggedInUser.email) {
        const response = await axios.get(`http://localhost:8080/api/courses?email=${loggedInUser.email}`);
        setCourses(response.data);
      } else {
        console.error('Error: loggedInUser or email is not available');
      }
    } catch (error) {
      console.error('Error fetching courses:', error.message);
    }
  };

  const fetchAdminDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/admin?email=${loggedInUser.email}`);
      setAdminDetails(response.data);
      setInstituteKey(response.data.instituteKey);
    } catch (error) {
      console.error('Error fetching admin details:', error.message);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:8080/api/courses/${courseId}`);
      console.log('Course deleted successfully', courseId);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error.message);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', overflow: 'hidden' }}>
      <Container style={{ textAlign: 'center', margin: 'auto', marginTop: '50px', padding: '20px', backgroundColor: 'White' }}>
        <Typography variant="h4" component="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <div>
          <Typography align="center" variant="h5" component="h5" gutterBottom>
            Course List
          </Typography>
          <TableContainer component={Paper} >
            <Table>
              <TableHead >
                <TableRow>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Course Fees</TableCell>
                  <TableCell>Course Duration</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Strength Of Students</TableCell>
                  {/* <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.fees}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>{course.batch}</TableCell>
                    <TableCell>{course.strengthOfStudents}</TableCell>
                    {/* <TableCell>{course.startDate}</TableCell>
                    <TableCell>{course.endDate}</TableCell> */}
                    <TableCell>
                      <Link to={`/edit-course/${course.id}`}>
                        <FaEdit style={{ color: 'blue', size: '16', cursor: 'pointer' }} />
                      </Link>
                      &nbsp;&nbsp;&nbsp;
                      <FaTrashAlt
                        style={{ color: 'red', size: 16, cursor: 'pointer' }}
                        onClick={() => deleteCourse(course.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
