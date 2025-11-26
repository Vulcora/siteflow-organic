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
  type CompanyResourceSchema,
  type ProjectResourceSchema,
  type TicketResourceSchema,
  type InvitationResourceSchema,
  type FormResponseResourceSchema,
  type InternalNoteResourceSchema,
} from '../generated/ash-rpc';

// Query keys for cache management
export const queryKeys = {
  companies: ['companies'] as const,
  projects: ['projects'] as const,
  tickets: ['tickets'] as const,
  timeEntries: ['timeEntries'] as const,
  invitations: ['invitations'] as const,
  documents: ['documents'] as const,
  formResponses: ['formResponses'] as const,
  internalNotes: ['internalNotes'] as const,
  project: (id: string) => ['project', id] as const,
  ticket: (id: string) => ['ticket', id] as const,
  formResponsesByProject: (projectId: string) => ['formResponses', 'project', projectId] as const,
  internalNotesByProject: (projectId: string) => ['internalNotes', 'project', projectId] as const,
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
        input,
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
        fields: ['id', 'formType', 'section', 'questionKey', 'answerValue', 'answerMetadata', 'projectId', 'insertedAt', 'updatedAt'],
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
        args: { projectId },
        fields: ['id', 'formType', 'section', 'questionKey', 'answerValue', 'answerMetadata', 'projectId'],
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
        args: { projectId, formType },
        fields: ['id', 'formType', 'section', 'questionKey', 'answerValue', 'answerMetadata', 'projectId'],
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
          args: { projectId: filter.projectId },
          fields: ['id', 'content', 'projectId', 'authorId', 'insertedAt', 'updatedAt'],
          ...config,
        });
        if (!result.success) {
          throw new Error((result as any).errors?.[0]?.message || 'Failed to fetch internal notes');
        }
        return result.data;
      }
      const result = await internalNoteRead({
        fields: ['id', 'content', 'projectId', 'authorId', 'insertedAt', 'updatedAt'],
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
        fields: ['id', 'content', 'projectId', 'authorId', 'insertedAt'],
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
        fields: ['id', 'content', 'updatedAt'],
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
