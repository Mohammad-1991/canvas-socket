import { Box, Button } from "@mui/material";
import { removeObjects } from "./fabric_manager/RemovingObjects";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Cancel from "@mui/icons-material/Cancel";
import MouseTracker from "./components/MouseTracker";
import { useCanvasRender } from "./hooks/useCanvasRender";

const CanvasComponent = () => {
  const {
    ImageRef,
    ImageRef2,
    canvas,
    canvasContainerRef,
    canvasRef,
    renderCircle,
    renderSquare,
  } = useCanvasRender();

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      flexDirection={"column"}
      justifyContent={"center"}
      textAlign={"center"}
      backgroundColor={"lightgray"}
      gap={2}
    >
      <MouseTracker />
      <Box sx={{ backgroundColor: "white" }} ref={canvasContainerRef}>
        <canvas ref={canvasRef} style={{ border: "1px dotted gray" }}></canvas>
      </Box>
      <Box display={"flex"} gap={2}>
        <Button onClick={renderCircle} variant="outlined">
          <CircleOutlinedIcon />
        </Button>
        <Button onClick={renderSquare} variant="outlined">
          <SquareOutlinedIcon />
        </Button>
        <Button
          onClick={() => {
            canvas.clear();
          }}
          variant="outlined"
        >
          <DeleteForever />
        </Button>
        <Button
          onClick={() => {
            removeObjects(canvas);
          }}
          variant="outlined"
        >
          <Cancel />
        </Button>
        <img
          ref={ImageRef}
          draggable="true"
          src="/src/assets/img.jpg"
          alt="Image"
          style={{ height: 50, width: 50 }}
          className="Image"
        />
        <img
          ref={ImageRef2}
          draggable="true"
          src="/src/assets/logo.svg"
          alt="Image"
          style={{ height: 50, width: 50 }}
          className="Image"
        />
      </Box>
    </Box>
  );
};

export default CanvasComponent;
