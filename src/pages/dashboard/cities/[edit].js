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
import { CityEditForm } from "../../../components/dashboard/city/cityEditForm";
import config from "../../../config";
import Cookies from "js-cookie";
import { redirectFromServerSideTo } from "../../../../helper";
const CityEdit = ({ data }) => {
  const city = data;

  if (!city) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard: City Edit </title>
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
            <NextLink href='/dashboard/cities' passHref>
              <Link
                color='textPrimary'
                component='a'
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowBackIcon fontSize='small' sx={{ mr: 1 }} />
                <Typography variant='subtitle2'>City</Typography>
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
            {getInitials(city.name)}
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
                <Typography variant='subtitle2'>user_id:</Typography>
                <Chip label={city.id} size='small' sx={{ ml: 1 }} />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <CityEditForm city={city} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

CityEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export async function getServerSideProps({ params: { edit }, ...ctx }) {
  if (!ctx.req.cookies?.accessToken) {
    redirectFromServerSideTo(ctx, "/");
  }
  const res = await axios.get(`${config.apiRoute}/city/${edit}`, {
    headers: {
      Authorization: config.token,
    },
  });
  return {
    props: { data: res.data },
  };
}
export default CityEdit;
