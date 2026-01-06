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

export interface Event {
  Id: string;
  Name: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  PromoImage: string;
}

export interface EventsResponse {
  Code: number;
  Message: string;
  Data: Event[];
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
  QrCode: string; // Base64 encoded
}

export interface HaveBankAccountResponse {
  Code: number;
  Message: string;
  Have: boolean;
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

export interface RegisterRequest {
  Username: string;
  Password: string;
  Email: string;
  Phone: string;
  FullName: string;
  Upline?: string;
}

export interface RegisterResponse {
  Code: number;
  Message: string;
}

export interface GetUplineRequest {
  Id: string;
}

export interface GetUplineResponse {
  Code: number;
  Message: string;
  ReferralCode: string;
}
