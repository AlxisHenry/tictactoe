import { JSX } from "preact/jsx-runtime";

export const Layout = (props: { children: JSX.Element }): JSX.Element => {
  return (
    <div
      class={
        "flex flex-col min-h-screen bg-gradient-to-b from-purple-700 to-purple-800 text-white"
      }
    >
      <div class="flex-grow bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-lg">
        {props.children}
      </div>
    </div>
  );
};
