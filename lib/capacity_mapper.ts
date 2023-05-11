// Adapts the output in order to override how capacity is presented.
// Certain integrations are limited to using capacity as a direct property of BycicleParkingStation.
export const mapCapacity = (rootObjects: any[]): any[] => {
  // find the root (BycicleParkingStation) object
  const station = rootObjects.find(
    (obj) =>
      obj["type"] ===
      "https://smartdatamodels.org/dataModel.OSLO/BicycleParkingStation"
  );
  if (!station) {
    // oups, nothing we can do
    return rootObjects;
  }
  // find the id of the capacity relationship
  const capacityId =
    station[
      "https://smartdatamodels.org/dataModel.OSLO/ParkingFacility.capacity"
    ]?.object;
  if (!capacityId) {
    // oups, nothing we can do
    return rootObjects;
  }

  const capacity = rootObjects.find((obj) => obj["id"] === capacityId);
  if (!capacity) {
    // oups, nothing we can do
    return rootObjects;
  }

  const capacityProperty =
    capacity["https://smartdatamodels.org/dataModel.OSLO/Capacity.total"];
  if (!capacityProperty) {
    // oups, nothing we can do
    return rootObjects;
  }

  // replace the relationshiop in the root object
  station[
    "https://smartdatamodels.org/dataModel.OSLO/ParkingFacility.capacity"
  ] = { ...capacityProperty };

  // return all members excluding the capacity
  return rootObjects.filter((obj) => obj["id"] !== capacityId);
};
