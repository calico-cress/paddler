import fs from 'fs';
import { join } from 'path';
let result: string[] = [];

/**
 * ディレクトリの読み出し
 * @param {string} dirPath
 */
function _iterate(dirPath: string): void {
  const dirents = fs.readdirSync(dirPath, { withFileTypes: true });
  // ディレクトリ取得
  const directories = dirents.filter((dir: fs.Dirent): boolean =>
    dir.isDirectory()
  );
  // フルパス取得
  const _getName = (dir: fs.Dirent): string => join(dirPath, dir.name);
  result = result.concat(directories.map(_getName));
  // サブディレクトリ下を再起呼び出し
  Array.isArray(directories) &&
    directories.forEach((dir: fs.Dirent): void => {
      _iterate(_getName(dir));
    });
}

/**
 * 逐次的に全てのディレクトリを取得する
 * @export
 * @param {string} dirPath
 * @returns {string[]}
 */
export default function getAllDirs(dirPath: string): string[] {
  result = result.concat(dirPath);
  _iterate(dirPath);
  return result;
}
