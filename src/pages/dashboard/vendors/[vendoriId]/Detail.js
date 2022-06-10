import React from "react";
import Cookies from "js-cookie";
import { redirectFromServerSideTo } from "../../../../../helper";

export const VendorDetail = () => {
  return <div>VendorDetail</div>;
};

VendorDetail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies?.accessToken) {
    redirectFromServerSideTo(ctx, "/");
  }
}

export default VendorDetail;
