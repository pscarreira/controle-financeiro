export async function readCSV(file: Express.Multer.File): Promise<any> {
  const fileBuffer = file.buffer;
  const fileContent = fileBuffer.toString('utf8');
  return fileContent;
}
