import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import {
  companyRead,
  projectRead,
  ticketRead,
  timeEntryRead,
  timeEntryCreate,
  invitationRead,
  documentRead,
  documentCreate,
  projectCreate,
  ticketCreate,
  invitationCreate,
  projectSubmit,
  projectApprove,
  projectReject,
  projectSetPriority,
  projectTogglePriority,
  ticketAssign,
  ticketStartWork,
  ticketSubmitForReview,
  ticketApprove,
  ticketRequestChanges,
  invitationAccept,
  commentRead,
  commentByTicket,
  commentCreate,
  formResponseRead,
  formResponseByProject,
  formResponseByProjectAndType,
  formResponseCreate,
  formResponseUpdate,
  formResponseDestroy,
  internalNoteRead,
  internalNoteByProject,
  internalNoteCreate,
  internalNoteUpdate,
  internalNoteDestroy,
  productPlanByProject,
  productPlanActiveByProject,
  productPlanCreate,
  productPlanUpdate,
  productPlanSendToCustomer,
  productPlanMarkViewed,
  productPlanApprove,
  productPlanRequestChanges,
  productPlanRevise,
  productPlanArchive,
  milestoneRead,
  milestoneByProject,
  milestoneCreate,
  milestoneUpdate,
  milestoneMarkCompleted,
  milestoneReopen,
  milestoneDestroy,
  meetingRead,
  meetingByProject,
  meetingUpcomingByProject,
  meetingCreate,
  meetingUpdate,
  meetingStart,
  meetingComplete,
  meetingCancel,
  meetingDestroy,
  type CompanyResourceSchema,
  type ProjectResourceSchema,
  type TicketResourceSchema,
  type InvitationResourceSchema,
  type FormResponseResourceSchema,
  type InternalNoteResourceSchema,
  type MilestoneResourceSchema,
  type MeetingResourceSchema,
} from '../generated/ash-rpc';

// Query keys for cache management
export const queryKeys = {
  companies: ['companies'] as const,
  projects: ['projects'] as const,
  tickets: ['tickets'] as const,
  timeEntries: ['timeEntries'] as const,
  invitations: ['invitations'] as const,
  documents: ['documents'] as const,
  comments: ['comments'] as const,
  formResponses: ['formResponses'] as const,
  internalNotes: ['internalNotes'] as const,
  productPlans: ['productPlans'] as const,
  milestones: ['milestones'] as const,
  meetings: ['meetings'] as const,
  project: (id: string) => ['project', id] as const,
  ticket: (id: string) => ['ticket', id] as const,
  commentsByTicket: (ticketId: string) => ['comments', 'ticket', ticketId] as const,
  formResponsesByProject: (projectId: string) => ['formResponses', 'project', projectId] as const,
  internalNotesByProject: (projectId: string) => ['internalNotes', 'project', projectId] as const,
  productPlansByProject: (projectId: string) => ['productPlans', 'project', projectId] as const,
  milestonesByProject: (projectId: string) => ['milestones', 'project', projectId] as const,
  meetingsByProject: (projectId: string) => ['meetings', 'project', projectId] as const,
  upcomingMeetingsByProject: (projectId: string) => ['meetings', 'project', projectId, 'upcoming'] as const,
};

// Helper to create config with auth headers
function useAuthConfig() {
  const { getAuthHeaders } = useAuth();
  return {
    headers: getAuthHeaders(),
  };
}

// ============== Company Hooks ==============

export function useCompanies() {
  const config = useAuthConfig();

  return useQuery({
    queryKey: queryKeys.companies,
    queryFn: async () => {
      const result = await companyRead({
        fields: ['id', 'name', 'orgNumber', 'city', 'isActive'],
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to fetch companies');
      }
      return result.data;
    },
  });
}

// ============== Project Hooks ==============

export function useProjects(filter?: { companyId?: string; state?: string }) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: [...queryKeys.projects, filter],
    queryFn: async () => {
      const result = await projectRead({
        fields: ['id', 'name', 'description', 'state', 'budget', 'spent', 'startDate', 'targetEndDate', 'companyId', 'isPriority'],
        filter: filter as any,
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to fetch projects');
      }
      return result.data;
    },
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      description?: string;
      companyId: string;
      budget?: string;
      startDate?: string;
      targetEndDate?: string;
    }) => {
      const result = await projectCreate({
        input,
        fields: ['id', 'name', 'state'],
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to create project');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useSubmitProject() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (primaryKey: string) => {
      const result = await projectSubmit({
        primaryKey,
        fields: ['id', 'state'],
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to submit project');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useApproveProject() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (primaryKey: string) => {
      const result = await projectApprove({
        primaryKey,
        fields: ['id', 'state', 'approvedAt'],
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to approve project');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

export function useRejectProject() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ primaryKey, rejectionReason }: { primaryKey: string; rejectionReason?: string }) => {
      const result = await projectReject({
        primaryKey,
        input: rejectionReason ? { rejectionReason } : undefined,
        fields: ['id', 'state', 'rejectionReason'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to reject project');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
}

// ============== Ticket Hooks ==============

export function useTickets(filter?: { projectId?: string; state?: string; assigneeId?: string }) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: [...queryKeys.tickets, filter],
    queryFn: async () => {
      const result = await ticketRead({
        fields: ['id', 'title', 'description', 'state', 'priority', 'category', 'projectId', 'assigneeId', 'reporterId'],
        filter: filter as any,
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to fetch tickets');
      }
      return result.data;
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (input: {
      title: string;
      description?: string;
      projectId: string;
      priority?: 'low' | 'medium' | 'high' | 'critical';
      category?: 'bug' | 'feature' | 'support' | 'question' | 'task';
    }) => {
      const result = await ticketCreate({
        input,
        fields: ['id', 'title', 'state'],
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to create ticket');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ primaryKey, assigneeId }: { primaryKey: string; assigneeId: string }) => {
      const result = await ticketAssign({
        primaryKey,
        input: { assigneeId },
        fields: ['id', 'state', 'assigneeId'],
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to assign ticket');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
}

export function useStartWorkOnTicket() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (primaryKey: string) => {
      const result = await ticketStartWork({
        primaryKey,
        fields: ['id', 'state'],
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to start work on ticket');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
}

export function useSubmitTicketForReview() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (primaryKey: string) => {
      const result = await ticketSubmitForReview({
        primaryKey,
        fields: ['id', 'state'],
        ...config,
      });
      if (!result.success) {
        throw new Error(result.errors?.[0]?.message || 'Failed to submit ticket for review');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
}

export function useApproveTicket() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (primaryKey: string) => {
      const result = await ticketApprove({
        primaryKey,
        fields: ['id', 'state', 'resolvedAt'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to approve ticket');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
}

export function useRequestChangesTicket() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ primaryKey, reviewNotes }: { primaryKey: string; reviewNotes?: string }) => {
      const result = await ticketRequestChanges({
        primaryKey,
        input: reviewNotes ? { reviewNotes } : undefined,
        fields: ['id', 'state', 'reviewNotes'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to request changes');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets });
    },
  });
}

// ============== Comment Hooks ==============

export function useCommentsByTicket(ticketId: string | undefined) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: ticketId ? queryKeys.commentsByTicket(ticketId) : ['comments', 'none'],
    queryFn: async () => {
      if (!ticketId) return [];

      const result = await commentByTicket({
        input: { ticketId },
        fields: ['id', 'body', 'isInternal', 'ticketId', 'authorId'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch comments');
      }
      return result.data;
    },
    enabled: !!ticketId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({
      ticketId,
      body,
      isInternal,
    }: {
      ticketId: string;
      body: string;
      isInternal?: boolean;
    }) => {
      const result = await commentCreate({
        input: { ticketId, body, isInternal },
        fields: ['id', 'body', 'isInternal', 'ticketId', 'authorId'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to create comment');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.commentsByTicket(variables.ticketId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.comments });
    },
  });
}

// ============== Time Entry Hooks ==============

export function useTimeEntries(filter?: { projectId?: string; userId?: string }) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: [...queryKeys.timeEntries, filter],
    queryFn: async () => {
      const result = await timeEntryRead({
        fields: ['id', 'hours', 'date', 'description', 'projectId', 'userId'],
        filter: filter as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch time entries');
      }
      return result.data;
    },
  });
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (input: {
      hours: number;
      date: string;
      projectId: string;
      description?: string;
      ticketId?: string;
      hourlyRate?: number;
      isBillable?: boolean;
    }) => {
      const result = await timeEntryCreate({
        input: {
          ...input,
          hours: String(input.hours),  // Convert number to string (Decimal)
          hourlyRate: input.hourlyRate ? String(input.hourlyRate) : undefined,
        } as any,
        fields: ['id', 'hours', 'date', 'description', 'projectId', 'ticketId'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to create time entry');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timeEntries });
    },
  });
}

// ============== Invitation Hooks ==============

export function useInvitations(filter?: { companyId?: string }) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: [...queryKeys.invitations, filter],
    queryFn: async () => {
      const result = await invitationRead({
        fields: ['id', 'email', 'role', 'expiresAt', 'acceptedAt', 'cancelledAt', 'companyId'],
        filter: filter as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch invitations');
      }
      return result.data;
    },
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (input: {
      email: string;
      companyId: string;
      role?: 'customer';
    }) => {
      const result = await invitationCreate({
        input,
        fields: ['id', 'email', 'expiresAt'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to create invitation');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations });
    },
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ invitationId, userId }: { invitationId: string; userId: string }) => {
      const result = await invitationAccept({
        primaryKey: invitationId,
        input: { userId },
        fields: ['id', 'acceptedAt'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to accept invitation');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invitations });
    },
  });
}

// ============== Document Hooks ==============

export function useDocuments(filter?: { projectId?: string }) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: [...queryKeys.documents, filter],
    queryFn: async () => {
      const result = await documentRead({
        fields: ['id', 'name', 'description', 'filePath', 'fileSize', 'mimeType', 'category', 'projectId'],
        filter: filter as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch documents');
      }
      return result.data;
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (input: {
      name: string;
      description?: string;
      filePath: string;
      fileSize?: number;
      mimeType?: string;
      category?: 'contract' | 'specification' | 'design' | 'report' | 'invoice' | 'other';
      projectId: string;
    }) => {
      const result = await documentCreate({
        input,
        fields: ['id', 'name', 'filePath', 'category'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to upload document');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    },
  });
}

// ============== Form Response Hooks ==============

export function useAllFormResponses() {
  const config = useAuthConfig();

  return useQuery({
    queryKey: queryKeys.formResponses,
    queryFn: async () => {
      const result = await formResponseRead({
        fields: ['id', 'formType', 'section', 'questionKey', 'answerValue', 'answerMetadata', 'projectId'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch form responses');
      }
      return result.data;
    },
  });
}

export function useFormResponsesByProject(projectId: string) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: queryKeys.formResponsesByProject(projectId),
    queryFn: async () => {
      const result = await formResponseByProject({
        input: { projectId },
        fields: ['id', 'formType', 'section', 'questionKey', 'answerValue', 'answerMetadata'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch form responses');
      }
      return result.data;
    },
    enabled: !!projectId,
  });
}

export function useFormResponsesByProjectAndType(projectId: string, formType: 'website' | 'system' | 'both') {
  const config = useAuthConfig();

  return useQuery({
    queryKey: [...queryKeys.formResponsesByProject(projectId), formType],
    queryFn: async () => {
      const result = await formResponseByProjectAndType({
        input: { projectId, formType },
        fields: ['id', 'formType', 'section', 'questionKey', 'answerValue', 'answerMetadata'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch form responses');
      }
      return result.data;
    },
    enabled: !!projectId && !!formType,
  });
}

export function useCreateFormResponse() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (input: {
      projectId: string;
      formType: 'website' | 'system' | 'both';
      section: string;
      questionKey: string;
      answerValue: Record<string, unknown>;
      answerMetadata?: Record<string, unknown>;
    }) => {
      const result = await formResponseCreate({
        input,
        fields: ['id', 'formType', 'section', 'questionKey', 'answerValue'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to create form response');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.formResponsesByProject(variables.projectId) });
    },
  });
}

export function useUpdateFormResponse() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
      answerValue,
      answerMetadata,
    }: {
      id: string;
      projectId: string;
      answerValue: Record<string, unknown>;
      answerMetadata?: Record<string, unknown>;
    }) => {
      const result = await formResponseUpdate({
        primaryKey: id,
        input: { answerValue, answerMetadata },
        fields: ['id', 'answerValue'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to update form response');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.formResponsesByProject(variables.projectId) });
    },
  });
}

export function useDeleteFormResponse() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await formResponseDestroy({
        primaryKey: id,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to delete form response');
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.formResponsesByProject(variables.projectId) });
    },
  });
}

// Hook for saving/loading form values in bulk
export function useProjectFormResponses(projectId: string) {
  const { data: responses, isLoading, error } = useFormResponsesByProject(projectId);
  const createMutation = useCreateFormResponse();
  const updateMutation = useUpdateFormResponse();

  // Convert responses array to key-value map for easy access
  const formValues = React.useMemo(() => {
    if (!responses) return {};
    const values: Record<string, string | string[]> = {};
    responses.forEach((response) => {
      const answer = response.answerValue as { value?: unknown };
      if (answer?.value !== undefined) {
        values[response.questionKey] = answer.value as string | string[];
      }
    });
    return values;
  }, [responses]);

  // Find existing response by question key
  const findResponse = React.useCallback(
    (questionKey: string) => {
      return responses?.find((r) => r.questionKey === questionKey);
    },
    [responses]
  );

  // Save a single answer
  const saveAnswer = React.useCallback(
    async (
      formType: 'website' | 'system' | 'both',
      section: string,
      questionKey: string,
      value: string | string[]
    ) => {
      const existing = findResponse(questionKey);
      const answerValue = { value };

      if (existing) {
        await updateMutation.mutateAsync({
          id: existing.id,
          projectId,
          answerValue,
        });
      } else {
        await createMutation.mutateAsync({
          projectId,
          formType,
          section,
          questionKey,
          answerValue,
        });
      }
    },
    [projectId, findResponse, createMutation, updateMutation]
  );

  // Save multiple answers at once
  const saveAllAnswers = React.useCallback(
    async (
      formType: 'website' | 'system' | 'both',
      answers: Array<{ section: string; questionKey: string; value: string | string[] }>
    ) => {
      await Promise.all(
        answers.map((answer) =>
          saveAnswer(formType, answer.section, answer.questionKey, answer.value)
        )
      );
    },
    [saveAnswer]
  );

  return {
    formValues,
    responses,
    isLoading,
    error,
    saveAnswer,
    saveAllAnswers,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}

// ============== Project Priority Hooks ==============

export function useToggleProjectPriority() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const result = await projectTogglePriority({
        primaryKey: projectId,
        fields: ['id', 'isPriority'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to toggle priority');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.formResponses });
    },
  });
}

export function useSetProjectPriority() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ projectId, isPriority }: { projectId: string; isPriority: boolean }) => {
      const result = await projectSetPriority({
        primaryKey: projectId,
        input: { isPriority },
        fields: ['id', 'isPriority'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to set priority');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.formResponses });
    },
  });
}

// ============== Internal Notes Hooks ==============

export function useInternalNotes(filter?: { projectId?: string }) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: filter?.projectId
      ? queryKeys.internalNotesByProject(filter.projectId)
      : queryKeys.internalNotes,
    queryFn: async () => {
      if (filter?.projectId) {
        const result = await internalNoteByProject({
          input: { projectId: filter.projectId },
          fields: ['id', 'content', 'projectId', 'authorId'] as any,
          ...config,
        });
        if (!result.success) {
          throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch internal notes');
        }
        return result.data;
      }
      const result = await internalNoteRead({
        fields: ['id', 'content', 'projectId', 'authorId'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch internal notes');
      }
      return result.data;
    },
  });
}

export function useCreateInternalNote() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (input: { content: string; projectId: string }) => {
      const result = await internalNoteCreate({
        input,
        fields: ['id', 'content', 'projectId', 'authorId'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to create internal note');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.internalNotesByProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.internalNotes });
    },
  });
}

export function useUpdateInternalNote() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId, content }: { id: string; projectId: string; content: string }) => {
      const result = await internalNoteUpdate({
        primaryKey: id,
        input: { content },
        fields: ['id', 'content'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to update internal note');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.internalNotesByProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.internalNotes });
    },
  });
}

export function useDeleteInternalNote() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await internalNoteDestroy({
        primaryKey: id,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to delete internal note');
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.internalNotesByProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.internalNotes });
    },
  });
}

// ============== Product Plan Hooks ==============

export function useProductPlansByProject(projectId: string) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: queryKeys.productPlansByProject(projectId),
    queryFn: async () => {
      const result = await productPlanByProject({
        input: { projectId },
        fields: ['id', 'title', 'content', 'pdfUrl', 'state', 'version', 'sentAt', 'viewedAt', 'approvedAt', 'rejectedAt', 'projectId', 'createdById'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch product plans');
      }
      return result.data;
    },
    enabled: !!projectId,
  });
}

export function useActiveProductPlan(projectId: string) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: [...queryKeys.productPlansByProject(projectId), 'active'],
    queryFn: async () => {
      const result = await productPlanActiveByProject({
        input: { projectId },
        fields: ['id', 'title', 'content', 'pdfUrl', 'state', 'version', 'sentAt', 'viewedAt', 'approvedAt', 'projectId'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch active product plan');
      }
      return result.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateProductPlan() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (input: {
      projectId: string;
      title: string;
      content?: string;
      pdfUrl?: string;
    }) => {
      const result = await productPlanCreate({
        input: {
          ...input,
          content: input.content || '',  // Ensure content is always provided
        } as any,
        fields: ['id', 'title', 'state', 'version'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to create product plan');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productPlansByProject(variables.projectId) });
    },
  });
}

export function useUpdateProductPlan() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
      title,
      content,
      pdfUrl,
    }: {
      id: string;
      projectId: string;
      title?: string;
      content?: string;
      pdfUrl?: string;
    }) => {
      const result = await productPlanUpdate({
        primaryKey: id,
        input: { title, content, pdfUrl },
        fields: ['id', 'title', 'content', 'pdfUrl'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to update product plan');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productPlansByProject(variables.projectId) });
    },
  });
}

export function useSendProductPlanToCustomer() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await productPlanSendToCustomer({
        primaryKey: id,
        fields: ['id', 'state', 'sentAt'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to send product plan');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productPlansByProject(variables.projectId) });
    },
  });
}

export function useMarkProductPlanViewed() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await productPlanMarkViewed({
        primaryKey: id,
        fields: ['id', 'state', 'viewedAt'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to mark product plan as viewed');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productPlansByProject(variables.projectId) });
    },
  });
}

export function useApproveProductPlan() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
      customerFeedback
    }: {
      id: string;
      projectId: string;
      customerFeedback?: string;
    }) => {
      const result = await productPlanApprove({
        primaryKey: id,
        input: customerFeedback ? { customerFeedback } : undefined as any,
        fields: ['id', 'state', 'approvedAt'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to approve product plan');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productPlansByProject(variables.projectId) });
    },
  });
}

export function useRequestProductPlanChanges() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
      changeRequests
    }: {
      id: string;
      projectId: string;
      changeRequests: Record<string, unknown>;
    }) => {
      const result = await productPlanRequestChanges({
        primaryKey: id,
        input: { feedback: JSON.stringify(changeRequests) } as any,
        fields: ['id', 'state', 'rejectedAt'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to request changes');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productPlansByProject(variables.projectId) });
    },
  });
}

export function useReviseProductPlan() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
      content,
      pdfUrl,
    }: {
      id: string;
      projectId: string;
      content?: string;
      pdfUrl?: string;
    }) => {
      const result = await productPlanRevise({
        primaryKey: id,
        input: { content, pdfUrl },
        fields: ['id', 'state', 'version', 'content', 'pdfUrl'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to revise product plan');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productPlansByProject(variables.projectId) });
    },
  });
}

export function useArchiveProductPlan() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await productPlanArchive({
        primaryKey: id,
        fields: ['id', 'state'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to archive product plan');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productPlansByProject(variables.projectId) });
    },
  });
}

// ==================== Milestone Hooks ====================

export function useMilestonesByProject(projectId: string) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: queryKeys.milestonesByProject(projectId),
    queryFn: async () => {
      const result = await milestoneByProject({
        input: { projectId },
        fields: ['id', 'title', 'description', 'dueDate', 'completedAt', 'orderIndex', 'status'] as any,
        sort: 'orderIndex',
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch milestones');
      }
      return result.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({
      projectId,
      title,
      description,
      dueDate,
      orderIndex,
      status,
    }: {
      projectId: string;
      title: string;
      description?: string;
      dueDate?: string;
      orderIndex?: number;
      status?: 'pending' | 'in_progress' | 'completed';
    }) => {
      const result = await milestoneCreate({
        input: { projectId, title, description, dueDate, orderIndex, status },
        fields: ['id', 'title', 'description', 'dueDate', 'completedAt', 'orderIndex', 'status'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to create milestone');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestonesByProject(variables.projectId) });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
      title,
      description,
      dueDate,
      orderIndex,
      status,
    }: {
      id: string;
      projectId: string;
      title?: string;
      description?: string;
      dueDate?: string;
      orderIndex?: number;
      status?: 'pending' | 'in_progress' | 'completed';
    }) => {
      const result = await milestoneUpdate({
        primaryKey: id,
        input: { title, description, dueDate, orderIndex, status },
        fields: ['id', 'title', 'description', 'dueDate', 'completedAt', 'orderIndex', 'status'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to update milestone');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestonesByProject(variables.projectId) });
    },
  });
}

export function useMarkMilestoneCompleted() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await milestoneMarkCompleted({
        primaryKey: id,
        fields: ['id', 'status', 'completedAt'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to mark milestone completed');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestonesByProject(variables.projectId) });
    },
  });
}

export function useReopenMilestone() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await milestoneReopen({
        primaryKey: id,
        fields: ['id', 'status', 'completedAt'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to reopen milestone');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestonesByProject(variables.projectId) });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await milestoneDestroy({
        primaryKey: id,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to delete milestone');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.milestonesByProject(variables.projectId) });
    },
  });
}

// ==================== Meeting Hooks ====================

export function useMeetingsByProject(projectId: string) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: queryKeys.meetingsByProject(projectId),
    queryFn: async () => {
      const result = await meetingByProject({
        input: { projectId },
        fields: ['id', 'title', 'description', 'meetingType', 'scheduledAt', 'durationMinutes', 'location', 'meetingUrl', 'notes', 'actionItems', 'attendees', 'status'] as any,
        sort: 'scheduledAt',
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch meetings');
      }
      return result.data;
    },
    enabled: !!projectId,
  });
}

export function useUpcomingMeetingsByProject(projectId: string) {
  const config = useAuthConfig();

  return useQuery({
    queryKey: queryKeys.upcomingMeetingsByProject(projectId),
    queryFn: async () => {
      const result = await meetingUpcomingByProject({
        input: { projectId },
        fields: ['id', 'title', 'description', 'meetingType', 'scheduledAt', 'durationMinutes', 'location', 'meetingUrl', 'attendees', 'status'],
        sort: 'scheduledAt',
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch upcoming meetings');
      }
      return result.data;
    },
    enabled: !!projectId,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      title: string;
      description?: string;
      meetingType?: 'kickoff' | 'status_update' | 'review' | 'planning' | 'retrospective' | 'other';
      scheduledAt?: string;
      durationMinutes?: number;
      location?: string;
      meetingUrl?: string;
      attendees?: string[];
      notes?: string;
      status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    }) => {
      const result = await meetingCreate({
        input: {
          projectId: data.projectId,
          title: data.title,
          description: data.description,
          meetingType: data.meetingType,
          scheduledAt: data.scheduledAt,
          durationMinutes: data.durationMinutes,
          location: data.location,
          meetingUrl: data.meetingUrl,
          attendees: data.attendees,
          notes: data.notes,
          status: data.status,
        },
        fields: ['id', 'title', 'meetingType', 'scheduledAt', 'status'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to create meeting');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetingsByProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingMeetingsByProject(variables.projectId) });
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      projectId: string;
      title?: string;
      description?: string;
      meetingType?: 'kickoff' | 'status_update' | 'review' | 'planning' | 'retrospective' | 'other';
      scheduledAt?: string;
      durationMinutes?: number;
      location?: string;
      meetingUrl?: string;
      notes?: string;
      actionItems?: any;
      attendees?: string[];
    }) => {
      const result = await meetingUpdate({
        primaryKey: data.id,
        input: {
          title: data.title,
          description: data.description,
          meetingType: data.meetingType,
          scheduledAt: data.scheduledAt,
          durationMinutes: data.durationMinutes,
          location: data.location,
          meetingUrl: data.meetingUrl,
          notes: data.notes,
          actionItems: data.actionItems,
          attendees: data.attendees,
        },
        fields: ['id', 'title', 'notes', 'actionItems', 'status'] as any,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to update meeting');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetingsByProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingMeetingsByProject(variables.projectId) });
    },
  });
}

export function useStartMeeting() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await meetingStart({
        primaryKey: id,
        fields: ['id', 'status'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to start meeting');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetingsByProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingMeetingsByProject(variables.projectId) });
    },
  });
}

export function useCompleteMeeting() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({
      id,
      projectId,
      notes,
      actionItems,
    }: {
      id: string;
      projectId: string;
      notes?: string;
      actionItems?: any;
    }) => {
      const result = await meetingComplete({
        primaryKey: id,
        input: { notes, actionItems },
        fields: ['id', 'status', 'notes', 'actionItems'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to complete meeting');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetingsByProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingMeetingsByProject(variables.projectId) });
    },
  });
}

export function useCancelMeeting() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await meetingCancel({
        primaryKey: id,
        fields: ['id', 'status'],
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to cancel meeting');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetingsByProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingMeetingsByProject(variables.projectId) });
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  const config = useAuthConfig();

  return useMutation({
    mutationFn: async ({ id, projectId }: { id: string; projectId: string }) => {
      const result = await meetingDestroy({
        primaryKey: id,
        ...config,
      });
      if (!result.success) {
        throw new Error((result as any).errors?.[0]?.message || 'Failed to delete meeting');
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetingsByProject(variables.projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.upcomingMeetingsByProject(variables.projectId) });
    },
  });
}

// ============== User Profile Hooks ==============

export function useChangePassword() {
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async ({
      userId,
      currentPassword,
      newPassword,
      newPasswordConfirmation,
    }: {
      userId: string;
      currentPassword: string;
      newPassword: string;
      newPasswordConfirmation: string;
    }) => {
      const response = await fetch('/api/rpc/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          domain: 'Accounts',
          resource: 'User',
          action: 'change_password',
          primaryKey: userId,
          input: {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation,
          },
        }),
      });

      const result = await response.json();
      if (!result.success) {
        const errorMessage = result.errors?.[0]?.message || 'Failed to change password';
        throw new Error(errorMessage);
      }
      return result.data;
    },
  });
}

export function useUpdateProfile() {
  const { getAuthHeaders } = useAuth();

  return useMutation({
    mutationFn: async ({
      userId,
      firstName,
      lastName,
      phone,
    }: {
      userId: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    }) => {
      const response = await fetch('/api/rpc/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          domain: 'Accounts',
          resource: 'User',
          action: 'update_profile',
          primaryKey: userId,
          input: {
            first_name: firstName,
            last_name: lastName,
            phone,
          },
        }),
      });

      const result = await response.json();
      if (!result.success) {
        const errorMessage = result.errors?.[0]?.message || 'Failed to update profile';
        throw new Error(errorMessage);
      }
      return result.data;
    },
  });
}
