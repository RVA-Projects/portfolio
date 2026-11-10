/** Declaraciones de módulos CSS (Vite: *.{css}.module) para TypeScript strict. */
declare module '*.module.css' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.module.css?raw' {
  const content: string
  export default content
}
