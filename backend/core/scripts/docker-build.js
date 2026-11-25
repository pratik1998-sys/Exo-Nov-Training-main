#!/usr/bin/env node
/**
 * Builds a Docker image for a given app and saves it to a local tar archive.
 *
 * Usage: yarn docker:build <app-id> [--no-cache] [--pull] [--platform <os/arch>]
 *
 * Runs from repo root (where Dockerfile lives after install:core):
 *   docker build --build-arg APP_ID=<app-id> -t <app-id>:latest -f Dockerfile .
 *   docker save <app-id>:latest -o image-<app-id>-<platform>-MMDD_HH-mm.tar
 *
 * --no-cache  Re-run all build steps and re-check base images from the registry.
 * --pull      Always pull newer base images (also enabled by --no-cache).
 * --platform  Target platform for build/pull (e.g. linux/amd64). When omitted,
 *             the saved tar name uses the platform of the built image.
 *
 * Env:
 *   BUILD_PLATFORM  Optional platform if --platform is not passed
 *
 * Base image ref is read from the first FROM line in Dockerfile (not overridable).
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const DOCKERFILE = path.join(ROOT, "Dockerfile");

function readBaseImageFromDockerfile(dockerfilePath) {
  const content = fs.readFileSync(dockerfilePath, "utf8");
  const match = content.match(/^FROM\s+(\S+)/im);
  if (!match) {
    throw new Error(`No FROM instruction found in ${dockerfilePath}`);
  }
  return match[1];
}

const BASE_IMAGE = readBaseImageFromDockerfile(DOCKERFILE);
const args = process.argv.slice(2);
const noCache = args.includes("--no-cache");
const pull = args.includes("--pull") || noCache;

function shellQuote(value) {
  return /\s/.test(value) ? `"${value}"` : value;
}

function parsePlatformArg(argv) {
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--platform" && argv[i + 1]) {
      return argv[i + 1];
    }
    if (argv[i].startsWith("--platform=")) {
      return argv[i].slice("--platform=".length);
    }
  }
  return process.env.BUILD_PLATFORM?.trim() || "";
}

function isCliFlag(arg) {
  return arg.startsWith("-");
}

function normalizeArch(arch) {
  if (arch === "aarch64" || arch === "arm64") {
    return "arm64";
  }
  if (arch === "x86_64" || arch === "amd64") {
    return "amd64";
  }
  return arch;
}

function platformToFilenameSlug(platform) {
  return platform.replace(/\//g, "_");
}

const buildPlatform = parsePlatformArg(args);
const positionalArgs = args.filter((arg, index) => {
  if (isCliFlag(arg)) {
    return false;
  }
  if (index > 0 && args[index - 1] === "--platform") {
    return false;
  }
  return true;
});
const appId = positionalArgs[0];

if (!appId) {
  console.error("Error: App ID is required");
  console.error(
    "Usage: yarn docker:build <app-id> [--no-cache] [--pull] [--platform <os/arch>]",
  );
  process.exit(1);
}

const now = new Date();
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");
const hh = String(now.getHours()).padStart(2, "0");
const min = String(now.getMinutes()).padStart(2, "0");
const stamp = `${mm}${dd}_${hh}-${min}`;

const runOptions = { cwd: ROOT, stdio: "inherit" };
const inspectOptions = { cwd: ROOT, encoding: "utf8" };

function resolveDefaultBuildPlatform() {
  try {
    const os = execSync(
      'docker version -f "{{.Server.Os}}"',
      inspectOptions,
    ).trim();
    const arch = normalizeArch(
      execSync('docker version -f "{{.Server.Arch}}"', inspectOptions).trim(),
    );
    if (os && arch) {
      return `${os}/${arch}`;
    }
  } catch {
    // fall through
  }
  return "linux/amd64";
}

function resolveImagePlatform(imageRef) {
  try {
    const platform = execSync(
      `docker image inspect ${shellQuote(imageRef)} --format '{{.Os}}/{{.Architecture}}'`,
      inspectOptions,
    ).trim();
    if (platform && platform !== "/") {
      const [os, arch] = platform.split("/");
      return `${os}/${normalizeArch(arch)}`;
    }
  } catch {
    // fall through
  }
  return resolveDefaultBuildPlatform();
}

function resolveBaseImageMetadata() {
  try {
    const [digest, release, buildDate, arch, version] = execSync(
      `docker image inspect ${shellQuote(BASE_IMAGE)} --format '{{.Digest}}|{{index .Config.Labels "release"}}|{{index .Config.Labels "build-date"}}|{{.Architecture}}|{{index .Config.Labels "version"}}'`,
      inspectOptions,
    )
      .trim()
      .split("|");

    let rhelVersion = "";
    try {
      rhelVersion = execSync(
        `docker run --rm --entrypoint cat ${shellQuote(BASE_IMAGE)} /etc/os-release | grep ^VERSION_ID= | cut -d= -f2 | tr -d '"'`,
        inspectOptions,
      ).trim();
    } catch {
      // ignore
    }

    const catalogTag =
      rhelVersion && release
        ? `${rhelVersion}-${release}`
        : release || version || "";

    return {
      digest,
      release,
      buildDate,
      arch,
      version,
      catalogTag,
      rhelVersion,
    };
  } catch {
    return {
      digest: "",
      release: "",
      buildDate: "",
      arch: "",
      version: "",
      catalogTag: "",
      rhelVersion: "",
    };
  }
}

const flags = [
  noCache ? "no cache" : null,
  pull ? "pull base images" : null,
  buildPlatform ? `platform ${buildPlatform}` : null,
]
  .filter(Boolean)
  .join(", ");

console.log(
  `Building Docker image for app: ${appId}${flags ? ` (${flags})` : ""}`,
);
console.log(`Base image: ${BASE_IMAGE}`);
if (buildPlatform) {
  console.log(`Build platform: ${buildPlatform}`);
}

if (pull) {
  execSync(
    [
      "docker",
      "pull",
      ...(buildPlatform ? ["--platform", buildPlatform] : []),
      BASE_IMAGE,
    ]
      .map(shellQuote)
      .join(" "),
    runOptions,
  );
}

const baseImage = resolveBaseImageMetadata();
if (baseImage.digest) {
  console.log(
    `Base image digest: ${baseImage.digest} (${baseImage.arch || "unknown"})`,
  );
}
if (baseImage.catalogTag) {
  console.log(`Base image catalog tag: ${baseImage.catalogTag}`);
}
if (baseImage.version) {
  console.log(`Base image version label: ${baseImage.version}`);
}
if (baseImage.buildDate) {
  console.log(`Base image build date: ${baseImage.buildDate}`);
}

execSync(
  [
    "docker",
    "build",
    ...(buildPlatform ? ["--platform", buildPlatform] : []),
    ...(noCache ? ["--no-cache"] : []),
    ...(pull ? ["--pull=always"] : []),
    "--build-arg",
    `APP_ID=${appId}`,
    ...(baseImage.digest
      ? ["--build-arg", `BASE_IMAGE_DIGEST=${baseImage.digest}`]
      : []),
    ...(baseImage.catalogTag
      ? ["--build-arg", `BASE_IMAGE_CATALOG_TAG=${baseImage.catalogTag}`]
      : []),
    ...(baseImage.arch
      ? ["--build-arg", `BASE_IMAGE_ARCH=${baseImage.arch}`]
      : []),
    ...(baseImage.buildDate
      ? ["--build-arg", `BASE_IMAGE_BUILD_DATE=${baseImage.buildDate}`]
      : []),
    "-t",
    `${appId}:latest`,
    "-f",
    "Dockerfile",
    ".",
  ]
    .map(shellQuote)
    .join(" "),
  runOptions,
);

const resolvedPlatform =
  buildPlatform || resolveImagePlatform(`${appId}:latest`);
const outFile = `image-${appId}-${platformToFilenameSlug(resolvedPlatform)}-${stamp}.tar`;

console.log(`Saving image to ${outFile} (${resolvedPlatform})`);
execSync(
  ["docker", "save", `${appId}:latest`, "-o", outFile]
    .map(shellQuote)
    .join(" "),
  runOptions,
);

console.log(`Done: ${outFile}`);
