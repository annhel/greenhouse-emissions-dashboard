import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ABBRV_TO_COUNTRY } from "../utils/constants";

export type CompareTableProps = {
  tableData: {
    country: string;
    percentChange: { isPositive: boolean; change: number } | null;
    totalEmissions: number | null;
    percentageOfTotal: number | null; 
  }[];
};

export default function CompareTable({ tableData }: CompareTableProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="emissions-table">
        <TableHead>
          <TableRow>
            <TableCell>Country</TableCell>
            <TableCell align="right">Percent Change (%)</TableCell>
            <TableCell align="right">Total Emissions (Mt CO₂e)</TableCell>
            <TableCell align="right">% of Total Emissions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.country}>
              <TableCell component="th" scope="row">
                {ABBRV_TO_COUNTRY[row.country]}
              </TableCell>
              <TableCell
                align="right"
                style={{
                  color: row.percentChange?.isPositive ? "green" : "red",
                }}
              >
                {row.percentChange?.change ? `${row.percentChange.change}%` : "N/A"}
              </TableCell>
              <TableCell align="right">
                {row.totalEmissions !== null
                  ? row.totalEmissions.toLocaleString()
                  : "N/A"}
              </TableCell>
              <TableCell align="right">
                {row.percentageOfTotal !== null
                  ? `${row.percentageOfTotal}%`
                  : "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
