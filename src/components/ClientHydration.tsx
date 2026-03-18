import { initializeI18Next } from "@/lib/locales";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { use, useEffect, useState, type ReactNode } from "react";

const queryClient = new QueryClient();

export default function ClientHydration({children, lang}: {children: ReactNode, lang: string}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeI18Next(lang).then(() => setReady(true));
  }, [lang]);

  if (!ready) return <></>;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}