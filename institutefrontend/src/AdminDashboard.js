import React, { useState, useEffect,useRef } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider} from '@material-ui/pickers';
import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {Container,Typography,TextField,Button,Box,TableHead,Table,TableBody, TableRow,TableCell,Paper,Tabs, Tab, TableContainer,MenuItem, Select,FormControl,InputLabel} from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import Logout from './Pages/Logout';
import { IconButton } from '@mui/material';
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { ControlDatePicker, handleDateTimeChange } from './Pages/Controls';

const AdminDashboard = ({  onBackToLogin, loggedInUser }) => {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState('');
  const [courseFees, setCourseFees] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [batch, setBatch] = useState('');
  const [strengthOfStudents, setStrengthOfStudents] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [instituteKey, setInstituteKey] = useState('');
  const [adminDetails, setAdminDetails] = useState({});
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [yearlyRegistrations, setYearlyRegistrations] = useState([]);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const handleHealthInfoFromChange = (name, newValue) => {
    handleDateTimeChange(name, newValue, setStartDate);
  };
  
  const handleHealthInfoToChange = (name, newValue) => {
    handleDateTimeChange(name, newValue, setEndDate);
  };
  const handleLogoutIconClick = () => {
    setShowLogoutConfirmation(true);
  };

  const handleLogoutConfirm = () => {
    onBackToLogin();
    navigate('/login');
    setShowLogoutConfirmation(false);
  }; 
  useEffect(() => {
    fetchAdminDetails();
    fetchCourses();
    if (loggedInUser && loggedInUser.email) {
      fetchMonthlyRegistrations(); // Fetch monthly registrations only if loggedInUser is available
      fetchYearlyRegistrations();
    }
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
  const fetchMonthlyRegistrations = async () => {
    try {
      if (!loggedInUser || !loggedInUser.email || !instituteKey) {
        console.error('Error: loggedInUser, email, or instituteKey is not available');
        return;
      }
  
      const response = await axios.get(`http://localhost:8080/api/monthly-registrations?instituteKey=${instituteKey}`);
      
      if (response && response.data) {
        const registrationsData = response.data;
  
        const currentYear = new Date().getFullYear();
          const currentYearRegistrations = registrationsData.filter(entry => {
            const entryDate = new Date(entry.registrationDate);
            const entryYear = entryDate.getFullYear();

            console.log('Entry Date:', entryDate, 'Entry Year:', entryYear, 'Current Year:', currentYear);

            return entryYear === currentYear;
          });

          console.log('Filtered Registrations for Current Year:', currentYearRegistrations);
          const registrationsByMonth = currentYearRegistrations.reduce((acc, entry) => {
          const month = new Date(entry.registrationDate).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});
  
        const monthlyRegistrationsArray = Object.entries(registrationsByMonth).map(([month, registeredStudents]) => ({
          month,
          registeredStudents,
        }));
  
        setMonthlyRegistrations(monthlyRegistrationsArray);
        console.info("Registered students", response);
        console.info("Total students", monthlyRegistrationsArray);
      } else {
        console.error('Error: Response or data is missing.');
      }
    } catch (error) {
      console.error('Error fetching monthly registrations:', error.message);
    }
  };
  
  const fetchYearlyRegistrations = async () => {
    try {
      if (!loggedInUser || !loggedInUser.email || !instituteKey) {
        console.error('Error: loggedInUser, email, or instituteKey is not available');
        return;
      }
      const response = await axios.get(`http://localhost:8080/api/monthly-registrations?instituteKey=${instituteKey}`);
      if (response && response.data) {
        const registrationsData = response.data;
        const registrationsByYear = registrationsData.reduce((acc, entry) => {
          const year = new Date(entry.registrationDate).getFullYear();
          acc[year] = (acc[year] || 0) + 1;
          return acc;
        }, {});
        const yearlyRegistrationsArray = Object.entries(registrationsByYear).map(([year, registeredStudents]) => ({
          year: parseInt(year),
          registeredStudents,
        }));
        setYearlyRegistrations(yearlyRegistrationsArray);
        console.info("Registered students", response);
        console.info("Total students per year", yearlyRegistrationsArray);
      } else {
        console.error('Error: Response or data is missing.');
      }
    } catch (error) {
      console.error('Error fetching yearly registrations:', error.message);
    }
  };

  const handleEditCourse = (courseId) => {
    const courseToEdit = courses.find(course => course.id === courseId);
    if (courseToEdit) {
      setCourseName(courseToEdit.name);
      setCourseFees(courseToEdit.fees);
      setCourseDuration(courseToEdit.duration);
      setBatch(courseToEdit.batch);
      setStrengthOfStudents(courseToEdit.strengthOfStudents);
      setStartDate(courseToEdit.startDate);
      setEndDate(courseToEdit.endDate);
      setEditingCourseId(courseId);
      setSelectedTab(1); 
    } else {
      console.error('Course not found for editing.');
    }
  };
  
  const addCourse = async () => {
    try {
      if (!courseName || !courseFees || !courseDuration || !batch || !strengthOfStudents || !startDate || !endDate) {
        alert('Please fill in all fields.');
        return;
      }
      const validStartDate = new Date(startDate['Start Date'].split('T')[0]);
      const validEndDate = new Date(endDate['End Date'].split('T')[0]);
      console.log('Valid Start Date:', validStartDate);
      console.log('Valid End Date:', validEndDate);
      const newCourse = {
        instituteKey: instituteKey,
        name: courseName,
        fees: courseFees,
        duration: courseDuration,
        batch: batch,
        strengthOfStudents: strengthOfStudents,
        startDate: validStartDate.toISOString(),
        endDate: validEndDate.toISOString(),  
      };
      console.log('Add Course Payload:', newCourse); // Print the JSON payload
      const response = await axios.post('http://localhost:8080/api/add-course', newCourse);
      console.log('Course added successfully:', response.data);
      setCourseName('');
      setCourseFees('');
      setCourseDuration('');
      setBatch('');
      setStrengthOfStudents('');
      setStartDate('');
      setEndDate('');
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error.message);
    }
  };
  
  const updateCourse = async () => {
    try {
      if (!courseName || !courseFees || !courseDuration || !batch || !strengthOfStudents || !startDate || !endDate) {
        alert('Please fill in all fields.');
        return;
      }
      const validStartDate = new Date(startDate['Start Date'].split('T')[0]);
      const validEndDate = new Date(endDate['End Date'].split('T')[0]);
      console.log('Valid Start Date:', validStartDate);
      console.log('Valid End Date:', validEndDate);
      const updatedCourse = {
        id: editingCourseId,
        name: courseName,
        fees: courseFees,
        duration: courseDuration,
        batch: batch,
        strengthOfStudents: strengthOfStudents,
        startDate: validStartDate.toISOString(),
        endDate: validEndDate.toISOString(), 
        instituteKey: instituteKey,
      };
      console.log('Update Course Payload:', updatedCourse); // Print the JSON payload
      const response = await axios.put(`http://localhost:8080/api/courses/${editingCourseId}`, updatedCourse);
      console.log('Course updated successfully:', response.data);
      fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error.message);
    }
  };
    const [totalAmountPaid, setTotalAmountPaid] = useState([
    { month: 'Jan', totalAmount: 1000 },
    { month: 'Feb', totalAmount: 1500 },
    { month: 'Mar', totalAmount: 1200 },
    { month: 'Apr', totalAmount: 500 },
    { month: 'May', totalAmount: 800 },
    { month: 'Jun', totalAmount: 600 },
   ]);
  
  const [totalDueAmount, setTotalDueAmount] = useState([
    { month: 'Jan', totalDueAmount: 500 },
    { month: 'Feb', totalDueAmount: 800 },
    { month: 'Mar', totalDueAmount: 600 },
    { month: 'Apr', totalDueAmount: 1000 },
    { month: 'May', totalDueAmount: 1500 },
    { month: 'Jun', totalDueAmount: 1200 },
    ]);
    const handleTabChange = (event, newValue) => {
      setSelectedTab(newValue);
    };

    const chartOptions = {
      chart: {
        id: 'registered-students',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: monthlyRegistrations ? monthlyRegistrations.map((entry) => entry.month) : [],
      },
    };
    
    const chartSeries = [{
      name: 'Registered Students per Month',
      data: monthlyRegistrations ? monthlyRegistrations.map((entry) => entry.registeredStudents) : [],
    }];
    
    const chartYearlyOptions = {
    chart: {
      id: 'yearly-registered-students',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: yearlyRegistrations.map(entry => entry.year),
    },
  };

  const chartYearlySeries = [{
    name: 'Registered Students per Year',
    data: yearlyRegistrations.map(entry => entry.registeredStudents),
  }];

  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:8080/api/courses/${courseId}`);
      console.log('Course deleted successfully', courseId);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error.message);
    }
  };
  const styles = {
    container: {
      textAlign: 'center',
      margin: 'auto',
      marginTop: '50px',
      padding: '20px',
      backgroundColor: 'White'
    },
    button: {
      padding: '0px',
      backgroundColor: 'Black',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '14px',
      cursor: 'pointer',
    },
  };
  return (
  <div style={{ backgroundColor: '#0a1517',minHeight: '100vh', overflow: 'hidden', }}>
      <Container style={styles.container}>
      <Typography  variant="h4" component="h4" gutterBottom>
        Admin Dashboard
      </Typography>
        <Box sx={{ position: 'absolute', top: 70, right: 80, padding: '0px' }}>
        <IconButton onClick={handleLogoutIconClick} color="inherit">
          <ExitToAppIcon />
        </IconButton>
        <Logout
          open={showLogoutConfirmation}
          onClose={() => setShowLogoutConfirmation(false)}
          onConfirm={handleLogoutConfirm}
        />
        </Box>
        <Tabs value={selectedTab} onChange={handleTabChange} indicatorColor="primary" >
          <Tab label="Details" sx={{ backgroundColor: selectedTab === 0 ? '#f0f0f0' : 'transparent' }} />
          <Tab label="Add Course" sx={{ backgroundColor: selectedTab === 1 ? '#f0f0f0' : 'transparent' }} />
          <Tab label="Course List" sx={{ backgroundColor: selectedTab === 2 ? '#f0f0f0' : 'transparent' }} />
        </Tabs>
        <Box>
        {selectedTab === 0 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ width: '90%' }}>
              <Typography marginLeft={8} variant="h5" component="h5" gutterBottom>
                Monthly Registration
              </Typography>
              <Box>
                {monthlyRegistrations && monthlyRegistrations.length > 0 ? (
                  <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={350} width={350} />
                ) : (
                  <p>No monthly registration data available.</p>
                )}
              </Box>
            </div>
            <div style={{  width: '90%' }} >
              <Typography marginLeft={8} variant="h5" component="h5" gutterBottom>
                Total Amount and Due Amount collected per Month
              </Typography>
              <Box>
                <ReactApexChart
                  options={{
                    chart: {
                      id: 'total-amount-due',
                      toolbar: {
                        show: false,
                      },
                    },
                    xaxis: {
                      categories: totalAmountPaid.map(entry => entry.month),
                    },
                  }}
                  series={[
                    {
                      name: 'Total Amount Paid',
                      data: totalAmountPaid.map(entry => entry.totalAmount),
                    },
                    {
                      name: 'Prevoius months balance Amount',
                      data: totalDueAmount.map(entry => entry.totalDueAmount),
                    },
                  ]}
                  type="bar" height={350} width={350} />
              </Box>
            </div>
            <div style={{ width: '38%' }} >
              <Typography marginLeft={8}  variant="h5" component="h5" gutterBottom>
                Yearly Registration
              </Typography>
              <Box>
                <ReactApexChart options={chartYearlyOptions} series={chartYearlySeries} type="area" height={350} width={350} />
              </Box>
            </div>
          </div>
          </>
        )}
        {selectedTab === 0 && (
        <div style={{ marginTop: '20px', marginLeft: '32%' }}>
          <Button size="small" variant="contained" >
            Export to PDF
          </Button>
        </div>
      )}
        {selectedTab === 1 && (
          <>
            <Typography align="center" variant="h5" component="h5" gutterBottom>
              Add Course
            </Typography>
            <Box sx={{ justifyContent: 'center', border: '2px solid grey', margin: '150px', marginTop: '50px'}}>
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
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <ControlDatePicker label="Start Date" id={'startDate'} value={startDate} onChange={handleHealthInfoFromChange} defaultValue={new Date()} variant="standard"/>&nbsp;&nbsp;
                      <Box marginLeft={5} marginRight={5}>
                      </Box>
                      <ControlDatePicker  label="End Date" id={'endDate'} value={endDate} onChange={handleHealthInfoToChange} defaultValue={new Date()} />&nbsp;&nbsp;
                      <Box marginLeft={5} marginRight={5}> 
                      </Box>
                    </MuiPickersUtilsProvider>
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
        )}
        {selectedTab === 2 && (
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
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
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
                      <TableCell>{dayjs(course.startDate).format('YYYY-MM-DD')}</TableCell>
                      <TableCell>{dayjs(course.endDate).format('YYYY-MM-DD')}</TableCell>
                      <TableCell>
                        <FaEdit
                          style={{ color: 'blue', size: '16', cursor: 'pointer' }}
                          onClick={() => handleEditCourse(course.id)}
                        />
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
        )}
      </Box>
      </Container>
    </div>
  );
};

export default AdminDashboard;