import React, { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useLocation } from "react-router-dom";
import axios from "axios";

const columns = [
  
  { id: "fullname", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 100 },
  {
    id: "contactno",
    label: "Phone number",
    minWidth: 170,
    align: "right",
  },
  { id: "vehicleType", label: "Vehicle Type", minWidth: 170 },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

export default function ParkingUsersTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [parkingusers, setParkingUser] = useState([]);
  useEffect(() => {
    getParkingUser();
  }, []);

  const getParkingUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8081/admin/getParkingUsers"
      );
      setParkingUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(parkingusers);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "50%", overflow: "hidden", margin: " 5rem auto" }}>
      <h1 className="text-center text-3xl">Parking Users Table</h1>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {parkingusers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={user.code}>
                    {columns.map((column) => {
                      const value = user[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={parkingusers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
