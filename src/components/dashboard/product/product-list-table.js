/** @format */

import { Fragment, useState, useEffect } from "react";
import numeral from "numeral";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import {
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Switch,
  Table,
  FormControlLabel,
  Checkbox,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChevronDown as ChevronDownIcon } from "../../../icons/chevron-down";
import { ChevronRight as ChevronRightIcon } from "../../../icons/chevron-right";
import { DotsHorizontal as DotsHorizontalIcon } from "../../../icons/dots-horizontal";
import { Image as ImageIcon } from "../../../icons/image";
import { Scrollbar } from "../../scrollbar";
import { PencilAlt as PencilAltIcon } from "../../../icons/pencil-alt";

import { SeverityPill } from "../../severity-pill";
import Link from "next/link";
import Select from "react-select";
export const ProductListTable = (props) => {
  const [city, selectCity] = useState();

  const [cat, selectCat] = useState();
  const [getCitisAndCat, setGetCitisAndCat] = useState({
    city: null,
    cat: null,
  });
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    products,
    productsCount,
    rowsPerPage,
    catData,
    cityData,
    ...other
  } = props;
  const [openProduct, setOpenProduct] = useState(null);
  useEffect(() => {
    const filteredData = cityData.filter((e) =>
      getCitisAndCat?.city?.includes(e.id)
    );
    const cityFiltered =
      filteredData &&
      filteredData?.map(function (ser) {
        return { value: ser.id, label: ser.name };
      });
    const filteredDataCat = catData.filter((e) =>
      getCitisAndCat?.cat?.includes(e.id)
    );
    const catFiltered =
      filteredDataCat &&
      filteredDataCat?.map(function (ser) {
        return { value: ser.id, label: ser.name };
      });

    selectCity(cityFiltered);
    selectCat(catFiltered);
  }, [city, cat]);
  const handleOpenProduct = (productId, city, cat) => {
    setGetCitisAndCat({ ...getCitisAndCat, city: city, cat: cat });
    setOpenProduct((prevValue) => (prevValue === productId ? null : productId));
  };

  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Ar Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>sku</TableCell>
              <TableCell>Special Price</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const open = product.id === openProduct;

              return (
                <Fragment key={product.id}>
                  <TableRow hover key={product.id}>
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(open && {
                          position: "relative",
                          "&:after": {
                            position: "absolute",
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: "primary.main",
                            width: 3,
                            height: "calc(100% + 1px)",
                          },
                        }),
                      }}
                      width="25%"
                    >
                      <IconButton
                        onClick={() =>
                          handleOpenProduct(
                            product.id,
                            product.city,
                            product.categoryId
                          )
                        }
                      >
                        {open ? (
                          <ChevronDownIcon fontSize="small" />
                        ) : (
                          <ChevronRightIcon fontSize="small" />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell width="25%">
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        {product.image ? (
                          <Box
                            sx={{
                              alignItems: "center",
                              backgroundColor: "background.default",
                              backgroundImage: `url(${product.image})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              borderRadius: 1,
                              display: "flex",
                              height: 80,
                              justifyContent: "center",
                              overflow: "hidden",
                              width: 80,
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              alignItems: "center",
                              backgroundColor: "background.default",
                              borderRadius: 1,
                              display: "flex",
                              height: 80,
                              justifyContent: "center",
                              width: 80,
                            }}
                          >
                            <ImageIcon fontSize="small" />
                          </Box>
                        )}
                        <Box
                          sx={{
                            cursor: "pointer",
                            ml: 2,
                          }}
                        >
                          <Typography variant="subtitle2">
                            {product.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{product.arName}</TableCell>
                    <TableCell>
                      {numeral(product.price).format(
                        `${product.currency}0,0.00`
                      )}
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      {product.specialPrice ? product.specialPrice : 0}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/products/${product.id}`}>
                        <IconButton>
                          <PencilAltIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                  {open && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{
                          p: 0,
                          position: "relative",
                          "&:after": {
                            position: "absolute",
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: "primary.main",
                            width: 3,
                            height: "calc(100% + 1px)",
                          },
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                              <Typography variant="h6">
                                Basic Details
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    disabled
                                    defaultValue={product.name}
                                    fullWidth
                                    label="Product name"
                                    name="name"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.sku}
                                    disabled
                                    fullWidth
                                    label="SKU"
                                    name="sku"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.arName}
                                    disabled
                                    fullWidth
                                    label="Ar Name"
                                    name="arName"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.description}
                                    disabled
                                    fullWidth
                                    label="Description"
                                    name="description"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.arDescription}
                                    disabled
                                    fullWidth
                                    label="Ar Description"
                                    name="arDescription"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.id}
                                    disabled
                                    fullWidth
                                    label="Barcode"
                                    name="barcode"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <Typography variant="h6">
                                Pricing and Categories
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    disabled
                                    defaultValue={product.price}
                                    fullWidth
                                    label="Old price"
                                    name="old-price"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          {product.currency}
                                        </InputAdornment>
                                      ),
                                    }}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.specialPrice}
                                    fullWidth
                                    label="specialPrice"
                                    name="new-price"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          $
                                        </InputAdornment>
                                      ),
                                    }}
                                    type="number"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <Typography variant="h7">Category</Typography>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    // options={catOptions}
                                    name="category"
                                    isDisabled
                                    value={cat}
                                    label=" Category"
                                    // onChange={(selectCat) => setCat(selectCat)}
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <Typography variant="h7">City</Typography>

                                  <Select
                                    // labelId="demo-simple-select-label"
                                    // options={catOptions}
                                    name="category"
                                    value={city}
                                    isMulti
                                    isDisabled
                                    label=" Category"
                                    // onChange={(selectCat) => setCat(selectCat)}
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled
                                        checked={product.FormControlLabel}
                                        // onChange={formik.handleChange}
                                      />
                                    }
                                    label="Is Multipal Allowed"
                                    name="is_multiple_allowed"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled
                                        checked={product.status}
                                        // onChange={formik.handleChange}
                                      />
                                    }
                                    label="Status"
                                    name="status"
                                  />
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        disabled
                                        checked={product.isFeatured}
                                        // onChange={formik.handleChange}
                                      />
                                    }
                                    label="Is Featured"
                                    name="isFeatured"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                        <Divider />
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            px: 2,
                            py: 1,
                          }}
                        >
                          {/* <Button
                            onClick={handleUpdateProduct}
                            sx={{ m: 1 }}
                            type="submit"
                            variant="contained"
                          >
                            Update
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            sx={{ m: 1 }}
                            variant="outlined"
                          >
                            Cancel
                          </Button> */}
                          {/* <Button
                            onClick={handleDeleteProduct}
                            color="error"
                            sx={{
                              m: 1,
                              ml: "auto",
                            }}
                          >
                            Delete product
                          </Button> */}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={productsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

ProductListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
