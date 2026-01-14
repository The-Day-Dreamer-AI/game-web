C9 APP - API DOCUMENTATION
========================================

DOCUMENT OVERVIEW
The API Documentation has been created in TWO formats:

1. **API_DOCUMENTATION.md** (Markdown Format)
   - Location: d:\work\Migration\c9-app\API_DOCUMENTATION.md
   - Can be opened in VS Code or any text editor
   - Can be easily converted to Word using online converters or Markdown editors

2. **C9_App_API_Documentation.docx** (Word Format - Ready to Use)
   - Location: d:\work\Migration\c9-app\C9_App_API_Documentation.docx
   - Ready to share with other frontend developers
   - Full formatting with tables and code blocks
   - Professional document layout

========================================
CONTENT SUMMARY
========================================

TOTAL SCREENS DOCUMENTED: 32 Screens

SCREENS WITH APIS (13):
1. About Us Screen
2. Games Screen (T1 Games)
3. Events Screen (T2 Events)
4. Transactions Screen (T3 Trans)
5. Account Screen (T4 Account)
6. Deposit Screen
7. Game Records Screen
8. Contacts Screen
9. Contact Requests Screen
10. Add Bank Account Screen
11. Change Phone Screen
12. Register Screen
13. Tabs Screen (for Carousel APIs)

SCREENS WITHOUT APIS (19):
- Language Screen
- Edit Alias Screen
- Change Avatar Screen
- Change Name Screen
- Change Full Name Screen
- Bank Accounts Screen
- My Rewards Screen
- Inbox Screen
- Contact Screen
- Webview Screens (4)
- Checkin Screen
- Rebates Screen
- Forgot Password Screen
- Game Detail Screen
- Deposit Button Screen
- Deposit PG Screen
- Login Screen
- Promotions Screen

========================================
DOCUMENT STRUCTURE
========================================

Each API Endpoint includes:
✓ Method (GET, POST, etc.)
✓ Endpoint path
✓ Full URL with base URL
✓ Required headers
✓ Request parameters (if any)
✓ Request body format
✓ Response format (JSON)
✓ HTTP status codes

Document Sections:
1. Overview & Base URL
2. Global Headers used across all APIs
3. Authentication Flow (5 steps)
4. API Endpoints organized by screen
5. Error Handling format
6. Common Response Codes table
7. List of screens with no APIs

========================================
HOW TO USE THIS DOCUMENT
========================================

For Frontend Developers:
1. Open the Word document: C9_App_API_Documentation.docx
2. Find your screen in the "API Endpoints by Screen" section
3. Reference the API details for implementation
4. Use the global headers for all requests
5. Follow the authentication flow for secured endpoints
6. Check common response codes for error handling

For Backend Developers:
1. Use as specification for API endpoints
2. Ensure responses match the documented format
3. Return proper HTTP status codes
4. Include Code and Message fields in all responses

For Project Managers:
1. Use for API requirement tracking
2. Reference when discussing features with team
3. Ensure all documented APIs are implemented

========================================
KEY INFORMATION FOR DEVELOPERS
========================================

BASE URL:
{BaseUrl} (e.g., https://api.example.com)

AUTHENTICATION:
- Most endpoints require Bearer token
- Store token in FlutterSecureStorage
- Include header: Authorization: bearer {AccessToken}
- If 401 response, token has expired - redirect to login

LANGUAGE SUPPORT:
- Include Lang header with language code
- Supported values: 'en' (English), 'zh' (Chinese)
- Example: Lang: en

ERROR HANDLING:
All error responses follow this format:
{
  "Code": 1,
  "Message": "Error description"
}

HTTP Status Codes:
- 200: Success
- 400: Bad request
- 401: Unauthorized (token expired)
- 403: Forbidden
- 404: Not found
- 500: Server error

========================================
TOTAL APIS DOCUMENTED: 40+ Endpoints

Generated: January 5, 2026
Version: 1.0
========================================
