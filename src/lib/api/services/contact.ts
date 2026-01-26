import { apiClient } from "../client";
import type {
  GetContactsResponse,
  GetContactRequestsResponse,
  GetContactDetailResponse,
  DeleteContactRequest,
  DeleteContactResponse,
  SearchContactResponse,
  AddContactRequest,
  AddContactResponse,
  ApproveContactRequest,
  ApproveContactResponse,
  RejectContactRequest,
  RejectContactResponse,
  CancelContactRequest,
  CancelContactResponse,
  GetTransferInfoResponse,
  PostTransferRequest,
  PostTransferResponse,
  UpdateContactAliasRequest,
  UpdateContactAliasResponse,
} from "../types";

export const contactApi = {
  /**
   * Get user's contacts list
   * GET /api/mapicontact2/getcontacts
   */
  async getContacts(): Promise<GetContactsResponse> {
    return apiClient.get<GetContactsResponse>("/api/mapicontact2/getcontacts", {
      authenticated: true,
    });
  },

  /**
   * Get contact requests (incoming and outgoing)
   * GET /api/mapicontact2/getcontactrequests
   */
  async getContactRequests(): Promise<GetContactRequestsResponse> {
    return apiClient.get<GetContactRequestsResponse>("/api/mapicontact2/getcontactrequests", {
      authenticated: true,
    });
  },

  /**
   * Get contact detail by ID
   * GET /api/mapicontact2/getcontact?Id=...
   */
  async getContact(id: string): Promise<GetContactDetailResponse> {
    return apiClient.get<GetContactDetailResponse>(`/api/mapicontact2/getcontact?Id=${id}`, {
      authenticated: true,
    });
  },

  /**
   * Delete a contact
   * POST /api/mapicontact2/deletecontact
   */
  async deleteContact(data: DeleteContactRequest): Promise<DeleteContactResponse> {
    return apiClient.post<DeleteContactResponse>("/api/mapicontact2/deletecontact", data, {
      authenticated: true,
    });
  },

  /**
   * Search for contacts by username/UID
   * GET /api/mapicontact2/searchcontact?Text=...
   */
  async searchContact(text: string): Promise<SearchContactResponse> {
    return apiClient.get<SearchContactResponse>(`/api/mapicontact2/searchcontact?Text=${encodeURIComponent(text)}`, {
      authenticated: true,
    });
  },

  /**
   * Send friend request / add contact
   * POST /api/mapicontact2/addContact
   */
  async addContact(data: AddContactRequest): Promise<AddContactResponse> {
    return apiClient.post<AddContactResponse>("/api/mapicontact2/addContact", data, {
      authenticated: true,
    });
  },

  /**
   * Approve a friend request
   * POST /api/mapicontact2/approvecontact
   */
  async approveContact(data: ApproveContactRequest): Promise<ApproveContactResponse> {
    return apiClient.post<ApproveContactResponse>("/api/mapicontact2/approvecontact", data, {
      authenticated: true,
    });
  },

  /**
   * Reject a friend request
   * POST /api/mapicontact2/rejectcontact
   */
  async rejectContact(data: RejectContactRequest): Promise<RejectContactResponse> {
    return apiClient.post<RejectContactResponse>("/api/mapicontact2/rejectcontact", data, {
      authenticated: true,
    });
  },

  /**
   * Cancel a sent friend request
   * POST /api/MapiContact2/CancelContact
   */
  async cancelContact(data: CancelContactRequest): Promise<CancelContactResponse> {
    return apiClient.post<CancelContactResponse>("/api/MapiContact2/CancelContact", data, {
      authenticated: true,
    });
  },

  /**
   * Get transfer info for a contact
   * GET /api/mapicontact2/gettransfer?Id=...
   */
  async getTransferInfo(id: string): Promise<GetTransferInfoResponse> {
    return apiClient.get<GetTransferInfoResponse>(`/api/mapicontact2/gettransfer?Id=${id}`, {
      authenticated: true,
    });
  },

  /**
   * Transfer money to a contact
   * POST /api/mapicontact2/posttransfer
   */
  async postTransfer(data: PostTransferRequest): Promise<PostTransferResponse> {
    return apiClient.post<PostTransferResponse>("/api/mapicontact2/posttransfer", data, {
      authenticated: true,
    });
  },

  /**
   * Update contact alias
   * POST /api/mapicontact2/updatecontactalias
   */
  async updateContactAlias(data: UpdateContactAliasRequest): Promise<UpdateContactAliasResponse> {
    return apiClient.post<UpdateContactAliasResponse>("/api/mapicontact2/updatecontactalias", data, {
      authenticated: true,
    });
  },
};
