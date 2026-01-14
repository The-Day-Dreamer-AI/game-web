# API Analysis Report

This document provides a comprehensive analysis of the current frontend implementation compared to the API documentation.

---

## Quick Summary

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ APIs Implemented | 19 | 58% |
| ❌ APIs Not Implemented | 14 | 42% |
| **Total APIs in Documentation** | **33** | 100% |

---

## API Status Matrix

### ✅ IMPLEMENTED APIs (19 total)

These APIs have been integrated into the frontend codebase and are actively used.

| # | API Endpoint | Method | Service File | Used In |
|---|-------------|--------|--------------|---------|
| 1 | `/token` | POST | `auth.ts` | Login authentication |
| 2 | `/api/mapiuser/Register` | POST | `auth.ts` | User registration |
| 3 | `/api/mapiuser/Register_GetUpline` | POST | `auth.ts` | Get referral upline info |
| 4 | `/api/mapidiscover/Discover` | GET | `discover.ts` | Home page (authenticated) |
| 5 | `/api/mapidiscover/DiscoverWOToken` | GET | `discover.ts` | Home page (guest) |
| 6 | `/api/mapidiscover/LaunchGame` | GET | `discover.ts` | Game launch |
| 7 | `/api/mapidiscover/RefreshGame` | GET | `discover.ts` | Refresh game URL |
| 8 | `/api/mapidiscover/QuitGame` | GET | `discover.ts` | Exit game session |
| 9 | `/api/mapievent/GetEvents` | GET | `events.ts` | Events page |
| 10 | `/api/mapievent/ClaimPromo` | POST | `events.ts` | Claim promotion |
| 11 | `/api/MapiEvent/MuteAllCarousels` | POST | `events.ts` | Mute carousel notifications |
| 12 | `/api/mapiuser/GetTrans` | GET | `transactions.ts` | Transaction history |
| 13 | `/api/mapiuser/GetQr` | GET | `user.ts` | Referral QR code |
| 14 | `/api/mapibank/GetHaveBankAccount` | GET | `user.ts` | Bank account check |
| 15 | `/api/MapiDiscover/AboutUs` | GET | `user.ts` | About us page |
| 16 | `/api/mapibank/GetWithdrawAccs` | GET | `withdrawal.ts` | Withdrawal page |
| 17 | `/api/mapibank/SubmitWithdraw` | POST | `withdrawal.ts` | Submit withdrawal |
| 18 | `/api/mapibank/AddBankAccount_GetTac` | GET | `bank.ts` | Add bank - Get TAC |
| 19 | `/api/mapibank/AddBankAccount` | POST | `bank.ts` | Add bank account |

---

### ❌ NOT IMPLEMENTED APIs (14 total)

These APIs are documented but have NOT been integrated into the frontend yet.

| # | API Endpoint | Method | Purpose | Priority |
|---|-------------|--------|---------|----------|
| 1 | `/api/mapisystem/GetAnnouncement` | GET | Show login announcements | Medium |
| 2 | `/api/MapiEvent/GetCarousels` | GET | Homepage carousel/banners | High |
| 3 | `/api/mapireport/GetGameRecordsGameSelections` | GET | Game records filter options | Low |
| 4 | `/api/mapireport/GetGameRecords` | GET | Game betting records | Low |
| 5 | `/api/MapiContact2/GetContacts` | GET | Contact list | Low |
| 6 | `/api/MapiContact2/GetContactRequests` | GET | Pending contact requests | Low |
| 7 | `/api/MapiContact2/SearchContact` | GET | Search for contacts | Low |
| 8 | `/api/MapiContact2/SendContactRequest` | POST | Send friend request | Low |
| 9 | `/api/MapiContact2/ApproveContact` | POST | Approve friend request | Low |
| 10 | `/api/MapiContact2/CancelContact` | POST | Remove/cancel contact | Low |
| 11 | `/api/mapiuser/ChangePhone_GetTac` | POST | Change phone - Get TAC | Medium |
| 12 | `/api/mapiuser/ChangePhone` | POST | Change phone number | Medium |
| 13 | `/api/mapiuser/Register_GetSendToOptions` | GET | OTP delivery options | Low |
| 14 | `/api/MapiContact2/GetTransfer` | GET | P2P transfer info | Low |
| 15 | `/api/MapiContact2/PostTransfer` | POST | Execute P2P transfer | Low |
| 16 | `/api/mapireward/GetRewards` | GET | Available rewards | Medium |
| 17 | `/api/mapireward/ClaimReward` | POST | Claim a reward | Medium |
| 18 | `/api/mapibank/RedeemCodeSubmit` | POST | Redeem promo code | Medium |
| 19 | `/api/mapireport/GetGameSelections` | GET | Turnover report filters | Low |
| 20 | `/api/mapireport/GetTurnover` | GET | Turnover report data | Low |
| 21 | `/api/mapiuser/UpdatePasswordForExistingUser` | POST | Change password | High |

---

## Recently Added APIs (January 7, 2026)

The following APIs were integrated in the most recent update:

| API | What Was Done |
|-----|---------------|
| `POST /token` | Replaced mock `/api/auth/login` with real OAuth token endpoint |
| `POST /api/mapiuser/Register` | Replaced mock `/api/auth/register` with real registration |
| `POST /api/mapiuser/Register_GetUpline` | Added referral code validation |
| `GET /api/mapibank/GetWithdrawAccs` | Full withdrawal page integration |
| `POST /api/mapibank/SubmitWithdraw` | Withdrawal submission flow |
| `GET /api/mapibank/AddBankAccount_GetTac` | TAC request for adding bank |
| `POST /api/mapibank/AddBankAccount` | Complete add bank account flow |

---

## APIs Missing from Documentation

These APIs are NEEDED by the frontend but are NOT documented in `API_DOCUMENTATION.md`:

| Feature | Expected Endpoint | Current Status |
|---------|-------------------|----------------|
| **Get User Profile** | `GET /api/mapiuser/GetProfile` | Using mock data |
| **Submit Deposit** | `POST /api/mapibank/Deposit` | Using mock data |
| **Get Payment Methods** | `GET /api/mapibank/GetPaymentMethods` | Using mock data |
| **Get Company Bank Accounts** | `GET /api/mapibank/GetCompanyBanks` | Using mock data |
| **Get Available Promotions** | `GET /api/mapievent/GetPromotions` | Using mock data |
| **Get Inbox Messages** | `GET /api/mapiuser/GetInbox` | Using mock data |
| **Mark Message Read** | `POST /api/mapiuser/MarkRead` | Not implemented |
| **Delete Message** | `DELETE /api/mapiuser/DeleteMessage` | Not implemented |
| **Change Username** | `POST /api/mapiuser/ChangeUsername` | Mock page only |
| **Change Avatar** | `POST /api/mapiuser/ChangeAvatar` | Mock page only |
| **Get Turnover Status** | `GET /api/mapibank/GetTurnover` | Shows 0.00/0.00 |
| **Get Account Overview** | `GET /api/mapiuser/GetOverview` | Using mock data |

---

## Implementation Progress by Feature

### Authentication & User Management
| Feature | Status | API Used |
|---------|--------|----------|
| Login | ✅ Done | `/token` |
| Register | ✅ Done | `/api/mapiuser/Register` |
| Referral Code Validation | ✅ Done | `/api/mapiuser/Register_GetUpline` |
| User Profile | ❌ Mock | Not documented |
| Change Password | ❌ Not implemented | `UpdatePasswordForExistingUser` available |
| Change Phone | ❌ Not implemented | `ChangePhone` + TAC available |

### Banking & Transactions
| Feature | Status | API Used |
|---------|--------|----------|
| View Bank Accounts | ✅ Done | `/api/mapibank/GetHaveBankAccount` |
| Add Bank Account | ✅ Done | `/api/mapibank/AddBankAccount` + TAC |
| Withdrawal | ✅ Done | `/api/mapibank/GetWithdrawAccs` + `SubmitWithdraw` |
| Deposit | ❌ Mock | Not documented |
| Transaction History | ✅ Done | `/api/mapiuser/GetTrans` |

### Games & Content
| Feature | Status | API Used |
|---------|--------|----------|
| Game List | ✅ Done | `/api/mapidiscover/Discover` |
| Launch Game | ✅ Done | `/api/mapidiscover/LaunchGame` |
| Events/Promotions | ✅ Done | `/api/mapievent/GetEvents` |
| Claim Promo | ✅ Done | `/api/mapievent/ClaimPromo` |
| About Us | ✅ Done | `/api/MapiDiscover/AboutUs` |
| Carousels | ❌ Not implemented | `GetCarousels` available |

### Social Features
| Feature | Status | API Used |
|---------|--------|----------|
| QR Code | ✅ Done | `/api/mapiuser/GetQr` |
| Contacts | ❌ Not implemented | Multiple APIs available |
| P2P Transfer | ❌ Not implemented | `GetTransfer` + `PostTransfer` available |
| Rewards | ❌ Not implemented | `GetRewards` + `ClaimReward` available |

---

## Files Modified Summary

### New Files Created (January 7, 2026)
```
src/lib/api/services/withdrawal.ts    - Withdrawal API service
src/lib/api/services/bank.ts          - Bank account API service
src/hooks/use-withdrawal.ts           - React Query hooks for withdrawal
src/hooks/use-bank.ts                 - React Query hooks for bank
src/app/account/bank/add/page.tsx     - Add bank account page
```

### Files Modified (January 7, 2026)
```
src/lib/api/client.ts                 - Added postForm() method
src/lib/api/services/auth.ts          - Real login/register APIs
src/lib/api/services/index.ts         - Export new services
src/lib/api/types.ts                  - New type definitions
src/providers/auth-provider.tsx       - Use real APIs
src/app/withdrawal/page.tsx           - Full API integration
src/app/account/bank/page.tsx         - Link to add bank page
src/lib/i18n/translations/*.json      - Bank-related translations
```

### Mock Routes Replaced
| Old Mock Route | Replaced With |
|----------------|---------------|
| `/api/auth/login` | `POST /token` (real API) |
| `/api/auth/register` | `POST /api/mapiuser/Register` (real API) |

---

## Next Steps / Recommendations

### High Priority
1. **Integrate `GetCarousels`** - For homepage promotional banners
2. **Implement Change Password** - `UpdatePasswordForExistingUser` API is available
3. **Backend: Document Deposit APIs** - Critical for money flow

### Medium Priority
4. **Implement Rewards page** - APIs are documented and ready
5. **Add Change Phone feature** - APIs are documented
6. **Implement Redeem Code** - API is documented

### Low Priority
7. **Game Records page** - For viewing bet history
8. **Contacts/Transfer** - P2P social features
9. **Turnover Report** - For detailed reporting

---

*Last Updated: January 7, 2026*
*Total APIs in Documentation: 33*
*APIs Implemented: 19 (58%)*
*APIs Remaining: 14 (42%)*
