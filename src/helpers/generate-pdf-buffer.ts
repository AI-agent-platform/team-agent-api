import * as path from "path";
import { readFile } from "fs/promises";

export async function loadPdfAttachment(
  filename: string,
  folder = "assets/pdfs"
) {
  try {
    const filePath = path.join(process.cwd(), folder, filename);
    const buffer = await readFile(filePath);

    return {
      filename,
      content: buffer,
      contentType: "application/pdf",
    };
  } catch (err) {
    console.warn(
      `PDF "${filename}" not found in ${folder}. Sending email without attachment.`,
      err?.message || err
    );
    return null;
  }
}
