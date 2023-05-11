import { Ngsildify } from "../lib/ngsildify";

describe("RDFS 2 NGSI-LD conversion library", () => {
  let ngsildify: Ngsildify;

  beforeEach(() => {
    ngsildify = new Ngsildify();
  });

  test("Ngsildify should have a function", () => {
    expect(ngsildify.transform).toBeInstanceOf(Function);
  });

  test("Ngsildify should return an object", async () => {
    const returnedValue = await ngsildify.transform({});
    expect(returnedValue).toBeInstanceOf(Object);
  });

  test("Ngsildify should transform a simple SSN observation", async () => {
    const input = {
      "@context": [
        "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
      ],
      "@id": "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
      "@type": "Observation",
      "Observation.observedProperty":
        "http://www.wikidata.org/entity/Q48035511",
      "Observation.hasSimpleResult": "8.10 ug/m3",
    };
    const returnedValue = await ngsildify.transform(input);
    const expectedOutput = [
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        id: "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
        type: "Observation",
        "Observation.observedProperty": {
          type: "Relationship",
          object: "http://www.wikidata.org/entity/Q48035511",
        },
        "Observation.hasSimpleResult": {
          type: "Property",
          value: "8.10 ug/m3",
        },
      },
    ];
    expect(returnedValue).toEqual(expectedOutput);
  });

  test("Ngsildify should transform and materialize a versioned entity", async () => {
    const input = {
      "@context": [
        "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
      ],
      "@id":
        "https://lodi.ilabt.imec.be/odala/data/observations/16584343831#2023-04-12T15%3A35%3A21",
      "@type": "Observation",
      "http://purl.org/dc/terms/isVersionOf":
        "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
      "http://www.w3.org/ns/prov#generatedAtTime": "2023-04-12T15:35:21",
      "Observation.observedProperty":
        "http://www.wikidata.org/entity/Q48035511",
      "Observation.hasSimpleResult": "8.10 ug/m3",
    };
    const returnedValue = await ngsildify.transform(input);
    const expectedOutput = [
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        id: "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
        type: "Observation",
        observedAt: "2023-04-12T15:35:21",
        "Observation.observedProperty": {
          type: "Relationship",
          object: "http://www.wikidata.org/entity/Q48035511",
          observedAt: "2023-04-12T15:35:21",
        },
        "Observation.hasSimpleResult": {
          type: "Property",
          value: "8.10 ug/m3",
          observedAt: "2023-04-12T15:35:21",
        },
      },
    ];
    expect(returnedValue).toEqual(expectedOutput);
  });

  test("Ngsildify should transform an array of simple SSN observations", async () => {
    const input = [
      {
        "@context": [
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        "@id": "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
        "@type": "Observation",
        "Observation.observedProperty":
          "http://www.wikidata.org/entity/Q48035511",
        "Observation.hasSimpleResult": "8.10 ug/m3",
      },
      {
        "@context": [
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        "@id": "https://lodi.ilabt.imec.be/odala/data/observations/16584343832",
        "@type": "Observation",
        "Observation.observedProperty":
          "http://www.wikidata.org/entity/Q48035511",
        "Observation.hasSimpleResult": "8.14 ug/m3",
      },
    ];
    const returnedValue = await ngsildify.transform(input);
    const expectedOutput = [
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        id: "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
        type: "Observation",
        "Observation.observedProperty": {
          type: "Relationship",
          object: "http://www.wikidata.org/entity/Q48035511",
        },
        "Observation.hasSimpleResult": {
          type: "Property",
          value: "8.10 ug/m3",
        },
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        id: "https://lodi.ilabt.imec.be/odala/data/observations/16584343832",
        type: "Observation",
        "Observation.observedProperty": {
          type: "Relationship",
          object: "http://www.wikidata.org/entity/Q48035511",
        },
        "Observation.hasSimpleResult": {
          type: "Property",
          value: "8.14 ug/m3",
        },
      },
    ];
    expect(returnedValue).toEqual(expectedOutput);
  });

  test("Ngsildify should transform an SSN ObservationCollection and decompose the collection into an array of NGSI-LD compliant objects", async () => {
    const input = {
      "@context": [
        "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
      ],
      "@id": "https://lodi.ilabt.imec.be/odala/data/observations/8245000782",
      "@type": "ObservationCollection",
      "ObservationCollection.hasFeatureOfInterest": {
        "@type": "SpatialSamplingFeature",
        "SamplingFeature.sampledFeature":
          "http://www.wikidata.org/entity/Q56245086",
        "http://www.w3.org/ns/locn#geometry": {
          "@type": "Geometry",
          "Geometry.asWkt":
            "<http://www.opengis.net/def/crs/EPSG/0/4979> POINT(50.86127751869 4.28904533370 45.9)",
        },
      },
      "ObservationCollection.madeBySensor": {
        "@type": ["Sensor", "Device"],
        "@id": "https://lodi.ilabt.imec.be/odala/data/sensors/24653",
        "Device.manufacturerName": "Nova Fitness",
        "Device.modelName": "SDS011",
      },
      "ObservationCollection.resultTime": "2021-12-15T10:14:05Z",
    };
    const returnedValue = await ngsildify.transform(input);
    const expectedOutput = [
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        type: "Geometry",
        "Geometry.asWkt": {
          type: "Property",
          value:
            "<http://www.opengis.net/def/crs/EPSG/0/4979> POINT(50.86127751869 4.28904533370 45.9)",
        },
        id: "https://lodi.ilabt.imec.be/odala/data/observations/8245000782/observationcollection.hasfeatureofinterest/1/https://smartdatamodels.org/datamodel.oslo/infrastructureelement.geometry/1",
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        type: "SpatialSamplingFeature",
        "SamplingFeature.sampledFeature": {
          type: "Relationship",
          object: "http://www.wikidata.org/entity/Q56245086",
        },
        "https://smartdatamodels.org/dataModel.OSLO/InfrastructureElement.geometry": {
          type: "Relationship",
          object:
            "https://lodi.ilabt.imec.be/odala/data/observations/8245000782/observationcollection.hasfeatureofinterest/1/https://smartdatamodels.org/datamodel.oslo/infrastructureelement.geometry/1",
        },
        id: "https://lodi.ilabt.imec.be/odala/data/observations/8245000782/observationcollection.hasfeatureofinterest/1",
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        type: ["Sensor", "Device"],
        id: "https://lodi.ilabt.imec.be/odala/data/sensors/24653",
        "Device.manufacturerName": {
          type: "Property",
          value: "Nova Fitness",
        },
        "Device.modelName": {
          type: "Property",
          value: "SDS011",
        },
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
          "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
        ],
        id: "https://lodi.ilabt.imec.be/odala/data/observations/8245000782",
        type: "ObservationCollection",
        "ObservationCollection.hasFeatureOfInterest": {
          type: "Relationship",
          object:
            "https://lodi.ilabt.imec.be/odala/data/observations/8245000782/observationcollection.hasfeatureofinterest/1",
        },
        "ObservationCollection.madeBySensor": {
          type: "Relationship",
          object: "https://lodi.ilabt.imec.be/odala/data/sensors/24653",
        },
        "ObservationCollection.resultTime": {
          type: "Property",
          value: "2021-12-15T10:14:05Z",
        },
      },
    ];
    expect(returnedValue).toEqual(expectedOutput);
  });

  test("Ngsildify should transform a simple SKOS Concept", async () => {
    const input = {
      "@id": "https://blue-bike.be/resourcereports/type/92#2022-09-08T10:12:26",
      "@type": "http://www.w3.org/2004/02/skos/core#Concept",
      "http://www.w3.org/2004/02/skos/core#prefLabel": {
        "@language": "en",
        "@value": "vehicle",
      },
    };
    const returnedValue = await ngsildify.transform(input);
    const expectedOutput = [
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        ],
        id: "https://blue-bike.be/resourcereports/type/92#2022-09-08T10:12:26",
        type: "http://www.w3.org/2004/02/skos/core#Concept",
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          type: "Property",
          value: "vehicle",
        },
      },
    ];
    expect(returnedValue).toEqual(expectedOutput);
  });

  test("Ngsildify should transform a complex OSLO transport hubs object", async () => {
    // Set custom timestampPath
    ngsildify = new Ngsildify({
      timestampPath: "http://purl.org/dc/elements/1.1/date",
    });
    const input = {
      "@id": "https://blue-bike.be/resourcereports/103#2022-09-08T10:11:03",
      "@type":
        "https://purl.eu/ns/mobility/passenger-transport-hubs#ResourceReport",
      "http://purl.org/dc/elements/1.1/date": {
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
        "@value": "2022-09-08T10:11:03",
      },
      "http://purl.org/dc/terms/type": {
        "@id":
          "https://blue-bike.be/resourcereports/type/103#2022-09-08T10:11:03",
        "@type": "http://www.w3.org/2004/02/skos/core#Concept",
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          "@language": "en",
          "@value": "vehicle",
        },
      },
      "https://purl.eu/ns/mobility/passenger-transport-hubs#Mobiliteitsdienst.vervoermiddel":
        {
          "@id":
            "https://blue-bike.be/resourcereports/vervoermiddel/103#2022-09-08T10:11:03",
          "@type": "http://www.w3.org/2004/02/skos/core#Concept",
          "http://www.w3.org/2004/02/skos/core#prefLabel": {
            "@language": "en",
            "@value": "bicycle",
          },
        },
      "https://purl.eu/ns/mobility/passenger-transport-hubs#location": {
        "@id": "https://blue-bike.be/stations/103#2022-09-08T10:11:03",
        "@type": "http://schema.mobivoc.org/#BicycleParkingStation",
        "http://purl.org/dc/terms/isVersionOf": {
          "@id": "https://blue-bike.be/stations/103",
        },
        "http://schema.mobivoc.org/#capacity": {
          "@id":
            "https://blue-bike.be/stations/capacity/103#2022-09-08T10:11:03",
          "@type": "http://schema.mobivoc.org/#Capacity",
          "http://schema.mobivoc.org/#totalCapacity": {
            "@type": "http://www.w3.org/2001/XMLSchema#integer",
            "@value": "27",
          },
          "https://purl.eu/ns/mobility/passenger-transport-hubs#vehicleType": {
            "@id":
              "https://blue-bike.be/stations/vehicleType/103#2022-09-08T10:11:03",
            "@type": "http://www.w3.org/2004/02/skos/core#Concept",
            "http://www.w3.org/2004/02/skos/core#prefLabel": {
              "@language": "en",
              "@value": "bicycle",
            },
          },
        },
        "http://schema.org/name": {
          "@language": "en",
          "@value": "Station Geel",
        },
        "http://www.w3.org/ns/locn#geometry": {
          "@id":
            "https://blue-bike.be/stations/geometry/103#2022-09-08T10:11:03",
          "@type": "http://www.w3.org/ns/locn#Geometry",
          "http://www.opengis.net/ont/geosparql#asWKT": {
            "@type": "http://www.opengis.net/ont/geosparql#wktLiteral",
            "@value": "POINT(4.988778000000 51.168778000000)",
          },
        },
      },
      "https://purl.eu/ns/mobility/passenger-transport-hubs#number": {
        "@type": "http://www.w3.org/2001/XMLSchema#integer",
        "@value": "12",
      },
      "https://purl.eu/ns/mobility/passenger-transport-hubs#propulsion": {
        "@id":
          "https://blue-bike.be/resourcereports/actuator/103#2022-09-08T10:11:03",
        "@type": "http://www.w3.org/2004/02/skos/core#Concept",
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          "@language": "en",
          "@value": "human",
        },
      },
      "https://purl.eu/ns/mobility/passenger-transport-hubs#service": {
        "@id": "https://blue-bike.be/#me",
      },
      "https://purl.eu/ns/mobility/passenger-transport-hubs#status": {
        "@id":
          "https://blue-bike.be/resourcereports/status/103#2022-09-08T10:11:03",
        "@type": "http://www.w3.org/2004/02/skos/core#Concept",
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          "@language": "en",
          "@value": "available",
        },
      },
    };
    const returnedValue = await ngsildify.transform(input);
    const expectedOutput = [
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        ],
        id: "https://blue-bike.be/resourcereports/type/103#2022-09-08T10:11:03",
        observedAt: "2022-09-08T10:11:03",
        type: "http://www.w3.org/2004/02/skos/core#Concept",
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          type: "Property",
          value: "vehicle",
          observedAt: "2022-09-08T10:11:03",
        },
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        ],
        id: "https://blue-bike.be/resourcereports/vervoermiddel/103#2022-09-08T10:11:03",
        observedAt: "2022-09-08T10:11:03",
        type: "http://www.w3.org/2004/02/skos/core#Concept",
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          type: "Property",
          value: "bicycle",
          observedAt: "2022-09-08T10:11:03",
        },
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        ],
        id: "https://blue-bike.be/stations/vehicleType/103#2022-09-08T10:11:03",
        observedAt: "2022-09-08T10:11:03",
        type: "http://www.w3.org/2004/02/skos/core#Concept",
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          type: "Property",
          value: "bicycle",
          observedAt: "2022-09-08T10:11:03",
        },
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        ],
        id: "https://blue-bike.be/stations/geometry/103#2022-09-08T10:11:03",
        observedAt: "2022-09-08T10:11:03",
        type: "http://www.w3.org/ns/locn#Geometry",
        "http://www.opengis.net/ont/geosparql#asWKT": {
          type: "Property",
          value: "POINT(4.988778000000 51.168778000000)",
          observedAt: "2022-09-08T10:11:03",
        },
        location: {
          type: "GeoProperty",
          value: {
            type: "Point",
            coordinates: [4.988778, 51.168778],
          },
        },
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        ],
        type: "https://smartdatamodels.org/dataModel.OSLO/BicycleParkingStation",
        "https://smartdatamodels.org/dataModel.OSLO/ParkingFacility.capacity": {
          type: "Property",
          value: "27",
          observedAt: "2022-09-08T10:11:03",
        },
        "https://smartdatamodels.org/name": {
          type: "Property",
          value: "Station Geel",
          observedAt: "2022-09-08T10:11:03",
        },
        "https://smartdatamodels.org/dataModel.OSLO/InfrastructureElement.geometry": {
          type: "Relationship",
          object:
            "https://blue-bike.be/stations/geometry/103#2022-09-08T10:11:03",
          observedAt: "2022-09-08T10:11:03",
        },
        id: "https://blue-bike.be/stations/103",
        observedAt: "2022-09-08T10:11:03",
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        ],
        id: "https://blue-bike.be/resourcereports/actuator/103#2022-09-08T10:11:03",
        observedAt: "2022-09-08T10:11:03",
        type: "http://www.w3.org/2004/02/skos/core#Concept",
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          type: "Property",
          value: "human",
          observedAt: "2022-09-08T10:11:03",
        },
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        ],
        id: "https://blue-bike.be/resourcereports/status/103#2022-09-08T10:11:03",
        observedAt: "2022-09-08T10:11:03",
        type: "http://www.w3.org/2004/02/skos/core#Concept",
        "http://www.w3.org/2004/02/skos/core#prefLabel": {
          type: "Property",
          value: "available",
          observedAt: "2022-09-08T10:11:03",
        },
      },
      {
        "@context": [
          "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        ],
        id: "https://blue-bike.be/resourcereports/103#2022-09-08T10:11:03",
        observedAt: "2022-09-08T10:11:03",
        type: "https://smartdatamodels.org/dataModel.OSLO/ResourceReport",
        "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.reportTime": {
          type: "Property",
          value: "2022-09-08T10:11:03",
          observedAt: "2022-09-08T10:11:03",
        },
        "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.type": {
          type: "Relationship",
          object:
            "https://blue-bike.be/resourcereports/type/103#2022-09-08T10:11:03",
          observedAt: "2022-09-08T10:11:03",
        },
        "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.meansOfTransport":
          {
            type: "Relationship",
            object:
              "https://blue-bike.be/resourcereports/vervoermiddel/103#2022-09-08T10:11:03",
            observedAt: "2022-09-08T10:11:03",
          },
        "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.location": {
          type: "Relationship",
          object: "https://blue-bike.be/stations/103",
          observedAt: "2022-09-08T10:11:03",
        },
        "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.number": {
          type: "Property",
          value: "12",
          observedAt: "2022-09-08T10:11:03",
        },
        "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.actuator": {
          type: "Relationship",
          object:
            "https://blue-bike.be/resourcereports/actuator/103#2022-09-08T10:11:03",
          observedAt: "2022-09-08T10:11:03",
        },
        "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.service": {
          type: "Relationship",
          object: "https://blue-bike.be/#me",
          observedAt: "2022-09-08T10:11:03",
        },
        "https://smartdatamodels.org/dataModel.OSLO/ResourceReport.status": {
          type: "Relationship",
          object:
            "https://blue-bike.be/resourcereports/status/103#2022-09-08T10:11:03",
          observedAt: "2022-09-08T10:11:03",
        },
      },
    ];
    expect(returnedValue).toEqual(expectedOutput);
  });
});
