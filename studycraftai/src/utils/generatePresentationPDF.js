import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as FileSystem from "expo-file-system";

export const generatePresentationPDF = async (presentation) => {
  const slidesHtml = presentation
    .map(
      (slide, index) => `
        <div style="margin-bottom: 40px;">
          <h2>Slide ${index + 1}: ${slide.title}</h2>
          <ul>
            ${slide.bullets.map((b) => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      `
    )
    .join("");

  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { color: #333; }
          li { margin-bottom: 6px; }
        </style>
      </head>
      <body>
        <h1>Presentation</h1>
        ${slidesHtml}
      </body>
    </html>
  `;

  const options = {
    html: htmlContent,
    fileName: "presentation",
    directory: "Documents",
  };

  try {
    const pdf = await RNHTMLtoPDF.convert(options);
    return pdf.filePath;
  } catch (error) {
    console.error("❌ PDF generation error:", error);
    return null;
  }
};
