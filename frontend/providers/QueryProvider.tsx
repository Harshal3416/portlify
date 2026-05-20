"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalLoader from "@/app/components/ui/GlobalLoader";

const queryClient = new QueryClient();

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <GlobalLoader />
    </QueryClientProvider>
  );
}