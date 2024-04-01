import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import {Typography,TextField,Button,Box,Table,TableBody, TableRow,MenuItem, Select,FormControl,InputLabel} from '@mui/material';
import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams } from 'react-router-dom';
import { ControlDatePicker, handleDateTimeChange } from '../Pages/Controls';
import { useNavigate } from 'react-router-dom';

const AddCourses = ({  loggedInUser }) => {
  const navigate = useNavigate();
    const [courseName, setCourseName] = useState('');
  const [courseFees, setCourseFees] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [batch, setBatch] = useState('');
  const [strengthOfStudents, setStrengthOfStudents] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courses, setCourses] = useState([]);
  const [instituteKey, setInstituteKey] = useState('');
  const [adminDetails, setAdminDetails] = useState({});
  const [editingCourseId, setEditingCourseId] = useState(null);
  const { courseId } = useParams(); // Get courseId from URL params
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');

  useEffect(() => {
      fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
      try {
          const response = await axios.get('http://localhost:8080/api/getFaculty');
          setFaculties(response.data);
      } catch (error) {
          console.error('Error fetching faculties:', error.message);
      }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(courseId);
    }
  }, [courseId]);

  const fetchCourseDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/courses/${id}`);
      const course = response.data;
      setInstituteKey(course.instituteKey);
      setCourseName(course.name);
      setCourseFees(course.fees);
      setCourseDuration(course.duration);
      setBatch(course.batch);
      setStrengthOfStudents(course.strengthOfStudents);
      setEditingCourseId(course.id);
    } catch (error) {
      console.error('Error fetching course details:', error.message);
    }
  };

  const handleHealthInfoFromChange = (name, newValue) => {
    handleDateTimeChange(name, newValue, setStartDate);
  };
  
  const handleHealthInfoToChange = (name, newValue) => {
    handleDateTimeChange(name, newValue, setEndDate);
  };
 
  useEffect(() => {
    fetchAdminDetails();
    fetchCourses();
  }, [loggedInUser, instituteKey]);
  const cancelEdit = () => {
    setInstituteKey('');
    setBatch('');
    setCourseName('');
    setCourseFees('');
    setCourseDuration('');
    setStrengthOfStudents('');
    // setStartDate(new Date());
    // setEndDate(new Date());
    setEditingCourseId(null);
  };
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
  
  const addCourse = async () => {
    try {
      if (!courseName || !courseFees || !courseDuration || !batch || !strengthOfStudents ) {
        alert('Please fill in all fields.');
        return;
      }
      // const validStartDate = startDate ? new Date(startDate.split('T')[0]) : null;
      // const validEndDate = endDate ? new Date(endDate.split('T')[0]) : null;
      // if (!validStartDate || !validEndDate) {
      //   alert('Invalid start or end date format.');
      //   return;
      // }
      // console.log('Valid Start Date:', validStartDate);
      // console.log('Valid End Date:', validEndDate);
      const newCourse = {
        instituteKey: instituteKey,
        name: courseName,
        fees: courseFees,
        duration: courseDuration,
        batch: batch,
        strengthOfStudents: strengthOfStudents,
        // startDate: validStartDate.toISOString(),
        // endDate: validEndDate.toISOString(),  
      };
      console.log('Add Course Payload:', newCourse);
      const response = await axios.post('http://localhost:8080/api/add-course', newCourse);
      console.log('Course added successfully:', response.data);
      setCourseName('');
      setCourseFees('');
      setCourseDuration('');
      setBatch('');
      setStrengthOfStudents('');
      // setStartDate('');
      // setEndDate('');
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error.message);
    }
  };
  
  const updateCourse = async () => {
    try {
      if (!courseName || !courseFees || !courseDuration || !batch || !strengthOfStudents ) {
        alert('Please fill in all fields.');
        return;
      }
      // const validStartDate = startDate ? new Date(startDate.split('T')[0]) : null;
      // const validEndDate = endDate ? new Date(endDate.split('T')[0]) : null;
      // if (!validStartDate || !validEndDate) {
      //   alert('Invalid start or end date format.');
      //   return;
      // }
      // console.log('Valid Start Date:', validStartDate);
      // console.log('Valid End Date:', validEndDate);
      const updatedCourse = {
        id: editingCourseId,
        name: courseName,
        fees: courseFees,
        duration: courseDuration,
        batch: batch,
        strengthOfStudents: strengthOfStudents,
        // startDate: validStartDate.toISOString(),
        // endDate: validEndDate.toISOString(), 
        instituteKey: instituteKey,
      };
      console.log('Update Course Payload:', updatedCourse); 
      const response = await axios.put(`http://localhost:8080/api/courses/${editingCourseId}`, updatedCourse);
      console.log('Course updated successfully:', response.data);
      fetchCourses();
      navigate('/addingCourse')
    } catch (error) {
      console.error('Error updating course:', error.message);
    }
  };
  
    return(
        <>
            <Typography align="center" variant="h5" component="h5" gutterBottom>
                {editingCourseId ? 'Edit Course' : 'Add Course'}
            </Typography>
            <Box sx={{ justifyContent: 'center', border: '2px solid grey', margin: '150px', marginTop: '50px'}}>
            {editingCourseId && (
                        <IconButton
                        onClick={cancelEdit}
                        style={{ position: 'absolute', top: 190, right: 145 }}
                      >
                        <CancelIcon />
                      </IconButton>
                        )}
              <Table >
                <TableBody>
                  <TableRow>
                  
                  <div style={{ display: 'flex', flexDirection: 'row', margin: '40px' }}>
                     
                      <TextField label="Institute Key" variant="outlined" size="small" value={instituteKey} disabled style={{ marginBottom: '10px', width: '200px' }} />&nbsp;&nbsp;
                      <Box marginLeft={5} marginRight={5}>
                        
                      </Box>
                      <FormControl variant="outlined" size="small" style={{ marginBottom: '10px', width: '200px' }}>
                        <InputLabel htmlFor="batch-select">Batch</InputLabel>
                        <Select label="Batch" id="batch-select" value={batch} onChange={(e) => setBatch(e.target.value)} MenuProps={{ PaperProps: { style: { maxHeight: 200, },},}}>
                          <MenuItem value="Jan">Jan</MenuItem>
                          <MenuItem value="Feb">Feb</MenuItem>
                          <MenuItem value="Mar">Mar</MenuItem>
                          <MenuItem value="Apr">Apr</MenuItem>
                          <MenuItem value="May">May</MenuItem>
                          <MenuItem value="Jun">Jun</MenuItem>
                          <MenuItem value="Jul">Jul</MenuItem>
                          <MenuItem value="Aug">Aug</MenuItem>
                          <MenuItem value="Sep">Sep</MenuItem>
                          <MenuItem value="Oct">Oct</MenuItem>
                          <MenuItem value="Nov">Nov</MenuItem>
                          <MenuItem value="Dec">Dec</MenuItem>
                        </Select>
                      </FormControl>&nbsp;&nbsp;
                      <Box marginLeft={5} marginRight={5}>
                      </Box>
                      <TextField label="Course Name" variant="outlined" value={courseName}size="small" onChange={(e) => setCourseName(e.target.value)}style={{ marginBottom: '10px', width: '200px' }}/>&nbsp;&nbsp;
                     
                      <Box marginLeft={5} marginRight={5}>
                    </Box>
                    
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', margin: '40px' }}>
                    <TextField label="Course Fees"variant="outlined"  value={courseFees} size="small" onChange={(e) => setCourseFees(e.target.value)}style={{ marginBottom: '10px', width: '200px' }} />&nbsp;&nbsp;
                    <Box marginLeft={5} marginRight={5}>
                      </Box>
                      <TextField label="Course Duration"variant="outlined"size="small"value={courseDuration}onChange={(e) => setCourseDuration(e.target.value)} style={{ marginBottom: '10px', width: '200px' }}/>&nbsp;&nbsp;
                      <Box marginLeft={5} marginRight={5}>
                      </Box>
                      <TextField label="Strength of Students" variant="outlined" value={strengthOfStudents} size="small" onChange={(e) => setStrengthOfStudents(e.target.value)} style={{ marginBottom: '10px', width: '200px' }}/>&nbsp;&nbsp;
                      <Box marginLeft={5} marginRight={5}>
                      </Box>
                      </div>
                    <div style={{ display: 'flex', flexDirection: 'row', margin: '40px' }}>
                    {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <ControlDatePicker label="Start Date" id={'startDate'} value={startDate} onChange={handleHealthInfoFromChange} defaultValue={new Date()} variant="standard"/>&nbsp;&nbsp;
                      <Box marginLeft={5} marginRight={5}>
                      </Box>
                      <ControlDatePicker  label="End Date" id={'endDate'} value={endDate} onChange={handleHealthInfoToChange} defaultValue={new Date()} />&nbsp;&nbsp;
                      <Box marginLeft={5} marginRight={5}> 
                      </Box>
                    </MuiPickersUtilsProvider> */}
                    <FormControl variant="outlined" size="small" style={{ marginBottom: '10px', width: '200px' }}>
                      <InputLabel htmlFor="faculty-select">Select Faculty</InputLabel>
                      <Select
                          label="Select Faculty"
                          id="faculty-select"
                          value={selectedFaculty}
                          onChange={(e) => setSelectedFaculty(e.target.value)}
                          MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                      >
                          {faculties.map(faculty => (
                              <MenuItem key={faculty.id} value={faculty.id}>
                                  {faculty.name}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={editingCourseId ? updateCourse : addCourse}
                      style={{ backgroundColor: 'Black', marginBottom: '10px', width: '200px' }}
                    >
                      {editingCourseId ? 'Save Changes' : 'Add Course'}
                    </Button>
                        
                    </div>
                    </TableRow>
                </TableBody>
                </Table>
            </Box>
            </>
    );
}
export default AddCourses;