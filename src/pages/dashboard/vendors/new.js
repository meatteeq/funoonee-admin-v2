import axios from "axios";
import config, { NetworkClient } from "../../../config";
import Head from "next/head";
import { useFormik } from "formik";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import VendorAddForm from "../../../components/vendors/vendorAddForm";
import Cookies from "js-cookie";
import {
  isUserAuthenticated,
  redirectFromServerSideTo,
} from "../../../../helper";

const AddVendors = ({ data }) => {
  return (
    <>
      <Head>
        <title>Dashboard: Vendor Create</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4">Create a new Vendor</Typography>
            <Breadcrumbs separator="/" sx={{ mt: 1 }}>
              <NextLink href="/dashboard" passHref>
                <Link variant="subtitle2">Dashboard</Link>
              </NextLink>
              <NextLink href="/dashboard/vendors" passHref>
                <Link color="primary" variant="subtitle2">
                  All Vendors
                </Link>
              </NextLink>
              <Typography color="textSecondary" variant="subtitle2">
                Vendors
              </Typography>
            </Breadcrumbs>
          </Box>
          <VendorAddForm cityAndCategory={data} />{" "}
        </Container>
      </Box>
    </>
  );
};
AddVendors.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies?.accessToken) {
    redirectFromServerSideTo(ctx, "/");
  }
  isUserAuthenticated(ctx);
  const cityAndCategory = await Promise.all([
    axios.get(`${config.apiRoute}category/list`),
    axios.get(`${config.apiRoute}city/list`),
  ])
    .then((resArray) => {
      const [categoryList, cityList] = resArray;
      const data = {
        categoryData: categoryList?.data,
        cityData: cityList?.data,
      };
      // console.log(data);
      return data;
    })
    .catch((e) => {
      console.log(e);
    });
  return {
    props: {
      data: cityAndCategory,
    },
  };
}

export default AddVendors;
