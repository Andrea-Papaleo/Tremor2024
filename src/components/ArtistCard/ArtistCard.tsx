import React, { useEffect, useState } from "react";
import { TremorArtist } from "../../types/SpotifyState";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Image from "mui-image";
import TrackList from "../TrackList/TrackList";
import { TabsComponent } from "../generic/TabsComponent";
import { RadarChartComponent } from "../generic/RadarChartComponent";
import { useSelector } from "react-redux";
import { selectArtistMeasurables } from "../../features/spotify/spotifySelectors";
import { ArtistMeasurables } from "../../types/ArtistMeasurables";

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

type ChartData = { subject: string; A: number; fullMark: number }[];

export const ArtistCard = ({ artist }: { artist: TremorArtist }) => {
  const artistMeasurables = useSelector(selectArtistMeasurables)(artist.id);
  const [averageFeatures, setAverageFeatures] = useState<ChartData>([]);

  useEffect(() => {
    const chartData: ChartData = [];
    if (!artistMeasurables) {
      setAverageFeatures(chartData);
      return;
    }
    Object.entries(artistMeasurables).forEach(entry => {
      chartData.push({
        subject: entry[0],
        A: entry[1],
        fullMark: fullMarks[entry[0] as keyof ArtistMeasurables],
      });
    });
    setAverageFeatures(chartData);
  }, [artistMeasurables]);

  return (
    <Grid item key={artist.id} xs={12} sm={12} md={6} lg={3}>
      <Paper
        elevation={16}
        sx={{
          mx: "auto",

          display: "flex",
          flexDirection: "column",
          backgroundColor: "black", //"#484848",
          p: 3,
          borderRadius: 6,
        }}
      >
        <Box
          position={"relative"}
          display="flex"
          alignItems={"center"}
          alignContent={"center"}
          paddingBottom={2}
          marginBottom={1}
          borderBottom={"2px solid grey"}
        >
          {artist.images!.length !== 0 && (
            <Image
              src={artist.images![0].url}
              alt="random"
              width="85px"
              duration={0}
            />
          )}
          <Box display="flex" justifyContent="center" width="85%">
            <Typography variant="h5" component="h2" color="white">
              {artist.name}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider", color: "white" }}>
          <TabsComponent
            labels={["Top Songs", "Metrics"]}
            childClassName="artist-tabs"
            textColor="inherit"
            indicatorColor="secondary"
          >
            <TrackList trackIds={artist.topTracks ?? []} />
            <RadarChartComponent data={averageFeatures} />
          </TabsComponent>
        </Box>
      </Paper>
    </Grid>
  );
};
