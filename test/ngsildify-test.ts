import { ngsildify } from '../lib/ngsildify';

describe('RDFS 2 NGSI-LD conversion library', () => {

    beforeAll(() => {

    });

    beforeEach(() => {

    })

    test('Ngsildify should be a function', () => {
        expect(ngsildify).toBeInstanceOf(Function);
    });

    test('Ngsildify should return an object', async () => {
        const returnedValue = await ngsildify({});
        expect(returnedValue).toBeInstanceOf(Object);
    });

    test('Ngsildify should create an array with NGSI-LD compliant objects', async () => {
        const input = {
            "@context": ["https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld"],
            "@id": "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
            "@type": "Observation",
            "Observation.observedProperty": "http://www.wikidata.org/entity/Q48035511",
            "Observation.hasSimpleResult": "8.10 ug/m3"
        };
        const returnedValue = await ngsildify(input);
        console.log(returnedValue)
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
});
