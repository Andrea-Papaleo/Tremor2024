import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAllArtists } from "../../features/spotify/spotifySelectors";

export const TremorArtistList = () => {
  const artists = useAppSelector(selectAllArtists);

  return <div>TremorArtistList</div>;
};
