declare module '*.css' {
  const content: { [className: string]: string };
  export = content;
}

declare module '*.gif' {
  const path: string;
  export = path;
}

declare module "*.svg" {
  const content: any;
  export default content;
}