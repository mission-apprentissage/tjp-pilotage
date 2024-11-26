import type { client } from "@/api.client";

export type FileType = (typeof client.infer)["[GET]/intention/:numero/files"]["files"][number];
