import { useEffect, useState } from "react";
import "./App.css";
import { useSpotify } from "./features/spotify/useSpotify";
import { Scopes } from "@spotify/web-api-ts-sdk";
import type {
  Artist,
  AudioFeatures,
  SpotifyApi,
  Track,
} from "@spotify/web-api-ts-sdk";
import { TremorArtist } from "./types/SpotifyState";
import { useAppDispatch } from "./app/hooks";
import { spotifySlice } from "./features/spotify/spotifySlice";
import { Container } from "@mui/material";
import { MainAppBar } from "./components/MainAppBar";
import { Footer } from "./components/Footer";
import { ArtistsSection } from "./sections/ArtistsSection/ArtistsSection";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectDataLoadedState } from "./features/app-state/selectors";
import { appStateSlice } from "./features/app-state/appStateSlice";

function App() {
  const sdk = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.userDetails,
  );

  return sdk ? <SpotifySearch sdk={sdk} /> : <></>;
}

function SpotifySearch({ sdk }: { sdk: SpotifyApi }) {
  const dispatch = useDispatch();
  const dataLoaded = useSelector(selectDataLoadedState);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<TremorArtist[]>([]);

  useEffect(() => {
    const get = async () => {
      console.log("getting playlist");

      const playlist = await sdk.playlists.getPlaylist(
        "5fm0avsyX0G2O7gt9wg5Ju",
      );
      console.log("getting artists");
      const trackIds: string[] = [];
      let artistIds: string[] = [];
      playlist.tracks.items.forEach(trackItem => {
        trackIds.push(trackItem.track.id);
        artistIds.push(
          ...trackItem.track.artists.map(artistItem => artistItem.id),
        );
      });

      artistIds = [...new Set(artistIds)];
      let topTrackIds: string[] = [];

      const artists = (await sdk.artists.get(artistIds)) as TremorArtist[];
      let i = 1;
      for (const artist of artists) {
        console.log(`getting top tracks for artist ${i} of ${artists.length}`);
        const topTracksResults = await sdk.artists.topTracks(artist.id, "PT");
        console.log(
          `${topTracksResults.tracks.length} for artist with id: ${artist.id}`,
        );
        const topTracks = topTracksResults.tracks.map(track => track.id);
        topTrackIds.push(...topTracks);

        artist.topTracks = topTracks;
        i++;
      }
      topTrackIds = [...new Set(topTrackIds)];

      console.log(`Total tracks: ${topTrackIds.length}`);
      console.log("resolving tracks");
      let min = 0;
      let max = 50;
      const count = 50;
      let finished = false;
      const tracks: Track[] = [];
      const audioFeatures: AudioFeatures[] = [];

      while (!finished) {
        console.log(`receiving tracks ${min + 1} through ${max}`);
        const tracksSlice = topTrackIds.slice(min, max);
        const _tracks = await sdk.tracks.get(tracksSlice);
        tracks.push(..._tracks);
        const _audioFeatures = await sdk.tracks.audioFeatures(tracksSlice);
        audioFeatures.push(..._audioFeatures);
        min += count;
        max += count;
        if (tracksSlice.length < count) finished = true;
      }

      console.log(
        `recieved info for ${tracks.length} out of ${topTrackIds.length}`,
      );

      dispatch(spotifySlice.actions.addTracks({ tracks }));
      dispatch(spotifySlice.actions.addArtists({ artists }));
      dispatch(spotifySlice.actions.addAudioFeatures({ audioFeatures }));
      dispatch(spotifySlice.actions.setArtistMeasurables());
      dispatch(appStateSlice.actions.setDataLoaded({ dataLoaded: true }));
      setTracks(tracks);
      setArtists(artists);
    };

    if (!dataLoaded) {
      get();
    }
  }, []);

  return (
    <Container
      sx={{
        bgcolor: "#4158D0",
        backgroundImage:
          "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
        maxWidth: "100vw",
        minHeight: "100vh",
        px: 0,
        overflowY: "scroll",
        "@media (min-width: 1200px)": {
          maxWidth: "100vw",
        },
        "@media (min-width: 600px)": {
          px: 0,
        },
      }}
    >
      <MainAppBar />
      <ArtistsSection />

      <Footer />
    </Container>
  );
}

export default App;
