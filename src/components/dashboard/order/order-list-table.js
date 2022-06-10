import PropTypes from "prop-types";
import { format } from "date-fns";
import numeral from "numeral";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
  TableHead,
} from "@mui/material";
import { SeverityPill } from "../../severity-pill";

const severityMap = {
  CONFIRMED: "success",
  NEW: "info",
  CANCELLED: "error",
  PROCESSNG: "error",
};

export const OrderListTable = (props) => {
  const {
    onOpenDrawer,
    onPageChange,
    onRowsPerPageChange,
    orders,
    ordersCount,
    page,
    rowsPerPage,
    ...other
  } = props;

  return (
    <div {...other}>
      <Box
        sx={{
          px: 3,
          py: 1,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow
                hover
                key={order.id}
                onClick={() => onOpenDrawer?.(order.id)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell
                  sx={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  {order.orderNo}
                </TableCell>
                <TableCell>{order.cName}</TableCell>
                <TableCell>{order.cPhone}</TableCell>
                <TableCell>{order.grandTotal}</TableCell>

                <TableCell>
                  <SeverityPill
                    color={severityMap[order.orderStatus] || "warning"}
                  >
                    {order.orderStatus}
                  </SeverityPill>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={ordersCount}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </div>
  );
};

OrderListTable.propTypes = {
  onOpenDrawer: PropTypes.func,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  orders: PropTypes.array.isRequired,
  ordersCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
