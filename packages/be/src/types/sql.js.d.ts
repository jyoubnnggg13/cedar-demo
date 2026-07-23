declare module 'sql.js' {
  export interface SqlJsStatic {
    Database: typeof Database;
  }

  export interface QueryExecResult {
    columns: string[];
    values: unknown[][];
  }

  export interface ParamsObject {
    [key: string]: unknown;
  }

  export type BindParams = unknown[] | ParamsObject | null;

  export interface Statement {
    bind(params?: BindParams): boolean;
    step(): boolean;
    getAsObject(params?: ParamsObject): Record<string, unknown>;
    get(params?: BindParams): unknown[];
    getColumnNames(): string[];
    free(): boolean;
    reset(): void;
    run(params?: BindParams): void;
  }

  export class Database {
    constructor(data?: ArrayLike<number> | Buffer | null);
    run(sql: string, params?: BindParams): Database;
    exec(sql: string, params?: BindParams): QueryExecResult[];
    prepare(sql: string): Statement;
    each(
      sql: string,
      params: BindParams,
      callback: (row: Record<string, unknown>) => void,
      done?: () => void
    ): void;
    export(): Uint8Array;
    close(): void;
    getRowsModified(): number;
    create_function(name: string, fn: (...args: unknown[]) => unknown): void;
  }

  export interface SqlJsConfig {
    locateFile?: (filename: string) => string;
  }

  export default function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;
}
