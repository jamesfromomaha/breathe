import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: {
    core: 'src/core.js',
  },
  output: {
    dir: 'build',
    sourcemap: true,
  },
  plugins: [
    nodeResolve()
  ],
};
