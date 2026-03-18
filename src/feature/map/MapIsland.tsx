
import ClientHydration from "@/components/ClientHydration";
import { Map3D } from "./Map3D";


export default function MapIsland() {
  return (
    <ClientHydration lang="en">
      <Map3D/>
    </ClientHydration>
  )
}