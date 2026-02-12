import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Dashboard />
    </QueryClientProvider>
  );
}

export default App;
