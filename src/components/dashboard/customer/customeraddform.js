import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import config from "../../../config";
import {
  RadioGroup,
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
  Radio,
  FormLabel,
} from "@mui/material";
import Select from "react-select";
import { FileDropzone } from "../../file-dropzone";
import React from "react";
import uploadToServer from "../../../utils/uploadImage";

export const CustomerAddForm = () => {
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      image: "imag.jpg",
      gender: "",
      role: "3",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      name: Yup.string().max(255).required("Name is required"),
      gender: Yup.string().max(255).required("gender is required"),

      phoneNumber: Yup.string().required("Number is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        const res = await axios.post(
          `${config.apiRoute}/admin/user/add`,
          values,
          {
            headers: {
              Authorization: config.token,
            },
          }
        );

        // console.log(res.data);
        toast.success("Customer created!");
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
  const uploadFile = async (id) => {
    const fileToUpload = document.getElementById("upload-image");
    // console.log("fileToUpload", fileToUpload?.files[0]);
    const file = fileToUpload.files[0];
    const upload = fileToUpload.value;
    // console.log("upload", upload);

    const reader = new FileReader();

    // if(!file) return

    if (file) {
      reader.readAsDataURL(file);
      const result = await uploadToServer(file);
      // console.log("result", result);
      if (result) {
        setFiles({ ...imageSrc, image: result });
      }
    }
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <Typography variant='h6'>Basic details</Typography>
            </Grid>
            <Grid item md={8} xs={12}>
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label='Customer Name'
                name='name'
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
                label='Customer Email'
                name='email'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />

              <TextField
                error={Boolean(
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                )}
                fullWidth
                label='phoneNumber'
                name='phoneNumber'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.phoneNumber}
              />
              <RadioGroup
                error={Boolean(formik.touched.gender && formik.errors.gender)}
                fullWidth
                helperText={formik.touched.gender && formik.errors.gender}
                label='Gender'
                margin='normal'
                name='gender'
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <FormLabel
                  id='demo-controlled-radio-buttons-group'
                  sx={{
                    // mb: 1,
                    mt: 3,
                  }}
                >
                  Gender
                </FormLabel>

                <FormControlLabel
                  value='Female'
                  control={<Radio />}
                  label='Female'
                />
                <FormControlLabel
                  value='Male'
                  control={<Radio />}
                  label='Male'
                />
              </RadioGroup>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* <Card sx={{ mt: 3 }}>
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
                  "image/*": "",
                }}
                id="upload-image"
                files={files}
                onDrop={uploadFile}
                onRemove={handleRemove}
                // onRemoveAll={handleRemoveAll}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}

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
        <Button
          sx={{ m: 1 }}
          type='submit'
          variant='contained'
          disabled={formik.isSubmitting}
        >
          Create
        </Button>
      </Box>
    </form>
  );
};
export default CustomerAddForm;
