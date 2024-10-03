import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        entryFileNames: 'aos.cjs.js',
        sourcemap: false,
      },
      {
        dir: 'dist',
        format: 'esm',
        entryFileNames: 'aos.esm.js',
        sourcemap: false,
      },
    ],
    plugins: [typescript({ module: "ESNext" })]
  }
]

