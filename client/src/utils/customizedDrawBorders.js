import * as fabric from "fabric";

export const customizedDrawBroders = () => {
  return (fabric.FabricObject.prototype.drawBorders = function (
    ctx,
    styleOverride
  ) {
    styleOverride = styleOverride || {};
    var wh = this._calculateCurrentDimensions(),
      strokeWidth = this.borderScaleFactor,
      width = wh.x + strokeWidth,
      height = wh.y + strokeWidth,
      hasControls =
        typeof styleOverride.hasControls !== "undefined"
          ? styleOverride.hasControls
          : this.hasControls,
      shouldStroke = false;

    ctx.save();
    // Set the border color to red
    ctx.strokeStyle = "#0466c8"; // Change the color here
    this._setLineDash(
      ctx,
      styleOverride.borderDashArray || this.borderDashArray,
      null
    );

    // Calculate dimensions for the selection box
    ctx.beginPath();

    // Rounded rectangle parameters
    const radius = 10; // Adjust this for desired roundness
    ctx.moveTo(-width / 2 + radius, -height / 2);

    ctx.lineTo(width / 2 - radius, -height / 2);
    ctx.quadraticCurveTo(
      width / 2,
      -height / 2,
      width / 2,
      -height / 2 + radius
    );

    ctx.lineTo(width / 2, height / 2 - radius);
    ctx.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);

    ctx.lineTo(-width / 2 + radius, height / 2);
    ctx.quadraticCurveTo(
      -width / 2,
      height / 2,
      -width / 2,
      height / 2 - radius
    );

    ctx.lineTo(-width / 2, -height / 2 + radius);
    ctx.quadraticCurveTo(
      -width / 2,
      -height / 2,
      -width / 2 + radius,
      -height / 2
    );

    ctx.closePath();
    ctx.stroke(); // Draw the border
    ctx.restore();

    // Draw controls if they are visible
    if (hasControls) {
      ctx.beginPath();
      this.forEachControl(function (control, key, fabricObject) {
        if (
          control.withConnection &&
          control.getVisibility(fabricObject, key)
        ) {
          shouldStroke = true;
          ctx.moveTo(control.x * width, control.y * height);
          ctx.lineTo(
            control.x * width + control.offsetX,
            control.y * height + control.offsetY
          );
        }
      });
      if (shouldStroke) {
        ctx.stroke();
      }
    }
    ctx.restore();
    return this;
  });
};
