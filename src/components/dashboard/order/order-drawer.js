import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import numeral from "numeral";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useMemo } from "react";
import toast from "react-hot-toast";

import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import { X as XIcon } from "../../../icons/x";
import { PropertyList } from "../../property-list";
import { PropertyListItem } from "../../property-list-item";
import { Scrollbar } from "../../scrollbar";
import axios from "axios";
import Select from "react-select";
import config from "../../../config";
import { useRouter } from "next/router";
import { NetworkClient } from "../../../config";

const OrderPreview = (props) => {
  const [statuss, setStatuss] = useState({});
  const [vendor, setVendor] = useState();
  const [vendorsData, setVendorsData] = useState();
  const { lgUp, onApprove, onEdit, onReject, order } = props;
  const align = lgUp ? "horizontal" : "vertical";
  const router = useRouter();
  const status = [
    { label: "NEW", value: "NEW" },
    { label: "CONFIRMED", value: "CONFIRMED" },
    { label: "PROCESSING", value: "PROCESSING" },
    { label: "REPAIR", value: "REPAIR" },
    { label: "DONE", value: "DONE" },
    { label: "CANCELLED", value: "CANCELLED" },
    { label: "ASSIGNED", value: "ASSIGNED" },
  ];
  const vendorOptions =
    vendorsData &&
    vendorsData?.map(function (ser) {
      return { value: ser.id, label: ser.name };
    });
  // console.log(vendorOptions);
  const handleSubmit = (selectdStatus) => {
    console.log(selectdStatus);
    setStatuss(selectdStatus);

    try {
      const res = NetworkClient.put(`/order/update-status/${order.id}`, {
        status: selectdStatus.label,
      }).then((res) => {
        toast.success(res.data.message);
        // props.onclose();
        router.push("/dashboard/orders").catch(console.error);
      });
    } catch (error) {
      // toast.error(error.);
    }
  };
  const handleAssignToVendor = async (selectdStatus) => {
    setVendor(selectdStatus);
    console.log(vendor);

    try {
      const res = NetworkClient.put(
        `order/assign-to-vendor/${order.id}&${selectdStatus.value}`
      ).then((res) => {
        toast.success(res.data.message);
        props.onclose();
        router.push("/dashboard/orders").catch(console.error);
      });
    } catch (error) {
      // toast.error(error.);
    }
  };
  useEffect(() => {
    const data = status.filter((item) => item.label === order.orderStatus);
    setStatuss(data[0]);
  }, [order]);

  const filterdStatus = useMemo(() => {
    const data = status.filter((item) => item.label !== order.orderStatus);
    return data;
  });

  const getVendors = async () => {
    try {
      const res = await NetworkClient.get(`vendor/list`);
      const data = await res.data;
      // console.log(data);
      setVendorsData(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (statuss?.value == "CONFIRMED") {
      getVendors();
    }
  }, [order, statuss]);
  // console.log("vendor", vendor?.value);
  // console.log("order id", order.id);
  return (
    <>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
          borderRadius: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          px: 3,
          py: 2.5,
        }}
      >
        <Typography color="textSecondary" sx={{ mr: 2 }} variant="overline">
          Actions
        </Typography>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexWrap: "wrap",
            m: -1,
            "& > button": {
              m: 1,
            },
          }}
        >
          <Select
            labelId="statusDropdown"
            options={filterdStatus}
            name="category"
            value={statuss}
            label="Select Category"
            onChange={(selectdStatus) => handleSubmit(selectdStatus)}
          />

          {/* <Button
            onClick={handleSubmit}
            size="small"
            startIcon={<EditIcon fontSize="small" />}
          >
            Status
          </Button> */}
        </Box>
      </Box>
      {statuss?.value == "CONFIRMED" ? (
        <Box
          sx={{
            alignItems: "center",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
            borderRadius: 1,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            px: 3,
            mt: 2,
            py: 2.5,
          }}
        >
          <Typography color="textSecondary" sx={{ mr: 2 }} variant="overline">
            Assign to Vendor
          </Typography>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              m: -1,
              "& > button": {
                m: 1,
              },
            }}
          >
            <Select
              labelId="statusDropdown"
              options={vendorOptions}
              name="category"
              value={vendor}
              label="Select Category"
              onChange={(selectdStatus) => handleAssignToVendor(selectdStatus)}
            />

            {/* <Button
              onClick={handleAssignToVendor}
              size="small"
              startIcon={<EditIcon fontSize="small" />}
            >
              Assign
            </Button> */}
          </Box>
        </Box>
      ) : null}
      <Typography sx={{ my: 3 }} variant="h6">
        Details
      </Typography>
      <PropertyList>
        <PropertyListItem
          align={align}
          disableGutters
          label="ID"
          value={order.id}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label="Number"
          value={order.cPhone}
        />
        <PropertyListItem align={align} disableGutters label="Customer">
          <Typography color="primary" variant="body2">
            {order.cName}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {order.cMail}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {order.city}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {order.area}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            {order.street}
          </Typography>
        </PropertyListItem>

        <PropertyListItem
          align={align}
          disableGutters
          label="Total Amount"
          value={`${order.grandTotal}`}
        />
        <PropertyListItem
          align={align}
          disableGutters
          label="Status"
          value={order.orderStatus}
        />
      </PropertyList>
      <Divider sx={{ my: 3 }} />
      <Typography sx={{ my: 3 }} variant="h6">
        Line items
      </Typography>
      <Scrollbar>
        <Table sx={{ minWidth: 400 }}>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Billing Cycle</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(order?.items || []).map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.name} x {item.quantity}
                </TableCell>
                <TableCell>{item.billingCycle}</TableCell>
                <TableCell>
                  {numeral(item.unitAmount).format(`${item.currency}0,0.00`)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </>
  );
};

const OrderForm = (props) => {
  const { onCancel, onSave, order } = props;

  return (
    <>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.800" : "neutral.100",
          borderRadius: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          px: 3,
          py: 2.5,
        }}
      >
        <Typography variant="overline" sx={{ mr: 2 }} color="textSecondary">
          Order
        </Typography>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            m: -1,
            "& > button": {
              m: 1,
            },
          }}
        >
          <Button
            color="primary"
            onClick={onSave}
            size="small"
            variant="contained"
          >
            Save changes
          </Button>
          <Button onClick={onCancel} size="small" variant="outlined">
            Cancel
          </Button>
        </Box>
      </Box>
      <Typography sx={{ my: 3 }} variant="h6">
        Details
      </Typography>
      <TextField
        disabled
        fullWidth
        label="ID"
        margin="normal"
        name="id"
        value={order.id}
      />
      <TextField
        disabled
        fullWidth
        label="Number"
        margin="normal"
        name="number"
        value={order.number}
      />
      <TextField
        disabled
        fullWidth
        label="Customer name"
        margin="normal"
        name="customer_name"
        value={order.customer.name}
      />
      <TextField
        disabled
        fullWidth
        label="Date"
        margin="normal"
        name="date"
        value={format(order.createdAt, "dd/MM/yyyy HH:mm")}
      />
      <TextField
        fullWidth
        label="Address"
        margin="normal"
        name="address"
        value={order.customer.address1}
      />
      <TextField
        fullWidth
        label="Country"
        margin="normal"
        name="country"
        value={order.customer.country}
      />
      <TextField
        fullWidth
        label="State/Region"
        margin="normal"
        name="state_region"
        value={order.customer.city}
      />
      <TextField
        fullWidth
        label="Total Amount"
        margin="normal"
        name="amount"
        value={order.totalAmount}
      />
      <TextField
        fullWidth
        label="Status"
        margin="normal"
        name="status"
        select
        SelectProps={{ native: true }}
        value={order.status}
      ></TextField>
      <Button color="error" sx={{ mt: 3 }}>
        Delete order
      </Button>
    </>
  );
};

const OrderDrawerDesktop = styled(Drawer)({
  width: 500,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    position: "relative",
    width: 500,
  },
});

const OrderDrawerMobile = styled(Drawer)({
  flexShrink: 0,
  maxWidth: "100%",
  height: "calc(100% - 64px)",
  width: 500,
  "& .MuiDrawer-paper": {
    height: "calc(100% - 64px)",
    maxWidth: "100%",
    top: 64,
    width: 500,
  },
});

export const OrderDrawer = (props) => {
  const { containerRef, onClose, open, order, ...other } = props;
  const [isEditing, setIsEditing] = useState(false);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // The reason for doing this, is that the persistent drawer has to be rendered, but not it's
  // content if an order is not passed.
  const content = order ? (
    <>
      <Box
        sx={{
          alignItems: "center",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          display: "flex",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Typography color="inherit" variant="h6">
          {order.number}
        </Typography>
        <IconButton color="inherit" onClick={onClose}>
          <XIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        sx={{
          px: 3,
          py: 4,
        }}
      >
        {!isEditing ? (
          <OrderPreview
            onApprove={onClose}
            onEdit={handleEdit}
            onReject={onClose}
            order={order}
            onclose={onClose}
            lgUp={lgUp}
          />
        ) : (
          <OrderForm
            onCancel={handleCancel}
            onSave={handleCancel}
            order={order}
          />
        )}
      </Box>
    </>
  ) : null;

  if (lgUp) {
    return (
      <OrderDrawerDesktop
        anchor="right"
        open={open}
        SlideProps={{ container: containerRef?.current }}
        variant="persistent"
        {...other}
      >
        {content}
      </OrderDrawerDesktop>
    );
  }

  return (
    <OrderDrawerMobile
      anchor="right"
      ModalProps={{ container: containerRef?.current }}
      onClose={onClose}
      open={open}
      SlideProps={{ container: containerRef?.current }}
      variant="temporary"
      {...other}
    >
      {content}
    </OrderDrawerMobile>
  );
};

OrderDrawer.propTypes = {
  containerRef: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  order: PropTypes.object,
};
