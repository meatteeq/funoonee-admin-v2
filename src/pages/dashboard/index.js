import { useEffect, useState } from "react";

import { gtm } from "../../lib/gtm";
import Router from "next/router";

const Overview = () => {
  const [displayBanner, setDisplayBanner] = useState(true);

  useEffect(() => {
    gtm.push({ event: "page_view" });
  }, []);

  useEffect(() => {
    // Restore the persistent state from local/session storage
    const value = globalThis.sessionStorage.getItem("dismiss-banner");

    if (value === "true") {
      // setDisplayBanner(false);
    }
  }, []);

  const handleDismissBanner = () => {
    // Update the persistent state
    // globalThis.sessionStorage.setItem('dismiss-banner', 'true');
    setDisplayBanner(false);
  };

  useEffect(() => {
    Router.push("/dashboard/customers");
  }, []);

  return <></>;
};

export default Overview;
