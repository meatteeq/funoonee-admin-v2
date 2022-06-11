import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
// import { useRouter } from "next/router";
import Router from "next/router";
import { useFormik } from "formik";
import axios from "axios";
import config from "../config";
import Cookies from "js-cookie";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";

const Login = () => {
  const [error, setError] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  // const router = useRouter();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      phoneNumber: Yup.string().max(15).required("Number is required"),
    }),
    onSubmit: async ({ phoneNumber }) => {
      // console.log(phoneNumber);
      try {
        const { data } = await axios.post(config.apiRoute + "admin/signin", {
          phoneNumber,
        });
        // console.log(data, "data");

        const { challengeChannel, authSessionToken } = data;
        const getToken = await axios.post(config.apiRoute + "admin/signin", {
          challenge: challengeChannel.toString(),
          authSessionToken: authSessionToken,
        });
        Cookies.set("accessToken", `Bearer ${getToken.data.accessToken}`);
        // console.log(Cookies.get("accessToken"));
        localStorage.setItem("accessToken", getToken.data.accessToken);
        Router.push("/dashboard/customers");

        return getToken.data;
      } catch (error) {
        console.log(error);
        if (error.response.status >= 400 && error.response.status < 500) {
          setError(true);
        } else if (error.response.status >= 500) {
          setNetworkError(true);
        }
      }
    },
  });

  const login = async (phoneNumber) => {
    try {
      const { data } = await axios.post(config.apiRoute + "admin/signin", {
        phoneNumber,
      });
      // console.log(data, "data");

      const { challengeChannel, authSessionToken } = data;
      const getToken = await axios.post(config.apiRoute + "admin/signin", {
        challenge: challengeChannel.toString(),
        authSessionToken: authSessionToken,
      });
      // console.log(getToken.data.accessToken, "token data");
      Cookies.set("accessToken", getToken.data.accessToken);
      localStorage.setItem("accessToken", getToken.data.accessToken);
      // Router.push("/dashboard/customers");

      return getToken.data;
    } catch (error) {
      console.log(error);
      if (error.response.status >= 400 && error.response.status < 500) {
        setError(true);
      } else if (error.response.status >= 500) {
        setNetworkError(true);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Login | Material Kit</title>
      </Head>
      <Box
        component='main'
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100%",
        }}
      >
        <Container maxWidth='sm'>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography color='textPrimary' variant='h4'>
                Sign in
              </Typography>
            </Box>

            <Box
              sx={{
                pb: 1,
                pt: 3,
              }}
            >
              <Typography align='center' color='textSecondary' variant='body1'>
                login with number
              </Typography>
            </Box>
            <TextField
              error={Boolean(
                formik.touched.phoneNumber && formik.errors.phoneNumber
              )}
              fullWidth
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              label='phoneNumber '
              margin='normal'
              name='phoneNumber'
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type='phoneNumber'
              value={formik.values.phoneNumber}
              variant='outlined'
              onFocus={() => {
                setError(false);
                setNetworkError(false);
              }}
            />
            <p style={{ color: "red" }}>
              {error
                ? "Please enter a valied number"
                : networkError && "Network Error. Please try again later"}
            </p>
            <Box sx={{ py: 2 }}>
              <Button
                color='primary'
                disabled={formik.isSubmitting}
                fullWidth
                size='large'
                type='submit'
                variant='contained'
              >
                Sign In Now
              </Button>
            </Box>
            {/* <Typography color='textSecondary' variant='body2'>
              Don&apos;t have an account?{" "}
              <NextLink href='/register'>
                <Link
                  to='/register'
                  variant='subtitle2'
                  underline='hover'
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography> */}
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
