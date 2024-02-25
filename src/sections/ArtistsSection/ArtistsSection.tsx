import { selectAllArtists } from "../../features/spotify/spotifySelectors";
import { Box, Grid } from "@mui/material";
import { ArtistCard } from "../../components/ArtistCard/ArtistCard";
import { useAppSelector } from "../../app/hooks";

export const ArtistsSection = () => {
  const artists = useAppSelector(selectAllArtists);
  // useEffect(() => {
  //   console.log(artists);
  // });
  return (
    <Box
      sx={{
        p: 8,
        pt: 16,
      }}
    >
      <Grid container spacing={4}>
        {artists.map(artist => (
          <ArtistCard artist={artist} key={artist.id} />
        ))}
      </Grid>
    </Box>
  );
};
