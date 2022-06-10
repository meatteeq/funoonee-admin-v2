import NextLink from "next/link";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import axios from "axios";
import * as Yup from "yup";
import config, { NetworkClient } from "../../config";
import { useState, useEffect } from "react";
import Select from "react-select";
import { QuillEditor } from "../quill-editor";
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

export const CategoryEditForm = ({ category }) => {
  const router = useRouter();
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
      try {
        // NOTE: Make API request
        const res = await NetworkClient.put(
          `${config.apiRoute}/category/${category.id}`,
          values
        );

        console.log(res.data);
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader title="Edit Category" />
        <Divider />
        <CardContent>
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
              <QuillEditor
                onChange={(value) => {
                  formik.setFieldValue("description", value);
                }}
                placeholder="Write something"
                sx={{ height: 200 }}
                value={formik.values.description}
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
