import { Fragment, useState } from "react";
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
import { SeverityPill } from "../../severity-pill";

const categoryOptions = [
  {
    label: "Healthcare",
    value: "healthcare",
  },
  {
    label: "Makeup",
    value: "makeup",
  },
  {
    label: "Dress",
    value: "dress",
  },
  {
    label: "Skincare",
    value: "skincare",
  },
  {
    label: "Jewelry",
    value: "jewelry",
  },
  {
    label: "Blouse",
    value: "blouse",
  },
];

export const CategoriesListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    products,
    productsCount,
    rowsPerPage,
    ...other
  } = props;
  const [openProduct, setOpenProduct] = useState(null);

  const handleOpenProduct = (productId) => {
    setOpenProduct((prevValue) => (prevValue === productId ? null : productId));
  };

  const handleUpdateProduct = () => {
    setOpenProduct(null);
    toast.success("Product updated");
  };

  const handleCancelEdit = () => {
    setOpenProduct(null);
  };

  const handleDeleteProduct = () => {
    toast.error("Product cannot be deleted");
  };

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Ar Name</TableCell>
              <TableCell></TableCell>
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
                      <IconButton onClick={() => handleOpenProduct(product.id)}>
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
                          {/* <Typography color="textSecondary" variant="body2">
                            in {product.category}
                          </Typography> */}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell width="25%">{product.arName}</TableCell>
                    {/* <TableCell width="25%">{product.status}</TableCell> */}

                    {/* <TableCell align="right">
                      <IconButton>
                        <DotsHorizontalIcon fontSize="small" />
                      </IconButton>
                    </TableCell> */}
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
                                Basic details
                              </Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.name}
                                    fullWidth
                                    label="Product name"
                                    name="name"
                                  />
                                </Grid>

                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.arName}
                                    // disabled
                                    fullWidth
                                    label="Ar Name"
                                    name="arName"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.description}
                                    // disabled
                                    fullWidth
                                    label="Description"
                                    name="description"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    defaultValue={product.arDescription}
                                    // disabled
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
                                    label="Id"
                                    name="barcode"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <Typography variant="h6">Status</Typography>
                              <Divider sx={{ my: 2 }} />
                              <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={product.status}
                                        // onChange={formik.handleChange}
                                      />
                                    }
                                    label="Status"
                                    name="status"
                                  />
                                </Grid>
                                {/* <Grid
                                  item
                                  md={6}
                                  xs={12}
                                  sx={{
                                    alignItems: "center",
                                    display: "flex",
                                  }}
                                >
                                  <Switch />
                                  <Typography variant="subtitle2">
                                    Keep selling when stock is empty
                                  </Typography>
                                </Grid> */}
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
                          <Button
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
                          </Button>
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

CategoriesListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
