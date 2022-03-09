const userType = {
    JUDGE: 'Judge',
    LA: 'Legal Advisor',
    CASEWORKER: 'Caseworker',
    CITIZEN: 'Citizen'
};

const caseEventId = {
    INITIATE_PAYMENT_CASE: 'InitiateClaimPaymentCitizen',
    STAY_CLAIM: 'StayClaim',
    LIFT_STAY: 'LiftStay',
    ASSIGN_FOR_DIRECTIONS: 'AssigningForDirections',
    ASSIGN_FOR_JUDGE_DIRECTIONS: 'AssigningForJudgeDirections',
    CLAIMANT_REJECTS: 'ClaimantRejects',
    GENERATE_ORDER: 'GenerateOrder'
};

const caseEventName = {
    LIFT_STAY: 'Lift Stay',
    PROVIDE_DIRECTIONS: 'Provide Directions',
    GENERATE_ORDER: 'Generate Order',
    REVIEW_ORDER: 'Review Order',
    ACTION_REVIEW_COMMENTS: 'Action review comments',
    APPROVE_DIRECTIONS_ORDER: 'Approve direction\'s order',
    DRAW_DIRECTIONS_ORDER: 'Draw directions order',
    JUDGE_DRAW_DIRECTIONS_ORDER: 'Draw directions order - Judge',
    REFERRED_MEDIATION: 'Mediation pending',
    MANAGE_DOCUMENTS: 'Manage Documents',
    MEDIATION_SUCCESSFUL: 'Mediation successful',
    MEDIATION_FAILED: 'Mediation unsuccessful',
    ISSUE_PAPER_DEFENCE_FORMS: 'Issue paper defence forms',
    PAPER_RESP_REVIEWED: 'Paper response reviewed',
    REVIEW_OCON9X_RESP: 'Review OCON9x paper response',
    PAPER_RESP_ADMISSIOON: 'Paper Response - Admission',
    PAPER_RESP_DEFENCE: 'Paper Response - Defence',
    ENTER_BREATHING_SPACE: 'Enter Breathing Space',
    LIFT_BREATHING_SPACE: 'Lift Breathing Space',
    CASE_HANDED_TO_CCBC: 'Case handed to CCBC',
    CHANGE_CONTACT_DETAILS: 'Change contact details',
    RESET_PIN: 'Reset Pin',
    RESEND_RPA: 'Resend RPA',
    CLAIM_NOTES: 'Claim notes',
    ATTACH_VIA_BULK_SCAN: 'Attached via bulk scan',
    LINK_LETTER_HOLDER_ID: 'Link letter holder',
    TRANSFER_CASE: 'Transfer case',
    WAITING_TO_BE_TRANSFERRED: 'Waiting to be transferred',
    SUPPORT_UPDATE: 'Support update',
    UPDATED_HWF_NUM: 'Updated HwF Number',
    NO_REMISSION_HWF: 'No remission HwF',
    INVALID_HWF_REF: 'Invalid HwF Reference',
    FULL_REMISSION_HWF: 'Full remission HwF- granted',
    PART_REMISSION_HWF: 'Part remission HwF-granted',
    MORE_INFO_HWF_REQD: 'More Information Required HwF',
    ISSUEE_HWF_CLAIM: 'Issue Help With Fees Claim'

};

module.exports = {
    userType,
    caseEventId,
    caseEventName
};
