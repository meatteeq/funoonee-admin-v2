import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import config from "../../../config";
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

import { FileDropzone } from "../../file-dropzone";
import { QuillEditor } from "../../quill-editor";

const categoryOptions = [
  {
    label: "Healthcare",
    value: "healthcare",
  },
  {
    label: "Makeup",
    value: "makeup",
  },
  {
    label: "Dress",
    value: "dress",
  },
  {
    label: "Skincare",
    value: "skincare",
  },
  {
    label: "Jewelry",
    value: "jewelry",
  },
  {
    label: "Blouse",
    value: "blouse",
  },
];

export const CategoryCreateForm = ({ cityAndCategory }) => {
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      ar_name: "",
      description: "",
      ar_description: "",
      image: "imag.jpg",

      status: true,
    },
    validationSchema: Yup.object({
      ar_name: Yup.string().required("Email is required"),
      name: Yup.string().max(255).required("Name is required"),
      // price: Yup.number().required("Price  is required"),
      image: Yup.string().required("Image is required"),
      // special_price: Yup.string().required("special is required"),
      // sku: Yup.string().required("sku is required"),
      description: Yup.string().required("description is required"),
      ar_description: Yup.string().required("ar_description is Required"),
    }),
    onSubmit: async (values, helpers) => {
      console.log("submit run");
      console.log(values);
      try {
        // NOTE: Make API request
        const res = await axios.post(
          `${config.apiRoute}/category/add`,
          values,
          {
            headers: {
              Authorization: config.token,
            },
          }
        );

        console.log(res.data);
        toast.success("Category created!");
        router.push("/dashboard/category").catch(console.error);
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
  console.log(formik.values);
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
                label="Category Name"
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
                error={Boolean(formik.touched.ar_name && formik.errors.ar_name)}
                fullWidth
                helperText={formik.touched.ar_name && formik.errors.ar_name}
                label="Ar Name"
                name="ar_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.ar_name}
              />

              <Typography
                color="textSecondary"
                sx={{
                  mb: 2,
                  mt: 3,
                }}
                variant="subtitle2"
              >
                Description
              </Typography>
              <QuillEditor
                onChange={(value) => {
                  formik.setFieldValue("description", value);
                }}
                placeholder="Write something"
                sx={{ height: 200 }}
                value={formik.values.description}
              />
              <Typography
                color="textSecondary"
                sx={{
                  mb: 2,
                  mt: 3,
                }}
                variant="subtitle2"
              >
                Ar Description
              </Typography>
              <QuillEditor
                onChange={(value) => {
                  formik.setFieldValue("ar_description", value);
                }}
                placeholder="Write something"
                sx={{ height: 200 }}
                value={formik.values.ar_description}
              />
              {Boolean(
                formik.touched.ar_description && formik.errors.ar_description
              ) && (
                <Box sx={{ mt: 2 }}>
                  <FormHelperText error>
                    {formik.errors.ar_description}
                  </FormHelperText>
                </Box>
              )}
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
      {/* <Card sx={{ mt: 3 }}> */}

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
        <Button sx={{ m: 1 }} variant="outlined">
          Cancel
        </Button>
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
