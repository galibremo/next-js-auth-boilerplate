import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	createProvider,
	deleteProvider,
	setDefault,
	testConnection,
	toggleProvider,
	updateProvider
} from "./email-provider.actions";
import { emailProviderKeys } from "./email-provider.keys";

export function useCreateProviderMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProvider,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: emailProviderKeys.all });
		}
	});
}

export function useUpdateProviderMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProvider,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: emailProviderKeys.all });
		}
	});
}

export function useDeleteProviderMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProvider,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: emailProviderKeys.all });
		}
	});
}

export function useTestConnectionMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: testConnection,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: emailProviderKeys.all });
		}
	});
}

export function useSetDefaultMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: setDefault,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: emailProviderKeys.all });
		}
	});
}

export function useToggleProviderMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: toggleProvider,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: emailProviderKeys.all });
		}
	});
}
