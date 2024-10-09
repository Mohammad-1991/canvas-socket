import * as fabric from "fabric";

export const applyGroupStyles = (canvas) => {
  const originalStyles = new Map();

  // Preload the images to prevent redundant loading in render
  const preloadImage = (src, callback) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      callback(img);
    };
  };

  let rotateIcon, deleteIcon, resizeIcon;

  // Preload images
  preloadImage("/src/assets/rotate.svg", (img) => rotateIcon = img);
  preloadImage("/src/assets/cancel.svg", (img) => deleteIcon = img);
  preloadImage("/src/assets/doubleArrow.svg", (img) => resizeIcon = img);

  const applyCustomStyles = (activeObject) => {
    if (activeObject && activeObject.type === "activeselection") {
      activeObject._objects.forEach((object) => {
        originalStyles.set(object.id, {
          hasControls: object.hasControls,
          hasBorders: object.hasBorders,
        });
      });

      activeObject.set({
        padding: 8,
        cornerColor: "black",
        cornerStrokeColor: "black",
        borderColor: "black",
        cornerStyle: "circle",
      });

      // Rotate Control
      activeObject.controls.tl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        offsetX: -15,
        offsetY: -1,
        cursorStyle: "pointer",
        actionHandler: fabric.controlsUtils.rotationWithSnapping,
        actionName: "rotate",
        render: (ctx, left, top) => {
          const size = 24;
          ctx.clearRect(left - size / 2, top - size / 2, size, size);  // Clear the area
          if (rotateIcon) {
            ctx.drawImage(rotateIcon, left - size / 2, top - size / 2, size, size);
          }
        },
        cornerSize: 24,
      });

      // Delete Control
      activeObject.controls.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -1,
        offsetX: 18,
        cursorStyle: "pointer",
        render: (ctx, left, top) => {
          const size = 24;
          ctx.clearRect(left - size / 2, top - size / 2, size, size);  // Clear the area
          if (deleteIcon) {
            ctx.drawImage(deleteIcon, left - size / 2, top - size / 2, size, size);
          }
        },
        cornerSize: 24,
        mouseUpHandler: function (eventData, transform, x, y) {
          const target = transform.target;
          const canvas = target.canvas;

          if (target.type === "activeselection") {
            target._objects.forEach((object) => {
              canvas.remove(object);
            });
          } else {
            canvas.remove(target);
          }

          canvas.discardActiveObject();
          canvas.renderAll();
          return true;
        },
      });

      // Resize Control
      activeObject.controls.bl = new fabric.Control({
        x: -0.5,
        y: 0.5,
        offsetX: -15,
        offsetY: 0,
        cursorStyle: "ew-resize",
        render: (ctx, left, top) => {
          const size = 24;
          ctx.clearRect(left - size / 2, top - size / 2, size, size);  // Clear the area
          if (resizeIcon) {
            ctx.drawImage(resizeIcon, left - size / 2, top - size / 2, size, size);
          }
        },
        cornerSize: 24,
        actionHandler: fabric.controlsUtils.scalingEqually,
        actionName: "scalingEqually",
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
        mtr: false,
      });

      activeObject._objects.forEach((object) => {
        object.set({
          hasControls: false,
          hasBorders: false,
        });
        object.setCoords();
      });

      canvas.renderAll();
    }
  };

  // Handle selection creation (dragging selection)
  canvas.on("selection:created", () => {
    const activeObject = canvas.getActiveObject();
    applyCustomStyles(activeObject);
  });

  // Handle shift+click selection (individual selection updates)
  canvas.on("selection:updated", () => {
    const activeObject = canvas.getActiveObject();
    applyCustomStyles(activeObject);
  });

  // Handle selection clearing (when objects are deselected)
  canvas.on("selection:cleared", () => {
    canvas.getObjects().forEach((object) => {
      const originalStyle = originalStyles.get(object.id);
      if (originalStyle) {
        object.set({
          hasControls: originalStyle.hasControls,
          hasBorders: originalStyle.hasBorders,
        });
        object.setCoords();
      }
    });

    canvas.renderAll();
  });
};
