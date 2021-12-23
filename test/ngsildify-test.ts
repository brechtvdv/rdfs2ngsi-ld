import { Ngsildify } from '../lib/ngsildify';

describe('RDFS 2 NGSI-LD conversion library', () => {
    let ngsildify: Ngsildify;
    beforeAll(() => {
        ngsildify = new Ngsildify();
    });

    beforeEach(() => {

    })

    test('Ngsildify should have a function', () => {
        expect(ngsildify.transform).toBeInstanceOf(Function);
    });

    test('Ngsildify should return an object', async () => {
        const returnedValue = await ngsildify.transform({});
        expect(returnedValue).toBeInstanceOf(Object);
    });

    test('Ngsildify should transform a simple SSN observation', async () => {
        const input = {
            "@context": ["https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld"],
            "@id": "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
            "@type": "Observation",
            "Observation.observedProperty": "http://www.wikidata.org/entity/Q48035511",
            "Observation.hasSimpleResult": "8.10 ug/m3"
        };
        const returnedValue = await ngsildify.transform(input);
        const expectedOutput = [{
            "@context": [
                "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
                "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld"
            ],
            "@id": "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
            "@type": "Observation",
            "Observation.observedProperty": {
                "@type": "Relationship",
                "object": "http://www.wikidata.org/entity/Q48035511"
            },
            "Observation.hasSimpleResult": {
                "@type": "Property",
                "value": "8.10 ug/m3"
            }
        }];
        expect(returnedValue).toEqual(expectedOutput);
    });

    test('Ngsildify should transform an SSN ObservationCollection and decompose the collection into an array of NGSI-LD compliant objects', async () => {
        const input = {
            "@context": ["https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld"],
            "@id": "https://lodi.ilabt.imec.be/odala/data/observations/8245000782",
            "@type": "ObservationCollection",
            "ObservationCollection.hasFeatureOfInterest": {
                "@type": "SpatialSamplingFeature",
                "SamplingFeature.sampledFeature": "http://www.wikidata.org/entity/Q56245086",
                "http://www.w3.org/ns/locn#geometry": {
                    "@type": "Geometry",
                    "Geometry.asWkt": "<http://www.opengis.net/def/crs/EPSG/0/4979> POINT(50.86127751869 4.28904533370 45.9)"
                }
            },
            "ObservationCollection.madeBySensor": {
                "@type": [
                    "Sensor",
                    "Device"
                ],
                "@id": "https://lodi.ilabt.imec.be/odala/data/sensors/24653",
                "Device.manufacturerName": "Nova Fitness",
                "Device.modelName": "SDS011"
            },
            "ObservationCollection.resultTime": "2021-12-15T10:14:05Z"
        };
        const returnedValue = await ngsildify.transform(input);
        const expectedOutput = [{
            "@context": [
                "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
                "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld"
            ],
            "@type": "Geometry",
            "Geometry.asWkt": {
                "@type": "Property",
                "value": "<http://www.opengis.net/def/crs/EPSG/0/4979> POINT(50.86127751869 4.28904533370 45.9)"
            },
            "@id": "https://lodi.ilabt.imec.be/odala/data/observations/8245000782/observationcollection.hasfeatureofinterest/1/http://www.w3.org/ns/locn#geometry/1"
        },
            {
                "@context": [
                    "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
                    "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld"
                ],
                "@type": "SpatialSamplingFeature",
                "SamplingFeature.sampledFeature": {
                    "@type": "Relationship",
                    "object": "http://www.wikidata.org/entity/Q56245086"
                },
                "http://www.w3.org/ns/locn#geometry": {
                    "@type": "Relationship",
                    "object": "https://lodi.ilabt.imec.be/odala/data/observations/8245000782/observationcollection.hasfeatureofinterest/1/http://www.w3.org/ns/locn#geometry/1"
                },
                "@id": "https://lodi.ilabt.imec.be/odala/data/observations/8245000782/observationcollection.hasfeatureofinterest/1"
            },
            {
                "@context": [
                    "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
                    "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld"
                ],
                "@type": [
                    "Sensor",
                    "Device"
                ],
                "@id": "https://lodi.ilabt.imec.be/odala/data/sensors/24653",
                "Device.manufacturerName": {
                    "@type": "Property",
                    "value": "Nova Fitness"
                },
                "Device.modelName": {
                    "@type": "Property",
                    "value": "SDS011"
                }
            },
            {
                "@context": [
                    "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
                    "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld"
                ],
                "@id": "https://lodi.ilabt.imec.be/odala/data/observations/8245000782",
                "@type": "ObservationCollection",
                "ObservationCollection.hasFeatureOfInterest": {
                    "@type": "Relationship",
                    "object": "https://lodi.ilabt.imec.be/odala/data/observations/8245000782/observationcollection.hasfeatureofinterest/1"
                },
                "ObservationCollection.madeBySensor": {
                    "@type": "Relationship",
                    "object": "https://lodi.ilabt.imec.be/odala/data/sensors/24653"
                },
                "ObservationCollection.resultTime": {
                    "@type": "Property",
                    "value": "2021-12-15T10:14:05Z"
                }
            }
        ];
        expect(returnedValue).toEqual(expectedOutput);
    });
});
