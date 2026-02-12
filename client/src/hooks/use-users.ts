import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertUser } from "@shared/routes";

// Since the schema and routes were provided for users, we generate the hooks.
// Although the current UI focus is on the dashboard, these are ready for auth integration.

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await fetch(api.users.create.path, {
        method: api.users.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.users.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create user");
      }
      
      return api.users.create.responses[201].parse(await res.json());
    },
    // Invalidating a hypothetical list query if it existed
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [api.users.list.path] })
    },
  });
}
