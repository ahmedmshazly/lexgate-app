# Public Source Refresh Register

**Document ID:** LG-LEG-SRC-001  
**Status:** Active research register; not legal advice  
**Owner:** Legal / privacy / finance reviewers  
**Last refresh:** 9 August 2026

## Source control rule

Arabic primary text and official publication control. A web page may confirm a regulator position or operating resource, but it does not replace an official gazette copy, current amendment analysis, or qualified interpretation. Every reviewed source must record retrieval date, official location, local evidence hash where permitted, effective period, relevant articles, reviewer, and derived requirement IDs.

| ID            | Topic                                                       | Public authority / current research result                                                                                                                                                  | Status                                  | Activation effect                                                            |
| ------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| EGY-PRO-001   | Legal profession and Bar rules                              | Official legal text, amendment chain, and current Bar decisions must be acquired and reviewed.                                                                                              | Blocked                                 | No public legal-service claims or professional-authority matrix activation.  |
| EGY-PDP-001   | Personal Data Protection Law and 2025 executive regulations | Official Arabic publication and regulator procedures require controlled acquisition; preserve source/applicability uncertainty.                                                             | Blocked                                 | No production personal-data, transfer, DPO, or sensitive-data activation.    |
| EGY-ITIDA-001 | Electronic signature                                        | [ITIDA electronic-signature guidance](https://itida.gov.eg/Arabic/pages/e-signature.aspx) confirms ITIDA’s regulatory role under Law 15/2004.                                               | Verified source; interpretation pending | No “legally signed” claim without document-class review/provider validation. |
| EGY-ETA-001   | Electronic invoice/receipt                                  | [ETA guidance](https://www.eta.gov.eg/ar/content/e-invoice-services) and taxpayer resources are official operating sources; Lex Gate obligation and integration route remain firm-specific. | Verified source; applicability pending  | No ETA workflow, provider, or tax treatment activation.                      |
| EGY-LAB-001   | Employment                                                  | Official current text and relevant implementation decisions require employment-law review.                                                                                                  | Pending controlled source               | No HR/payroll scope activation.                                              |
| EGY-MOJ-001   | Justice services                                            | Public digital services do not establish API permission or automation authorization.                                                                                                        | Pending terms/API evidence              | Manual processes only; no scraping or court integration.                     |
| EGY-CRM-001   | Criminal procedure transition                               | Official current/transition text and implementing decisions require controlled source review.                                                                                               | Blocked                                 | No automatic procedural rule activation.                                     |

## Review sequence

1. Acquire and hash the official Arabic primary text and amendment/effective-date evidence.
2. Extract only platform-relevant provisions, and link them to source IDs and requirement IDs.
3. Get the assigned Egyptian reviewer’s interpretation and scope limits.
4. Update `requirements.yaml`, validation gates, and the release packet.
5. Recheck before any related public, provider, or production activation.
