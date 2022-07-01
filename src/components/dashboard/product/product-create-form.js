/** @format */

import { useState, createRef, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import axios from "axios";
import config, { NetworkClient } from "../../../config";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import firebase from "../../../../Firebase";
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  FormHelperText,
  Grid,
  Switch,
  TextField,
  Checkbox,
  Typography,
  CardContent,
} from "@mui/material";
import Select from "react-select";

import { FileDropzone } from "../../file-dropzone";

const style = {
  percentageCard: {
    maxWidth: "158px",
    width: "100%",
    padding: "8px",
    fontSize: "18px",
    color: "#6B50E5",
  },
};

export const ProductCreateForm = ({ cityAndCategory }) => {
  const { categoryData, cityData } = cityAndCategory;
  const [city, selectCity] = useState([]);
  const [cat, setCat] = useState("");
  const [file, setFile] = useState(null);
  const [percent, setPercent] = useState(0);
  const [imageUrl, setImageUrl] = useState();
  const router = useRouter();
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

  // upload image to firebase
  const firebaseApp = firebase.getApp();
  const storage = getStorage(firebaseApp);

  // get the image from dropzone
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

  console.log(imageUrl);

  let formik = useFormik({
    initialValues: {
      name: "",
      ar_name: "",
      description: "",
      ar_description: "",
      is_multiple_allowed: true,
      price: 0,
      special_price: 0,
      status: true,
      isFeatured: false,
    },

    onSubmit: async (values, helpers) => {
      const payload = {
        ...values,
        image: imageUrl,
        city: city.map((e) => e.value),
        category_id: cat.value,
      };
      try {
        // NOTE: Make API request
        const res = await NetworkClient.post(`product/add`, payload);

        // console.log(res.data);
        toast.success("Product created!");
        router.push("/dashboard/products").catch(console.error);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <Card>
                <CardContent>
                  <FileDropzone
                    file={file}
                    maxFiles={1}
                    accept="image/*"
                    onDrop={handleDropSingleFile}
                  />
                  <Card style={style.percentageCard}>{percent}%</Card>

                  {/* <DropzoneArea
                    file={file}
                    onDrop={handleDropSingleFile}
                    name="image"
                    accept="image/*"
                    value={formik.values.file}
                  /> */}
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={4} xs={12}>
              <Typography variant="h6">Basic detssails</Typography>
            </Grid>
            <Grid item md={8} xs={12}>
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Product Name"
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

              <TextField
                error={Boolean(formik.touched.sku && formik.errors.sku)}
                fullWidth
                label="SKU"
                name="sku"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2 }}
                value={formik.values.sku}
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
                aria-label=" Description"
                value={formik.values.description}
                name="description"
                rows={6}
                onChange={formik.handleChange}
                multiline
                placeholder="Add  Description"
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
            <Grid item md={6} xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.is_multiple_allowed}
                    onChange={formik.handleChange}
                  />
                }
                label="Is Multipal Allowed"
                name="is_multiple_allowed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.status}
                    onChange={formik.handleChange}
                  />
                }
                label="Status"
                name="status"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.isFeatured}
                    onChange={formik.handleChange}
                  />
                }
                label="Is Featured"
                name="isFeatured"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <Typography variant="h6">Pricing</Typography>
            </Grid>
            <Grid item md={8} xs={12}>
              <TextField
                error={Boolean(formik.touched.price && formik.errors.price)}
                fullWidth
                label="Price"
                name="price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={formik.values.price}
              />
              <TextField
                error={Boolean(
                  formik.touched.special_price && formik.errors.special_price
                )}
                fullWidth
                label="New Price"
                name="special_price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                sx={{ mt: 2, mb: 2 }}
                type="number"
                value={formik.values.special_price}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* <Card sx={{ mt: 4 }}> */}
      <CardContent>
        <Grid container spacing={5}>
          <Grid item md={4} xs={12}>
            <Typography variant="h6"> Select Category</Typography>
          </Grid>
          <Grid item md={8} xs={12}>
            <Select
              labelId="demo-simple-select-label"
              options={catOptions}
              name="category"
              value={cat}
              label="Select Category"
              onChange={(selectCat) => setCat(selectCat)}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography variant="h6"> Select Cities </Typography>
          </Grid>
          <Grid item md={8} xs={12}>
            <Select
              labelId="city_id"
              name="city"
              options={cityOptions}
              error={Boolean(formik.touched.city && formik.errors.city)}
              value={city}
              label="Select City"
              onChange={(selectedOption) => selectCity(selectedOption)}
              isMulti
            />
          </Grid>
        </Grid>
      </CardContent>
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
