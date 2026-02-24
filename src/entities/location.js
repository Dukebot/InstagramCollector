class Location {
  constructor(data) {
    this.pk = data.pk
    this.shortName = data.shortName
    this.facebookPlacesId = data.facebookPlacesId
    this.externalSource = data.externalSource
    this.name = data.name
    this.address = data.address
    this.city = data.city
    this.hasViewerSaved = data.hasViewerSaved
    this.lng = data.lng
    this.lat = data.lat
    this.isEligibleForGuides = data.isEligibleForGuides
  }
}

module.exports = Location
