const Media = require("./src/services/MediaService")

const path = process.cwd() + "/exports/canvas.jpg"



Media.print(path, 2, true);