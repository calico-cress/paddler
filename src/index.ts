#!/usr/bin/env node

import handlErrors from './helper/handle-errors';
import moment from 'moment';
import minimize from './parse-args';
import getAllDirs from './get-alldirs';
import TaskQueue from './task-queue';
import paddle from './paddle';

// 例外の管理
handlErrors();

// 引数をパース
const argv = minimize(process.argv.slice(2));
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
  // 全てのサブフォルダのフルパスを取得する
  const directories = getAllDirs(path);
  if (!directories.length) return;

  // フォルダ単位でタスク実行（queueで管理）
  let taskQueue = new TaskQueue(parseInt(argv.nest));
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
