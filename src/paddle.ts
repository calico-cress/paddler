import fs from 'fs';
import { join } from 'path';

// promise化
import { promisify } from 'util';
const _readdir = promisify(fs.readdir);
// const _stat = promisify(fs.stat);

/**
 * 指定の拡張子や時刻以降のファイルを取得する
 * @export
 * @param {string} path
 * @param {string} ext
 * @param {Date} from
 * @returns {Promise<string[]>}
 */
export default async function paddle(
  path: string,
  ext: string,
  from: Date,
  isTest: boolean = false
): Promise<string[]> {
  const names = await _readdir(path);
  const changeAbsPath = (name: string): string => join(path, name);
  const extract = (name: string): boolean => {
    // テストモードの場合..
    if (isTest && /.*walnut\d{2}.emlx/.test(name)) return true;
    // テストモード以外
    const stat = fs.statSync(name);
    return (
      stat.isFile() &&
      new RegExp(`.*\.${ext}$`).test(name) &&
      stat.mtime >= from
    );
  };
  return names.map(changeAbsPath).filter(extract);
}
