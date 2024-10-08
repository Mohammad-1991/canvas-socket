import * as fabric from "fabric";

export const applyGroupStyles = (canvas) => {
  // Store original styles in a Map for later restoration
  const originalStyles = new Map();

  // Handle selection creation
  canvas.on("selection:created", () => {
    const activeObject = canvas.getActiveObject();
    console.log("Active Object Type:", activeObject.type);

    // Check for active selection
    if (activeObject && activeObject.type === "activeselection") {
      console.log("Applying styles to group selection...");

      // Store original styles for restoration later
      activeObject._objects.forEach((object) => {
        originalStyles.set(object.id, {
          hasControls: object.hasControls,
          hasBorders: object.hasBorders,
        });
      });

      // Apply styles to the group selection border
      activeObject.set({
        padding: 8,
        cornerColor: "black",
        cornerStrokeColor: "black",
        borderColor: "black",
        cornerStyle: "circle",
      });

      activeObject.controls.tl = new fabric.Control({
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

      activeObject.controls.tr = new fabric.Control({
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
    
      







      activeObject.setControlsVisibility({
        tl: true,
        tr: true,
        bl: true,
        br: false,
        mt: false,
        mb: false,
        ml: false,
        mr: false,
        mtr:false,
      });
      

      // Hide individual object borders and controls
      activeObject._objects.forEach((object) => {
        object.set({
          hasControls: false,
          hasBorders: false,
        });
        object.setCoords();  // Update coordinates for correct rendering
      });

      canvas.renderAll();  // Render changes
      console.log("Styles applied to group selection.");
    }
  });

  // Handle selection update
  canvas.on("selection:updated", () => {
    const activeObject = canvas.getActiveObject();
    
    if (activeObject && activeObject.type === "activeselection") {
      console.log("Reapplying styles to group selection...");

      // Reapply styles to the group selection border
      activeObject.set({
        borderColor: "black",
        cornerColor: "black",
        cornerSize: 12,
        cornerStyle: "circle",
        padding: 10,
        hasBorders: true,
        hasControls: true
      });

      activeObject._objects.forEach((object) => {
        object.set({
          hasControls: false,
          hasBorders: false,
        });
        object.setCoords();  // Update coordinates again
      });

      canvas.renderAll();  // Render changes
    }
  });

  // Handle selection clearing (when objects are deselected)
  canvas.on("selection:cleared", () => {
    console.log("Selection cleared");
    
    // Restore original styles for all objects in the canvas
    canvas.getObjects().forEach((object) => {
      const originalStyle = originalStyles.get(object.id);
      if (originalStyle) {
        object.set({
          hasControls: originalStyle.hasControls,
          hasBorders: originalStyle.hasBorders,
        });
        object.setCoords();  // Update coordinates
      }
    });

    canvas.renderAll();  // Render the canvas to reflect changes
  });
};
