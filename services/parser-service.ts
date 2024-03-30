type CSVData = Record<string, string>;

class ParserService {
  static async parseCSV(contents: string, separator: "," | ";" = ";"): Promise<CSVData[]> {
    try {
      const lines = contents
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const headers = lines[0].split(separator).map((header) => header.replace(/"/g, ""));
      const jsonData: CSVData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(separator);
        const entry: CSVData = {};

        for (let j = 0; j < headers.length; j++) {
          if (headers[j] === "gdrive_link_photo") {
            entry[headers[j]] = `https://drive.google.com/thumbnail?id=${currentLine[j].split("/")[5]}&sz=w1000`;
          } else {
            entry[headers[j]] = currentLine[j].replace(/"/g, "");
          }
        }
        jsonData.push(entry);
      }

      return jsonData;
    } catch (error) {
      return [];
    }
  }

  static async uploadAndParse(file: File | null) {
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const contents = e.target?.result as string;
        const jsonData = await ParserService.parseCSV(contents);

        return jsonData;
      };
      reader.readAsText(file);
    }
  }

  static async removeBackground(image: string): Promise<string> {
    const apiKey = "Qi8XDDS5bbAZ1eMXSNzjar5N";
    const url = "https://api.remove.bg/v1.0/removebg";
    const formData = new FormData();
    formData.append("image_url", image);
    formData.append("size", "auto");
    formData.append("type", "auto");
    formData.append("format", "auto");
    let result = "";

    await fetch(url, {
      method: "POST",
      headers: {
        "X-Api-key": apiKey,
      },
      body: formData,
    })
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new Image();
        reader.src = URL.createObjectURL(blob);
        result = reader.src;
      })
      .catch((err) => {
        console.error(err);
        result = image;
      });

    return result;
  }
}

export default ParserService;
