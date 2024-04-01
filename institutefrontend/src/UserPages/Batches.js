import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StudentBatchDetails from '../UserPages/StudentBatchDetails';
import StudentCourseDetails from '../UserPages/StudentCourseDetails';

const Batches = ({onBackToLogin, loggedInUser}) => {
  const navigate = useNavigate();
  const [selectBatch, setSelectBatch] = useState(null);
  const [instituteKey, setInstituteKey] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [uniqueCourseNames, setUniqueCourseNames] = useState([]);
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [fetchedStudents, setFetchedStudents] = useState([]);
  const [selectedInstallmentType, setSelectedInstallmentType] = useState('');
  const [showStudentCoursesDialog, setShowStudentCoursesDialog] = useState(false);
  const [selectedStudentCourses, setSelectedStudentCourses] = useState([]);
const calculateTotalFees = (courses) => {
  const totalFees = courses.reduce((total, course) => total + Number(course.courseFees), 0);
  return totalFees;
};
const calculateTotalPrice = (installmentType) => {
  const totalFees = calculateTotalFees(selectedStudentCourses);
  switch (installmentType) {
    case 'full':
      return totalFees;
    case '3months':
      return totalFees/3;
    case '6months':
      return totalFees/6;
    default:
      return totalFees;
  }
};
const [paidFees, setPaidFees] = useState(calculateTotalPrice(selectedInstallmentType).toFixed(2));
useEffect(() => {
  setPaidFees(calculateTotalPrice(selectedInstallmentType).toFixed(2));
  }, [selectedInstallmentType]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user?email=${loggedInUser.email}`);
      console.log('User Details Response:', response);
      const instituteKeyFromResponse = response.data.instituteKey;
      console.log('Institute Key:', instituteKeyFromResponse);
      setInstituteKey(instituteKeyFromResponse);
      const coursesResponse = await axios.get(`http://localhost:8080/api/courses/user?email=${loggedInUser.email}`);

      console.log('Courses Response:', coursesResponse);
      console.log('Courses Response Data:', coursesResponse.data);
      setFetchedCourses(coursesResponse.data);
      setUserDetails(response.data);
      const uniqueNames = Array.from(new Set(fetchedCourses.map(course => course.name)));
      setUniqueCourseNames(uniqueNames);
      } catch (error) {
      console.error('error while fetching courses:', error.message);
      console.error('Error fetching user details:', error.message);
    }
  };
  useEffect(() => {
    console.log('Executing fetchUserDetails useEffect');
    console.log('loggedInUser:', loggedInUser);
    fetchUserDetails();
  }, [loggedInUser]);
  const fetchStudents = async () => {
    try {
    const studentsResponse = await axios.get(`http://localhost:8080/api/students/students?instituteKey=${instituteKey}`);
      setFetchedStudents(studentsResponse.data);
    } catch (error) {
      console.error('Error fetching students:', error.message);
    }
  };
  useEffect(() => {
    console.log('Executing fetchUserDetails useEffect');
    console.log('loggedInUser:', loggedInUser);
  
    if (instituteKey && loggedInUser.email) {
      fetchStudents();
    }
  }, [instituteKey, loggedInUser.email]);
  const [selectregisteredStudents, setSelectRegisteredStudents] = useState([]);
  const fetchRegisteredStudents = async () => {
    try {
      const registeredStudentsResponse = await axios.get(`http://localhost:8080/api/registered-students?instituteKey=${instituteKey}`);
      setSelectRegisteredStudents(registeredStudentsResponse.data);
    } catch (error) {
      console.error('Error fetching students:', error.message);
    }
  };
  useEffect(() => {
    console.log('Executing fetchUserDetails useEffect');
    console.log('loggedInUser:', loggedInUser);
  
    if (instituteKey && loggedInUser.email) {
      fetchRegisteredStudents();
    }
  }, [instituteKey, loggedInUser.email]);
  
  const handleDelete = async (studentId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/${studentId}`);
      console.log('Student deleted successfully:', response.data);
      setSelectRegisteredStudents((prevData) => prevData.filter((student) => student.id !== studentId));
      const updatedBatchDetails = selectBatch.filter((student) => student.id !== studentId);
      setSelectBatch(updatedBatchDetails);
    } catch (error) {
      console.error('Error deleting student:', error.message);
    }
  };
  
  const uniqueBatches = Array.from(
    new Set(selectregisteredStudents.map((student) => student.batch))
  );
  const handleViewBatchesDetails = (batchName) => {
    const batchDetails = selectregisteredStudents.filter(
      (student) => student.batch === batchName
    );
    setSelectBatch(batchDetails);
  };
    const handleCloseBatchesDetails = () => {
    setSelectBatch(null);
  };

  return (
    <>
         <Typography align="center" variant="h5" component="h5" gutterBottom>
           Batches
         </Typography>
         <TableContainer component={Paper}>
           <Table>
             <TableHead>
               <TableRow>
                 <TableCell>Batch</TableCell>
                 <TableCell>View</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {uniqueBatches.map((batchName) => (
                <TableRow key={batchName}>
                  <TableCell>{batchName}</TableCell>
                  <TableCell>
                    <Button
                      variant='contained'
                      onClick={() => handleViewBatchesDetails(batchName)}
                      color='inherit'
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
<StudentBatchDetails open={Boolean(selectBatch)} batchDetails={selectBatch} onClose={handleCloseBatchesDetails} onDelete={handleDelete} updatedStudents={selectregisteredStudents} onfetch={fetchedCourses} />
</>
  );
};

export default Batches;