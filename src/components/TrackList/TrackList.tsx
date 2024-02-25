import React, {
  MouseEventHandler,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { TrackItem } from "./TrackItem/TrackItem";
import { Box, List, ListItem, Typography } from "@mui/material";
import { Track } from "@spotify/web-api-ts-sdk";
import { useAppSelector } from "../../app/hooks";
import { selectTrackEntities } from "../../features/spotify/spotifySelectors";
import { useSelector } from "react-redux";

type TrackListProps = {
  trackIds: string[];
};

const trackFeatures = [
  "Name",
  "Duration",
  "Danceability",
  "Acousticness",
  "Energy",
  "Instrumentalness",
  "Key",
  "Liveness",
  "Loudness",
  "Speechiness",
  "Time Signature",
  "Tempo",
  "Valence",
];

export const TrackFeature = ({
  feature,
  value,
  onClick,
}: {
  feature: string;
  value?: number | string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}) => {
  const getSize = (featureName: string) => {
    if (featureName === "Name") {
      return "25rem";
    } else if (
      ["Energy", "Key", "Tempo", "Valence", "Duration"].includes(featureName)
    ) {
      return "5rem";
    } else if (
      ["Liveness", "Loudness", "Danceability", "Acousticness"].includes(
        featureName,
      )
    ) {
      return "7rem";
    } else {
      return "10rem";
    }
  };
  return (
    <Typography
      textAlign={"center"}
      color="white"
      sx={{
        minWidth: getSize(feature),
        overflowX: "scroll",
        "&:hover": { cursor: value ? "inherit" : "pointer" },
      }}
      onClick={onClick}
    >
      {!value && value !== 0
        ? feature
        : typeof value === "string"
          ? value
          : (value as number).toPrecision(3)}
    </Typography>
  );
};

const TrackList = ({ trackIds }: TrackListProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const allTracks = useSelector(selectTrackEntities);

  useEffect(() => {
    const fullTracks = trackIds.map(trackId => allTracks[trackId]);
    setTracks(fullTracks);
  }, [trackIds]);
  return (
    <List
      sx={{
        height: "15rem",
        overflowY: "scroll",
        overflowX: "scroll",
      }}
    >
      {tracks.map((track, idx) => {
        return <TrackItem index={idx} track={track} key={track.id} />;
      })}
    </List>
  );
};

export default TrackList;
