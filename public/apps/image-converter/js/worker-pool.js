/**
 * Web Worker プール（最大 64 並行）
 */

export const WORKER_POOL_SIZE = 64;

export class WorkerPool {
  /**
   * @param {string | URL} scriptUrl
   * @param {number} [size]
   */
  constructor(scriptUrl, size = WORKER_POOL_SIZE) {
    this.workers = [];
    /** @type {Worker[]} */
    this.freeWorkers = [];
    /** @type {Map<string, { resolve: (v: unknown) => void, reject: (e: Error) => void }>} */
    this.jobs = new Map();
    /** @type {Array<{ jobId: string, payload: object, transfer: Transferable[] }>} */
    this.queue = [];
    this.jobCounter = 0;

    for (let i = 0; i < size; i += 1) {
      const worker = new Worker(scriptUrl, { type: "module" });
      worker.addEventListener("message", (event) => this.#onMessage(worker, event));
      worker.addEventListener("error", (event) => this.#onError(worker, event));
      this.workers.push(worker);
      this.freeWorkers.push(worker);
    }
  }

  /**
   * @param {object} payload
   * @param {Transferable[]} [transfer]
   */
  run(payload, transfer = []) {
    return new Promise((resolve, reject) => {
      const jobId = `job_${++this.jobCounter}`;
      this.jobs.set(jobId, { resolve, reject });
      this.queue.push({ jobId, payload, transfer });
      this.#pump();
    });
  }

  #pump() {
    while (this.freeWorkers.length > 0 && this.queue.length > 0) {
      const worker = this.freeWorkers.pop();
      const task = this.queue.shift();
      if (!worker || !task) return;
      worker.postMessage({ jobId: task.jobId, ...task.payload }, task.transfer);
    }
  }

  /**
   * @param {Worker} worker
   * @param {MessageEvent} event
   */
  #onMessage(worker, event) {
    const { jobId, error, buffer, mime } = event.data ?? {};
    const job = this.jobs.get(jobId);
    if (!job) return;
    this.jobs.delete(jobId);
    this.freeWorkers.push(worker);
    this.#pump();

    if (error) {
      job.reject(new Error(String(error)));
      return;
    }
    job.resolve(new Blob([buffer], { type: mime }));
  }

  /**
   * @param {Worker} worker
   * @param {ErrorEvent} event
   */
  #onError(worker, event) {
    this.freeWorkers.push(worker);
    for (const [jobId, job] of this.jobs) {
      job.reject(new Error(event.message || "Worker error"));
      this.jobs.delete(jobId);
    }
    this.#pump();
  }

  destroy() {
    for (const worker of this.workers) {
      worker.terminate();
    }
    this.workers = [];
    this.freeWorkers = [];
    this.jobs.clear();
    this.queue = [];
  }
}
