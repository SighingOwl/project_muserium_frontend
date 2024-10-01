import { defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import viteconfig from './vite.config';
import { JSDOM } from 'jsdom';

// 기존 vite 설정을 가져와 테스트 설정과 병합
export default mergeConfig(
  viteconfig || {},
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
