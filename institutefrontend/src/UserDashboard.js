import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StudentCourseDetails from './UserPages/StudentCourseDetails';

const UserDashboard = ({ loggedInUser}) => {
  const navigate = useNavigate();
  const [instituteKey, setInstituteKey] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [uniqueCourseNames, setUniqueCourseNames] = useState([]);
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [fetchedStudents, setFetchedStudents] = useState([]);
  const [selectedInstallmentType, setSelectedInstallmentType] = useState('');
  const [showStudentCoursesDialog, setShowStudentCoursesDialog] = useState(false);
  const [selectedStudentCourses, setSelectedStudentCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [balanceFees, setBalanceFees] = useState(0);
  const [installmentsLeft, setInstallmentsLeft] = useState(0);
  const [installmentDetails, setInstallmentDetails] = useState({
    installmentType: '',
    totalInstallments: 0,
    paidInstallments: 0,
  });
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    email: '',
    mobile: '',
    studentId: '',
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
    
   
const handlePaymentDialogClose = () => {
  setShowStudentCoursesDialog(false);
};
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

const handlePay = async () => {
    try {
      if (!selectedCourse) {
        console.error('Selected course is null.');
        return;
      }

      const totalFees = calculateTotalFees(selectedStudentCourses);

      if (paidFees > totalFees) {
        alert('Paid fees cannot exceed total fees!');
        return;
      }

      const updatedPaidInstallments = installmentDetails.paidInstallments + 1;
      if (updatedPaidInstallments === 3) {
        const remainingBalance = totalFees - paidFees;
        if (remainingBalance > 0) {
          alert(`Please pay the remaining balance of ${remainingBalance} in this installment.`);
        }
      }
      setInstallmentDetails((prevDetails) => ({
        ...prevDetails,
        paidInstallments: updatedPaidInstallments,
      }));

      const response = await axios.put(`http://localhost:8080/api/students/pay-fees`, {
        studentId: selectedCourse.studentId,
        courseId: selectedCourse.id,
        paidFees: paidFees,
        installmentType: selectedInstallmentType,
      });

      console.log('Payment successful:', response.data);

      setShowPaymentForm(false);
      setPaidFees(0);
      const { balanceFees, installmentsLeft, paidFees: updatedPaidFees } = response.data;
      setPaidFees(updatedPaidFees);
      setBalanceFees(balanceFees);
      setInstallmentsLeft(installmentsLeft);

      console.log('Payment API Response:', response);
      if (paidFees > selectedCourse.totalCourseFees) {
        alert('Total fees paid exceed total fees!');
      }
      alert('Payment successful!');
      setShowStudentCoursesDialog(false);
      handleStudentClick();
    } catch (error) {
      console.error('Error making payment:', error.message);
    }
  };
  const handleStudentClick = async (studentId) => {
  try {
    const studentResponse = await axios.get(`http://localhost:8080/api/students/${studentId}`);
    const student = studentResponse.data;
    const coursesResponse = await axios.get(`http://localhost:8080/api/registered-students/${studentId}`);
    const courses = coursesResponse.data;
    setSelectedStudentCourses(courses);
    const installmentType = student.installmentType;
    const remainingInstallments = student.totalInstallments - student.paidInstallments;
    setSelectedInstallmentType(installmentType);
    if (courses.length > 0) {
     const totalFees = courses.reduce((total, course) => total + Number(course.courseFees), 0);
      const studentWithTotalFees = {
        ...student,
        totalCourseFees: totalFees,
      };
      setStudentDetails(studentWithTotalFees);
      setSelectedCourse(courses[0]);
      setShowStudentCoursesDialog(true);
      setInstallmentDetails({
        installmentType: student.installmentType,
        totalInstallments: student.totalInstallments,
        paidInstallments: student.paidInstallments,
        remainingInstallments: remainingInstallments,
      });
    } else {
      console.warn('No courses registered for the selected student.');
      }
  } catch (error) {
    console.error('Error fetching student and registered courses:', error.message);
  }
};
 
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
 
    return (
    <>
      <Typography align="center" variant="h5" component="h5" gutterBottom>
              Registered Students
            </Typography>
            {fetchedStudents.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>StudentID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Total Fees</TableCell>
                <TableCell>Paid Fees</TableCell>
                <TableCell>Balance Fees</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {fetchedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Button onClick={() => handleStudentClick(student.studentId)}>{student.studentId}</Button>
                </TableCell>
                <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.mobile}</TableCell>
                  <TableCell>{student.totalCourseFees}</TableCell>
                  <TableCell>{student.paidFees}</TableCell>
                  <TableCell
                    style={{
                      color: (student.totalCourseFees > 0 && student.paidFees === student.totalCourseFees) ? 'green' : 'inherit',
                      fontWeight: (student.totalCourseFees > 0 && student.paidFees === student.totalCourseFees) ? 'bold' : 'normal',
                      padding: (student.totalCourseFees > 0 && student.paidFees === student.totalCourseFees) ? '6px 10px' : 'inherit',
                      borderRadius: (student.totalCourseFees > 0 && student.paidFees === student.totalCourseFees) ? '4px' : 'inherit',
                    }}
                  >
                    {(student.totalCourseFees > 0 && student.paidFees === student.totalCourseFees) ? 'Payment Completed' : student.balanceFees.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
            )}
           <StudentCourseDetails
  open={showStudentCoursesDialog}
  onClose={() => setShowStudentCoursesDialog(false)}
  selectedStudentCourses={selectedStudentCourses}
  selectedInstallmentType={selectedInstallmentType}
  paidFees={paidFees}
  handlePay={handlePay}
  studentDetails={studentDetails}
  handlePaymentDialogClose={handlePaymentDialogClose}
  setPaidFees={setPaidFees}
  setSelectedInstallmentType={setSelectedInstallmentType}
/>
      </>
       
  );
};

export default UserDashboard;