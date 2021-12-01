/// <reference types='codeceptjs' />

type smokeSteps = typeof import('./smoke/stepsFile');

declare namespace CodeceptJS {
  interface SupportObject { I, smokeSteps }
  interface Methods extends Puppeteer {}
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
