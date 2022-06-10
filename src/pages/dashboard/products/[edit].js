import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import Head from "next/head";
import { Avatar, Box, Chip, Container, Link, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import axios from "axios";
import config from "../../../config";
import { ProductEditForm } from "../../../components/dashboard/product/productEditForm";
import { getInitials } from "../../../utils/get-initials";
import Cookies from "js-cookie";
import { redirectFromServerSideTo } from "../../../../helper";
const ProductEdit = ({ data }) => {
  const { productData } = data;

  if (!productData) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard: product Edit </title>
      </Head>
      <Box
        component='main'
        sx={{
          backgroundColor: "background.default",
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth='md'>
          <Box sx={{ mb: 4 }}>
            <NextLink href='/dashboard/products' passHref>
              <Link
                color='textPrimary'
                component='a'
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowBackIcon fontSize='small' sx={{ mr: 1 }} />
                <Typography variant='subtitle2'>Product</Typography>
              </Link>
            </NextLink>
          </Box>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              overflow: "hidden",
            }}
          >
            <Avatar
              src={productData.image}
              sx={{
                height: 64,
                mr: 2,
                width: 64,
              }}
            >
              {getInitials(productData.name)}
            </Avatar>
            <div>
              <Typography noWrap variant='h4'>
                {productData.email}
              </Typography>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography variant='subtitle2'>user_id:</Typography>
                <Chip label={productData.id} size='small' sx={{ ml: 1 }} />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <ProductEditForm product={data} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

ProductEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export async function getServerSideProps({ params: { edit }, ...ctx }) {
  if (!ctx.req.cookies?.accessToken) {
    redirectFromServerSideTo(ctx, "/");
  }
  const cityAndCategory = await Promise.all([
    axios.get(`${config.apiRoute}/category/list`, {
      headers: {
        Authorization: config.token,
      },
    }),
    axios.get(`${config.apiRoute}/city/list`, {
      headers: {
        Authorization: config.token,
      },
    }),
    axios.get(`${config.apiRoute}/product/${edit}`, {
      headers: {
        Authorization: config.token,
      },
    }),
  ])
    .then((resArray) => {
      const [categoryList, cityList, product] = resArray;
      const data = {
        categoryData: categoryList?.data,
        cityData: cityList?.data,
        productData: product?.data,
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
export default ProductEdit;
