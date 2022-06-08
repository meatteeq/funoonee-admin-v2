import React from "react";

export const VendorDetail = () => {
  return <div>VendorDetail</div>;
};

VendorDetail.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);

export default VendorDetail;
