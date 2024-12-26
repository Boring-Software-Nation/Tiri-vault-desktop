declare const __DEV__: boolean
/** Extension name, defined in packageJson.name */
declare const __NAME__: string

declare module '*.vue' {
  const component: any
  export default component
}

interface ImportMeta {
  env: {
    BASE_URL: string
    VITE_API_HOST: string,
    VITE_WS_URL: string,
    VITE_SIG_V2_SYMMETRIC: string,
    VITE_SIG_V2_ASYMMETRIC: string,
    VITE_TRIAL_VOL_LABEL: string,
    VITE_MEDIUM_PRICE: string,
    VITE_MEDIUM_VOL_LABEL: string,
    VITE_LARGE_PRICE: string,
    VITE_LARGE_VOL_LABEL: string,
    VITE_TRIAL_PLAN_LIMIT: number,
    VITE_MEDIUM_PLAN_LIMIT: number,
    VITE_LARGE_PLAN_LIMIT: number,
  }
}
