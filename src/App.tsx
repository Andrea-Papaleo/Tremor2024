import { useEffect, useState } from "react";
import "./App.css";
import { useSpotify } from "./features/spotify/useSpotify";
import { Scopes } from "@spotify/web-api-ts-sdk";
import type {
  Artist,
  AudioFeatures,
  Playlist,
  SpotifyApi,
  Track,
} from "@spotify/web-api-ts-sdk";

function App() {
  const sdk = useSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_REDIRECT_TARGET,
    Scopes.userDetails,
  );

  return sdk ? <SpotifySearch sdk={sdk} /> : <></>;
}

function SpotifySearch({ sdk }: { sdk: SpotifyApi }) {
  const [playlist, setPlaylist] = useState<Playlist<Track>>();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);

  useEffect(() => {
    (async () => {
      console.log("getting playlist");
      const playlist = await sdk.playlists.getPlaylist(
        "5fm0avsyX0G2O7gt9wg5Ju",
      );
      const trackIds: string[] = [];
      let artistIds: string[] = [];
      playlist.tracks.items.forEach(trackItem => {
        trackIds.push(trackItem.track.id);
        artistIds.push(
          ...trackItem.track.artists.map(artistItem => artistItem.id),
        );
      });

      artistIds = [...new Set(artistIds)];
      console.log("getting tracks");
      const tracks = await sdk.tracks.get(trackIds);
      console.log("getting artists");
      const artists = await sdk.artists.get(artistIds);
      const artistTopMetrics: Record<string, AudioFeatures[]> = {};
      for await (const artist of artistIds) {
        const topTracks = await sdk.artists.topTracks(artist, "PT");
        const trackMetrics = await sdk.tracks.audioFeatures(
          topTracks.tracks.map(track => track.id),
        );
        artistTopMetrics[artist] = trackMetrics;
      }

      setPlaylist(playlist);
      setTracks(tracks);
      setArtists(artists);
    })();
  }, [sdk]);

  // generate a table for the results
  const tableRows = tracks.map(track => {
    return (
      <tr key={track.id}>
        <td>{track.name}</td>
        <td>{track.popularity}</td>
        <td>{track.artists.map(artist => artist.name)}</td>
      </tr>
    );
  });

  return (
    <>
      <h1>Spotify Search for The Beatles</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Popularity</th>
            <th>Artists</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    </>
  );
}

export default App;
