module.exports = {
    'reason': 'My reasons for the claim are that I am owed this money for a variety of reason, these being...',
    'caseName': 'John Smith Vs Mrs. Rose Smith',
    'features': 'admissions,directionsQuestionnaire',
    'issuedOn': '2021-02-24',
    'timeline': [
        {
            'id': 'e8f4d3cc-f76e-44e7-ae11-66f1396c5fd0',
            'value': {
                'date': 'may',
                'description': 'ok'
            }
        }
    ],
    'amountType': 'BREAK_DOWN',
    'applicants': [
        {
            'id': 'fd2479fa-05a0-4978-bc55-5019a5670a92',
            'value': {
                'partyName': 'John Smith',
                'partyDetail': {
                    'type': 'INDIVIDUAL',
                    'idamId': '4caee4db-cc66-410c-b27c-4bbfee1c3dfc',
                    'dateOfBirth': '1982-07-26',
                    'emailAddress': 'civilmoneyclaims+claimant-moneyclaims-210224@gmail.com',
                    'primaryAddress': {
                        'PostCode': 'SW2 1AN',
                        'PostTown': 'LONDON',
                        'AddressLine1': '10, DALBERG ROAD',
                        'AddressLine2': 'Brixton'
                    },
                    'telephoneNumber': {
                        'telephoneNumber': '07700000001'
                    },
                    'correspondenceAddress': {
                        'PostCode': 'G72 7ZY',
                        'PostTown': 'Edinburgh',
                        'AddressLine1': '234 Acacia Road',
                        'AddressLine2': 'a really cool place'
                    }
                },
                'leadApplicantIndicator': 'YES'
            }
        }
    ],
    'respondents': [
        {
            'id': '85c74ec9-19d0-4104-bda8-36dd9484f9cb',
            'value': {
                'pcqId': '27741ab2-23f5-402c-bb4e-a49d6e62967e',
                'partyName': 'Mrs. Rose Smith',
                'servedDate': '2021-03-01',
                'defendantId': 'e4c12163-d108-4579-880b-fc55f0c2282e',
                'partyDetail': {
                    'type': 'INDIVIDUAL',
                    'idamId': 'e4c12163-d108-4579-880b-fc55f0c2282e',
                    'dateOfBirth': '1982-07-26',
                    'emailAddress': 'civilmoneyclaims+defendant-moneyclaims-210224@gmail.com',
                    'primaryAddress': {
                        'PostCode': 'BS1 5TL',
                        'PostTown': 'Bristol',
                        'AddressLine1': 'ABC Street',
                        'AddressLine2': 'A cool place'
                    },
                    'telephoneNumber': {
                        'telephoneNumber': '07700000002'
                    }
                },
                'responseType': 'PART_ADMISSION',
                'letterHolderId': 'bcec83d6-1281-4067-8ae7-f2810f21ff63',
                'responseAmount': '5000',
                'responseMethod': 'DIGITAL',
                'responseDefence': 'I paid half',
                'claimantResponse': {
                    'submittedOn': '2021-02-24T13:54:08.107101',
                    'freeMediationOption': 'YES',
                    'claimantResponseType': 'REJECTION',
                    'mediationPhoneNumber': {
                        'telephoneNumber': '07700000001'
                    },
                    'directionsQuestionnaire': {
                        'hearingLoop': 'YES',
                        'selfWitness': 'NO',
                        'disabledAccess': 'YES',
                        'expertRequired': 'NO',
                        'hearingLocation': 'Bristol Civil and Family Justice Centre',
                        'languageInterpreted': 'Some Text',
                        'otherSupportRequired': 'Some Text',
                        'hearingLocationOption': 'SUGGESTED_COURT',
                        'signLanguageInterpreted': 'Some Text'
                    }
                },
                'responseDeadline': '2021-03-15',
                'statementOfMeans': {
                    'carer': 'NO',
                    'debts': [
                        {
                            'id': '8eb09f00-7641-42b2-8a7c-6adf3e370d05',
                            'value': {
                                'totalOwed': '10000',
                                'description': 'Wife\'s debt',
                                'monthlyPayments': '1000'
                            }
                        }
                    ],
                    'reason': 'I cannot pay immediately',
                    'incomes': [
                        {
                            'id': 'bd699827-4ec7-49ad-b4c0-21c7386b38da',
                            'value': {
                                'type': 'JOB',
                                'frequency': 'WEEK',
                                'amountReceived': '1000'
                            }
                        },
                        {
                            'id': '5bedc2df-142e-48c5-a75e-d120e2da4ba1',
                            'value': {
                                'type': 'UNIVERSAL_CREDIT',
                                'frequency': 'WEEK',
                                'amountReceived': '1000'
                            }
                        }
                    ],
                    'expenses': [
                        {
                            'id': 'ee3e2089-43c4-4ce1-9f57-25cfb9469d6c',
                            'value': {
                                'type': 'MORTGAGE',
                                'frequency': 'WEEK',
                                'amountPaid': '1000'
                            }
                        },
                        {
                            'id': '28cc5de3-52a5-48a6-b31a-445bb38904d3',
                            'value': {
                                'type': 'RENT',
                                'frequency': 'WEEK',
                                'amountPaid': '1000'
                            }
                        }
                    ],
                    'employers': [
                        {
                            'id': 'de09696f-2b1b-4609-8472-5fd21fc18209',
                            'value': {
                                'jobTitle': 'Junior Accountant',
                                'employerName': 'Happy Dogs and Cats'
                            }
                        }
                    ],
                    'taxYouOwe': '10000',
                    'courtOrders': [
                        {
                            'id': 'f2485c1b-d47d-4144-bf9f-e34700c26774',
                            'value': {
                                'amountOwed': '10000',
                                'claimNumber': '000MC001',
                                'monthlyInstalmentAmount': '1000'
                            }
                        }
                    ],
                    'bankAccounts': [
                        {
                            'id': 'c5e9d6dd-26ca-4fbd-8fd9-e3c0f0340d5e',
                            'value': {
                                'type': 'SAVINGS_ACCOUNT',
                                'joint': 'YES',
                                'balance': '1000000'
                            }
                        }
                    ],
                    'livingPartner': {
                        'over18': 'YES',
                        'pensioner': 'YES',
                        'disability': 'SEVERE'
                    },
                    'priorityDebts': [
                        {
                            'id': 'f8f70a3c-f86f-42c9-8d74-52e9d0ed9849',
                            'value': {
                                'type': 'MORTGAGE',
                                'amount': '50000',
                                'frequency': 'MONTH'
                            }
                        },
                        {
                            'id': '8a237fc6-5653-40c6-ac65-047c4eefadd2',
                            'value': {
                                'type': 'MAINTENANCE_PAYMENTS',
                                'amount': '20000',
                                'frequency': 'MONTH'
                            }
                        }
                    ],
                    'residenceType': 'OTHER',
                    'disabilityStatus': 'SEVERE',
                    'dependantChildren': [
                        {
                            'id': '7a0fe12e-15bf-4c06-8fe1-a2054f8e2da5',
                            'value': {
                                'ageGroupType': 'UNDER_11',
                                'numberOfChildren': 1
                            }
                        },
                        {
                            'id': 'd671dc7a-e384-4172-bcff-62f1ee75c5c5',
                            'value': {
                                'ageGroupType': 'BETWEEN_11_AND_15',
                                'numberOfChildren': 2
                            }
                        },
                        {
                            'id': '30dab3a5-4ff7-4179-8fa1-05a6ec2a12cd',
                            'value': {
                                'ageGroupType': 'BETWEEN_16_AND_19',
                                'numberOfChildren': 3,
                                'numberOfResidentChildren': 3
                            }
                        }
                    ],
                    'taxPaymentsReason': 'Various taxes',
                    'anyDisabledChildren': 'NO',
                    'residenceOtherDetail': 'Special home',
                    'otherDependantDetails': 'Colleagues',
                    'noOfMaintainedChildren': 0,
                    'selfEmploymentJobTitle': 'CEO',
                    'numberOfOtherDependants': 5,
                    'otherDependantAnyDisabled': 'NO',
                    'selfEmploymentAnnualTurnover': '100000'
                },
                'responseSubmittedOn': '2021-02-24T13:53:20.866051',
                'responseEvidenceRows': [
                    {
                        'id': 'eaf37514-7542-40a3-9d64-64fe674eda92',
                        'value': {
                            'type': 'CONTRACTS_AND_AGREEMENTS',
                            'description': 'description'
                        }
                    }
                ],
                'claimantProvidedDetail': {
                    'type': 'INDIVIDUAL',
                    'title': 'Mrs.',
                    'lastName': 'Smith',
                    'firstName': 'Rose',
                    'dateOfBirth': '1982-07-26',
                    'emailAddress': 'civilmoneyclaims+defendant-moneyclaims-210224@gmail.com',
                    'primaryAddress': {
                        'PostCode': 'BS1 5TL',
                        'PostTown': 'Bristol',
                        'AddressLine1': 'ABC Street',
                        'AddressLine2': 'A cool place'
                    },
                    'telephoneNumber': {
                        'telephoneNumber': '07700000002'
                    }
                },
                'defendantTimeLineEvents': [
                    {
                        'id': '458d5c3e-e876-466c-a223-713ea76f5a36',
                        'value': {
                            'date': 'Early Spring',
                            'description': 'Claimant accuses me of owing...'
                        }
                    },
                    {
                        'id': '190d1967-99c6-479f-845c-d60bb05fd1cd',
                        'value': {
                            'date': 'Mid Spring',
                            'description': 'I asked the claimant for a reason and evidence why they are doing this.'
                        }
                    }
                ],
                'directionsQuestionnaire': {
                    'hearingLoop': 'YES',
                    'selfWitness': 'YES',
                    'expertReports': [
                        {
                            'id': 'd2d85535-ef1b-40b4-b1ff-1ff435a4ccd7',
                            'value': {
                                'expertName': 'I am an expert, trust me',
                                'expertReportDate': '2019-01-01'
                            }
                        }
                    ],
                    'disabledAccess': 'YES',
                    'expertRequired': 'YES',
                    'hearingLocation': 'Bristol Civil and Family Justice Centre',
                    'unavailableDates': [
                        {
                            'id': '8ad57482-719f-4ecf-b9fb-f1ec16270c1e',
                            'value': '2021-02-25'
                        }
                    ],
                    'languageInterpreted': 'Some Text',
                    'otherSupportRequired': 'Some Text',
                    'hearingLocationOption': 'SUGGESTED_COURT',
                    'numberOfOtherWitnesses': 1,
                    'signLanguageInterpreted': 'Some Text'
                },
                'responseEvidenceComment': 'Some evidence',
                'claimantProvidedPartyName': 'Mrs. Rose Smith',
                'defendantPaymentIntention': {
                    'paymentLength': '3 weeks',
                    'paymentOption': 'INSTALMENTS',
                    'completionDate': '2025-01-15',
                    'paymentSchedule': 'EACH_WEEK',
                    'firstPaymentDate': '2025-01-01',
                    'instalmentAmount': '2000'
                },
                'responseFreeMediationOption': 'YES',
                'responseMediationPhoneNumber': {
                    'telephoneNumber': '07700000002'
                },
                'responseMoreTimeNeededOption': 'NO'
            }
        }
    ],
    'submittedOn': '2021-02-24T13:51:01.097782',
    'submitterId': '4caee4db-cc66-410c-b27c-4bbfee1c3dfc',
    'totalAmount': '10550',
    'interestRate': 8,
    'interestType': 'STANDARD',
    'caseDocuments': [],
    'paymentAmount': '250000',
    'paymentStatus': 'Success',
    'submitterEmail': 'civilmoneyclaims+claimant-moneyclaims-210224@gmail.com',
    'amountBreakDown': [
        {
            'id': 'ec80d3c9-9e91-4011-bef3-5d69f4ed597a',
            'value': {
                'amount': '1000',
                'reason': 'Reason'
            }
        },
        {
            'id': 'e6b61d4e-c3e9-4177-8d6b-3af2a0e42057',
            'value': {
                'amount': '2050',
                'reason': 'Reason'
            }
        },
        {
            'id': 'af8ca581-968b-41c1-955d-2960d272df07',
            'value': {
                'amount': '5000',
                'reason': 'Reason'
            }
        }
    ],
    'bulkPrintDetails': [
        {
            'id': 'b94293b7-987c-464a-93d5-86a44a839455',
            'value': {
                'printRequestId': 'b3e96163-99e5-4d29-aa59-65c0c88d31b5',
                'printRequestType': 'PIN_LETTER_TO_DEFENDANT',
                'printRequestedAt': '2021-02-24'
            }
        }
    ],
    'interestDateType': 'SUBMISSION',
    'paymentReference': 'RC-1524-6488-1670-7520',
    'preferredDQCourt': 'Bristol Civil and Family Justice Centre',
    'feeAmountInPennies': '2500',
    'interestEndDateType': 'SETTLED_OR_JUDGMENT',
    'currentInterestAmount': '0',
    'migratedFromClaimStore': 'NO',
    'dateReferredForDirections': '2021-02-24T13:54:08.107104',
    'intentionToProceedDeadline': '2021-03-29',
    'previousServiceCaseReference': '414MC306',
    'claimSubmissionOperationIndicators': {
        'rpa': 'YES',
        'bulkPrint': 'YES',
        'sealedClaimUpload': 'YES',
        'staffNotification': 'YES',
        'claimantNotification': 'YES',
        'defendantNotification': 'YES',
        'claimIssueReceiptUpload': 'YES'
    }
};
