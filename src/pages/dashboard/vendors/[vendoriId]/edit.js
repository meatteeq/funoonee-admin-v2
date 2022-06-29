import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { redirectFromServerSideTo } from "../../../../../helper";

import Head from "next/head";
import { Avatar, Box, Chip, Container, Link, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { customerApi } from "../../../../__fake-api__/customer-api";
import { AuthGuard } from "../../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../../components/dashboard/dashboard-layout";
import { CustomerEditForm } from "../../../../components/dashboard/customer/customer-edit-form";
import { useMounted } from "../../../../hooks/use-mounted";
import { gtm } from "../../../../lib/gtm";
import { getInitials } from "../../../../utils/get-initials";
import axios from "axios";
import config from "../../../../config";
import { VendorEditForm } from "../../../../components/vendors/vendorEditForm";

const VendorEdit = ({ data }) => {
  const vendor = data;
  const isMounted = useMounted();

  //   useEffect(() => {
  //     gtm.push({ event: "page_view" });
  //   }, []);

  //   const getCustomer = useCallback(async () => {
  //     try {
  //       const data = await customerApi.getCustomer();

  //       if (isMounted()) {
  //         setCustomer(data);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }, [isMounted]);

  //   useEffect(
  //     () => {
  //       getCustomer();
  //     },
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     []
  //   );

  if (!vendor) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard: Vendor Edit </title>
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
                <Typography variant="subtitle2">Vendors</Typography>
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
              src={vendor.image}
              sx={{
                height: 64,
                mr: 2,
                width: 64,
              }}
            >
              {getInitials(vendor.name)}
            </Avatar>
            <div>
              <Typography noWrap variant="h4">
                {vendor.email}
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
                <Typography variant="subtitle2">user_id:</Typography>
                <Chip label={vendor.id} size="small" sx={{ ml: 1 }} />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <VendorEditForm vendor={vendor} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

VendorEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export async function getServerSideProps({ params: { vendoriId }, ...ctx }) {
  if (!ctx.req.cookies?.accessToken) {
    redirectFromServerSideTo(ctx, "/");
  }
  const res = await axios.get(`${config.apiRoute}/vendor/${vendoriId}`, {
    headers: {
      Authorization: config.token,
    },
  });
  // console.log("single customer id", res.data);
  return {
    props: { data: res.data },
  };
}
export default VendorEdit;
