import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Viewer from "./Viewer";
import { NuqsAdapter } from "nuqs/adapters/react";

const client = new QueryClient({ defaultOptions: { queries: { }}});

export default function Index() {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={client}>
        <Viewer />
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
