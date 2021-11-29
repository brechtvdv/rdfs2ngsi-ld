# rdfs2ngsild.js
JS library to convert RDFS objects (in JSON-LD format) to NGSI-LD compliant JSON-LD objects

## What is the difference between an RDFS object and NGSI-LD object?

An example of an RDFS object:
```json
{
  "@context": "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
  "@id": "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
  "@type": "Observation",
  "Observation.observedProperty": "http://www.wikidata.org/entity/Q48035511",
  "Observation.hasSimpleResult": "8.10 ug/m3"
}
``` 

Should be transformed to an NGSI-LD compliant object:
```json
{
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
}
```
## Use it

```bash
npm install @brechtvdv/rdfs2ngsi-ld.js
```

We expect an JSON-LD object at the input.

```javascript
import { ngsildify } from 'rdfs2ngsi-ld.js';

const input = {
    "@context": "https://brechtvdv.github.io/demo-data/OSLO-airAndWater-Core-ap.jsonld",
    "@id": "https://lodi.ilabt.imec.be/odala/data/observations/16584343831",
    "@type": "Observation",
    "Observation.observedProperty": "http://www.wikidata.org/entity/Q48035511",
    "Observation.hasSimpleResult": "8.10 ug/m3"
};

console.log(ngsildify(input));

// Output will be an array of NGSI-LD compliant entities
[{
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
}]
```

## What it does

* Loop over the input object when it's an array
* Parse the JSON-LD context and add it with NGSI-LD's context
* loop over all the properties of the JSON object
* Based on the context:
  * if the value of the property is an identifier, add a NGSI-LD relationship
    * create an identifier if not provided, based on the type (or relationship name) and the index
    * ngsildify the linked object recursively
  * else add a NGSI-LD property

