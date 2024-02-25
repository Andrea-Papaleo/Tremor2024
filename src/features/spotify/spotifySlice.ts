import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AudioFeatures, Track } from "@spotify/web-api-ts-sdk";
import { TremorArtist, SpotifyState } from "../../types/SpotifyState";
import { ArtistMeasurables } from "../../types/ArtistMeasurables";

// Define a type for the slice state

export const audioFeaturesAdapter = createEntityAdapter<AudioFeatures>();
export const trackAdapter = createEntityAdapter<Track>();
export const artistAdapter = createEntityAdapter<TremorArtist>();

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const fullMarks: ArtistMeasurables = {
  acousticness: 1,
  danceability: 1,
  energy: 1,
  instrumentalness: 1,
  loudness: -60,
  tempo: 1,
  valence: 1,
  speechiness: 1,
};

const initialState: SpotifyState = {
  tracks: trackAdapter.getInitialState(),
  artists: artistAdapter.getInitialState(),
  audioFeatures: audioFeaturesAdapter.getInitialState(),
};

export const spotifySlice = createSlice({
  name: "spotify",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    reset(state) {
      Object.assign(state, spotifySlice.getInitialState());
    },

    addTracks: (state, action: PayloadAction<{ tracks: Track | Track[] }>) => {
      let tracks: Track[] = [];
      if (!Array.isArray(action.payload.tracks)) {
        tracks = [action.payload.tracks];
      } else {
        tracks = action.payload.tracks;
      }
      trackAdapter.addMany(state.tracks, tracks);
    },

    addArtists: (
      state,
      action: PayloadAction<{ artists: TremorArtist | TremorArtist[] }>,
    ) => {
      let artists: TremorArtist[] = [];
      if (!Array.isArray(action.payload.artists)) {
        artists = [action.payload.artists];
      } else {
        artists = action.payload.artists;
      }
      artistAdapter.addMany(state.artists, artists);
    },
    addAudioFeatures: (
      state,
      action: PayloadAction<{ audioFeatures: AudioFeatures | AudioFeatures[] }>,
    ) => {
      let audioFeatures: AudioFeatures[] = [];
      if (!Array.isArray(action.payload.audioFeatures)) {
        audioFeatures = [action.payload.audioFeatures];
      } else {
        audioFeatures = action.payload.audioFeatures;
      }
      audioFeaturesAdapter.addMany(state.audioFeatures, audioFeatures);
    },
    setArtistMeasurables: state => {
      for (const artist of Object.values(state.artists.entities)) {
        const topTrackIds = artist.topTracks ?? [];
        const artistAudioFeatures: AudioFeatures[] = [];

        topTrackIds.forEach(id => {
          const features = state.audioFeatures.entities[id];
          features && artistAudioFeatures.push(features);
        });

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
            const featureEntry = Object.entries(
              features,
            ) as Entries<AudioFeatures>;

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

        const aveFeatures: Record<string, number> = {};

        Object.entries(parsedFeatures.numeric).forEach(entry => {
          if (!(entry[0] in fullMarks)) return;
          let count = entry[1].length;

          let ave =
            entry[1].reduce((acc, val) => {
              const add = (acc += val);

              return add;
            }, 0) / count;

          switch (entry[0]) {
            case "tempo":
              ave = (ave - 60) / 100;
              break;
            case "loudness":
              ave /= -60;
              break;
            default:
              break;
          }
          aveFeatures[entry[0]] = ave;
        });

        state.artists.entities[artist.id].measurables =
          aveFeatures as ArtistMeasurables;
      }
    },
  },
});
