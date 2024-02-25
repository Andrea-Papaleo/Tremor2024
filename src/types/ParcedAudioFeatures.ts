import { AudioFeatures } from "@spotify/web-api-ts-sdk";
import { IncludeFieldType } from "./util";

export type ParcedAudioFeatures = {
  numeric: IncludeFieldType<AudioFeatures, number>;
  text: IncludeFieldType<AudioFeatures, string>;
};
