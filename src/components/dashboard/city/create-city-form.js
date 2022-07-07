import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import config, { NetworkClient } from "../../../config";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

export const CreateNewCityForm = () => {
  const [errorMessage, setErrorMessage] = useState();
  const [checkError, setCheckError] = useState(false);
  const router = useRouter();
  const AlertData = (message) => {
    console.log("message");
    return (
      <>
        <Alert severity="error" onClose={() => {}}>
          <AlertTitle>Error</AlertTitle>
          {message}
        </Alert>
      </>
    );
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      ar_name: "",

      status: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      ar_name: Yup.string().required("Ar Name is required"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        const res = await NetworkClient.post(`city/add`, values);

        console.log(res.data);
        toast.success(res.data.message);
        router.push("/dashboard/cities").catch(console.error);
      } catch (err) {
        console.error(err);
        setErrors(err.message);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        {checkError && <AlertData message={errorMessage} />}
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
              <TextField
                error={Boolean(formik.touched.name && formik.errors.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors.name}
                label="City Name"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Grid>
            <Grid item md={8} xs={12}>
              <TextField
                error={Boolean(formik.touched.ar_name && formik.errors.ar_name)}
                fullWidth
                helperText={formik.touched.ar_name && formik.errors.ar_name}
                label="City Ar Name"
                name="ar_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.ar_name}
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
        <Button
          sx={{ m: 1 }}
          type="submit"
          variant="contained"
          disabled={!(formik.isValid && formik.dirty)}
        >
          Create
        </Button>
      </Box>
    </form>
  );
};
