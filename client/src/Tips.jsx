import { Box, Typography } from '@mui/material'

const Tips = () => {
  return (
    <Box   sx={{ width:300, border:2, borderColor:'gray', padding:2, height:'fit-content', alignSelf:'start'}}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>

            <Typography fontSize={16} fontWeight={700} alignSelf={'center'} flexWrap={'wrap'}>Some Tips for Using Canvas</Typography>

          <Typography  fontSize={14} flexWrap={'wrap'}> 🟢  To select elements of you chosing please hold shift and then select objects with mouse</Typography>
          <Typography  fontSize={14} flexWrap={'wrap'}> 🟢  Please use your mouse wheel to Zoom In and Out In the Canvas and For painning hold alt key and than move with you mouse click.  </Typography>
        </Box>
      
    </Box>
  )
}

export default Tips
