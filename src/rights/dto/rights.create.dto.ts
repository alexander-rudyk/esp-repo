export class RightsCreateDto {
  project?: { id: number };
  user?: { id: number };
  isCanDownload: boolean;
  isCanUpload: boolean;
}
