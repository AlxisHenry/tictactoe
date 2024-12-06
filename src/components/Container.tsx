import { JSX } from "preact/jsx-runtime";

export const Container = (props: { children: JSX.Element[] }): JSX.Element => {
  return <div className="max-w-2xl w-fit mx-auto">{props.children}</div>;
};
