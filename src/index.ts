#!/usr/bin/env node

import handleErrors from './helper/handle-errors';
import moment from 'moment';
import parseArgs from './parse-args';
import getAllDirs from './get-alldirs';
import TaskQueue from './task-queue';
import paddle from './paddle';

// 例外の管理
handleErrors();

// 引数をパース
const argv = parseArgs(process.argv.slice(2));
const path = argv._[0],
  ext = argv._[1],
  from = moment()
    .add(-1 * parseInt(argv.time), 'millisecond')
    .toDate();

if (!path || !ext) {
  console.error(`
  以下は必須入力です..
    第一引数：検索対象のパス
    第二引数：検索対象の拡張子
`);
  process.exit(1);
}

/**
 * メイン処理
 * @returns {Promise<void>}
 */
function main(): void {
  /* 全てのサブフォルダのフルパスを取得（同期的な再起呼出し）
   * `getAllxx`を非同期にする場合、後続の`taskQueue`以降の処理も非同期下に移動
   * .. いずれ対応する */
  const directories = getAllDirs(path);
  if (!directories.length) return;

  // フォルダ単位でタスク実行（queueで管理）
  const taskQueue = new TaskQueue(parseInt(argv.nest));
  directories.forEach((dir: string): void => {
    taskQueue.pushTask(
      async (): Promise<void> => {
        const names = await paddle(dir, ext, from, argv.test);
        if (names.length <= 0) return;
        // 出力..
        if (argv.line) {
          names.forEach((nm: string): void => console.log(nm));
        } else {
          console.log(names.join(' '));
        }
      }
    );
  });
}

main();
