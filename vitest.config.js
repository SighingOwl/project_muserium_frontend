import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import viteconfig from './vite.config';
import { JSDOM } from 'jsdom';

export default mergeConfig(
  viteconfig,
  defineConfig({
    test: {
      environment: 'jsdom', // browser simulation
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        reportsDirectory: './coverage',
      },
    },
  })
);
