const production = !process.env.ROLLUP_WATCH;

export default {
  // input: ['src/main.ts', 'src/widgets/TestWidget/index.ts'],
  // input: "src/main.ts",
  output: {
    sourcemap: !production,
    format: "iife",
    name: "app",
    // file: "public/build/bundle.js",
  },
  plugins:[],
  watch: {
    clearScreen: false,
  },
};
