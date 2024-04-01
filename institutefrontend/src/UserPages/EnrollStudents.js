import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,Dialog,DialogTitle,DialogContent,DialogActions,TextField,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Tabs,Tab,Box,Typography,Container,} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Logout from '../Pages/Logout';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StudentBatchDetails from '../UserPages/StudentBatchDetails';
import dayjs, {Dayjs} from 'dayjs';
import StudentCourseDetails from '../UserPages/StudentCourseDetails';


const EnrollStudents = ({loggedInUser}) =>{
    const [selectBatch, setSelectBatch] = useState(null);
  const [instituteKey, setInstituteKey] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [uniqueCourseNames, setUniqueCourseNames] = useState([]);
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [fetchedStudents, setFetchedStudents] = useState([]);
  const [selectregisteredStudents, setSelectRegisteredStudents] = useState([]);
  const [selectedInstallmentType, setSelectedInstallmentType] = useState('');
  const [showStudentCoursesDialog, setShowStudentCoursesDialog] = useState(false);
  const [selectedStudentCourses, setSelectedStudentCourses] = useState([]);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [balanceFees, setBalanceFees] = useState(0);
  const [installmentsLeft, setInstallmentsLeft] = useState(0);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
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
  const [showEnrollStudentTab, setShowEnrollStudentTab] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
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
  const calculateTotalFees = (courses) => {
    const totalFees = courses.reduce((total, course) => total + Number(course.courseFees), 0);
    return totalFees;
  };
  const [paidFees, setPaidFees] = useState(calculateTotalPrice(selectedInstallmentType).toFixed(2));

    const handleSubmit = async () => {
        try {
          const response = await axios.post('http://localhost:8080/api/students', {
            instituteKey: instituteKey,
            name: studentDetails.name,
            email: studentDetails.email,
            mobile: studentDetails.mobile,
            paidFees: paidFees,
          });
      
          console.log('Student registered successfully:', response.data);
          setFetchedStudents((prevData) => [...prevData, response.data]);
          setShowEnrollStudentTab(false);
          setStudentDetails({
            instituteKey: '',
            name: '',
            email: '',
            mobile: '',
          });
          setPaidFees(0);
        } catch (error) {
          console.error('Error registering student:', error.message);
        }
      };
      const handleFormSubmit = async () => {
        try {
          const isAlreadyRegistered = selectregisteredStudents.some(
            (student) =>
              student.studentId === studentDetails.studentId &&
              student.courseId === selectedCourse.id
          );
      
          if (isAlreadyRegistered) {
           alert('Student is already registered for this course.');
            return;
          }
          const response = await axios.post('http://localhost:8080/api/register-student', {
            courseId: selectedCourse.id,
            courseName: selectedCourse.name,
            courseFees: selectedCourse.fees,
            courseDuration: selectedCourse.duration,
            studentId: studentDetails.studentId,
            batch: selectedCourse.batch,
            startDate: selectedCourse.startDate,
            endDate: selectedCourse.endDate,
            name: studentDetails.name,
            email: studentDetails.email,
            mobile: studentDetails.mobile,
            instituteKey: instituteKey,
            registrationDate: new Date(),
           
          });
           console.log('Student registered successfully:', response.data);
          const updatedCourseResponse = await axios.get(`http://localhost:8080/api/courses/${selectedCourse.id}`);
          const updatedCourse = updatedCourseResponse.data;
          setSelectRegisteredStudents((prevData) => [...prevData, response.data]);
          setFetchedCourses((prevCourses) =>
            prevCourses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
          );
          setShowRegistrationForm(false);
          setSelectedCourse(null);
          setStudentDetails({
            instituteKey: '',
            name: '',
            email: '',
            mobile: '',
          });
        } catch (error) {
          console.error('Error registering student:', error.message);
        }
      };
      

    return(
        <>
        <Box sx={{ justifyContent: 'center', border: '1px solid lightgray', margin: '10px'}}>
      <div style={{ display: 'flex', flexDirection: 'row', margin: '20px' }}>
        <TextField label="Name" value={studentDetails.name} onChange={(e) => setStudentDetails({ ...studentDetails, name: e.target.value })} required size="small" />&nbsp;&nbsp;
        <TextField label="Email" type="email" value={studentDetails.email} onChange={(e) => setStudentDetails({ ...studentDetails, email: e.target.value })} required size="small" />&nbsp;&nbsp;
        <TextField label="Mobile" type="mobile" value={studentDetails.mobile} onChange={(e) => setStudentDetails({ ...studentDetails, mobile: e.target.value })} required size="small" />&nbsp;&nbsp;           
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
        <Button onClick={handleFormSubmit} variant='contained' style={{ backgroundColor: "Black" }}>
          Cancel
        </Button>&nbsp;&nbsp;
        <Button onClick={handleSubmit} variant='contained' style={{ backgroundColor: "Black" }}>
          Submit
        </Button>
      </div>
    </Box>
        </>
    )
}
export default EnrollStudents;