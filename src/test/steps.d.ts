/// <reference types='codeceptjs' />

type smokeSteps = typeof import('./smoke/stepsFile');

declare namespace CodeceptJS {
  interface SupportObject { I, smokeSteps }
  interface I extends WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
