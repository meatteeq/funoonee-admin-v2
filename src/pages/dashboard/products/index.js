import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { Box, Button, Card, Container, Grid, Typography } from "@mui/material";
import { productApi } from "../../../__fake-api__/product-api";
import { AuthGuard } from "../../../components/authentication/auth-guard";
import { DashboardLayout } from "../../../components/dashboard/dashboard-layout";
import { ProjectListFilters } from "../../../components/dashboard/product/product-list-filters";
import { ProductListTable } from "../../../components/dashboard/product/product-list-table";
import { useMounted } from "../../../hooks/use-mounted";
import { Download as DownloadIcon } from "../../../icons/download";
import { Upload as UploadIcon } from "../../../icons/upload";
import { Plus as PlusIcon } from "../../../icons/plus";
import { gtm } from "../../../lib/gtm";
import axios from "axios";
import config, { NetworkClient } from "../../../config";
import Cookies from "js-cookie";
import {
  isUserAuthenticated,
  redirectFromServerSideTo,
} from "../../../../helper";
const applyFilters = (products, filters) =>
  products?.filter((product) => {
    if (filters.name) {
      const nameMatched = product.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());

      if (!nameMatched) {
        return false;
      }
    }

    // It is possible to select multiple category options
    if (filters.category?.length > 0) {
      const categoryMatched = filters.category.includes(product.category);

      if (!categoryMatched) {
        return false;
      }
    }

    // It is possible to select multiple status options
    if (filters.status?.length > 0) {
      const statusMatched = filters.status.includes(product.status);

      if (!statusMatched) {
        return false;
      }
    }

    return true;
  });

const applyPagination = (products, page, rowsPerPage) =>
  products?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

const ProductList = ({ data }) => {
  console.log(data);
  const { products, cityData, categoryData } = data;
  const isMounted = useMounted();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    name: undefined,
    category: [],
    status: [],
    inStock: undefined,
  });

  const handleFiltersChange = (filters) => {
    setFilters(filters);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Usually query is done on backend with indexing solutions
  const filteredProducts = applyFilters(products, filters);
  const paginatedProducts = applyPagination(
    filteredProducts,
    page,
    rowsPerPage
  );

  return (
    <>
      <Head>
        <title>Dashboard: Product List | Material Kit Pro</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Grid container justifyContent="space-between" spacing={3}>
              <Grid item>
                <Typography variant="h4">Products</Typography>
              </Grid>
              <Grid item>
                <NextLink href="/dashboard/products/new" passHref>
                  <Button
                    component="a"
                    startIcon={<PlusIcon fontSize="small" />}
                    variant="contained"
                  >
                    Add
                  </Button>
                </NextLink>
              </Grid>
            </Grid>
            {/* <Box
              sx={{
                m: -1,
                mt: 3,
              }}
            >
              <Button startIcon={<UploadIcon fontSize="small" />} sx={{ m: 1 }}>
                Import
              </Button>
              <Button
                startIcon={<DownloadIcon fontSize="small" />}
                sx={{ m: 1 }}
              >
                Export
              </Button>
            </Box> */}
          </Box>
          <Card>
            <ProjectListFilters onChange={handleFiltersChange} />
            <ProductListTable
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              products={paginatedProducts}
              productsCount={filteredProducts?.length}
              rowsPerPage={rowsPerPage}
              catData={categoryData}
              cityData={cityData}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

ProductList.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies?.accessToken) {
    redirectFromServerSideTo(ctx, "/");
  }
  isUserAuthenticated(ctx);
  const cityAndCategory = await Promise.all([
    axios.get(`${config.apiRoute}category/list`),
    axios.get(`${config.apiRoute}city/list`),
    axios.get(`${config.apiRoute}product/list`),
  ])
    .then((resArray) => {
      const [categoryList, cityList, productList] = resArray;
      const data = {
        categoryData: categoryList?.data,
        cityData: cityList?.data,
        products: productList?.data,
      };
      return data;
    })
    .catch((e) => {});

  return {
    props: { data: cityAndCategory || [] },
  };
}

export default ProductList;
