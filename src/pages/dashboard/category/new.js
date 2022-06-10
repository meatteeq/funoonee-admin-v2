import { useEffect } from "react";
import NextLink from "next/link";
import Head from "next/head";
import { Box, Breadcrumbs, Container, Link, Typography } from "@mui/material";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { gtm } from "../../../lib/gtm";
import axios from "axios";
import config from "../../../config";
import Cookies from "js-cookie";
import { redirectFromServerSideTo } from "../../../../helper";
import { CategoryCreateForm } from "../../../components/dashboard/product/create-cat-form";
const CategoryCreate = ({ data }) => {
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard: Category Create</title>
      </Head>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth='md'>
          <Box sx={{ mb: 3 }}>
            <Typography variant='h4'>Create a new Category</Typography>
            <Breadcrumbs separator='/' sx={{ mt: 1 }}>
              <NextLink href='/dashboard' passHref>
                <Link variant='subtitle2'>Dashboard</Link>
              </NextLink>
              <NextLink href='/dashboard' passHref>
                <Link color='primary' variant='subtitle2'>
                  Management
                </Link>
              </NextLink>
              <Typography color='textSecondary' variant='subtitle2'>
                Categories
              </Typography>
            </Breadcrumbs>
          </Box>
          <CategoryCreateForm />
        </Container>
      </Box>
    </>
  );
};

CategoryCreate.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies?.accessToken) {
    redirectFromServerSideTo(ctx, "/");
  }
  return {
    props: {},
  };
}

export default CategoryCreate;
