export type Registry = "npm" | "go-proxy";

export interface PackageRef {
  name: string;
  registry: Registry;
  targetMajor: number;
}

export interface PluginSource {
  plugin: string;        // directory name under src/plugins
  packages: PackageRef[]; // empty when editorial or skip
  editorial: boolean;    // no registry; judged via L2 research. Mutually exclusive with skip.
  skip: boolean;         // not audited (no upstream surface). Mutually exclusive with editorial.
  skills: string[];      // skill dirs under skills/ that ride this plugin
}

export const SOURCES: PluginSource[] = [
  { plugin: "shadcn", editorial: false, skip: false, skills: ["shadcn-expert"],
    packages: [
      { name: "@base-ui/react", registry: "npm", targetMajor: 1 },
      { name: "tailwindcss", registry: "npm", targetMajor: 4 },
    ] },
  { plugin: "reactflow", editorial: false, skip: false, skills: [],
    packages: [{ name: "@xyflow/react", registry: "npm", targetMajor: 12 }] },
  { plugin: "motion", editorial: false, skip: false, skills: [],
    packages: [{ name: "motion", registry: "npm", targetMajor: 12 }] },
  { plugin: "lenis", editorial: false, skip: false, skills: [],
    packages: [{ name: "lenis", registry: "npm", targetMajor: 1 }] },
  { plugin: "react", editorial: false, skip: false, skills: [],
    packages: [
      { name: "react", registry: "npm", targetMajor: 19 },
      { name: "react-dom", registry: "npm", targetMajor: 19 },
      { name: "next", registry: "npm", targetMajor: 16 },
    ] },
  { plugin: "design-tokens", editorial: false, skip: false, skills: [],
    packages: [{ name: "tailwindcss", registry: "npm", targetMajor: 4 }] },
  { plugin: "echo", editorial: false, skip: false, skills: [],
    packages: [{ name: "github.com/labstack/echo/v4", registry: "go-proxy", targetMajor: 4 }] },
  { plugin: "golang", editorial: true, skip: false, skills: [], packages: [] },
  { plugin: "rust", editorial: true, skip: false, skills: [], packages: [] },
  { plugin: "ui-ux", editorial: true, skip: false, skills: [], packages: [] },
  { plugin: "designer", editorial: true, skip: false, skills: ["designer"], packages: [] },
  { plugin: "hyperstack", editorial: false, skip: true, skills: [], packages: [] },
];
