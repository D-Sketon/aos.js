import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import scss from "rollup-plugin-scss";

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        dir: "./dist",
        format: "umd",
        entryFileNames: "[name].umd.js",
        name: "AOS",
        sourcemap: false,
        plugins: [terser()],
      },
    ],
    plugins: [
      nodeResolve(),
      typescript({ module: "ESNext" }),
    ],
  },
  {
    input: "./src/style/aos.scss",
    plugins: [
      scss({
        outputStyle: 'compressed',
        output: './dist/aos.css',
      })
    ],
  }
];
