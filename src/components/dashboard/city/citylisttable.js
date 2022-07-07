import { Fragment, useState } from "react";
import numeral from "numeral";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import {
  Box,
  IconButton,
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Modal from "@mui/material/Modal";
import { Scrollbar } from "../../scrollbar";
import { PencilAlt as PencilAltIcon } from "../../../icons/pencil-alt";
import Link from "next/link";
import { Modal8 } from "../../modal-8";

export const CityListTable = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    cities,
    productsCount,
    rowsPerPage,
  } = props;
  console.log(cities);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const handleOpen = (pId) => {
    setId(pId);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell width="25%">Name</TableCell>
              <TableCell width="25%">AR Name</TableCell>
              <TableCell width="25%">Edit</TableCell>
              <TableCell width="25%">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cities.map((city) => {
              console.log(city.ar_name);
              return (
                <>
                  <Fragment key={city.id}>
                    <TableRow hover key={city.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{city.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {city.arName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <IconButton>
                          <Link href={`/dashboard/cities/${city.id}`}>
                            <PencilAltIcon fontSize="small" />
                          </Link>
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleOpen(city.id)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                </>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <Modal open={open} onClose={handleClose}>
        <Modal8 close={handleClose} id={id} query={"city"} page={"cities"} />
      </Modal>
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

CityListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
