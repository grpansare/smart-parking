import React, { useEffect, useState } from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
import "./parkingOwner.css";
const columns = [
  { id: "fullname", label: "Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 100 },
  {
    id: "contactno",
    label: "Phone number",
    minWidth: 170,
    align: "right",
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

export default function ParkingOwnersTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [owners, setOwners] = useState([]);

  // ✅ Fetch parking owners
  useEffect(() => {
    axios
      .get("http://localhost:8081/admin/getParkingOwners")
      .then(checkAccepted)
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const checkAccepted = (response) => {
    const owners = response.data;
    console.log(owners);

    const acceptedUsers = owners.filter((owner) => owner.status === "Accepted");
    setOwners(acceptedUsers);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleAccept = (id) => {
    axios
      .post(`http://localhost:8081/parking-owners/${id}/accept`)
      .then(() => {
        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner.id === id ? { ...owner, status: "Accepted" } : owner
          )
        );
      })
      .catch((error) => console.error("Error accepting request:", error));
  };

  // ✅ Handle Reject Request
  const handleReject = (id) => {
    axios
      .post(`http://localhost:8081/parking-owners/${id}/reject`)
      .then(() => {
        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner.id === id ? { ...owner, status: "Rejected" } : owner
          )
        );
      })
      .catch((error) => console.error("Error rejecting request:", error));
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className=" parkingowners  border bg-slate-200 p-4 ">
      <div className="w-full text-right right-20 mt-4">
        <NavLink
          to="/admindashboard/ownerrequests"
          className="bg-blue-300  items-end p-2 rounded hover:bg-blue-400"
        >
          View Parking Owner Requests
        </NavLink>
      </div>
      <h1 className="text-center text-3xl">Parking Owners </h1>
      {owners.length > 0 ? (
        <Paper sx={{ width: "70%", overflow: "hidden", margin: " 3rem auto" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label=" table">
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
                {owners
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={user.id}
                      >
                        {columns.map((column) => {
                          const value = user[column.id];

                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              className="p-2 border"
                            >
                              {value}
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
            count={owners.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <div className="no_approved p-6 mt-6 flex items-center justify-center bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto">
          <p className="text-gray-600 text-lg font-semibold">
            No Approved Parking Owners
          </p>
        </div>
      )}
    </div>
  );
}
