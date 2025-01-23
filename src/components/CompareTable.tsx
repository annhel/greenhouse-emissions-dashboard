import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export type CompareTableProps = {
  tableData: {
    country: string;
    percentChange: { isPositive: boolean; change: number } | null;
  }[];
};

export default function CompareTable({ tableData }: CompareTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="percent-change-table">
        <TableHead>
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell align="right">Percent Change (%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.country}>
              <TableCell component="th" scope="row">
                {row.country}
              </TableCell>
              <TableCell
                align="right"
                style={{
                  color: row.percentChange?.isPositive ? "green" : "red",
                }}
              >
                {row.percentChange
                  ? `${row.percentChange.change}%`
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}