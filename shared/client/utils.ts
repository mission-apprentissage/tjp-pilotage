import { ObjectPropertyKeys, TObject, Type } from "@sinclair/typebox";

export const Partial = <S extends TObject, K extends ObjectPropertyKeys<S>>(
  schema: S,
  keys: K[]
) => {
  return Type.Intersect([
    Type.Omit(schema, keys),
    Type.Partial(Type.Pick(schema, keys)),
  ]);
};

export const Required = <S extends TObject, K extends ObjectPropertyKeys<S>>(
  schema: S,
  keys: K[]
) => {
  return Type.Intersect([
    Type.Omit(schema, keys),
    Type.Required(Type.Pick(schema, keys)),
  ]);
};
