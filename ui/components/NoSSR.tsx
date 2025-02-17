import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import * as React from "react";

const NoSsr = (props: { children: ReactNode }) => <React.Fragment>{props.children}</React.Fragment>;

export default dynamic(async () => Promise.resolve(NoSsr), {
  ssr: false,
});
