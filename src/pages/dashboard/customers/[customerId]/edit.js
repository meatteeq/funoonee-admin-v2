import { useCallback, useEffect, useState } from "react";
import NextLink from "next/link";
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
import config, { NetworkClient } from "../../../../config";
import Cookies from "js-cookie";
import {
  isUserAuthenticated,
  redirectFromServerSideTo,
} from "../../../../../helper";

const CustomerEdit = ({ data }) => {
  const customer = data;
  const isMounted = useMounted();

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  const getCustomer = useCallback(async () => {
    try {
      const data = await customerApi.getCustomer();

      if (isMounted()) {
        setCustomer(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(
    () => {
      getCustomer();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!customer) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard: Customer Edit </title>
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
            <NextLink href="/dashboard/customers" passHref>
              <Link
                color="textPrimary"
                component="a"
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Customers</Typography>
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
              src={customer.image}
              sx={{
                height: 64,
                mr: 2,
                width: 64,
              }}
            >
              {getInitials(customer.name)}
            </Avatar>
            <div>
              <Typography noWrap variant="h4">
                {customer.email}
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
                <Chip label={customer.id} size="small" sx={{ ml: 1 }} />
              </Box>
            </div>
          </Box>
          <Box mt={3}>
            <CustomerEditForm customer={customer} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

CustomerEdit.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export async function getServerSideProps() {
  if (!ctx.req.cookies?.accessToken) {
    redirectFromServerSideTo(ctx, "/");
  }
  isUserAuthenticated(ctx);
  const res = await axios.get(`${config.apiRoute}customer/profile`);
  // console.log("single customer id", res.data);
  return {
    props: { data: res.data },
  };
}
export default CustomerEdit;
