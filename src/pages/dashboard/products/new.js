import { useEffect } from "react";
import NextLink from "next/link";
import Head from "next/head";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { ProductCreateForm } from "../../../components/dashboard/product/product-create-form";
import { gtm } from "../../../lib/gtm";
import axios from "axios";
import config, { NetworkClient } from "../../../config";
import Cookies from "js-cookie";
import {
  isUserAuthenticated,
  redirectFromServerSideTo,
} from "../../../../helper";
const ProductCreate = ({ data }) => {
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard: Product Create</title>
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
            <Typography variant="h4">Create a new product</Typography>
            <Breadcrumbs separator="/" sx={{ mt: 1 }}>
              <NextLink href="/dashboard" passHref>
                <Link variant="subtitle2">Dashboard</Link>
              </NextLink>
              <NextLink href="/dashboard" passHref>
                <Link color="primary" variant="subtitle2">
                  Management
                </Link>
              </NextLink>
              <Typography color="textSecondary" variant="subtitle2">
                Products
              </Typography>
            </Breadcrumbs>
          </Box>
          <ProductCreateForm cityAndCategory={data} />
        </Container>
      </Box>
    </>
  );
};

ProductCreate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
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

export default ProductCreate;
