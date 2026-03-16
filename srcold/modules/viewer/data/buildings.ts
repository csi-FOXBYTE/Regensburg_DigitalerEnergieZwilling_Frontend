export interface SelectableBuilding {
  id: string;
  address: string;
  coordinates: [number, number];
  geometry: {
    area: number;
    floors: number;
    height: number;
    roofType: string;
  };
  polygon: [number, number][];
}

export const mockBuildings: SelectableBuilding[] = [
  {
    id: "1",
    address: "Dachauplatz 12, 93047 Regensburg",
    coordinates: [12.0974, 49.0134],
    geometry: { area: 180, floors: 3, height: 9.5, roofType: "Satteldach" },
    polygon: [
      [12.0974, 49.0134],
      [12.0975, 49.0134],
      [12.0975, 49.0135],
      [12.0974, 49.0135],
    ],
  },
  {
    id: "2",
    address: "Arnulfsplatz 7, 93047 Regensburg",
    coordinates: [12.0984, 49.0144],
    geometry: { area: 240, floors: 4, height: 12, roofType: "Flachdach" },
    polygon: [
      [12.0984, 49.0144],
      [12.0985, 49.0144],
      [12.0985, 49.0145],
      [12.0984, 49.0145],
    ],
  },
  {
    id: "3",
    address: "Weingasse 3, 93047 Regensburg",
    coordinates: [12.0964, 49.0124],
    geometry: { area: 160, floors: 3, height: 9, roofType: "Satteldach" },
    polygon: [
      [12.0964, 49.0124],
      [12.0965, 49.0124],
      [12.0965, 49.0125],
      [12.0964, 49.0125],
    ],
  },
];

export function getSelectableBuildingById(id: string | null) {
  if (!id) return null;
  const knownBuilding = mockBuildings.find((building) => building.id === id);
  if (knownBuilding) return knownBuilding;

  return {
    id,
    address: `Gebaeude ${id}, Regensburg`,
    coordinates: [12.0974, 49.0134],
    geometry: { area: 180, floors: 3, height: 9.5, roofType: "Unbekannt" },
    polygon: [],
  };
}
