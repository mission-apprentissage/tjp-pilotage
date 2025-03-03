import type {client} from '@/api.client';

export type Discipline = (typeof client.infer)["[GET]/discipline/search/:search"][number];
export type Etablissement = (typeof client.infer)["[GET]/etablissement/perdir/search/:search"][number];
export type Formation = (typeof client.infer)["[GET]/diplome/search/:search"][number];
