

// @ts-nocheck
const createDummyClient = () => {
  const dummy: any = new Proxy(() => {}, {
    get: (_target, prop) => {
      if (prop === 'then') {
        // Make it thenable. When awaited, it resolves to the error object.
        return (resolve: any, _reject: any) => {
           resolve({
             data: null,
             error: { message: "Supabase client is disabled. Please use Firebase." }
           });
        }
      }
      return dummy;
    },
    apply: (_target, _thisArg, _argumentsList) => {
      // When called as a function, return itself to allow chaining
      return dummy;
    }
  });
  return dummy;
};

export const supabase = createDummyClient();
export const supabaseAdmin = createDummyClient();

