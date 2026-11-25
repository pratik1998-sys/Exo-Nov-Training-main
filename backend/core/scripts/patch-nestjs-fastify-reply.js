/**
 * Nest 12 FastifyAdapter does `import * as Reply from 'fastify/lib/reply.js'`.
 * Fastify 5 is CJS, so that import is a module namespace, not the Reply class.
 * Exception filters then crash with "Reply is not a constructor".
 */
const fs = require("fs");
const path = require("path");

const candidates = [
  path.resolve(
    __dirname,
    "../../node_modules/@nestjs/platform-fastify/adapters/fastify-adapter.js",
  ),
  path.resolve(
    __dirname,
    "../node_modules/@nestjs/platform-fastify/adapters/fastify-adapter.js",
  ),
];

const from = "import * as Reply from 'fastify/lib/reply.js';";
const to = "import Reply from 'fastify/lib/reply.js';";

const file = candidates.find((candidate) => fs.existsSync(candidate));
if (!file) {
  console.warn("patch-nestjs-fastify-reply: adapter not found, skipping");
  process.exit(0);
}

const source = fs.readFileSync(file, "utf8");
if (source.includes(to) && !source.includes(from)) {
  process.exit(0);
}
if (!source.includes(from)) {
  console.warn(
    `patch-nestjs-fastify-reply: expected import not found in ${file}`,
  );
  process.exit(0);
}

fs.writeFileSync(file, source.replace(from, to));
console.log(`Patched Fastify Reply import for Nest 12: ${file}`);
