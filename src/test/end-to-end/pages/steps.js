import { actor } from 'codeceptjs';
import signIn from './IDAM/signIn.js';
import { caseAuditSearch } from './lauHomePage/caseAuditSearch.js';
import { caseSearch } from './lauHomePage/caseSearch.js';
import { logonAuditSearch } from './lauHomePage/logonAuditSearch.js';
import { deletedUsersSearch } from './lauHomePage/deletedUsersSearch.js';
import { caseChallengedAccessSearch } from './lauHomePage/caseChallengedAccessSearch.js';
import { caseAuditSearchWithoutSearchData } from './lauHomePage/caseAuditSearchWithoutSearchData.js';
import { logonAuditSearchWithoutSearchData } from './lauHomePage/logonAuditSearchWithoutSearchData.js';
import { deletedUsersSearchWithoutSearchData } from './lauHomePage/deletedUsersSearchWithoutSearchData.js';
import { caseChallengedAccessSearchWithoutSearchData } from './lauHomePage/caseChallengedAccessSearchWithoutSearchData.js';
import { userDetailsSearch } from './lauHomePage/userDetailsSearch.js';


export default function () {
  return actor({
    authenticateWithIdam: signIn,
    performCaseAuditSearch: caseAuditSearch,
    performCaseSearch: caseSearch,
    performLogonAuditSearch: logonAuditSearch,
    performDeletedUsersSearch: deletedUsersSearch,
    performCaseChallengedAccessSearch: caseChallengedAccessSearch,
    performCaseAuditSearchWithoutSearchData: caseAuditSearchWithoutSearchData,
    performLogonAuditSearchWithoutSearchData: logonAuditSearchWithoutSearchData,
    performDeletedUsersSearchWithoutSearchData: deletedUsersSearchWithoutSearchData,
    performChallengedAccessSearchWithoutSearchData: caseChallengedAccessSearchWithoutSearchData,
    performUserDetailsSearch: userDetailsSearch,
  });
};
