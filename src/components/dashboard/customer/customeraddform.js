import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import config from "../../config";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Switch,
  TextField,
  InputLabel,
  Typography,
} from "@mui/material";
import Select from "react-select";

import { FileDropzone } from "../file-dropzone";
import { QuillEditor } from "../quill-editor";
import React from "react";

export const VendorAddForm = ({ cityAndCategory }) => {
  const { categoryData, cityData } = cityAndCategory;
  const [serviceData, setServicesData] = useState();
  const [service, setService] = useState();

  const [city, selectCity] = useState([]);
  const [cat, setCat] = useState("");
  console.log(cat);
  console.log(city);
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const catOptions =
    categoryData &&
    categoryData?.map(function (ser) {
      return { value: ser.id, label: ser.name };
    });
  const cityOptions =
    cityData &&
    cityData?.map(function (ser) {
      return { value: ser.id, label: ser.name };
    });
  let serviceOptions =
    serviceData &&
    serviceData?.products?.map(function (ser) {
      return { value: ser.id, label: ser.name };
    });
  useEffect(async () => {
    if (city && cat) {
      try {
        const res = await axios.get(
          `${config.apiRoute}/category/products/${cat.value}&${city.value}`
        );
        setServicesData(res.data);
        console.log(res.data);
      } catch (e) {
        console.log(e);
      }
    }
  }, [city, cat]);
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      document: ["dd", "ds"],
      street: "",
      postalCode: "",
      country: "",
      street: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      name: Yup.string().max(255).required("Name is required"),
      phoneNumber: Yup.string().required("Number is required"),
      postalCode: Yup.string().required("postalCode is required"),
      country: Yup.string().required("country is required"),
      street: Yup.string().required("street is required"),
    }),
    onSubmit: async (values, helpers) => {
      console.log("submit run");
      const payload = {
        ...values,
        category: [cat.value],
        city: city.value,
        service: service.map((e) => e.value),
      };

      try {
        // NOTE: Make API request
        const res = await axios.post(
          `${config.apiRoute}/customer/registration`,
          payload,
          {
            headers: {
              Authorization: config.token,
            },
          }
        );

        console.log(res.data);
        toast.success("Vendor created!");
        router.push("/dashboard/customers").catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });
  const handleDrop = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleRemove = (file) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_file) => _file.path !== file.path)
    );
  };

  const handleRemoveAll = () => {
    setFiles([]);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <Typography variant="h6">Basic details</Typography>
            </Grid>
            <Grid item md={8} xs={12}>
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Vendor Name"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <TextField
                sx={{
                  // mb: 1,
                  mt: 3,
                }}
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label="Vendor Email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />

              <TextField
                error={Boolean(
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                )}
                fullWidth
                label="phoneNumber"
                name="phoneNumber"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.phoneNumber}
              />
              <TextField
                error={Boolean(formik.touched.country && formik.errors.country)}
                fullWidth
                label="country"
                name="country"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.country}
              />
              <TextField
                error={Boolean(
                  formik.touched.postalCode && formik.errors.postalCode
                )}
                fullWidth
                label="postalCode"
                name="postalCode"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.postalCode}
              />
              <TextField
                error={Boolean(formik.touched.street && formik.errors.street)}
                fullWidth
                label="street"
                name="street"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.street}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <Typography variant="h6">Images</Typography>
              <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                Images will appear in the store front of your website.
              </Typography>
            </Grid>
            <Grid item md={8} xs={12}>
              <FileDropzone
                accept={{
                  "image/*": [],
                }}
                files={files}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* <Card sx={{ mt: 4 }}> */}

      {/* </Card> */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          mx: -1,
          mb: -1,
          mt: 3,
        }}
      >
        {/* <Button
          color="error"
          sx={{
            m: 1,
            mr: "auto",
          }}
        >
          Delete
        </Button> */}
        {/* <Button sx={{ m: 1 }} variant="outlined">
          Cancel
        </Button> */}
        <Button
          sx={{ m: 1 }}
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
        >
          Create
        </Button>
      </Box>
    </form>
  );
};
export default VendorAddForm;
