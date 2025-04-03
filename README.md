# IPC Channel list

`liveview` stream chunks of video buffer, used in `LiveviewService` emitted by web socket

## Session

`session` channels handles main use case in a single session. A session is defined as the beginning of user enters the app until printing the result as well a link generated as QR. This object is used as state control.

`phase` is a number of stage the user is running through. A session has eight phases. This term is mostly useful in the renderer codebase, since the components naming convention are based by the phase number. Node runtime objective is to ensure the single source of truth for phase number, maintaining consistency in the renderer just in case error is thrown at the renderer and needs a reboot, continuing at the stage at which this runtime stores the `phase` object.

### session channels

`session/begin` initiation of a session, invoked at user enters the app.

`session/proceed` move forward to next phase.

`session/end` ends the current session, resetting `phase` and cleansing program state.

`session/load` invoke from renderer to get current state in Node runtime, mostly use for reloading app.

`session/state/payment` invoke to save payment object to Node state runtime.

`session/state/frame` invoke to save frame object to Node state runtime.

`session/state/canvas` invoke to save canvas object to Node state runtime.

`session/throw` invoke when the renderer throw error.

## Media

`media` channels handles functions associated with media file, including saving media files, printing, and rendering video.

### media channels

`media/print` initiate printing procedure. Receive URL representation of image binary data, write to disk and spawn process to print from the written file.

`media/render` initiate stop motion video rendering procedure. Spawn independent process to render video from a path configured source folder.

`media/motion` receive URL representation of image binary data to be written as `motion` (read the Motion section for definition).

`media/canvas` receive URL representation of image binary data to be written as `canvas` (read the Canvas section for definition).
