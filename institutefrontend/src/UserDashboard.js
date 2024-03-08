import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,Dialog,DialogTitle,DialogContent,DialogActions,TextField,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Tabs,Tab,Box,Typography,Container,} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Logout from './Pages/Logout';
import { IconButton } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import StudentBatchDetails from './UserPages/StudentBatchDetails';
import dayjs, {Dayjs} from 'dayjs';
import StudentCourseDetails from './UserPages/StudentCourseDetails';

const UserDashboard = ({onBackToLogin, loggedInUser}) => {
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
  const [selectedTab, setSelectedTab] = useState(0);
  const [showEnrollStudentTab, setShowEnrollStudentTab] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
    
    const handleLogoutIconClick = () => {
    setShowLogoutConfirmation(true);
  };
  const handleLogoutConfirm = () => {
    onBackToLogin();
    navigate('/login');
    setShowLogoutConfirmation(false);
  }; 
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
  const handleStudentIdChange = async (enteredStudentId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/students/${enteredStudentId}`);
      const studentData = response.data;
        setStudentDetails({
        studentId: studentData.studentId,
        name: studentData.name,
        email: studentData.email,
        mobile: studentData.mobile,
      });
    } catch (error) {
      console.error('Error fetching student details:', error.message);
      }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setStudentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    if (name === 'studentId') {
      handleStudentIdChange(value);
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

  const handleRegister = async (course) => {
    try {
      const courseDetailsResponse = await axios.get(`http://localhost:8080/api/courses/${course.id}`);
      const courseDetails = courseDetailsResponse.data;
      setSelectedCourse(course);
      setShowRegistrationForm(true);
      setStudentDetails({
        studentId: '',
        name: '',
        email: '',
        mobile: '',
      });
      setSelectedCourseDetails(courseDetails);
     } catch (error) {
      console.error('Error fetching course details:', error.message);
    }
  };
  
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
  
  const handleEnrollButtonClick = () => {
    setShowEnrollStudentTab(true)
    console.log('Enroll button clicked!');
  };
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
  const styles = {
    container: { textAlign: 'center', margin: 'auto', marginTop: '50px', padding: '20px', backgroundColor: 'White'},
    button: { padding: '0px', backgroundColor: 'Black', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '14px', cursor: 'pointer', },
  };
 
  return (
    <div style={{ backgroundColor: '#0a1517',minHeight: '100vh', overflow: 'hidden',}}>
      <StudentBatchDetails batchDetails={selectBatch} />
      <Container style={styles.container}>
      <Typography  variant="h4" component="h4" gutterBottom>
        Manager Dashboard
      </Typography>
       <Box sx={{ position: 'absolute', top: 70, right: 80, padding: '0px' }}>
       <IconButton onClick={handleLogoutIconClick} color="inherit">
         <ExitToAppIcon />
       </IconButton>
       <Logout open={showLogoutConfirmation} onClose={() => setShowLogoutConfirmation(false)} onConfirm={handleLogoutConfirm} />
      </Box>
      <Tabs value={selectedTab} onChange={(event, newValue) => setSelectedTab(newValue)} indicatorColor="primary" >
        <Tab label="Your Courses" sx={{ backgroundColor: selectedTab === 0 ? '#f0f0f0' : 'transparent' }} />
        <Tab label="Batches" sx={{ backgroundColor: selectedTab === 1 ? '#f0f0f0' : 'transparent' }} />
        <Tab label="Registered Students" sx={{ backgroundColor: selectedTab === 2 ? '#f0f0f0' : 'transparent' }} />
        <Box sx={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
        <Button variant="contained" color='inherit' onClick={handleEnrollButtonClick}>
          Enroll Student
        </Button>
        </Box>
      </Tabs>
      <Box hidden={selectedTab !== 0}>
      <Typography align="center" variant="h5" component="h5" gutterBottom>
              Your Course
            </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>Course Name</TableCell>
                  <TableCell>Batch</TableCell>
                  <TableCell>Course Fees</TableCell>
                   <TableCell>Start Date</TableCell>
                   <TableCell>End Date</TableCell>
                  <TableCell>Strength Of Students</TableCell>
                  <TableCell>Available Seats</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchedCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.batch}</TableCell>
                    <TableCell>{course.fees}</TableCell>
                    <TableCell>{dayjs(course.startDate).format('YYYY-MM-DD')}</TableCell>
                    <TableCell>{dayjs(course.endDate).format('YYYY-MM-DD')}</TableCell>
                    <TableCell>{course.strengthOfStudents}</TableCell>
                    <TableCell>{course.availableSeats}</TableCell>                      
                    <TableCell>
                      <Button onClick={() => handleRegister(course)} variant='contained' color='inherit'>Register</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>       
      </Box>
       <Dialog open={showEnrollStudentTab} onClose={() => setShowEnrollStudentTab(false)} maxWidth="md" fullWidth >
         <DialogTitle>{`Registration Form for Institute`}</DialogTitle>
         <Box sx={{ justifyContent: 'center', border: '1px solid lightgray', margin: '10px'}}>
         <DialogContent>
             <div style={{ display: 'flex', flexDirection: 'row', margin: '20px' }}>
               <TextField label="Name"value={studentDetails.name}onChange={(e) => setStudentDetails({ ...studentDetails, name: e.target.value })}required size="small" />&nbsp;&nbsp;
               <TextField label="Email" type="email" value={studentDetails.email} onChange={(e) => setStudentDetails({ ...studentDetails, email: e.target.value })}required size="small" />&nbsp;&nbsp;
               <TextField label="Mobile" type="mobile" value={studentDetails.mobile} onChange={(e) => setStudentDetails({ ...studentDetails, mobile: e.target.value })} required size="small" />&nbsp;&nbsp;           
             </div>        
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setShowEnrollStudentTab(false)} variant='contained' style={{backgroundColor: "Black"}}>
             Cancel
           </Button>&nbsp;&nbsp;
           <Button onClick={handleSubmit} variant='contained' style={{backgroundColor: "Black"}}>
             Submit
           </Button>&nbsp;&nbsp;
         </DialogActions>
         </Box>
       </Dialog>
       <Dialog open={showRegistrationForm} onClose={() => setShowRegistrationForm(false)} maxWidth="md" fullWidth >
         <DialogTitle>{`Registration Form for ${selectedCourse?.name}`}</DialogTitle>
         <Box sx={{ justifyContent: 'center', border: '1px solid lightgray', margin: '10px'}}>
         <DialogContent>
             <div style={{ display: 'flex', flexDirection: 'row', margin: '20px' }}>
             <TextField label="Student ID" name="studentId" size='small' value={studentDetails.studentId} onChange={(e) => { handleChange(e); handleStudentIdChange(e.target.value); }} />&nbsp;&nbsp;
             <TextField label="Name" name="name" size='small' value={studentDetails.name} />&nbsp;&nbsp;
             <TextField label="Email" name="email" size='small' value={studentDetails.email} />&nbsp;&nbsp;
             <TextField label="Mobile" name="mobile" size='small' value={studentDetails.mobile} />&nbsp;&nbsp;
             </div>
         </DialogContent>
         <DialogActions>
           <Button onClick={() => setShowRegistrationForm(false)} variant='contained' style={{backgroundColor: "Black"}}>
             Cancel
           </Button>&nbsp;&nbsp;
           <Button onClick={handleFormSubmit} variant='contained' style={{backgroundColor: "Black"}}>
             Submit
           </Button>&nbsp;&nbsp;
         </DialogActions>
         </Box>
       </Dialog>
      <Box hidden={selectedTab !== 2}>
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
                      // backgroundColor: (student.totalCourseFees > 0 && student.paidFees === student.totalCourseFees) ? '#cdeac0' : 'inherit',
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
      </Box>
       <Box hidden={selectedTab !== 1}>
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
      </Box>
<StudentBatchDetails open={Boolean(selectBatch)} batchDetails={selectBatch} onClose={handleCloseBatchesDetails} onDelete={handleDelete} updatedStudents={selectregisteredStudents} onfetch={fetchedCourses} />
{/* <Dialog open={showStudentCoursesDialog} onClose={() => setShowStudentCoursesDialog(false)} maxWidth="md" fullWidth >
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
            <TableCell>{new Date(course.registrationDate).toLocaleDateString()}</TableCell> 
          </TableRow>          
        ))}
      </TableBody>
    </Table>
  </TableContainer>
 <TextField label="Total Fees" value={calculateTotalFees(selectedStudentCourses)} disabled size="small" margin="normal"/>&nbsp;&nbsp;
<TextField select label="Installment Type" value={selectedInstallmentType} onChange={(e) => setSelectedInstallmentType(e.target.value)} size="small" margin="normal" disabled={Boolean(selectedInstallmentType)} sx={{ width: '200px' }}>
  <MenuItem value="full">Full Payment</MenuItem>
  <MenuItem value="3months">3 Months Installment</MenuItem>
  <MenuItem value="6months">6 Months Installment</MenuItem>
</TextField>&nbsp;&nbsp;
 <TextField label="Paying Fees" type="number" value={paidFees} onChange={(e) => setPaidFees(Number(e.target.value))} size="small" margin="normal"/>&nbsp;&nbsp;
  </DialogContent>
  <DialogActions>
  <Button
  variant='contained'
  onClick={() => selectedCourse ? handlePay() : console.error('Selected course is null.')}
  style={{
    backgroundColor: "Black",
    color: "white",
    pointerEvents: studentDetails.totalCourseFees === studentDetails.paidFees ? 'none' : 'auto',
    opacity: studentDetails.totalCourseFees === studentDetails.paidFees ? 0.5 : 1,
    cursor: studentDetails.totalCourseFees === studentDetails.paidFees ? 'not-allowed' : 'pointer',
  }}
  disabled={studentDetails.totalCourseFees === studentDetails.paidFees}>
  Pay
</Button>
<Button onClick={handlePaymentDialogClose} variant='contained' color='inherit'>
      Close
    </Button>
  </DialogActions>
</Dialog> */}
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
    </Container>
    </div>
  );
};

export default UserDashboard;