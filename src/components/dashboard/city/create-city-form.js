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
// import { QuillEditor } from "../../quill-editor";

export const CreateNewCityForm = ({ cityAndCategory }) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",

      status: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Email is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        const res = await axios.post(`${config.apiRoute}/city/add`, values, {
          headers: {
            Authorization: config.token,
          },
        });

        // console.log(res.data);
        toast.success("City created!");
        router.push("/dashboard/cities").catch(console.error);
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
  // console.log(formik.values);
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
                label='City Name'
                name='name'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
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
        {/* <Button sx={{ m: 1 }} variant="outlined">
          Cancel
        </Button> */}
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
