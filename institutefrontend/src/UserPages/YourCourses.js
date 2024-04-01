import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button,Dialog,DialogTitle,DialogContent,DialogActions,TextField,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Tabs,Tab,Box,Typography,Container,} from '@mui/material';
import dayjs, {Dayjs} from 'dayjs';

const YourCourses = ({  loggedInUser }) => {
    const [selectedCourseDetails, setSelectedCourseDetails] = useState([]);
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [uniqueCourseNames, setUniqueCourseNames] = useState([]);
    const [studentDetails, setStudentDetails] = useState({
        name: '',
        email: '',
        mobile: '',
        studentId: '',
      });
      const [selectedCourse, setSelectedCourse] = useState(null);
      const [selectregisteredStudents, setSelectRegisteredStudents] = useState([]);
      const [instituteKey, setInstituteKey] = useState('');
      const [fetchedCourses, setFetchedCourses] = useState([]);

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
      

return (
<>
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
</>
)
  }
  export default YourCourses;