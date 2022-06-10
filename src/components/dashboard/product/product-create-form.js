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

export const ProductCreateForm = ({ cityAndCategory }) => {
  const { categoryData, cityData } = cityAndCategory;
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

  const formik = useFormik({
    initialValues: {
      name: "",
      ar_name: "",
      description: "",
      ar_description: "",
      image: "imag.jpg",
      is_multiple_allowed: true,
      price: 0,
      special_price: 0,
      status: true,
      isFeatured: false,
    },
    // validationSchema: Yup.object({
    //   ar_name: Yup.string().required("Email is required"),
    //   name: Yup.string().max(255).required("Name is required"),
    //   price: Yup.number().required("Price  is required"),
    //   image: Yup.string().required("Image is required"),
    //   special_price: Yup.string().required("special is required"),
    //   sku: Yup.string().required("sku is required"),
    //   description: Yup.string().required("description is required"),
    //   ar_description: Yup.string().required("ar_description is Required"),
    //   category: Yup.string().required("cities are required"),
    //   city: Yup.array().required("cities are required"),
    // }),
    onSubmit: async (values, helpers) => {
      console.log("submit run");
      const payload = {
        ...values,
        city: city.map((e) => e.value),
        category_id: cat.value,
      };
      console.log(payload);

      try {
        // NOTE: Make API request
        const res = await axios.post(
          `${config.apiRoute}/product/add`,
          payload,
          {
            headers: {
              Authorization: config.token,
            },
          }
        );

        console.log(res.data);
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
      </Card> */}
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
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={<Switch />}
                  label="isMultipleAllowed"
                />
              </Box>
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
