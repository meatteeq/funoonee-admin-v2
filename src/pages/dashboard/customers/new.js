import axios from "axios";
import config from "../../../config";
import Head from "next/head";
import { useFormik } from "formik";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import VendorAddForm from "../../../components/vendors/vendorAddForm";
import CustomerAddForm from "../../../components/dashboard/customer/customeraddform";

const AddCustomer = ({ data }) => {
  return (
    <>
      <Head>
        <title>Dashboard: Customer Create</title>
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
            <Typography variant="h4">Create a new Customer</Typography>
            <Breadcrumbs separator="/" sx={{ mt: 1 }}>
              <NextLink href="/dashboard" passHref>
                <Link variant="subtitle2">Dashboard</Link>
              </NextLink>
              <NextLink href="/dashboard/customers" passHref>
                <Link color="primary" variant="subtitle2">
                  All Customers
                </Link>
              </NextLink>
              <Typography color="textSecondary" variant="subtitle2">
                Customers
              </Typography>
            </Breadcrumbs>
          </Box>
          <CustomerAddForm />
        </Container>
      </Box>
    </>
  );
};
AddCustomer.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default AddCustomer;
