import { publicConfig } from "@/config.public";
export const getDocumentationPath = (path: string) => {

  switch(publicConfig.env) {
  case "local":
    return `http://localhost:8080/co/${path}`;
  case "productionij":
  case "production":
  case "preproduction":
  case "diffusion":
  case "qualification":
  default:
    return `/documentation/co/${path}`;
  }
};
