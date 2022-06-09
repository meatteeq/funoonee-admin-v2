import { useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Card, Container, Divider, Link, Typography } from "@mui/material";
import { Logo } from "../components/logo";
import { JWTLogin } from "../components/authentication/jwt-login";
import { GuestGuard } from "../components/authentication/guest-guard";
const platformIcons = {
  Amplify: "/static/icons/amplify.svg",
  Auth0: "/static/icons/auth0.svg",
  Firebase: "/static/icons/firebase.svg",
  JWT: "/static/icons/jwt.svg",
};

const SignIn = () => {
  const router = useRouter();

  //   useEffect(() => {
  //     gtm.push({ event: "page_view" });
  //   }, []);

  return (
    <>
      <Head>
        <title>SignIn | Material Kit Pro</title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: "background.default",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* <AuthBanner /> */}
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: "60px",
              md: "120px",
            },
          }}
        >
          {/* <Box
            sx={{
              alignItems: "center",
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "neutral.900" : "neutral.100",
              borderColor: "divider",
              borderRadius: 1,
              borderStyle: "solid",
              borderWidth: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              mb: 4,
              p: 2,
              "& > img": {
                height: 32,
                width: "auto",
                flexGrow: 0,
                flexShrink: 0,
              },
            }}
          >
            <Typography color="textSecondary" variant="caption">
              The app authenticates {platform}
            </Typography>
            <img alt="Auth platform" src={platformIcons[platform]} />
          </Box> */}
          <Card elevation={16} sx={{ p: 4 }}>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <NextLink href="/" passHref>
                <a>
                  <Logo
                    sx={{
                      height: 40,
                      width: 40,
                    }}
                  />
                </a>
              </NextLink>
              <Typography variant="h4">Log in</Typography>
              <Typography color="textSecondary" sx={{ mt: 2 }} variant="body2">
                Sign in With Phone Number
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3,
              }}
            >
              {/* {platform === "Amplify" && <AmplifySignIn />}
              {platform === "Auth0" && <Auth0SignIn />}
              {platform === "Firebase" && <FirebaseSignIn />} */}
              <JWTLogin />
            </Box>
            {/* <Divider sx={{ my: 3 }} />
            <div>
              <NextLink
                href={
                  disableGuard
                    ? `/authentication/register?disableGuard=${disableGuard}`
                    : "/authentication/register"
                }
                passHref
              >
                <Link color="textSecondary" variant="body2">
                  Create new account
                </Link>
              </NextLink>
            </div>
            {platform === "Amplify" && (
              <Box sx={{ mt: 1 }}>
                <NextLink
                  href={
                    disableGuard
                      ? `/authentication/password-recovery?disableGuard=${disableGuard}`
                      : "/authentication/password-recovery"
                  }
                  passHref
                >
                  <Link color="textSecondary" variant="body2">
                    Forgot password
                  </Link>
                </NextLink>
              </Box>
            )} */}
          </Card>
        </Container>
      </Box>
    </>
  );
};

SignIn.getLayout = (page) => <GuestGuard>{page}</GuestGuard>;

export default SignIn;
