export class FileCreateDto {
  fieldname: string;
  mimetype: string;
  filename?: string;
  originalname: string;
  buffer: Buffer;
  path?: string;
}
