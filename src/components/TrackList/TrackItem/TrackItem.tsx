import { Box, ListItem, Typography } from "@mui/material";
import { Track } from "@spotify/web-api-ts-sdk";

type TrackItemProps = {
  track: Track;
  index: number;
};

// const getMMSSFromMS = (ms: number) => {
//   const seconds = ms / 1000;
//   const minutes = Math.floor(seconds / 60);
//   const secondsRem = Math.round(seconds % 60);

//   return `${minutes}:${secondsRem}`;
// };

export const TrackItem = ({ track, index }: TrackItemProps) => {
  return (
    <ListItem key={track.id} sx={{ py: 1 }}>
      <Box display="flex" width="100%" overflow="scroll">
        <Typography color="white" pr={2}>
          {index + 1}.
        </Typography>
        <Typography color="white">{track.name}</Typography>
      </Box>
    </ListItem>
  );
};
