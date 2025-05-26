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
  {
    id: "status",
    label: "status",
    minWidth: 170,
    align: "right",
  },
  {
    id: "Action",
    label: "Action",
    minWidth: 170,
    align: "right",
  },
];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

export default function OwnerRequests() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [owners, setOwners] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8081/admin/getParkingOwners")
      .then((response) => setOwners(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  console.log(owners);

  const handleAccept = (id) => {
    console.log(id);

    axios
      .post(`http://localhost:8081/admin/${id}/accept`)
      .then(() => {
        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner.userId === id ? { ...owner, status: "Accepted" } : owner
          )
        );
      })
      .catch((error) => console.error("Error accepting request:", error));
  };

  // ✅ Handle Reject Request
  const handleReject = (id) => {
    axios
      .post(`http://localhost:8081/admin/${id}/reject`)
      .then(() => {
        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner.userId === id ? { ...owner, status: "Rejected" } : owner
          )
        );
      })
      .catch((error) => console.error("Error rejecting request:", error));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "70%", overflow: "hidden", margin: " 5rem auto" }}>

      <h1 className="text-center text-3xl">Parking Owner Requests</h1>
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
                    key={user.userid}
                  >
                    {columns.map((column) => {
                      const value = user[column.id];

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className="p-2 border"
                        >
                          {/* ✅ Show Badge in Status Column */}
                          {column.id === "status" ? (
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                value === "Accepted"
                                  ? "bg-green-200 text-green-800"
                                  : value === "Rejected"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-yellow-200 text-yellow-800"
                              }`}
                            >
                              {value}
                            </span>
                          ) : column.id === "Action" ? (
                            // ✅ Show Accept/Reject buttons only for Pending users
                            user.status === "Pending" ? (
                              <>
                                <button
                                  onClick={() => handleAccept(user.userId)}
                                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleReject(user.userId)}
                                  className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-gray-500">No actions</span>
                            )
                          ) : (
                            // ✅ Default: Render normal column values
                            value
                          )}
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
  );
}
