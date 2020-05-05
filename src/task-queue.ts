// タスクの型.. 戻り値を`Promise<T>`型にする
type TaskType = () => Promise<void>;
/**
 * タスクのキュー管理クラス
 * @export
 * @class TaskQueue
 */
export default class TaskQueue {
  // 同時実行数
  private readonly concurrency: number;
  // 現在実行中のタスク数
  private running = 0;
  // 実行待ちのタスク
  private queue: TaskType[] = [];
  /**
   * Creates an instance of TaskQueue.
   * @param {number} [concurrency=2]
   * @memberof TaskQueue
   */
  public constructor(concurrency: number = 2) {
    this.concurrency = concurrency;
  }
  /**
   * タスク追加
   * @memberof TaskQueue
   */
  public pushTask = (task: TaskType): void => {
    this.queue.push(task);
    this.next();
  };
  /**
   * 上限までタスクを実行
   * @memberof TaskQueue
   */
  public next = (): void => {
    // `queue`にタスクが溜まっていたら、上限に到達するまでループする
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      const _signIn = async (tsk: TaskType): Promise<void> => {
        await tsk();
        this.running--;
        this.next();
      };
      if (task) {
        _signIn(task), this.running++;
      }
    }
  };
}
