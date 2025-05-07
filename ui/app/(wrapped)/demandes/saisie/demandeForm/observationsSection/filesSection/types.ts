import type { client } from "@/api.client";

export type FileType = (typeof client.infer)["[GET]/demande/:numero/files"]["files"][number];
