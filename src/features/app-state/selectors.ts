export const selectDataLoadedState = ({
  appState,
}: {
  appState: { dataLoaded: boolean };
}) => {
  return appState.dataLoaded;
};
