export type MessageMatcher<T> = (msg: any) => msg is T;

type Waiter<T> = {
  match: MessageMatcher<T>;
  resolve: (msg: T) => void;
  reject: (err: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
};

type Collector<T> = {
  match: MessageMatcher<T>;
  results: T[];
  totalTimeoutId: ReturnType<typeof setTimeout>;
  silenceTimeoutId: ReturnType<typeof setTimeout> | null;
  silenceMs: number;
  resolve: (msgs: T[]) => void;
  reject: (err: Error) => void;
  done: boolean;
};

export class RequestManager {
  private waiters: Waiter<any>[] = [];
  private collectors: Collector<any>[] = [];

  handleMessage(msg: any) {
    // waiters
    if (this.waiters.length) {
      const snapshot = [...this.waiters];
      for (const w of snapshot) {
        let ok = false;
        try {
          ok = w.match(msg);
        } catch {
          ok = false;
        }
        if (ok) {
          this.waiters = this.waiters.filter((x) => x !== w);
          clearTimeout(w.timeoutId);
          w.resolve(msg);
        }
      }
    }

    // collectors
    if (this.collectors.length) {
      const snapshot = [...this.collectors];
      for (const c of snapshot) {
        if (c.done) continue;
        let ok = false;
        try {
          ok = c.match(msg);
        } catch {
          ok = false;
        }
        if (!ok) continue;

        c.results.push(msg);

        if (c.silenceTimeoutId) clearTimeout(c.silenceTimeoutId);
        c.silenceTimeoutId = setTimeout(() => {
          this.finishCollector(c);
        }, c.silenceMs);
      }
    }
  }

  waitForOne<T>(match: MessageMatcher<T>, timeoutMs = 5000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.waiters = this.waiters.filter((w) => w !== waiter);
        reject(new Error(`Timeout waiting for controller response (${timeoutMs}ms)`));
      }, timeoutMs);

      const waiter: Waiter<T> = { match, resolve, reject, timeoutId };
      this.waiters.push(waiter);
    });
  }

  collect<T>(
    match: MessageMatcher<T>,
    opts?: { totalTimeoutMs?: number; silenceMs?: number }
  ): Promise<T[]> {
    const totalTimeoutMs = opts?.totalTimeoutMs ?? 5000;
    const silenceMs = opts?.silenceMs ?? 500;

    return new Promise<T[]>((resolve, reject) => {
      const collector: Collector<T> = {
        match,
        results: [],
        totalTimeoutId: setTimeout(() => {
          if (collector.done) return;
          collector.done = true;
          this.collectors = this.collectors.filter((c) => c !== collector);
          if (collector.silenceTimeoutId) clearTimeout(collector.silenceTimeoutId);
          // if something was collected, return it; otherwise treat as timeout
          if (collector.results.length) resolve(collector.results);
          else reject(new Error(`Timeout waiting for controller responses (${totalTimeoutMs}ms)`));
        }, totalTimeoutMs),
        silenceTimeoutId: null,
        silenceMs,
        resolve,
        reject,
        done: false,
      };

      this.collectors.push(collector);
    });
  }

  private finishCollector<T>(collector: Collector<T>) {
    if (collector.done) return;
    collector.done = true;
    this.collectors = this.collectors.filter((c) => c !== collector);
    clearTimeout(collector.totalTimeoutId);
    if (collector.silenceTimeoutId) clearTimeout(collector.silenceTimeoutId);
    collector.resolve(collector.results);
  }

  reset() {
    for (const w of this.waiters) {
      clearTimeout(w.timeoutId);
      w.reject(new Error('RequestManager reset'));
    }
    this.waiters = [];

    for (const c of this.collectors) {
      clearTimeout(c.totalTimeoutId);
      if (c.silenceTimeoutId) clearTimeout(c.silenceTimeoutId);
      if (!c.done) c.reject(new Error('RequestManager reset'));
    }
    this.collectors = [];
  }
}

