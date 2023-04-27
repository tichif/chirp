import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster position="bottom-right" />
      <Head>
        <title>Chirp</title>
        <meta name="description" content="Twitter emoji clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />;
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
