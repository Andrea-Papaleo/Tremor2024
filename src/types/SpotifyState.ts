import { EntityState } from "@reduxjs/toolkit";
import { Artist, AudioFeatures, Track } from "@spotify/web-api-ts-sdk";
import { ArtistMeasurables } from "./ArtistMeasurables";

export type TremorArtist = Artist & {
  topTracks?: string[];
  performances?: string[];
  measurables?: ArtistMeasurables;
};

export type SpotifyState = {
  tracks: EntityState<Track, string>;
  artists: EntityState<TremorArtist, string>;
  audioFeatures: EntityState<AudioFeatures, string>;
};
