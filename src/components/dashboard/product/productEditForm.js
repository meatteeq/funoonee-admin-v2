import NextLink from "next/link";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";
import * as Yup from "yup";
import config from "../../../config";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useFormik } from "formik";
import { QuillEditor } from "../../quill-editor";
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { wait } from "../../../utils/wait";
export const ProductEditForm = ({ product }) => {
  const { categoryData, cityData, productData } = product;
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
  useEffect(() => {
    const filteredData = cityData.filter((e) =>
      productData?.city?.includes(e.id)
    );
    const cityFiltered =
      filteredData &&
      filteredData?.map(function (ser) {
        return { value: ser.id, label: ser.name };
      });

    selectCity(cityFiltered);
  }, []);
  useEffect(() => {
    const filteredData = categoryData.filter(
      (e) => productData?.categoryId == e.id
    );
    const catFiltered =
      filteredData &&
      filteredData?.map(function (ser) {
        return { value: ser.id, label: ser.name };
      });
    setCat(catFiltered);
  }, []);
  const formik = useFormik({
    initialValues: {
      name: productData.name,
      ar_name: productData.arName,
      description: productData.description,
      ar_description: productData.arDescription,
      image: "imag.jpg",
      is_multiple_allowed: productData.isMultipleAllowed,
      price: productData.price,
      special_price: productData.specialPrice,
      status: productData.status,
      sku: productData.sku,
      isFeatured:
        productData.isFeatured == null ? false : productData.isFeatured,
    },
    onSubmit: async (values, helpers) => {
      const payload = {
        ...values,
        city: city.map((e) => e.value),
        category_id: cat[0].value,
      };
      console.log("payload", payload);
      try {
        const res = await axios.put(
          `${config.apiRoute}/product/${productData.id}`,
          payload,
          {
            headers: {
              Authorization: config.token,
            },
          }
        );
        await wait(500);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success("Product updated!");
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
        <CardHeader title="Edit Product" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="Name"
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
                label="Ar Name"
                name="ar_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.ar_name}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(formik.touched.price && formik.errors.price)}
                fullWidth
                helperText={formik.touched.price && formik.errors.price}
                label="Price"
                name="price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.price}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                error={Boolean(
                  formik.touched.special_price && formik.errors.special_price
                )}
                fullWidth
                helperText={
                  formik.touched.special_price && formik.errors.special_price
                }
                label="special_price "
                name="special_price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.special_price}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <QuillEditor
                onChange={(value) => {
                  formik.setFieldValue("description", value);
                }}
                placeholder="Write Description"
                sx={{ height: 200 }}
                value={formik.values.description}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <QuillEditor
                onChange={(value) => {
                  formik.setFieldValue("ar_description", value);
                }}
                placeholder="Write Ar Descripton"
                sx={{ height: 200 }}
                value={formik.values.ar_description}
              />
            </Grid>

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
            <TextField
              sx={{ mt: 2 }}
              error={Boolean(formik.touched.sku && formik.errors.sku)}
              fullWidth
              helperText={formik.touched.sku && formik.errors.sku}
              label="SKU"
              name="sku"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              required
              value={formik.values.sku}
            />
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

ProductEditForm.propTypes = {
  customer: PropTypes.object.isRequired,
};
