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
// Game Records Types
// ===========================================

export interface GameRecordSelection {
  Text: string;
  Game: string;
}

export interface GameRecordSelectionsResponse {
  Code: number;
  Message: string;
  Rows: GameRecordSelection[];
}

export interface GameRecord {
  Id: string;
  GameName: string;
  Stake: number;
  Turnover: number;
  Profit: number;
  CreatedDate: string;
}

export interface GameRecordsResponse {
  Code: number;
  Message: string;
  PageNumber: number;
  TotalStake: number;
  TotalTurnover: number;
  TotalProfit: number;
  Rows: GameRecord[];
}

// ===========================================
// Message Selection Types
// ===========================================

export interface MessageSelectionOption {
  Value: string;
  Text: string;
}

export interface MessageSelectionResponse {
  Code: number;
  Message: string;
  Data: MessageSelectionOption[];
}

// ===========================================
// Register Types
// ===========================================

export interface GetUplineRequest {
  Id: string;
}

export interface GetUplineResponse {
  Code: number;
  Message: string;
  Id: string;
  Username: string;
  ReferralCode: string;
}

export interface RegisterGetTacRequest {
  Phone: string;
  Option: string;
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
  Option: string;
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
  BankImage: string;
  Name: string;
  No: string;
  Currency: string;
  Rate: number;
}

export interface WithdrawAccountsResponse {
  Code: number;
  Message: string;
  Cash: number;
  Currency: string;
  Rollover: number;
  TargetRollover: number;
  DailyWithdrawFreq: number;
  DailyWithdrawFreqBalance: number;
  ProcessingFeePercentage: number;
  DailyWithdrawLimit: number;
  MinMYR: number;
  MaxMYR: number;
  MinUSD: number;
  MaxUSD: number;
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

export interface UserBank {
  Id: string;
  Name: string;
  Image: string;
  Currency: string;
}

export interface GetUserBanksResponse {
  Code: number;
  Message: string;
  Rows?: UserBank[];
  FullName?: string;
}

export interface UserBankAccount {
  Id: string;
  BankName: string;
  BankImage: string;
  Name: string;
  No: string;
}

export interface GetUserBankAccountsResponse {
  Code: number;
  Message: string;
  Rows: UserBankAccount[];
}

export interface GetTacResponse {
  Code: number;
  Message: string;
  UserId?: string;
  Phone?: string;
  Tac?: string;
  ExpiresIn: number;
}

export interface AddBankAccountRequest {
  Name: string;
  No: string;
  Tac: string;
  UserBankId: string;
}

export interface AddBankAccountResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Reset PIN Types
// ===========================================

export interface ResetPinGetTacResponse {
  Code: number;
  Message: string;
  UserId: string;
  Phone: string;
  Tac: string;
  ExpiresIn: number;
}

export interface ResetPinRequest {
  Pin: string;
  Tac: string;
}

export interface ResetPinResponse {
  Code: number;
  Message: string;
}

export interface DeleteBankAccountRequest {
  Id: string;
}

export interface DeleteBankAccountResponse {
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
  Alias: string;
  Letter: string;
  Image: string;
}

export interface GetContactsResponse {
  Code: number;
  Message: string;
  Contacts: Contact[];
}

export interface FriendRequest {
  Id: string;
  Name: string;
  Username: string;
  Image: string;
}

export interface GetContactRequestsResponse {
  Code: number;
  Message: string;
  FrRequests: FriendRequest[];
  MyRequests: FriendRequest[];
}

export interface ContactDetail {
  Id: string;
  TargetId: string;
  Username: string;
  Name: string;
  Alias: string;
  Image: string;
}

export interface GetContactDetailResponse {
  Code: number;
  Message: string;
  Id: string;
  TargetId: string;
  Username: string;
  Name: string;
  Alias: string;
  Image: string;
}

export interface DeleteContactRequest {
  Id: string;
}

export interface DeleteContactResponse {
  Code: number;
  Message: string;
}

export interface UpdateContactAliasRequest {
  Id: string;
  Alias: string;
}

export interface UpdateContactAliasResponse {
  Code: number;
  Message: string;
}

export interface SearchContactResult {
  Id: string;
  Name: string;
  Username: string;
  Image: string;
}

export interface SearchContactResponse {
  Code: number;
  Message: string;
  Text: string;
  Contacts: SearchContactResult[];
}

export interface AddContactRequest {
  Id: string;
}

export interface AddContactResponse {
  Code: number;
  Message: string;
}

export interface ApproveContactRequest {
  Id: string;
}

export interface ApproveContactResponse {
  Code: number;
  Message: string;
}

export interface RejectContactRequest {
  Id: string;
}

export interface RejectContactResponse {
  Code: number;
  Message: string;
}

export interface CancelContactRequest {
  Id: string;
}

export interface CancelContactResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Transfer Types
// ===========================================

export interface GetTransferInfoResponse {
  Code: number;
  Message: string;
  Id: string;
  Name: string;
  Username: string;
  Image: string;
  Currency: string;
  AvailableCash: number;
}

export interface PostTransferRequest {
  Id: string;
  Amount: number;
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
  Image: string;
  Price: number;
}

export interface GetRewardsResponse {
  Code: number;
  Message: string;
  Point: number;
  RewardPendingCount: number;
  Rewards: Reward[];
}

export interface MyReward {
  Id: string;
  Name: string;
  Image: string;
  Price: number;
  Status: string;
  CreatedDate: string;
}

export interface GetMyRewardsResponse {
  Code: number;
  Message: string;
  Rewards: MyReward[];
}

export interface ClaimRewardRequest {
  Id: string;
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
  Id: string;
  GameName: string;
  Rollover: number;
  WinLose: number;
  CreatedDate: string;
}

export interface TurnoverReportResponse {
  Code: number;
  Message: string;
  PageNumber: number;
  TotalRollover: number;
  TotalWinLose: number;
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

// ===========================================
// Change Name Types
// ===========================================

export interface GetNameResponse {
  Code: number;
  Message: string;
  Name: string;
}

export interface ChangeNameRequest {
  Name: string;
}

export interface ChangeNameResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Change Avatar Types
// ===========================================

export interface Avatar {
  Id: string;
  Image: string;
}

export interface GetAvatarsResponse {
  Code: number;
  Message: string;
  AvatarId: string;
  Avatars: Avatar[];
}

export interface ChangeAvatarRequest {
  Id: string;
}

export interface ChangeAvatarResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Change Password Types
// ===========================================

export interface ChangePasswordGetTacResponse {
  Code: number;
  Message: string;
  ExpiresIn?: number;
}

export interface ChangePasswordRequest {
  OldPassword: string;
  NewPassword: string;
  Tac: string;
}

export interface ChangePasswordResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Deposit Types
// ===========================================

export interface WalletInfoResponse {
  Code: number;
  Message: string;
  Id: string;
  Currency: string;
  Cash: number;
  Chip: number;
  UserName: string;
  FullName: string;
}

export interface PaygateNetwork {
  Id: string;
  Name: string;
  Code: string;
  Image: string;
}

export interface Paygate {
  Id: string;
  Name: string;
  Type: string;
  Min: number;
  Max: number;
  Image: string;
  ConversionRate: number;
  ChargeRate: number;
  NoBonus: boolean;
  Networks: PaygateNetwork[];
}

export interface DepositPromo {
  Id: string;
  Name: string;
  Image: string;
  Type: string;
  Rate: number;
  Freq: string;
  MinDeposit: number;
  MaxDeposit: number;
}

export interface PaygatesResponse {
  Code: number;
  Message: string;
  UserName: string;
  FullName: string;
  Cash: number;
  Rows: Paygate[];
  Promos: DepositPromo[];
}

export interface DepositBankAccount {
  Id: string;
  BankName: string;
  BankImage: string;
  Name: string;
  No: string;
}

export interface DepositAccountsResponse {
  Code: number;
  Message: string;
  Min: number;
  Max: number;
  UserName: string;
  FullName: string;
  Cash: number;
  Rows: DepositBankAccount[];
  Promos: DepositPromo[];
}

export interface SubmitDepositPgRequest {
  Amount: number;
  PaygateId: string;
  PaygateNetworkId: string;
  PromoCode: string;
  PromoId: string;
}

export interface SubmitDepositPgResponse {
  Code: number;
  Message: string;
  Url: string;
}

export interface SubmitDepositRequest {
  BankAccountId: string;
  Amount: number;
  PromoId: string;
  PromoCode: string;
  Receipt: File;
}

export interface SubmitDepositResponse {
  Code: number;
  Message: string;
}

// ===========================================
// Rebate Types
// ===========================================

export interface RebateGame {
  Id: string;
  Name: string;
  Code: string;
  PlayerCommRate: number;
  PlayerL1CommRate: number;
  PlayerL2CommRate: number;
  AgentCommRate: number;
}

export interface GetRebatesResponse {
  Code: number;
  Message: string;
  Games: RebateGame[];
}
