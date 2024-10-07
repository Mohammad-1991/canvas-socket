import * as fabric from "fabric";

export const customControls = (object) => {
  object.set({
    padding: 8,
    cornerColor: "black",
    cornerStrokeColor: "black",
    borderColor: "black",
    cornerStyle: "circle",
  });

  object.controls.tl = new fabric.Control({
    x: -0.5, // Horizontal position
    y: -0.5, // Vertical position
    offsetX: -15, // Move 4px away from the left
    offsetY: -1, // Move 4px away from the top
    cursorStyle: "pointer",
    actionHandler: fabric.controlsUtils.rotationWithSnapping, // Change to rotation
    actionName: "rotate", // Action name for rotation
    render: (ctx, left, top) => {
      const size = 24;
      const img = new Image();
      img.src = "/src/assets/rotate.svg"; // Replace with your custom icon path

      img.onload = () => {
        ctx.drawImage(img, left - size / 2, top - size / 2, size, size);
      };

      // Check if the image has already loaded
      if (img.complete) {
        ctx.drawImage(img, left - size / 2, top - size / 2, size, size);
      }
    },
    cornerSize: 24, // Size of the control point
  });

  object.controls.tr = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -1,
    offsetX: 18,
    cursorStyle: "pointer",
    render: (ctx, left, top) => {
      const img = new Image();
      img.src = "/src/assets/cancel.svg"; // Path to your cancel icon

      // Draw the cancel icon
      img.onload = () => {
        ctx.drawImage(img, left - 12, top - 12, 24, 24); // Center the icon
      };

      if (img.complete) {
        ctx.drawImage(img, left - 12, top - 12, 24, 24);
      }
    },
    cornerSize: 24,

    // Add click functionality to remove the object
    mouseUpHandler: function (eventData, transform, x, y) {
      const target = transform.target; // Reference to the clicked object
      const canvas = target.canvas; // Reference to the canvas

      canvas.remove(target); // Remove the object from the canvas
      canvas.renderAll(); // Re-render the canvas
      return true; // Return true to finalize the mouse action
    },
  });

  // Ensure the canvas updates the control positions correctly
  object.on("modified", function () {
    this.setCoords(); // Update coordinates for correct control positions
  });

  object.controls.bl = new fabric.Control({
    x: -0.5, // Position at bottom-left
    y: 0.5,
    offsetX: -15,
    offsetY: 0,
    cursorStyle: "ew-resize",
    render: (ctx, left, top) => {
      const size = 24;
      const img = new Image();
      img.src = "/src/assets/doubleArrow.svg"; // Path to your resize icon

      // Draw the resize icon
      img.onload = () => {
        ctx.drawImage(img, left - size / 2, top - size / 2, size, size);
      };

      if (img.complete) {
        ctx.drawImage(img, left - size / 2, top - size / 2, size, size);
      }
    },
    cornerSize: 24,

    actionHandler: fabric.controlsUtils.scalingX, // Use Fabric's default scaling for resizing
    actionName: "scaleX", // Ensures the proper scaling action is triggered
  });

  object.setControlsVisibility({
    tl: true,
    tr: true,
    bl: true,
    br: true,
    mt: true,
    mb: true,
    ml: true,
    mr: true,
  });

  delete object.controls.mtr;
};
