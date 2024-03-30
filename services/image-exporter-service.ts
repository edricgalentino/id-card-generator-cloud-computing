import html2canvas from "html2canvas";
import JSZip from "jszip";
class imageExporter {
  public static async exportToPng(imageID: string, name: string) {
    const element = document.getElementById(imageID);

    if (element) {
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      link.href = data;
      link.download = name + ".png";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  public static async getImagesFromElements(imageId: string[]) {
    const images = await Promise.all(
      imageId.map(async (id) => {
        const element = document.getElementById(id);
        if (element) {
          const canvas = await html2canvas(element);
          return canvas.toDataURL("image/png") as string;
        }
      })
    );

    return images as string[];
  }

  public static async exportAsZip(images: string[], imageNames: string[], zipFileName: string) {
    const zip = new JSZip();

    for (let i = 0; i < images.length; i++) {
      const response = await fetch(images[i]);
      const blob = await response.blob();
      zip.file(`${imageNames[i]}.png`, blob);
    }

    // Generate the zip file
    const zipData = await zip.generateAsync({
      type: "blob",
      streamFiles: true,
    });

    // Create a download link for the zip file
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(zipData);
    link.download = zipFileName + ".zip";
    link.click();
  }
}

export default imageExporter;
