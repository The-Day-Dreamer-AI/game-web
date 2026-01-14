// ===========================================
// Common Types
// ===========================================

export interface ApiResponse<T = unknown> {
  Code: number;
  Message: string;
  Data?: T;
}

export interface PaginatedResponse<T> {
  Code: number;
  Message: string;
  Page: number;
  End: boolean;
  Rows: T[];
}

// ===========================================
// Discover / Games Types
// ===========================================

export interface Banner {
  Id: string;
  Image: string;
  ImageCn: string | null;
  ImageMy: string | null;
}

export interface RunningMessage {
  Id: string;
  Message: string;
  MessageCn: string | null;
  MessageMy: string | null;
}

export interface GameCategory {
  Id: string;
  Name: string;
  DayImage: string | null;
  DayImageSelected: string | null;
  DarkImage: string | null;
  DarkImageSelected: string | null;
  CnDayImage: string | null;
  CnDayImageSelected: string | null;
  MyDayImage: string | null;
  MyDayImageSelected: string | null;
}

export interface Game {
  Id: string;
  GameCategoryId: string | null;
  GameCategory: string | null;
  Name: string;
  Image: string | null;
  IsHot: boolean;
  HasChip: boolean;
  Status: string; // "A" = Active, "M" = Maintenance
}

export interface DiscoverResponse {
  Code: number;
  Message: string;
  Banners: Banner[];
  RunningMessages: RunningMessage[];
  GameCategories: GameCategory[];
  Games: Game[];
  // User info (when authenticated)
  Id?: string;
  Username?: string;
  Name?: string;
  Avatar?: string;
  Currency?: string;
  Cash?: number;
  Chip?: number;
  Point?: number;
}

export interface LaunchGameResponse {
  Id: string;
  GameName: string;
  LaunchType: "Webview" | "Browser" | "App";
  Url: string;
  Code: number;
  Message: string;
}

export interface RefreshGameResponse {
  Code: number;
  Message: string;
  Url: string;
}

export interface QuitGameResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Events Types
// ===========================================

export interface Promo {
  Id: string;
  Name: string;
  NameCn: string | null;
  NameMy: string | null;
  Tnc: string;
  TncCn: string | null;
  TncMy: string | null;
  Image: string;
  ImageCn: string | null;
  ImageMy: string | null;
  Mode: string;
  Type: string;
  Rate: number;
  Amount: number;
  Freq: string;
}

export interface EventsResponse {
  Code: number;
  Message: string;
  DailyCheckInUrl: string | null;
  FortuneWheelUrl: string | null;
  Promos: Promo[];
}

export interface ClaimPromoRequest {
  Id: string;
}

export interface ClaimPromoResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Transaction Types
// ===========================================

export interface Transaction {
  Id: string;
  Type: string;
  Amount: number;
  Balance: number;
  CreatedDate: string;
  Description: string;
}

export interface TransactionsResponse extends PaginatedResponse<Transaction> {}

// ===========================================
// User / Account Types
// ===========================================

export interface QrCodeResponse {
  Code: number;
  Message: string;
  Id: string;
  Username: string;
  Name: string;
  Avatar: string;
  QrImageUrl: string;
  Link: string;
  ReferralCode: string;
}

export interface HaveBankAccountResponse {
  Code: number;
  Message: string;
  Have: boolean;
  Accounts?: BankAccount[];
}

export interface BankAccount {
  Id: string;
  BankName: string;
  AccountName: string;
  AccountNo: string;
  IsPrimary: boolean;
}

// ===========================================
// About Us Types
// ===========================================

export interface AboutUsResponse {
  Content: string;
}

// ===========================================
// Game Records Types
// ===========================================

export interface GameSelection {
  Id: string;
  Name: string;
  Image: string;
}

export interface GameSelectionsResponse {
  Code: number;
  Message: string;
  Data: GameSelection[];
}

export interface GameRecord {
  GameName: string;
  Amount: number;
  WinAmount: number;
  CreatedDate: string;
}

export interface GameRecordsResponse extends PaginatedResponse<GameRecord> {}

// ===========================================
// Register Types
// ===========================================

export interface GetUplineRequest {
  Id: string;
}

export interface GetUplineResponse {
  Code: number;
  Message: string;
  ReferralCode: string;
}

export interface RegisterGetTacRequest {
  Phone: string;
  Option: "SMS" | "WhatsApp";
}

export interface RegisterGetTacResponse {
  Code: number;
  Message: string;
  Phone: string;
  Tac: string;
  ExpiresIn: number;
}

export interface RegisterRequest {
  Name: string;
  Password: string;
  Phone: string;
  Tac: string;
  UplineReferralCode: string;
  Username: string;
}

export interface RegisterResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Forgot Password Types
// ===========================================

export interface ForgotPasswordGetTacRequest {
  Username: string;
  Phone: string;
  Option: "SMS" | "WhatsApp";
}

export interface ForgotPasswordGetTacResponse {
  Code: number;
  Message: string;
  Phone: string;
  Tac: string;
  ExpiresIn: number;
}

export interface ForgotPasswordRequest {
  Username: string;
  Phone: string;
  Tac: string;
  Password: string;
}

export interface ForgotPasswordResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Login Types
// ===========================================

export interface LoginRequest {
  username: string;
  password: string;
  fcm_token?: string;
  fcm_platform?: "Android" | "IOS" | "Web";
  fcm_deviceid?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginErrorResponse {
  error: "invalid_grant" | "reset_required" | string;
  error_description: string;
}

// ===========================================
// Withdrawal Types
// ===========================================

export interface WithdrawAccount {
  Id: string;
  BankName: string;
  AccountNumber: string;
}

export interface WithdrawAccountsResponse {
  Code: number;
  Message: string;
  Rows: WithdrawAccount[];
}

export interface SubmitWithdrawRequest {
  BankAccountId: string;
  Amount: number;
  Pin: string;
}

export interface SubmitWithdrawResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Bank Account Types
// ===========================================

export interface GetTacResponse {
  Code: number;
  Message: string;
  ExpiresIn: number;
}

export interface AddBankAccountRequest {
  BankName: string;
  AccountNumber: string;
  Tac: string;
}

export interface AddBankAccountResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Carousel/Announcement Types
// ===========================================

export interface CarouselItem {
  Id: string;
  Title: string;
  ImageUrl: string;
  Description: string;
}

export interface CarouselsResponse {
  Items: CarouselItem[];
}

export interface AnnouncementResponse {
  HasAnnouncement: boolean;
  Title: string;
  Content: string;
  ImageEn: string;
  ImageCn: string;
}

// ===========================================
// Contact Types
// ===========================================

export interface Contact {
  Id: string;
  Name: string;
  Phone: string;
  Status: string;
}

export interface ContactsResponse {
  Code: number;
  Message: string;
  Data: Contact[];
}

export interface ContactRequest {
  Id: string;
  Name: string;
  Phone: string;
}

export interface ContactRequestsResponse {
  Code: number;
  Message: string;
  Data: ContactRequest[];
}

export interface SearchContactResponse {
  Code: number;
  Message: string;
  Data: ContactRequest[];
}

// ===========================================
// Transfer Types
// ===========================================

export interface TransferInfoResponse {
  Code: number;
  Message: string;
  Name: string;
  Phone: string;
  MaximumTransfer: number;
}

export interface PostTransferRequest {
  Id: string;
  Amount: string;
  Pin: string;
}

export interface PostTransferResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Rewards Types
// ===========================================

export interface Reward {
  Id: string;
  Name: string;
  Description: string;
  Image: string;
}

export interface RewardsResponse {
  Code: number;
  Message: string;
  Data: Reward[];
}

export interface ClaimRewardRequest {
  Id: string;
  ReceiverName: string;
  ReceiverPhone: string;
  ReceiverAddress: string;
}

export interface ClaimRewardResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Turnover Report Types
// ===========================================

export interface TurnoverGameSelection {
  Text: string;
  Game: string;
}

export interface TurnoverGameSelectionsResponse {
  Code: number;
  Message: string;
  Rows: TurnoverGameSelection[];
}

export interface TurnoverRecord {
  GameName: string;
  Amount: number;
  WinAmount: number;
  CreatedDate: string;
}

export interface TurnoverReportResponse {
  Code: number;
  Message: string;
  PageNumber: number;
  TotalAmount: number;
  Rows: TurnoverRecord[];
}

// ===========================================
// Redeem Code Types
// ===========================================

export interface RedeemCodeRequest {
  RedeemCode: string;
}

export interface RedeemCodeResponse {
  Code: number;
  Message: string;
}

// ===========================================
// User Profile Types
// ===========================================

export interface UserProfileResponse {
  Code: number;
  Message: string;
  Id: string;
  Username: string;
  Name: string;
  FullName: string;
  Avatar: string;
  InboxCount: number;
  Currency: string;
  Cash: number;
  Chip: number;
  OverviewDate: string;
  RegisteredDownline: number;
  ActiveDownline: number;
  Turnover: number;
  Pin: string | null;
}
