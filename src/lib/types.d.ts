declare module '*.css' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.gif' {
  const path: string;
  export = path;
}