import React from 'react';
import { TextField,FormControl,InputLabel,Select,MenuItem, Autocomplete, Button } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers';

export const ControlDatePicker =(props) =>{
    return (
        <>
            <FormControl  sx={{ minWidth: 120, width:'23.3%' }} size="small">
                <LocalizationProvider dateAdapter={AdapterDayjs} size="small" label={props.label}>
                    <DatePicker format={props.format?"YYYY-MM-DD":"DD-MM-YYYY"} variant={props.variant} size="small"  value={(props.value==null || props.value==undefined || props.value=='')? dayjs(new Date().toLocaleDateString()):dayjs(props.value)} label={props.label} onChange={(newvalue) =>props.onChange(props.label,newvalue)} disabled={props.readonly}
                        slotProps={{ textField: { size: "small" } }}
                    />
                </LocalizationProvider>
            </FormControl>
        </>
    )

}

export const handleDateTimeChange = (name, newValue, stateSetter) => {
    let hours = newValue.$H < 10 ? '0' + newValue.$H : newValue.$H;
    let minutes = newValue.$m < 10 ? '0' + newValue.$m : newValue.$m;
    let formattedDate = `${newValue.toDate().toISOString().slice(0, -1)}Z`;
  
    stateSetter((oldValues) => ({
      ...oldValues,
      [name]: formattedDate,
    }))
  }