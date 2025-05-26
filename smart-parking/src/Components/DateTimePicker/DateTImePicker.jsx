import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useDispatch, useSelector } from "react-redux";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  setArrivalTime,
  setDepartureTime,
} from "../../Store/UserSlice/UserSlice";

dayjs.extend(utc);
dayjs.extend(timezone);

const DateTimePickerComponent = ({ color }) => {
  const dispatch = useDispatch();
  const { arrivalTime, departureTime } = useSelector((state) => state.user);

  const [arrival, setArrival] = useState(dayjs());
  const [departure, setDeparture] = useState(dayjs().add(1, "hour"));

  useEffect(() => {
    if (arrivalTime) {
      setArrival(dayjs(arrivalTime));
    } else {
      const currentIST = dayjs().tz("Asia/Kolkata").format();
      setArrival(dayjs(currentIST));
      dispatch(setArrivalTime(currentIST));
    }

    if (departureTime) {
      setDeparture(dayjs(departureTime));
    } else {
      const defaultDeparture = dayjs().add(1, "hour").tz("Asia/Kolkata").format();
      setDeparture(dayjs(defaultDeparture));
      dispatch(setDepartureTime(defaultDeparture));
    }
  }, [dispatch, arrivalTime, departureTime]);

  const handleArrivalChange = (newValue) => {
    const istTime = newValue.tz("Asia/Kolkata").format();
    setArrival(dayjs(istTime));
    dispatch(setArrivalTime(istTime));
  };

  const handleDepartureChange = (newValue) => {
    const istTime = newValue.tz("Asia/Kolkata").format();
    setDeparture(dayjs(istTime));
    dispatch(setDepartureTime(istTime));
  };

  return (
    <div className="mt-4">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box className="flex justify-center gap-5">
          <DateTimePicker
            label="Arrival Date & Time"
            value={arrival}
            onChange={handleArrivalChange}
            slotProps={{
              textField: {
                sx: {
                  input: { color: color ? "black" : "white" },
                  label: { color: color ? "black" : "white" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                },
              },
            }}
          />

          <DateTimePicker
            label="Departure Date & Time"
            value={departure}
            onChange={handleDepartureChange}
            minDate={arrival}
            slotProps={{
              textField: {
                sx: {
                  input: { color: color ? "black" : "white" },
                  label: { color: color ? "black" : "white" },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                },
              },
            }}
          />
        </Box>
      </LocalizationProvider>
    </div>
  );
};

export default DateTimePickerComponent;
