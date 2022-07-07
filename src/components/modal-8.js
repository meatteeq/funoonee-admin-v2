import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import WarningIcon from "@mui/icons-material/WarningOutlined";
import { useEffect } from "react";
import { NetworkClient } from "../config";
import toast from "react-hot-toast";
import Router from "next/router";

export const Modal8 = ({ close, id, query, page }) => {
  const deleteCity = async (id) => {
    try {
      const { data } = await NetworkClient.delete(`${query}/${id}`);
      close();
      toast.success(data?.message);
      Router.push(`/dashboard/${page}`);
    } catch (error) {
      close();
      toast.error(error.message);
    }
  };
  return (
    <Container maxWidth="sm" mt="4">
      <Grid container justifyContent="center" alignItems="center">
        <Paper elevation={12}>
          <Box
            sx={{
              display: "flex",
              pb: 2,
              pt: 3,
              px: 3,
            }}
          >
            <Avatar
              sx={{
                backgroundColor: (theme) =>
                  alpha(theme.palette.error.main, 0.08),
                color: "error.main",
                mr: 2,
              }}
            >
              <WarningIcon fontSize="small" />
            </Avatar>
            <div>
              <Typography variant="h5">Delete {query}</Typography>
              <Typography color="textSecondary" sx={{ mt: 1 }} variant="body2">
                Are you sure you want to delete the {query}?
              </Typography>
            </div>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              px: 3,
              py: 1.5,
            }}
          >
            <Button sx={{ mr: 2 }} variant="outlined" onClick={close}>
              Cancel
            </Button>
            <Button
              onClick={() => deleteCity(id)}
              sx={{
                backgroundColor: "error.main",
                "&:hover": {
                  backgroundColor: "error.dark",
                },
              }}
              variant="contained"
            >
              Delete
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Container>
  );
};
