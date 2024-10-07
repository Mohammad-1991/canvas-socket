import * as fabric from 'fabric'
import { customControls } from './CustomControls';

export const handleImageDrop = (canvasContainerRef, canvas, ImageRef , imageScaleFactor) => {
    let draggedImage = null; // Variable to track the dragged image
  
    // Drag start event
    const handleDragStart = () => {
      draggedImage = ImageRef.current; // Track the image being dragged
      draggedImage.classList.add('img_dragging');
    };
  
    // Drag over event
    const handleDragOver = (e) => {
      e.preventDefault(); 
      e.dataTransfer.dropEffect = 'copy';
    };
  
    // Drop event
    const handleDrop = (e) => {
      e.preventDefault();
      
      if (draggedImage) {
        const zoom = canvas.getZoom();
        const pointer = canvas.getViewportPoint(e);
        const vpt = canvas.viewportTransform; // For panning
  
        // Adjust coordinates based on zoom and pan
        const adjustedX = (pointer.x - vpt[4]) / zoom;
        const adjustedY = (pointer.y - vpt[5]) / zoom;
  
        const newImage = new fabric.FabricImage(draggedImage, {
          left: adjustedX,
          top: adjustedY,
          originX: 'center',
          originY: 'center',
        });
        newImage.scale(imageScaleFactor);
        customControls(newImage)
        canvas.add(newImage);
        canvas.renderAll();
  
        draggedImage.classList.remove('img_dragging'); // Cleanup
        draggedImage = null; // Reseting the dragged image
      }
    };
  
    // Drag end event
    const handleDragEnd = () => {
      if (draggedImage) {
        draggedImage.classList.remove('img_dragging');
        draggedImage = null; // Reset the dragged image
      }
    };
  
    // Attach event listeners to the image reference
    ImageRef.current.addEventListener('dragstart', handleDragStart);
    ImageRef.current.addEventListener('dragend', handleDragEnd);
  
    // Attach event listeners to the canvas container for dropping
    canvasContainerRef.current.addEventListener('dragover', handleDragOver);
    canvasContainerRef.current.addEventListener('drop', handleDrop);
  
    // Cleanup listeners when the component unmounts
    return () => {
      ImageRef.current.removeEventListener('dragstart', handleDragStart);
      ImageRef.current.removeEventListener('dragend', handleDragEnd);
      canvasContainerRef.current.removeEventListener('dragover', handleDragOver);
      canvasContainerRef.current.removeEventListener('drop', handleDrop);
    };
  };
  