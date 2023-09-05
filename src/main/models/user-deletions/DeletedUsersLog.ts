import {Logs} from '../Logs';

export interface DeletedUsersLog {
    userId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    timestamp: string;
}

export class DeletedUsersLog extends Logs<DeletedUsersLog> {
    public _fields: string[] = ['userId', 'emailAddress', 'firstName', 'lastName', 'timestamp'];
}

export const deletedUsersLogsOrder = ['userId', 'email', 'firstName', 'lastName', 'timestamp'];
