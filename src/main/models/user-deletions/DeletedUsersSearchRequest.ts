export interface DeletedUsersSearchRequest {
  userId: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  startTimestamp: string;
  endTimestamp: string;
  size: number;
  page: number;
}
