import { AudioFeatures } from "@spotify/web-api-ts-sdk";
import { IncludeFieldType } from "./util";

export type ArtistMeasurables = {
  [K in keyof Omit<
    IncludeFieldType<AudioFeatures, number>,
    "duration_ms" | "key" | "liveness" | "time_signature" | "mode"
  >]: number;
};
