import { Logger } from "@nestjs/common";
import * as fb from "fast-glob";
import * as path from "path";
import { cwd } from "process";

enum ClassType {
  custom = "custom",
  extension = "extension",
  core = "core",
}

export interface ClassDirectory {
  id: string;
  name: string;
  sequence: number;
  path: string;
}

/**
 * @todo Remove "classPathKey" when safe to do so
 */
export const ClassDirectories: Record<
  "core" | "coreModules" | "coreTutorial" | "coreStaging" | "globalApp" | "app",
  ClassDirectory
> = {
  core: {
    id: "core",
    name: "core",
    path: "core",
    sequence: 0,
  },
  coreModules: {
    id: "coreModules",
    name: "core-modules",
    path: "core-modules",
    sequence: 1,
  },
  coreTutorial: {
    id: "coreTutorial",
    name: "core-tutorial",
    path: "core-tutorial",
    sequence: 2,
  },
  coreStaging: {
    id: "coreStaging",
    name: "core-staging",
    path: path.join("src", "core-staging"),
    sequence: 3,
  },
  globalApp: {
    id: "globalApp",
    name: "global",
    path: path.join("src", "apps", "global"),
    sequence: 4,
  },
  app: {
    id: "app",
    name: "",
    path: path.join("src", "apps"),
    sequence: 5,
  },
};

export interface ClassPathDirectory extends ClassDirectory {
  path: string;
}

export interface ClassPath<T = any> {
  id?: string;
  consumerIds: string[];
  fileName: string;
  resolvedPath: string;
  resolvedPathShort: string;
  paths: { directory: string; path: string }[];
  type: ClassType;
  classObj?: T;
  /**
   * All exported classes in the file matching the component type's `classNameSuffix` (e.g. every
   * `*Entity` class exported from a single `*.entity.ts` file). `classObj` only ever holds the first
   * match, for consumers that assume one class per file - use `classObjs` when a file may define
   * more than one (currently: entities).
   */
  classObjs?: T[];
  classImports?: any[];
  isDefault?: boolean;
  fileFormat?: string;
  resolvedPathDirectory?: string;
}

/**
 * Do not alter this class unless you are a part of the  Cerebrum governance team - core framework is highly
 * dependent on this logic
 */
export class ClassResolver {
  static async resolveClassPaths(
    classFileFormat: string,
    appName: string,
    directoryName: string,
    logger: Logger,
    isTSFile: boolean = false,
    normalizedToken?: string,
  ): Promise<ClassPath[]> {
    const methodname = `${ClassResolver.name}.resolveClassPath`;

    const prefix = !isTSFile ? `dist${path.sep}` : "";

    const shortPathKey = !isTSFile ? prefix : `${cwd()}${path.sep}`;

    const options: fb.Options = {
      onlyFiles: true,
      deep: Infinity,
      ignore: [],
    };

    const pathSuffix =
      directoryName && directoryName != null && directoryName.trim() != ""
        ? path.join(directoryName, classFileFormat)
        : classFileFormat;

    const directoryList: (ClassDirectory & { path: string })[] = [];

    const arr1 = Object.values(ClassDirectories).map((directory) => {
      const directoryRelativePath =
        ClassDirectories.app.id == directory.id
          ? path.join(directory.path, appName)
          : directory.path;

      directoryList.push({
        ...directory,
        path: directoryRelativePath,
      });

      const directoryPath = path.join(
        process.cwd(),
        prefix,
        directoryRelativePath,
        pathSuffix,
      );

      return fb.async(this.adjustFilePath(directoryPath), options);
    });

    const fileResults: string[][] = await Promise.all(arr1);

    const fileClassPathMap: Record<string, ClassPath> = {};

    fileResults.forEach((fileList, i) => {
      const directory = directoryList[i];

      const {
        path: directoryRelativePath,
        name: directoryName,
        id: directoryId /* classPathKey: directoryClassPathKey*/,
      } = directory;

      fileList.forEach((filePath) => {
        filePath = path.normalize(filePath);

        const relativeFilePath = filePath.substring(
          filePath.indexOf(directoryRelativePath) +
            directoryRelativePath.length,
        );

        if (!fileClassPathMap[relativeFilePath]) {
          fileClassPathMap[relativeFilePath] = {
            fileFormat: classFileFormat,
            fileName: filePath.substring(filePath.lastIndexOf(path.sep) + 1),
            resolvedPath: null,
            resolvedPathShort: null,
            paths: [],
            type: null,
            consumerIds: [],
          };
        }

        const classPath: ClassPath = fileClassPathMap[relativeFilePath];

        classPath.resolvedPath = filePath;

        classPath.resolvedPathShort = filePath.substring(
          filePath.indexOf(shortPathKey) + shortPathKey.length,
        );

        classPath.resolvedPathDirectory = directoryName;

        classPath.paths.push({
          directory: directory.name,
          path: filePath,
        });

        if (directoryId == ClassDirectories.core.id) {
          classPath.type = ClassType.core;
        } else {
          classPath.type =
            classPath.type == null ? ClassType.custom : ClassType.extension;
        }
      });
    });

    const classPaths: ClassPath[] = Object.values(fileClassPathMap);

    if (logger) {
      logger.log(
        `${methodname} - Resolved class paths for ${pathSuffix}: ${JSON.stringify(classPaths)}`,
      );
    }

    return classPaths;
  }

  /**
   * Resolve the proper class path for a class "type" that is allowed to be overridden/extended in apps/global and/or apps/$appName, given
   * a file name format.
   *
   * @param classFileFormat
   * @param appName
   * @param directoryName
   * @param logger
   * @returns
   */
  // static async resolveClassPaths(classFileFormat: string, appName: string, directoryName: string, logger: Logger, isTSFile: boolean = false, normalizedToken?: string): Promise<ClassPath[]> {
  //     const methodname = `${ClassResolver.name}.resolveClassPath`;

  //     const prefix = !isTSFile ? `dist${path.sep}` : '';

  //     // const shortPathKey = !isTSFile ? prefix : `${cwd()}${path.sep}`;
  //     // const globalHomePath = `${prefix}src${path.sep}apps${path.sep}global`;
  //     // const appHomePath = `${prefix}src${path.sep}apps${path.sep}${appName}`;
  //     // const coreStagingHomePath = `${prefix}core-staging`;
  //     // const coreTutorialHomePath = `${prefix}core-tutorial`;
  //     // const coreHomePath = `${prefix}core`;

  //     const shortPathKey = !isTSFile ? prefix : `${cwd()}${path.sep}`;
  //     const globalHomePath = `${prefix}${ClassDirectories.globalApp.path}`;
  //     const appHomePath = `${prefix}${ClassDirectories.app.path}${path.sep}${appName}`;
  //     const coreStagingHomePath = `${prefix}${ClassDirectories.coreStaging.path}`;
  //     const coreTutorialHomePath = `${prefix}${ClassDirectories.coreTutorial.path}`;
  //     const coreHomePath = `${prefix}${ClassDirectories.core.path}`;

  //     const options: fb.Options = {
  //         onlyFiles: true,
  //         deep: Infinity,
  //         ignore: [],
  //     };

  //     const pathSuffix = directoryName && directoryName != null && directoryName.trim() != '' ? `${directoryName}${path.sep}${classFileFormat}` : classFileFormat;

  //     const globalPath = path.join(process.cwd(), `${globalHomePath}${path.sep}${pathSuffix}`);
  //     const appPath = path.join(process.cwd(), `${appHomePath}${path.sep}${pathSuffix}`);
  //     const corePath = path.join(process.cwd(), `${coreHomePath}${path.sep}${pathSuffix}`);
  //     const coreTutorialPath = path.join(process.cwd(), `${coreTutorialHomePath}${path.sep}${pathSuffix}`);
  //     const coreStagingPath = path.join(process.cwd(), `${coreStagingHomePath}${path.sep}${pathSuffix}`);

  //     const arr = [
  //         fb.async(this.adjustFilePath(corePath), options),
  //         fb.async(this.adjustFilePath(coreTutorialPath), options),
  //         fb.async(this.adjustFilePath(coreStagingPath), options),
  //         fb.async(this.adjustFilePath(globalPath), options),
  //         fb.async(this.adjustFilePath(appPath), options),
  //     ];

  //     const res = await Promise.all(arr);

  //     if (logger) {
  //         logger.log(`${methodname} - Found class files matching ${pathSuffix}: ${JSON.stringify(res)}`);
  //     }

  //     const fileMap = {};

  //     //First go through the file paths to determine the right path according to hierarchy
  //     res.forEach((fileList, i) => {
  //         const homePath =
  //             i == 0 ? coreHomePath
  //             : i == 1 ? coreTutorialHomePath
  //             : i == 2 ? coreStagingHomePath
  //             : i == 3 ? globalHomePath
  //             : appHomePath;

  //         fileList.forEach((filePath) => {
  //             //Build the key for fileMap. Normalize it to the core path, which will ensure proper hierarchy overriding
  //             filePath = path.normalize(filePath);

  //             let key = filePath;

  //             if (i != 0) {
  //                 //Home Path is  Path here
  //                 key = filePath.replace(homePath, coreHomePath);
  //             }

  //             const fileName = filePath.substring(filePath.lastIndexOf(path.sep) + 1);

  //             if (normalizedToken) {
  //                 key = `${key.substring(0, key.indexOf(normalizedToken) + normalizedToken.length)}${path.sep}${fileName}`;
  //             }

  //             if (!fileMap[key]) {
  //                 const classPathObj: ClassPath = {
  //                     fileFormat: classFileFormat,
  //                     fileName: fileName,
  //                     resolvedPath: null,
  //                     resolvedPathShort: null,
  //                     corePath: null,
  //                     coreStagingPath: null,
  //                     coreTutorialPath: null,
  //                     globalPath: null,
  //                     appPath: null,
  //                     type: null,
  //                     consumerIds: [],
  //                 };

  //                 fileMap[key] = classPathObj;
  //             }

  //             const classPathObj: ClassPath = fileMap[key];

  //             classPathObj.resolvedPath = filePath;

  //             classPathObj.resolvedPathShort = filePath.substring(filePath.indexOf(shortPathKey) + shortPathKey.length);

  //             if (i == 0) {
  //                 classPathObj.corePath = filePath;
  //                 classPathObj.type = ClassType.core;
  //                 classPathObj.resolvedPathDirectory = ClassDirectories.core.id;
  //             } else {
  //                 classPathObj.type = classPathObj.type == null ? ClassType.custom : ClassType.extension;

  //                 if (i == 1) {
  //                     classPathObj.coreTutorialPath = filePath;
  //                     classPathObj.resolvedPathDirectory = ClassDirectories.coreTutorial.id;
  //                 } else if (i == 2) {
  //                     classPathObj.coreStagingPath = filePath;
  //                     classPathObj.resolvedPathDirectory = ClassDirectories.coreStaging.id;
  //                 } else if (i == 3) {
  //                     classPathObj.globalPath = filePath;
  //                     classPathObj.resolvedPathDirectory = ClassDirectories.globalApp.id;
  //                 } else if (i == 4) {
  //                     classPathObj.appPath = filePath;
  //                     classPathObj.resolvedPathDirectory = ClassDirectories.app.id;
  //                 }
  //             }
  //         });
  //     });

  //     const classPaths: ClassPath[] = Object.values(fileMap);

  //     if (logger) {
  //         logger.log(`${methodname} - Resolved class paths for ${pathSuffix}: ${JSON.stringify(classPaths)}`);
  //     }

  //     return classPaths;
  // }

  /**
   * Convert Windows path (with \ as sep) to path with / for the fast-glob lib
   *
   * @param filePath
   * @returns
   */
  private static adjustFilePath(filePath: string): string {
    if (path.sep == "/") {
      return filePath;
    } else {
      return fb.convertPathToPattern(filePath);
    }
  }
}
