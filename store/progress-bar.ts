import { ProgressBar } from "../utils/progress-bar";

export class ProgressBarStore {
  state = {
    progress: 0,
    total: 0,
  };
  _progressBar: ProgressBar;

  start(total: number) {
    this.state.total = total;
    this.state.progress = 0;
    if (this._progressBar) {
      this.stop();
    }
    this._progressBar = new ProgressBar(total, this.state.progress);
  }

  increment(progress = 0) {
    this.state.progress += progress;
    this._progressBar.increment(progress);
  }

  isResolved() {
    return this.state.progress >= this.state.total;
  }

  stop() {
    this._progressBar.stop();
  }
}

let store: ProgressBarStore;

export const getProgressBarStore = () => {
  if (!store) {
    store = new ProgressBarStore();
  }
  return store;
};
