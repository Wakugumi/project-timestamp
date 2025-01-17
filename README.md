# Developer > [!NOTE]

## Node Process backend notes

`gphoto2 --stdout --capture-movie | ffmpeg  -i - -vcodec rawvideo -pix_fmt yuv420p -threads 0 -f v4l2 -s:v 1920x1080 -r 25 /dev/video2`
The `-r` flag sets the frame rate of the stream. Assuming `/dev/video2` is not occupied, otherwise just change the name.
This method allows GPhoto2 to pipe its output stream to ffmpeg which then pipe it as virtual webcam.

## Response Body Format

Generally all endpoint will return the same JSON format in their payload, with status being considered as important info too.
`{
  "message" : <string>
}`
The string value for `message` will have a generic convention to process, each endpoint will have their own conventions.

However, if the response status returned was `500` as number, the response payload will look like this:
`{
  "error" : <string>
}`

### `/status`

`ready` : Camera device are ready to be use

### `/checkup`

This checks the camera functionality by testing captures and reading the downloaded file

`ok` : Required functions are good to go

### `/capture`

`succcess` : Capture action has successfully run and any further processing are resolved.

### `/session/reset`

`success` : Session has been reset.
