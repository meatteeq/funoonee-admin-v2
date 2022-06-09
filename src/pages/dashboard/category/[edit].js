import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import Head from "next/head";
import { Avatar, Box, Chip, Container, Link, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { customerApi } from "../../../../__fake-api__/customer-api";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";

import { getInitials } from "../../../utils/get-initials";
import axios from "axios";
import config from "../../../config";
import { CategoryEditForm } from "../../../components/vendors/CategoryEditForm";
const CategoryEdit = ({ data }) => {
  const category = data;

  if (!category) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard: Category Edit </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <NextLink href="/dashboard/vendors" passHref>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Category</Typography>
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
              src={category.avatar}
              sx={{
                height: 64,
                mr: 2,
                width: 64,
              }}
            >
              {getInitials(category.name)}
            </Avatar>
            <div>
              {/* <Typography noWrap variant="h4">
                {category.email}
              </Typography> */}
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Typography variant="subtitle2">user_id:</Typography>
                <Chip label={category.id} size="small" sx={{ ml: 1 }} />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <CategoryEditForm category={category} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

CategoryEdit.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);
export async function getServerSideProps({ params: { edit } }) {
  const res = await axios.get(`${config.apiRoute}/category/${edit}`, {
    headers: {
      Authorization: config.token,
    },
  });
  return {
    props: { data: res.data },
  };
}
export default CategoryEdit;
