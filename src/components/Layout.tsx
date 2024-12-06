import { JSX } from "preact/jsx-runtime";

export const Layout = (props: { children: JSX.Element }): JSX.Element => {
  return (
    <div
      class={
        "flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-indigo-700 text-white"
      }
    >
      {props.children}
    </div>
  );
};
