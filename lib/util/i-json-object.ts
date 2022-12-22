export type AnyJson = boolean | number | string | null | IJsonArray | IJsonObject;

export interface IJsonObject {
  [key: string]: AnyJson;
}

export type IJsonArray = Array<AnyJson>;
