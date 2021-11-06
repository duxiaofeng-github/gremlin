declare module "@download/blockies" {
  export const createIcon: any;
  export default createIcon;
}

declare module "*.jpg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.svg" {
  const content: any;

  export const ReactComponent: any;

  export default content;
}
