import BaseApi from "./BaseApi";

class Upload extends BaseApi {
  constructor() {
    super("/upload");
  }

  public async uploadVideos(
    files: File[],
    token: string
  ): Promise<{ status: string; message: string[] }> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await this.post(`/upload/videos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  }

  public async uploadImages(
    images: File[],
    token: string
  ): Promise<{ status: string; message: string }> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("file", image);
    });

    const response = await this.post(`/upload/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  }
}

export const uploadApi = new Upload();
