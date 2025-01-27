import { getProgressBarStore, ProgressBarStore } from "./progress-bar";

export interface StateType {
  compositionType: CompositionType;
  progressType: string;
  incrementedComponents: IncrementedComponents;
  componentsDetails?: ComponentsDetails;
  components?: string[];
}
export interface IncrementedComponents {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
  step6: boolean;
  step7: boolean;
  greenpress: boolean;
  admin: boolean;
  assets: boolean;
  auth: boolean;
  content: boolean;
  drafts: boolean;
  secrets: boolean;
  front: boolean;
}
export interface ComponentsDetails {
  images: Images;
  services: Services;
}
export interface Images {
  step1?: [string | null, number];
  step2?: [string | null, number];
  step3?: [string | null, number];
  step4?: [string | null, number];
  step5?: [string | null, number];
  step6?: [string | null, number];
  step7?: [string | null, number];
  greenpress?: [string | null, number];
  alreadyBuilt?: [string | null, number];
}
export interface Services {
  admin?: [string | null, number];
  assets?: [string | null, number];
  auth?: [string | null, number];
  content?: [string | null, number];
  drafts?: [string | null, number];
  secrets?: [string | null, number];
  front?: [string | null, number];
}
export type CompositionType = 'local'

class StartStore {
  state: StateType = {
    compositionType: "local",
    progressType: "images",
    incrementedComponents: {
      step1: false,
      step2: false,
      step3: false,
      step4: false,
      step5: false,
      step6: false,
      step7: false,
      greenpress: false,
      admin: false,
      assets: false,
      auth: false,
      content: false,
      drafts: false,
      secrets: false,
      front: false,
    },
  };
  _progressBarStore: ProgressBarStore;

  constructor() {
    this._progressBarStore = getProgressBarStore();
  }

  init(compositionType: CompositionType = "local") {
    this.state.compositionType = compositionType;
    if (compositionType === "local") {
      this.state.componentsDetails = {
        images: {
          step1: ["Step 1/8", 2.5],
          step2: ["Step 2/8", 2.5],
          step3: ["Step 3/8", 2.5],
          step4: ["Step 4/8", 2.5],
          step5: ["Step 5/8", 2.5],
          step6: ["Step 6/8", 2.5],
          step7: ["Step 7/8", 2.5],
          greenpress: [null, 2.5],
          alreadyBuilt: ["Successfully built", 17.5],
        },
        services: {
          admin: ["Admin front-server is up on port", 10],
          assets: ["Assets Service is running on port", 10],
          auth: ["Authentication Service is running on port", 10],
          content: ["Content Service is running on port", 10],
          drafts: ["Drafts Service is running on port", 10],
          secrets: ["Secrets Service is running on port", 10],
          front: ["READY  Server listening", 20],
        },
      };
    }

    this.state.components = Object.keys(this.state.componentsDetails);
  }

  startImages() {
    this.state.progressType = "images";
    this._progressBarStore.start(20);
  }

  startServices() {
    this.state.progressType = "services";
    this._progressBarStore.start(80);
  }

  stop() {
    this._progressBarStore.stop();
  }

  sendOutput(output) {
    const { components, componentsDetails, incrementedComponents } = this.state;
    components.forEach((component) => {
      Object.entries(componentsDetails[component]).forEach((element) => {
        const [searchText, progress] = element;
        if (
          searchText &&
          !incrementedComponents[searchText] &&
          output.includes(searchText)
        ) {
          this._progressBarStore.increment((progress as number) || 0);
          incrementedComponents[searchText] = true;
        }
      });
    });
  }

  setStep(componentType, stepName) {
    const { componentsDetails, incrementedComponents } = this.state;
    const [_, progress] = componentsDetails[componentType][stepName];

    if (!incrementedComponents[stepName]) {
      this._progressBarStore.increment(progress || 0);
      incrementedComponents[stepName] = true;
    }
  }

  isProgressTypeResolved() {
    return this._progressBarStore.isResolved();
  }
}

let store: StartStore;

export const getStartStore = () => {
  if (!store) {
    store = new StartStore();
  }
  return store;
};
