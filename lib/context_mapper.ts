// hardcoded map of type values to use during transformation
// from the OSLO Passenger Hubs semantic data model to the OSLO SDM
const map: { [name: string]: string } = {
  ///// type: ResourceReport
  "https://purl.eu/ns/mobility/passenger-transport-hubs#ResourceReport": 
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport",
  // ResourceReport.actuator
  "https://purl.eu/ns/mobility/passenger-transport-hubs#propulsion":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.actuator",
  // ResourceReport.location
  "https://purl.eu/ns/mobility/passenger-transport-hubs#location":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.location",
  // ResourceReport.meansOfTransport
  "https://purl.eu/ns/mobility/passenger-transport-hubs#Mobiliteitsdienst.vervoermiddel":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.meansOfTransport",
  // ResourceReport.number
  "https://purl.eu/ns/mobility/passenger-transport-hubs#number":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.number",
  // ResourceReport.service
  "https://purl.eu/ns/mobility/passenger-transport-hubs#service":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.service",
  // ResourceReport.status
  "https://purl.eu/ns/mobility/passenger-transport-hubs#status":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.status",
  // ResourceReport.type
  "http://purl.org/dc/terms/type":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.type",
  // ResourceReport.reportTime
  "http://purl.org/dc/elements/1.1/date":
    "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.reportTime",
  ///// type: BicycleParkingStation
  "http://schema.mobivoc.org/#BicycleParkingStation":
    "https://smartdatamodels.org/dataModel.OSLO/BicycleParkingStation",
  // name
  "http://schema.org/name": "https://smartdatamodels.org/name",
  // ParkingFacility.capacity
  "http://schema.org/capacity":
    "https://smartdatamodels.org/dataModel.OSLO/ParkingFacility.capacity",
  // InfrastructureElement.geometry
  "http://www.w3.org/ns/locn#geometry":
    "https://smartdatamodels.org/dataModel.OSLO/InfrastructureElement.geometry",
  ///// type: Capacity (This type definition is missing in the SDM)
  "http://schema.org/Capacity":
    "https://smartdatamodels.org/dataModel.OSLO/Capacity",
  // Capacity.total (This property definition is missing in the SDM)
  "http://schema.org/totalCapacity":
    "https://smartdatamodels.org/dataModel.OSLO/Capacity.total" 
};

export const mapType = (type: string): string => {
  return map[type] || type;
};
