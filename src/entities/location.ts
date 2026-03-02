export interface LocationInput {
  pk?: string | number | null;
  shortName?: string | null;
  facebookPlacesId?: string | null;
  externalSource?: string | null;
  name?: string | null;
  address?: string | null;
  city?: string | null;
  hasViewerSaved?: boolean | null;
  lng?: number | null;
  lat?: number | null;
  isEligibleForGuides?: boolean | null;
}

export default class Location {
  pk: string | number | null;
  shortName: string | null;
  facebookPlacesId: string | null;
  externalSource: string | null;
  name: string | null;
  address: string | null;
  city: string | null;
  hasViewerSaved: boolean | null;
  lng: number | null;
  lat: number | null;
  isEligibleForGuides: boolean | null;

  constructor(data: LocationInput = {}) {
    this.pk = data.pk ?? null;
    this.shortName = data.shortName ?? null;
    this.facebookPlacesId = data.facebookPlacesId ?? null;
    this.externalSource = data.externalSource ?? null;
    this.name = data.name ?? null;
    this.address = data.address ?? null;
    this.city = data.city ?? null;
    this.hasViewerSaved = data.hasViewerSaved ?? null;
    this.lng = data.lng ?? null;
    this.lat = data.lat ?? null;
    this.isEligibleForGuides = data.isEligibleForGuides ?? null;
  }
}
