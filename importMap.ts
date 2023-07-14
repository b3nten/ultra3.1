interface SpecifierMap {
  [url: string]: string | null;
}
interface Scopes {
  [url: string]: SpecifierMap;
}
export interface ImportMap {
  imports?: SpecifierMap;
  scopes?: Scopes;
}