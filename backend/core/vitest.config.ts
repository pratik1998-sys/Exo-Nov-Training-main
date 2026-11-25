import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, ViteUserConfigExport } from "vitest/config";

// Use cwd so we don't rely on import.meta (avoids TS module option requirement)
const projectRoot = process.cwd();

export const VitestConfig /*: ViteUserConfigExport & { coverage: any }*/ = {
  plugins: [
    tsconfigPaths({
      root: projectRoot,
      projects: [path.join(projectRoot, "tsconfig.json")],
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^@logger$/,
        replacement: path.join(projectRoot, "core/foundation/logger"),
      },
      {
        find: /^@logger\/(.*)$/,
        replacement: path.join(projectRoot, "core/foundation/logger") + "/$1",
      },
      {
        find: /^@configuration\/app$/,
        replacement: path.join(
          projectRoot,
          "core/foundation/configuration/app",
        ),
      },
      {
        find: /^@configuration\/(.*)$/,
        replacement:
          path.join(projectRoot, "core/foundation/configuration") + "/$1",
      },
      {
        find: /^@context$/,
        replacement: path.join(projectRoot, "core/foundation/context"),
      },
      {
        find: /^@context\/(.*)$/,
        replacement: path.join(projectRoot, "core/foundation/context") + "/$1",
      },
      {
        find: /^@feature$/,
        replacement: path.join(projectRoot, "core/foundation/feature"),
      },
      {
        find: /^@feature\/(.*)$/,
        replacement: path.join(projectRoot, "core/foundation/feature") + "/$1",
      },
      {
        find: /^@feature-tutorial-pet$/,
        replacement: path.join(
          projectRoot,
          "core-modules/features/tutorial-pet",
        ),
      },
      {
        find: /^@feature-tutorial-pet\/(.*)$/,
        replacement:
          path.join(projectRoot, "core-modules/features/tutorial-pet") + "/$1",
      },
      {
        find: /^@feature-shared-models$/,
        replacement: path.join(
          projectRoot,
          "core-modules/features/shared/models",
        ),
      },
      {
        find: /^@feature-shared-models\/(.*)$/,
        replacement:
          path.join(projectRoot, "core-modules/features/shared/models") + "/$1",
      },
      {
        find: /^@plugin$/,
        replacement: path.join(projectRoot, "core/foundation/plugin"),
      },
      {
        find: /^@plugin\/(.*)$/,
        replacement: path.join(projectRoot, "core/foundation/plugin") + "/$1",
      },
    ],
  },
  test: {
    include: ["**/*.spec.ts", "**/*.test.ts"],
    exclude: [
      "node_modules",
      "**/node_modules/**",
      "dist",
      "**/dist/**",
      "**/docs/**",
      "**/core/docs/**",
      "**/foundation/plugin/testing/plugin.service.test.ts",
      "**/foundation/plugin/testing/plugin.mapper.test.ts",
      "**/foundation/plugin/testing/plugin.datasource.test.ts",
      "**/foundation/plugin/testing/plugin.base.test.ts",
      "**/foundation/feature/testing/feature.base.test.ts",
      "**/foundation/feature/testing/feature.resolver.test.ts",
      "**/foundation/feature/testing/feature.controller.test.ts",
    ],
    environment: "node",
    globals: true,
  },
  // Vitest coverage options (defineConfig from vitest/config may be typed as Vite-only in some setups)
  coverage: {
    provider: "v8",
    reporter: ["text", "lcov"],
  },
};
