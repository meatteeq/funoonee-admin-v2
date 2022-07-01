import NextLink from "next/link";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";
import * as Yup from "yup";
import config, { NetworkClient } from "../../config";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { wait } from "../../utils/wait";

export const VendorEditForm = ({ vendor }) => {
  const router = useRouter();

  const [venodrEditStatus, setStatus] = useState("");
  const formik = useFormik({
    initialValues: {
      name: vendor.name,
      email: vendor.email,
      phoneNumber: vendor.phoneNumber,
      street: vendor.street,
      postalCode: vendor.postalCode,
      country: vendor.country,
      status: vendor.status,
    },
    onSubmit: async (values, helpers) => {
      const payload = {
        status: venodrEditStatus.value,
      };
      try {
        const res = await NetworkClient.put(
          `vendor/change-status/${vendor.id}`,
          payload
        );
        await wait(500);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success("Vendor updated!");
        router.push("/dashboard/vendors").catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });
  const venodrStatus = [
    {
      value: "PENDING",
      label: "PENDING",
    },
    {
      value: "APPROVED",
      label: "APPROVED",
    },
    {
      value: "REJECT",
      label: "REJECT",
    },
  ];

  useEffect(() => {
    const datas = venodrStatus.filter((item) => item.label === vendor?.status);
    // console.log();
    setStatus(datas[0]);
  }, [vendor]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader title="Edit Vendor" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                disabled
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Full name"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.name}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                disabled
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Email address"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.email}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                disabled
                error={Boolean(
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                )}
                fullWidth
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                label="phoneNumber "
                name="phoneNumber"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.phoneNumber}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                disabled
                error={Boolean(formik.touched.country && formik.errors.country)}
                fullWidth
                helperText={formik.touched.country && formik.errors.country}
                label="Country"
                name="country"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.country}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                disabled
                error={Boolean(formik.touched.city && formik.errors.city)}
                fullWidth
                helperText={formik.touched.city && formik.errors.city}
                label="city/Region"
                name="city"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.state}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                disabled
                error={Boolean(
                  formik.touched.postalCode && formik.errors.postalCode
                )}
                fullWidth
                helperText={
                  formik.touched.postalCode && formik.errors.postalCode
                }
                label="Postal Code"
                name="postalCode"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.postalCode}
              />
            </Grid>
            {/* <Grid item md={6} xs={12}> */}
            {/* <TextField
                disabled
                error={Boolean(formik.touched.country && formik.errors.country)}
                fullWidth
                helperText={formik.touched.country && formik.errors.country}
                label="Address 2"
                name="country"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.country}
              />
            </Grid> */}
            <Grid item md={6} xs={12}>
              <Select
                isDisabled={
                  vendor.value == "APPROVED" || "REJECT" ? true : false
                }
                labelId="demo-simple-select-label"
                options={venodrStatus}
                name="status"
                value={venodrEditStatus}
                label="Select Status"
                onChange={(selectCat) => setStatus(selectCat)}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
            }}
          ></Box>
          <Divider sx={{ my: 3 }} />
        </CardContent>
        <CardActions
          sx={{
            flexWrap: "wrap",
            m: -1,
          }}
        >
          <Button
            disabled={vendor?.value == "APPROVED" || "REJECT" ? true : false}
            type="submit"
            sx={{ m: 1 }}
            variant="contained"
          >
            Update
          </Button>
          <NextLink href="/dashboard/vendors" passHref>
            <Button
              component="a"
              disabled={formik.isSubmitting}
              sx={{
                m: 1,
                mr: "auto",
              }}
              variant="outlined"
            >
              Cancel
            </Button>
          </NextLink>
        </CardActions>
      </Card>
    </form>
  );
};

VendorEditForm.propTypes = {
  customer: PropTypes.object.isRequired,
};
