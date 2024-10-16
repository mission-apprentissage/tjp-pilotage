type Params = {
  params: {
    codeNsf: string;
  };
};

export default async function Page({ params: { codeNsf } }: Params) {
  return <div>page du code Nsf {codeNsf}</div>;
}
