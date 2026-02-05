import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ✅ 여기 추가: 안 쓰는 변수 경고 완화/무시
  {
    rules: {
      // 1) 완전 끄기 (원하면 이걸로)
      // "@typescript-eslint/no-unused-vars": "off",

      // 2) 추천: _로 시작하는 변수는 무시 (router를 _router로 바꾸면 경고 없어짐)
      "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
