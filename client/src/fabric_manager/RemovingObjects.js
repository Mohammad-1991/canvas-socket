


export const removeObjects = (canvas)=>{
    const activeObjects = canvas.getActiveObjects();
    console.log(activeObjects)
    canvas.discardActiveObject(); 
    activeObjects.map((object)=>{
        console.log(object)
        canvas.remove(object)
    })

}