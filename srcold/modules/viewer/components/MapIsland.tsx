import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Map3D } from "../../../../src/feature/map/Map3D";

const client = new QueryClient({ defaultOptions: { queries: {} } });

export default function MapIsland() {
  return (
    <QueryClientProvider client={client}>
      <Map3D />
    </QueryClientProvider>
  );
}
