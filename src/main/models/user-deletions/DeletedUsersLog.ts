import {Logs} from '../Logs';

export interface DeletedUsersLog {
    userId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    deletionTimestamp: string;
}

export class DeletedUsersLog extends Logs<DeletedUsersLog> {
    public _fields: string[] = ['userId', 'emailAddress', 'firstName', 'lastName', 'deletionTimestamp'];
}

export const deletedUsersLogsOrder = ['userId', 'emailAddress', 'firstName', 'lastName', 'deletionTimestamp'];
