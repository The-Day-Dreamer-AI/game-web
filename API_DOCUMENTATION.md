# API Documentation - C9 App

## Configuration

**BaseUrl Reference in Code:** Defined in `lib/main.dart`
```dart
const String domain = 'https://a1bo-qa.azurewebsites.net'; // QA Environment
```

**Base URL:** `{domain}` (Example: `https://a1bo-qa.azurewebsites.net`)

---

## Global Headers
All API requests should include:
```
Accept: application/json
Content-Type: application/json (for POST requests)
Authorization: bearer {AccessToken} (for authenticated endpoints)
Lang: {LanguageCode} (e.g., 'en', 'zh')
```

---

## API Endpoints by Screen

### 1. About Us Screen
**File:** `lib/screens/about.dart`

#### API: Get About Us Content
- **Method:** GET
- **Endpoint:** `/api/MapiDiscover/AboutUs`
- **Full URL:** `{domain}/api/MapiDiscover/AboutUs`
- **Headers:**
  - `Accept: application/json`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Content": "string - About us page content"
}
```
- **Status Codes:**
  - 200: Success
  - 400+: Error

---

### 2. Games Screen (T1 Games)
**File:** `lib/screens/t1_games.dart`

#### API: Get Discover Games (With Token)
- **Method:** GET
- **Endpoint:** `/api/mapidiscover/Discover`
- **Full URL:** `{domain}/api/mapidiscover/Discover?Platform={Platform}`
- **Parameters:** 
  - `Platform`: Android | IOS | Web
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Data": {
    "GameCategories": [
      {
        "Id": "string",
        "Name": "string",
        "Games": [
          {
            "Id": "string",
            "Name": "string",
            "Image": "string"
          }
        ]
      }
    ]
  }
}
```

#### API: Get Discover Games (Without Token)
- **Method:** GET
- **Endpoint:** `/api/mapidiscover/DiscoverWOToken`
- **Full URL:** `{domain}/api/mapidiscover/DiscoverWOToken?Platform={Platform}`
- **Parameters:** 
  - `Platform`: Android | IOS | Web
- **Headers:**
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:** Same as above

#### API: Launch Game
- **Method:** GET
- **Endpoint:** `/api/mapidiscover/LaunchGame`
- **Full URL:** `{domain}/api/mapidiscover/LaunchGame?Id={GameId}&Platform={Platform}`
- **Parameters:**
  - `Id`: Game ID
  - `Platform`: Android | IOS | Web
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Id": "string",
  "GameName": "string",
  "LaunchType": "Webview | Browser | App",
  "Url": "string",
  "Code": 0,
  "Message": "string"
}
```

#### API: Refresh Game
- **Method:** GET
- **Endpoint:** `/api/mapidiscover/RefreshGame`
- **Full URL:** `{domain}/api/mapidiscover/RefreshGame?Id={GameId}`
- **Parameters:**
  - `Id`: Game ID
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Url": "string"
}
```

#### API: Quit Game
- **Method:** GET
- **Endpoint:** `/api/mapidiscover/QuitGame`
- **Full URL:** `{domain}/api/mapidiscover/QuitGame?Platform={Platform}`
- **Parameters:**
  - `Platform`: Android | IOS | Web
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 3. Events Screen (T2 Events)
**File:** `lib/screens/t2_events.dart`

#### API: Get Events
- **Method:** GET
- **Endpoint:** `/api/mapievent/GetEvents`
- **Full URL:** `{domain}/api/mapievent/GetEvents`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Data": [
    {
      "Id": "string",
      "Name": "string",
      "Description": "string",
      "StartDate": "datetime",
      "EndDate": "datetime",
      "PromoImage": "string"
    }
  ]
}
```

#### API: Claim Promo
- **Method:** POST
- **Endpoint:** `/api/mapievent/ClaimPromo`
- **Full URL:** `{domain}/api/mapievent/ClaimPromo`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Id": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

#### API: Mute All Carousels
- **Method:** POST
- **Endpoint:** `/api/MapiEvent/MuteAllCarousels`
- **Full URL:** `{domain}/api/MapiEvent/MuteAllCarousels`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "DeviceId": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 4. Transactions Screen (T3 Trans)
**File:** `lib/screens/trans.dart`

#### API: Get Transactions
- **Method:** GET
- **Endpoint:** `/api/mapiuser/GetTrans`
- **Full URL:** `{domain}/api/mapiuser/GetTrans?Page={Page}&DateFrom={DateFrom}&DateTo={DateTo}`
- **Parameters:**
  - `Page`: Page number (1, 2, ...)
  - `DateFrom`: Date from (optional)
  - `DateTo`: Date to (optional)
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Page": 1,
  "End": false,
  "Rows": [
    {
      "Id": "string",
      "Type": "string",
      "Amount": 0.00,
      "Balance": 0.00,
      "CreatedDate": "datetime",
      "Description": "string"
    }
  ]
}
```

---

### 5. Account Screen (T4 Account)
**File:** `lib/screens/t4_account.dart`

#### API: Get My QR Code
- **Method:** GET
- **Endpoint:** `/api/mapiuser/GetQr`
- **Full URL:** `{domain}/api/mapiuser/GetQr`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "QrCode": "string - Base64 encoded QR image"
}
```

---

### 6. Deposit Screen
**File:** `lib/screens/deposit.dart`

#### API: Get Have Bank Account
- **Method:** GET
- **Endpoint:** `/api/mapibank/GetHaveBankAccount`
- **Full URL:** `{domain}/api/mapibank/GetHaveBankAccount`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Have": true|false
}
```

---

### 7. Game Records Screen
**File:** `lib/screens/gamerecords.dart`

#### API: Get Game Records Game Selections
- **Method:** GET
- **Endpoint:** `/api/mapireport/GetGameRecordsGameSelections`
- **Full URL:** `{domain}/api/mapireport/GetGameRecordsGameSelections`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Data": [
    {
      "Id": "string",
      "Name": "string",
      "Image": "string"
    }
  ]
}
```

#### API: Get Game Records
- **Method:** GET
- **Endpoint:** `/api/mapireport/GetGameRecords`
- **Full URL:** `{domain}/api/mapireport/GetGameRecords?GameId={GameId}&DateFrom={DateFrom}&DateTo={DateTo}&Page={Page}`
- **Parameters:**
  - `GameId`: Game ID (optional)
  - `DateFrom`: Date from (optional)
  - `DateTo`: Date to (optional)
  - `Page`: Page number (1, 2, ...)
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Page": 1,
  "End": false,
  "Rows": [
    {
      "GameName": "string",
      "Amount": 0.00,
      "WinAmount": 0.00,
      "CreatedDate": "datetime"
    }
  ]
}
```

---

### 8. Contacts Screen
**File:** `lib/screens/contacts.dart`

#### API: Get Contacts
- **Method:** GET
- **Endpoint:** `/api/MapiContact2/GetContacts`
- **Full URL:** `{domain}/api/MapiContact2/GetContacts`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Data": [
    {
      "Id": "string",
      "Name": "string",
      "Phone": "string",
      "Status": "string"
    }
  ]
}
```

---

### 9. Contact Requests Screen
**File:** `lib/screens/contactrequests.dart`

#### API: Get Contact Requests
- **Method:** GET
- **Endpoint:** `/api/MapiContact2/GetContactRequests`
- **Full URL:** `{domain}/api/MapiContact2/GetContactRequests`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Data": [
    {
      "Id": "string",
      "Name": "string",
      "Phone": "string"
    }
  ]
}
```

#### API: Search Contact
- **Method:** GET
- **Endpoint:** `/api/MapiContact2/SearchContact`
- **Full URL:** `{domain}/api/MapiContact2/SearchContact?Text={SearchText}`
- **Parameters:**
  - `Text`: Search text
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Data": [
    {
      "Id": "string",
      "Name": "string",
      "Phone": "string"
    }
  ]
}
```

#### API: Send Contact Request
- **Method:** POST
- **Endpoint:** `/api/MapiContact2/SendContactRequest`
- **Full URL:** `{domain}/api/MapiContact2/SendContactRequest`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Id": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

#### API: Approve Contact
- **Method:** POST
- **Endpoint:** `/api/MapiContact2/ApproveContact`
- **Full URL:** `{domain}/api/MapiContact2/ApproveContact`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Id": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

#### API: Cancel Contact
- **Method:** POST
- **Endpoint:** `/api/MapiContact2/CancelContact`
- **Full URL:** `{domain}/api/MapiContact2/CancelContact`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Id": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 10. Add Bank Account Screen
**File:** `lib/screens/addbankaccount.dart`

#### API: Get TAC for Add Bank Account
- **Method:** GET
- **Endpoint:** `/api/mapibank/AddBankAccount_GetTac`
- **Full URL:** `{domain}/api/mapibank/AddBankAccount_GetTac`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "ExpiresIn": 300,
  "Message": "TAC sent to your registered phone"
}
```

#### API: Add Bank Account
- **Method:** POST
- **Endpoint:** `/api/mapibank/AddBankAccount`
- **Full URL:** `{domain}/api/mapibank/AddBankAccount`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "BankName": "string",
  "AccountNumber": "string",
  "Tac": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 11. Change Phone Screen
**File:** `lib/screens/changephone.dart`

#### API: Get TAC for Change Phone
- **Method:** POST
- **Endpoint:** `/api/mapiuser/ChangePhone_GetTac`
- **Full URL:** `{domain}/api/mapiuser/ChangePhone_GetTac`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Phone": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "ExpiresIn": 300
}
```

#### API: Change Phone
- **Method:** POST
- **Endpoint:** `/api/mapiuser/ChangePhone`
- **Full URL:** `{domain}/api/mapiuser/ChangePhone`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "OldPhone": "string",
  "OldTac": "string",
  "NewPhone": "string",
  "NewTac": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 12. Register Screen
**File:** `lib/screens/register.dart`

#### API: Get Register Send To Options
- **Method:** GET
- **Endpoint:** `/api/mapiuser/Register_GetSendToOptions`
- **Full URL:** `{domain}/api/mapiuser/Register_GetSendToOptions`
- **Headers:**
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Data": ["email", "phone", "both"]
}
```

#### API: Get Upline
- **Method:** POST
- **Endpoint:** `/api/mapiuser/Register_GetUpline`
- **Full URL:** `{domain}/api/mapiuser/Register_GetUpline`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Id": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "ReferralCode": "string"
}
```

#### API: Register User
- **Method:** POST
- **Endpoint:** `/api/mapiuser/Register`
- **Full URL:** `{domain}/api/mapiuser/Register`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Username": "string",
  "Password": "string",
  "Email": "string",
  "Phone": "string",
  "FullName": "string",
  "Upline": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 13. Login Screen
**File:** `lib/screens/login.dart`

#### API: Get Access Token (Login)
- **Method:** POST
- **Endpoint:** `/token`
- **Full URL:** `{domain}/token`
- **Headers:**
  - `Content-Type: application/x-www-form-urlencoded`
  - `Lang: {LanguageCode}`
- **Request Body (Form Data):**
```
username: {PhoneNumber}
password: {Password}
grant_type: password
fcm_token: {FCMToken}
fcm_platform: {Platform} (Android | IOS | Web)
fcm_deviceid: {DeviceId}
```
- **Response Format (Success - 200):**
```json
{
  "access_token": "string - JWT token",
  "token_type": "Bearer",
  "expires_in": 3600
}
```
- **Response Format (Error):**
```json
{
  "error": "invalid_grant | reset_required",
  "error_description": "string - Error message"
}
```
- **Status Codes:**
  - 200: Success - Token returned
  - 400: Bad request or invalid credentials
  - 401: Invalid username/password
  - Other 4xx/5xx: Server error

#### API: Get Announcement (On Login)
- **Method:** GET
- **Endpoint:** `/api/mapisystem/GetAnnouncement`
- **Full URL:** `{domain}/api/mapisystem/GetAnnouncement?Platform={Platform}`
- **Parameters:**
  - `Platform`: Android | IOS | Web
- **Headers:**
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "HasAnnouncement": true|false,
  "Title": "string",
  "Content": "string",
  "ImageEn": "string - Image URL",
  "ImageCn": "string - Image URL"
}
```

---

### 14. Withdraw Screen
**File:** `lib/screens/withdraw.dart`

#### API: Get Withdraw Accounts
- **Method:** GET
- **Endpoint:** `/api/mapibank/GetWithdrawAccs`
- **Full URL:** `{domain}/api/mapibank/GetWithdrawAccs`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Rows": [
    {
      "Id": "string",
      "BankName": "string",
      "AccountNumber": "string"
    }
  ]
}
```

#### API: Submit Withdraw
- **Method:** POST
- **Endpoint:** `/api/mapibank/SubmitWithdraw`
- **Full URL:** `{domain}/api/mapibank/SubmitWithdraw`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "BankAccountId": "string",
  "Amount": 0.00,
  "Pin": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 15. Transfer Screen
**File:** `lib/screens/transfer.dart`

#### API: Get Transfer Info
- **Method:** GET
- **Endpoint:** `/api/MapiContact2/GetTransfer`
- **Full URL:** `{domain}/api/MapiContact2/GetTransfer?Id={ContactId}`
- **Parameters:**
  - `Id`: Contact ID
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Name": "string",
  "Phone": "string",
  "MaximumTransfer": 0.00
}
```

#### API: Post Transfer
- **Method:** POST
- **Endpoint:** `/api/MapiContact2/PostTransfer`
- **Full URL:** `{domain}/api/MapiContact2/PostTransfer`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Id": "string",
  "Amount": "string",
  "Pin": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 16. Rewards Screen
**File:** `lib/screens/rewards.dart`

#### API: Get Rewards
- **Method:** GET
- **Endpoint:** `/api/mapireward/GetRewards`
- **Full URL:** `{domain}/api/mapireward/GetRewards`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Data": [
    {
      "Id": "string",
      "Name": "string",
      "Description": "string",
      "Image": "string"
    }
  ]
}
```

#### API: Claim Reward
- **Method:** POST
- **Endpoint:** `/api/mapireward/ClaimReward`
- **Full URL:** `{domain}/api/mapireward/ClaimReward`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Id": "string",
  "ReceiverName": "string",
  "ReceiverPhone": "string",
  "ReceiverAddress": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 17. Redeem Code Screen
**File:** `lib/screens/redeem_code.dart`

#### API: Redeem Code Submit
- **Method:** POST
- **Endpoint:** `/api/mapibank/RedeemCodeSubmit`
- **Full URL:** `{domain}/api/mapibank/RedeemCodeSubmit`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Content-Type: application/json; charset=UTF-8`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "RedeemCode": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Successfully claimed."
}
```

---

### 18. Turnover Report Screen
**File:** `lib/screens/turnoverreport.dart`

#### API: Get Game Selections
- **Method:** GET
- **Endpoint:** `/api/mapireport/GetGameSelections`
- **Full URL:** `{domain}/api/mapireport/GetGameSelections`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "Rows": [
    {
      "Text": "string",
      "Game": "string"
    }
  ]
}
```

#### API: Get Turnover Report
- **Method:** GET
- **Endpoint:** `/api/mapireport/GetTurnover`
- **Full URL:** `{domain}/api/mapireport/GetTurnover?StartDt={StartDt}&EndDt={EndDt}&Game={Game}&PageNumber={PageNumber}`
- **Parameters:**
  - `StartDt`: Start date (format: yyyy-MM-dd HH:mm:ss)
  - `EndDt`: End date (format: yyyy-MM-dd HH:mm:ss)
  - `Game`: Game name (optional)
  - `PageNumber`: Page number for pagination
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success",
  "PageNumber": 1,
  "TotalAmount": 0.00,
  "Rows": [
    {
      "GameName": "string",
      "Amount": 0.00,
      "WinAmount": 0.00,
      "CreatedDate": "datetime"
    }
  ]
}
```

---

### 19. Carousel (Promotions) Screen
**File:** `lib/screens/tabs.dart`

#### API: Get Carousels
- **Method:** GET
- **Endpoint:** `/api/MapiEvent/GetCarousels`
- **Full URL:** `{domain}/api/MapiEvent/GetCarousels`
- **Headers:**
  - `Authorization: bearer {AccessToken}`
  - `Lang: {LanguageCode}`
- **Request Body:** None
- **Response Format:**
```json
{
  "Items": [
    {
      "Id": "string",
      "Title": "string",
      "ImageUrl": "string",
      "Description": "string"
    }
  ]
}
```

---

### 20. Update Password For Existing User Screen
**File:** `lib/screens/updatepwforexuser.dart`

#### API: Update Password For Existing User
- **Method:** POST
- **Endpoint:** `/api/mapiuser/UpdatePasswordForExistingUser`
- **Full URL:** `{domain}/api/mapiuser/UpdatePasswordForExistingUser`
- **Headers:**
  - `Content-Type: application/json; charset=UTF-8`
  - `Lang: {LanguageCode}`
- **Request Body:**
```json
{
  "Id": "string",
  "NewPassword": "string"
}
```
- **Response Format:**
```json
{
  "Code": 0,
  "Message": "Success"
}
```

---

### 21. Screens with NO APIs

### 21. Screens with NO APIs

- **Language Screen** (`language.dart`) - No APIs
- **Edit Alias Screen** (`editalias.dart`) - No APIs
- **Change Avatar Screen** (`changeavatar.dart`) - No APIs
- **Change Name Screen** (`changename.dart`) - No APIs
- **Change Full Name Screen** (`changefullname.dart`) - No APIs
- **Change Password Screen** (`changepassword.dart`) - No APIs
- **Bank Accounts Screen** (`bankaccounts.dart`) - No APIs
- **My Rewards Screen** (`myrewards.dart`) - No APIs
- **My QR Screen** (`myqr.dart`) - No APIs (displays QR code fetched from API)
- **Inbox Screen** (`inbox.dart`) - No APIs
- **Contact Screen** (`contact.dart`) - No APIs
- **Webview Screens** (`webviewforgame.dart`, `webviewformega.dart`, `webviewforpg.dart`, `wv_dailycheckin.dart`, `webviewforlivechat.dart`, `wv_wheeloffortune.dart`) - No direct APIs (uses webview URL)
- **Checkin Screen** (`checkin.dart`) - No APIs
- **Rebates Screen** (`rebates.dart`) - No APIs
- **Forgot Password Screen** (`forgotpassword.dart`) - No APIs
- **Game Detail Screen** (`gamedetail.dart`) - No APIs
- **Deposit Button Screen** (`deposit_bt.dart`) - No APIs
- **Deposit PG Screen** (`deposit_pg.dart`) - No APIs
- **Promotions Screen** (`promotnc.dart`) - No APIs
- **Tabs Screen** (`tabs.dart`) - API handling via other screens and carousel
- **TNC Screen** (`tnc.dart`) - No APIs
- **QR Scan Screens** (`qrscan.dart`, `qrscan2.dart`, `qrscan3.dart`) - No APIs
- **Splash Screen** (`splash.dart`) - No APIs
- **Transaction Detail Screens** (`tran_deposit_detail.dart`, `tran_game_detail.dart`, `tran_payout_detail.dart`, `tran_transfer_detail.dart`, `tran_withdraw_detail.dart`) - No APIs
- **Profile Screen** (`profile.dart`) - No APIs
- **Reports Screen** (`reports.dart`) - Navigation only
- **Settings Screen** (`settings.dart`) - No APIs
- **Reset PIN Screen** (`resetpin.dart`) - No APIs
- **Wallet Screen** (`wallet.dart`) - No APIs (placeholder)
- **Webview PG Screen** (`webviewforpg.dart`) - No direct APIs (uses webview URL)

---

## Summary of All API Endpoints

### Total Endpoints: 33

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| POST /token | POST | login.dart | User authentication |
| GET /api/mapisystem/GetAnnouncement | GET | login.dart | Get announcements |
| GET /api/MapiDiscover/AboutUs | GET | about.dart | Get about content |
| GET /api/mapidiscover/Discover | GET | t1_games.dart | Get games with token |
| GET /api/mapidiscover/DiscoverWOToken | GET | t1_games.dart | Get games without token |
| GET /api/mapidiscover/LaunchGame | GET | t1_games.dart | Launch a game |
| GET /api/mapidiscover/RefreshGame | GET | t1_games.dart & webviewforgame.dart | Refresh game URL |
| GET /api/mapidiscover/QuitGame | GET | t1_games.dart & webviewforgame.dart | Quit game |
| GET /api/mapievent/GetEvents | GET | t2_events.dart | Get events |
| POST /api/mapievent/ClaimPromo | POST | t2_events.dart | Claim promo |
| POST /api/MapiEvent/MuteAllCarousels | POST | t2_events.dart & tabs.dart | Mute carousels |
| GET /api/MapiEvent/GetCarousels | GET | tabs.dart | Get carousel promotions |
| GET /api/mapiuser/GetTrans | GET | trans.dart | Get transactions |
| GET /api/mapiuser/GetQr | GET | t4_account.dart | Get QR code |
| GET /api/mapibank/GetHaveBankAccount | GET | deposit.dart | Check bank account |
| GET /api/mapireport/GetGameRecordsGameSelections | GET | gamerecords.dart | Get game selections |
| GET /api/mapireport/GetGameRecords | GET | gamerecords.dart | Get game records |
| GET /api/MapiContact2/GetContacts | GET | contacts.dart | Get contacts |
| GET /api/MapiContact2/GetContactRequests | GET | contactrequests.dart | Get contact requests |
| GET /api/MapiContact2/SearchContact | GET | contactrequests.dart | Search contacts |
| POST /api/MapiContact2/SendContactRequest | POST | contactrequests.dart | Send contact request |
| POST /api/MapiContact2/ApproveContact | POST | contactrequests.dart | Approve contact |
| POST /api/MapiContact2/CancelContact | POST | contactrequests.dart | Cancel contact |
| GET /api/mapibank/AddBankAccount_GetTac | GET | addbankaccount.dart | Get TAC for bank account |
| POST /api/mapibank/AddBankAccount | POST | addbankaccount.dart | Add bank account |
| POST /api/mapiuser/ChangePhone_GetTac | POST | changephone.dart | Get TAC for phone change |
| POST /api/mapiuser/ChangePhone | POST | changephone.dart | Change phone |
| GET /api/mapiuser/Register_GetSendToOptions | GET | register.dart | Get send-to options |
| POST /api/mapiuser/Register_GetUpline | POST | register.dart | Get upline info |
| POST /api/mapiuser/Register | POST | register.dart | Register user |
| GET /api/mapibank/GetWithdrawAccs | GET | withdraw.dart | Get withdraw accounts |
| POST /api/mapibank/SubmitWithdraw | POST | withdraw.dart | Submit withdraw |
| GET /api/MapiContact2/GetTransfer | GET | transfer.dart | Get transfer info |
| POST /api/MapiContact2/PostTransfer | POST | transfer.dart | Post transfer |
| GET /api/mapireward/GetRewards | GET | rewards.dart | Get rewards |
| POST /api/mapireward/ClaimReward | POST | rewards.dart | Claim reward |
| POST /api/mapibank/RedeemCodeSubmit | POST | redeem_code.dart | Submit redeem code |
| GET /api/mapireport/GetGameSelections | GET | turnoverreport.dart | Get game selections |
| GET /api/mapireport/GetTurnover | GET | turnoverreport.dart | Get turnover report |
| POST /api/mapiuser/UpdatePasswordForExistingUser | POST | updatepwforexuser.dart | Update password |

---

## Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Request successful |
| 400 | Bad request |
| 401 | Unauthorized (token expired or invalid) |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Internal server error |

---

## Authentication Flow

1. User logs in with credentials
2. Server returns `AccessToken`
3. Store token securely in `FlutterSecureStorage`
4. Include `Authorization: bearer {AccessToken}` in all authenticated requests
5. If token expires (401), clear token and redirect to login

---

## Error Handling

All error responses follow this format:
```json
{
  "Code": 1,
  "Message": "Error description"
}
```

---

**Last Updated:** January 7, 2026
**Version:** 1.1
**Status:** ✅ COMPLETE - All APIs from all screen files have been documented
