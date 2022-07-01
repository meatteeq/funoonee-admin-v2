import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import config, { NetworkClient } from "../../../config";
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
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import firebase from "../../../../Firebase";

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
      const payload = {
        ...values,
        image: imageUrl,
      };
      try {
        // NOTE: Make API request
        const res = await NetworkClient.post(`category/add`, payload);

        toast.success("Category created!");
        router.push("/dashboard/category").catch(console.error);
      } catch (err) {
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
          <FileDropzone
            file={file}
            maxFiles={1}
            accept="image/*"
            onDrop={handleDropSingleFile}
          />
          <Card style={style.percentageCard}>{percent}%</Card>

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
              <TextField
                aria-label="Description"
                rows={6}
                multiline
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                placeholder="Add Description"
                style={{ width: 590 }}
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
              <TextField
                aria-label="Ar Description"
                value={formik.values.ar_description}
                name="ar_description"
                rows={6}
                onChange={formik.handleChange}
                multiline
                placeholder="Add Ar Description"
                style={{ width: 590 }}
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
            {/* <Grid item md={4} xs={12}>
              <Typography variant="h6">Images</Typography>
              <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                Images will appear in the store front of your website.
              </Typography>
            </Grid> */}
            {/* <Grid item md={8} xs={12}>
              <FileDropzone
                accept={{
                  "image/*": [],
                }}
                files={files}
                onDrop={handleDrop}
                onRemove={handleRemove}
                onRemoveAll={handleRemoveAll}
              />
            </Grid> */}
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
