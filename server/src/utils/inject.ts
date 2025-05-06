/* eslint-disable @typescript-eslint/no-explicit-any */
const injector =
  ({ onCall }: { onCall?: (p: { args: unknown }) => void } = {}) =>
  <
    U extends (deps: D) => (...args: A) => any,
    D extends Record<string, any>,
    A extends Array<any>
  >(
      deps: D,
      usecase: U
    ) => {
    return [
      (...args: Parameters<ReturnType<U>>) => {
        onCall?.({ args });
        return usecase(deps)(...(args ?? [])) as ReturnType<ReturnType<U>>;
      },
      usecase,
    ] as const;
  };

const inject = injector();

export { inject, injector };
