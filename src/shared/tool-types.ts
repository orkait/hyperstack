export type ToolContent = { type: "text"; text: string };

export type ToolResult = {
  content: ToolContent[];
  isError?: boolean;
};

export type ToolHandler<TArgs = any> = (args: TArgs) => Promise<ToolResult> | ToolResult;

export interface ToolServer {
  tool<TArgs = any>(
    name: string,
    description: string,
    schema: unknown,
    handler: ToolHandler<TArgs>,
  ): void;
  resource(
    name: string,
    uriTemplate: string,
    metadata: unknown,
    handler: (...args: any[]) => Promise<unknown> | unknown,
  ): void;
  prompt(name: string, description: string, schema: unknown, handler: (...args: any[]) => unknown): void;
}

export interface Plugin {
  name: string;
  register: (server: ToolServer) => void;
}
