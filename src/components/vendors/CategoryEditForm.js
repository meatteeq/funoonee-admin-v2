import NextLink from "next/link";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";
import * as Yup from "yup";
import config, { NetworkClient } from "../../config";
import { useState, useEffect } from "react";
import firebase from "../../../Firebase";
import { FileDropzone } from "../file-dropzone";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import Select from "react-select";
// import { QuillEditor } from "../quill-editor";
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
import TextareaAutosize from "@mui/material/TextareaAutosize";

export const CategoryEditForm = ({ category }) => {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState(0);
  const [imageUrl, setImageUrl] = useState();
  const firebaseApp = firebase.getApp();
  const storage = getStorage(firebaseApp);
  const style = {
    percentageCard: {
      maxWidth: "158px",
      width: "100%",
      padding: "8px",
      fontSize: "18px",
      color: "#6B50E5",
    },
  };
  const formik = useFormik({
    initialValues: {
      name: category.name,
      ar_name: category.arName,
      description: category.description,
      ar_description: category.arDescription,
      image: "imag.jpg",

      status: true,
    },
    validationSchema: Yup.object({
      ar_name: Yup.string().required("Email is required"),
      name: Yup.string().max(255).required("Name is required"),
      // price: Yup.number().required("Price  is required"),
      //   image: Yup.string().required("Image is required"),
      // special_price: Yup.string().required("special is required"),
      // sku: Yup.string().required("sku is required"),
      description: Yup.string().required("description is required"),
      ar_description: Yup.string().required("ar_description is Required"),
    }),
    onSubmit: async (values, helpers) => {
      const payload = {
        ...values,
        image: imageUrl,
      };
      try {
        // NOTE: Make API request
        const res = await NetworkClient.put(
          `${config.apiRoute}/category/${category.id}`,
          payload
        );

        // console.log(res.data);
        toast.success("Category Updated!");
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
  const handleDropSingleFile = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileObj = {
        ...file,
        preview: URL.createObjectURL(file),
        fileData: file,
      };
      setFile(fileObj);
    }

    const storageRef = ref(storage, `/files/${file.path}`);
    const uploadProcess = uploadBytesResumable(storageRef, file);

    uploadProcess.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadProcess.snapshot.ref).then((url) => {
          setImageUrl(url);
        });
      }
    );
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader title="Edit Category" />
        <Divider />
        <CardContent>
          <FileDropzone
            file={file}
            maxFiles={1}
            accept="image/*"
            onDrop={handleDropSingleFile}
          />
          <Card style={style.percentageCard}>{percent}%</Card>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
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
                error={Boolean(formik.touched.ar_name && formik.errors.ar_name)}
                fullWidth
                helperText={formik.touched.ar_name && formik.errors.ar_name}
                label="ar_name "
                name="ar_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.ar_name}
              />
            </Grid>

            <Grid item md={6} xs={12}>
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
              <TextField
                aria-label="Description"
                rows={6}
                multiline
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                placeholder="Add Description"
                style={{ width: 430 }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
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
              <TextField
                aria-label="Ar Description"
                value={formik.values.ar_description}
                name="ar_description"
                rows={6}
                onChange={formik.handleChange}
                multiline
                placeholder="Add Ar Description"
                style={{ width: 430 }}
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
            disabled={formik.isSubmitting}
            type="submit"
            sx={{ m: 1 }}
            variant="contained"
          >
            Update
          </Button>
          <NextLink href="/dashboard/category" passHref>
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

CategoryEditForm.propTypes = {
  customer: PropTypes.object.isRequired,
};
