import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { useState, useEffect } from 'react';

const AdminDetails = ({  loggedInUser }) => {
  const [instituteKey, setInstituteKey] = useState('');
  const [adminDetails, setAdminDetails] = useState({});
  const [courses, setCourses] = useState([]);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [yearlyRegistrations, setYearlyRegistrations] = useState([]);
  useEffect(() => {
    fetchAdminDetails();
    fetchCourses();
    if (loggedInUser && loggedInUser.email) {
      fetchMonthlyRegistrations();
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
      // if (!loggedInUser || !loggedInUser.email || !instituteKey) {
      //   console.error('Error: loggedInUser, email, or instituteKey is not available');
      //   return;
      // }
  
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
          console.log('Monthly Registrations:', monthlyRegistrations);
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
      // if (!loggedInUser || !loggedInUser.email || !instituteKey) {
      //   console.error('Error: loggedInUser, email, or instituteKey is not available');
      //   return;
      // }
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
        console.log('Yearly Registrations:', yearlyRegistrations);
        console.info("Registered students", response);
        console.info("Total students per year", yearlyRegistrationsArray);
      } else {
        console.error('Error: Response or data is missing.');
      }
    } catch (error) {
      console.error('Error fetching yearly registrations:', error.message);
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
      categories: yearlyRegistrations ? yearlyRegistrations.map(entry => entry.year) : [],
    },
  };

  const chartYearlySeries = [{
    name: 'Registered Students per Year',
    data: yearlyRegistrations ? yearlyRegistrations.map(entry => entry.registeredStudents) : [],
  }];

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Container>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ width: '90%' }}>
            <Typography variant="h5" component="h5" gutterBottom>
              Monthly Registration
            </Typography>
            <Box>
              <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={350} width={350} />
            </Box>
          </div>
          <div style={{ width: '90%' }} >
            <Typography variant="h5" component="h5" gutterBottom>
              New installments and Due Amount collected per Month
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
                    categories: totalAmountPaid ? totalAmountPaid.map(entry => entry.month) : [],
                  },
                }}
                series={[
                  {
                    name: 'New Installment amount for current month',
                    data: totalAmountPaid ? totalAmountPaid.map(entry => entry.totalAmount) : [],
                  },
                  {
                    name: 'Installments balance Amount',
                    data: totalDueAmount ? totalDueAmount.map(entry => entry.totalDueAmount) : [],
                  },
                ]}
                type="area" height={350} width={350} />
            </Box>
          </div>
          <div style={{ width: '38%' }} >
            <Typography variant="h5" component="h5" gutterBottom>
              Yearly Registration
            </Typography>
            <Box>
              <ReactApexChart options={chartYearlyOptions} series={chartYearlySeries} type="area" height={350} width={350} />
            </Box>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminDetails;
