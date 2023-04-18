// hardcoded map of type values to use during transformation
const map: { [name: string]: string } = {
  BicycleParkingStation:
    "https://smartdatamodels.org/dataModel.OSLO/BicycleParkingStation",
  BicycleParkingStationForecast:
    "https://smartdatamodels.org/dataModel.OSLO/BicycleParkingStationForecast",
  "InfrastructureElement.geometry":
    "https://smartdatamodels.org/dataModel.OSLO/InfrastructureElement.geometry",
  "ParkingFacility.capacity":
    "https://smartdatamodels.org/dataModel.OSLO/ParkingFacility.capacity",
  ResourceReport: "https://smartdatamodels.org/dataModel.OSLO/ResourceReport",
  "ResourceReport.actuator":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.actuator",
  "ResourceReport.location":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.location",
  "ResourceReport.meansOfTransport":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.meansOfTransport",
  "ResourceReport.number":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.number",
  "ResourceReport.reportTime":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.reportTime",
  "ResourceReport.service":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.service",
  "ResourceReport.status":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.status",
  "ResourceReport.type":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.type",
  ResourceReportForecast:
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReportForecast",
  address: "https://smartdatamodels.org/address",
  alternateName: "https://smartdatamodels.org/alternateName",
  areaServed: "https://smartdatamodels.org/areaServed",
  dataProvider: "https://smartdatamodels.org/dataProvider",
  dateCreated: "https://smartdatamodels.org/dateCreated",
  dateModified: "https://smartdatamodels.org/dateModified",
  description: "http://purl.org/dc/terms/description",
  id: "@id",
  location: "ngsi-ld:location",
  name: "https://smartdatamodels.org/name",
  "ngsi-ld": "https://uri.etsi.org/ngsi-ld/",
  owner: "https://smartdatamodels.org/owner",
  seeAlso: "https://smartdatamodels.org/seeAlso",
  source: "https://smartdatamodels.org/source",
  type: "@type",
  validFrom: "https://smartdatamodels.org/dataModel.OSLO/validFrom",
  validTo: "https://smartdatamodels.org/dataModel.OSLO/validTo",
  validity: "https://smartdatamodels.org/dataModel.OSLO/validity",
};

export const mapType = (type: string): string => {
  if (!type.startsWith("http")) {
    // nothing to do, it's not a URI schema
    return type;
  }
  const typeName = type.split("#")[1];
  if (!typeName) {
    // nothind to do, no type identifier
    return type;
  }
  return map[typeName] || type;
};
