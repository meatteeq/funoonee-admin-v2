import { useEffect } from "react";
import Head from "next/head";
import { Divider } from "@mui/material";
import { MainLayout } from "../components/main-layout";
import { HomeClients } from "../components/home/home-clients";
import { HomeHero } from "../components/home/home-hero";
import { HomeDevelopers } from "../components/home/home-developers";
import { HomeDesigners } from "../components/home/home-designers";
import { HomeFeatures } from "../components/home/home-features";
import { HomeTestimonials } from "../components/home/home-testimonials";
import Router from "next/router";
import { gtm } from "../lib/gtm";

const Home = () => {
  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  useEffect(() => {
    if (localStorage.getItem("JWT_TOKEN")) {
      Router.push("/dashboard");
    } else {
      Router.push("/authentication/login");
    }
  }, []);

  return <></>;
};

export default Home;
