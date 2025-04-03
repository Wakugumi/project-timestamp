import axios, { Axios, AxiosHeaders, AxiosInstance } from "axios";
import { createReadStream } from "node:original-fs";

export class UploadService {
  #path: string;
  #url: string;
  #headers: AxiosHeaders;

  constructor(path: string, url: string, filetype: "image" | "video") {
    this.#path = path;
    this.#url = url;
    switch (filetype) {
      case "image":
        this.#headers = new AxiosHeaders({
          "Content-Disposition": "attachment",
          "Content-Type": "image/png",
        });
        break;

      case "video":
        this.#headers = new AxiosHeaders({
          "Content-Disposition": "attachment",
          "Content-Type": "video/mp4",
        });
    }
  }

  public async upload() {
    try {
      const data = createReadStream(this.#path);

      const response = await axios.put(this.#url, data, {
        headers: this.#headers,
      });
      console.log("upload success:", response.status, response.data);
    } catch (error) {
      console.log("upload error:", error);
      throw error;
    }
  }
}
