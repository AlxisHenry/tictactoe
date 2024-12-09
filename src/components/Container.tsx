import { JSX } from "preact/jsx-runtime";

export const Container = (props: { children: JSX.Element[] }): JSX.Element => {
  return <div className="relative max-w-2xl pt-16 w-fit mx-auto">{props.children}</div>;
};
