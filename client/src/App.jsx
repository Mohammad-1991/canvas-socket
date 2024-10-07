import { Box } from "@mui/material";
import Canvas from "./Canvas";
import Tips from "./Tips";

function App() {
  return (
    <Box
      backgroundColor={"lightgray"}
      paddingY={13}
      paddingX={2}
      display={"flex"}
      gap={2}
      justifyContent={"center"}
      flexWrap={"wrap-reverse"}
      position={"relative"}
    >
      <Canvas />
      <Tips />
    </Box>
  );
}

export default App;
