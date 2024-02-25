import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import {
  artistAdapter,
  audioFeaturesAdapter,
  trackAdapter,
} from "./spotifySlice";
import { AudioFeatures } from "@spotify/web-api-ts-sdk";
import { ParcedAudioFeatures } from "../../types/ParcedAudioFeatures";
import { IncludeFieldType } from "../../types/util";

const artistSelectors = artistAdapter.getSelectors(
  (state: RootState) => state.spotify.artists,
);
const trackSelectors = trackAdapter.getSelectors(
  (state: RootState) => state.spotify.tracks,
);
const audioFeaturesSelectors = audioFeaturesAdapter.getSelectors(
  (state: RootState) => state.spotify.audioFeatures,
);

export const selectArtistIds = artistSelectors.selectIds;
export const selectArtistEntities = artistSelectors.selectEntities;
export const selectAllArtists = artistSelectors.selectAll;
export const selectArtistTotal = artistSelectors.selectTotal;
export const selectArtistById = artistSelectors.selectById;

export const selecttrackIds = trackSelectors.selectIds;
export const selectTrackEntities = trackSelectors.selectEntities;
export const selectAllTracks = trackSelectors.selectAll;
export const selectTrackTotal = trackSelectors.selectTotal;
export const selectTrackById = trackSelectors.selectById;

export const selectAudioFeatureIds = audioFeaturesSelectors.selectIds;
export const selectAudioFeatureEntities = audioFeaturesSelectors.selectEntities;
export const selectAllAudioFeatures = audioFeaturesSelectors.selectAll;
export const selectAudioFeatureTotal = audioFeaturesSelectors.selectTotal;
export const selectAudioFeatureById = audioFeaturesSelectors.selectById;

export const selectArtistAudioFeatures = createSelector(
  selectAudioFeatureEntities,
  selectArtistEntities,
  (audioFeatures, artists) => (artistId: string) => {
    const artist = artists[artistId];
    if (!artist) return [];

    const topTrackIds = artist.topTracks ?? [];
    const artistAudioFeatures: AudioFeatures[] = [];

    topTrackIds.forEach(id => {
      const features = audioFeatures[id];
      features && artistAudioFeatures.push(features);
    });

    return artistAudioFeatures;
  },
);

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const selectArtistAverageAudioFeatures = createSelector(
  selectArtistAudioFeatures,
  audioFeatures => (artistId: string) => {
    const artistAudioFeatures = audioFeatures(artistId);
    const pushValue = (
      object: Record<string, Array<string | number>>,
      key: string,
      value: string | number,
    ) => {
      if (key in object) {
        object[key].push(value);
      } else {
        object[key] = [value];
      }
    };
    const parsedFeatures = artistAudioFeatures.reduce(
      (
        parced: {
          numeric: Record<string, number[]>;
          text: Record<string, string[]>;
        },
        features: AudioFeatures,
      ) => {
        const featureEntry = Object.entries(features) as Entries<AudioFeatures>;

        featureEntry.forEach(([key, value]) => {
          if (typeof value === "number") {
            pushValue(parced.numeric, key, value);
          } else {
            pushValue(parced.text, key, value);
          }
        });
        return parced;
      },
      { numeric: {}, text: {} },
    );
    return parsedFeatures;
  },
);

export const selectArtistMeasurables = createSelector(
  selectArtistEntities,
  artists => (artistId: string) => {
    const artist = artists[artistId];
    if (!artist) return [];

    return artist.measurables;
  },
);
