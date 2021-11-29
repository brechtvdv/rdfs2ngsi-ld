const ContextParser = require('jsonld-context-parser').ContextParser;

const myParser = new ContextParser();

function getIdFromValue(value: any, index: number, idOfPrevEntity: string, relationshipWithPrevEntity: string, jsonKeyOfId: string, jsonKeyOfType: string) {
    if (typeof value === "string") return value; // value is only a string
    else if (value[jsonKeyOfId]) return value[jsonKeyOfId]; // identifier is provided
    // no identifier provided (blank node)
    else if (value[jsonKeyOfType]) return idOfPrevEntity + '/' + value[jsonKeyOfType] + '/' + index; // type is found
    else return idOfPrevEntity + '/' + relationshipWithPrevEntity + '/' + index; // use relationship name
}

// whether another key is used to refer to @id
function getJsonKeyOfId(myRawJsonLdContext: any) {
    for (const [key, value] of Object.entries(myRawJsonLdContext)) {
        if (value === "@id") return key;
    }
    return "@id";
}
// return the used json key for @type
function getJsonKeyOfType(myRawJsonLdContext: any) {
    for (const [key, value] of Object.entries(myRawJsonLdContext)) {
        if (value === "@type") return key;
    }
    return "@type";
}

export const ngsildify = async (input: any, context?: any): Promise<any[]> => {
    let resultArray: any = [];
    let result: any = {
        "@context": [
            "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
        ]
    };
    let myRawJsonLdContext; // context in object form
    let jsonKeyId = "@id"; // key that is used for the identifier; by default @id
    let jsonKeyType = "@type";
    let id: any;

    // add context parameter to result
    if (context) result["@context"].push(context);

    // process input object
    if (!Array.isArray(input) && typeof input === "object") {
        // fetch provided context and look up the json key that is used for identifiers
        for (const [key, value] of Object.entries(input)) {
            if (key === "@context") {
                // Add context
                if (Array.isArray(value)) result["@context"] = result["@context"].concat(value);
                else result["@context"].push(value);
            }
        }
        // Set jsonKeyOfId and jsonKeyOfType based on the resulting context
        const myContext = await myParser.parse(result["@context"]);
        myRawJsonLdContext = myContext.getContextRaw();
        const tempJsonKeyOfId = getJsonKeyOfId(myRawJsonLdContext);
        if (tempJsonKeyOfId) jsonKeyId = tempJsonKeyOfId;
        const tempJsonKeyOfType = getJsonKeyOfType(myRawJsonLdContext);
        if (tempJsonKeyOfType) jsonKeyType = tempJsonKeyOfType;

        // fetch id
        for (const [key, value] of Object.entries(input)) {
            if (key === jsonKeyId) {
                id = value;
            }
        }

        // We can use the parsed context to differentiate between identifiers, types, relationships and properties
        for (const [key, value] of Object.entries(input)) {
            if (key === "@context") {
                // already processed
            } else if (key === "@id" || key === "@type" || key === jsonKeyId || key === jsonKeyType) {
                // copy @id and @type
                result[key] = value;
            } else if (myRawJsonLdContext[key]) {
                if (myRawJsonLdContext[key]["@type"] === "@id") {
                    // relationship
                    let values = [];
                    if (!Array.isArray(value)) values.push(value);
                    for (let [i, v] of values.entries()) {
                        result[key] = {
                            "@type": "Relationship",
                            "object": getIdFromValue(v, i, id, key, jsonKeyId, jsonKeyType)
                        };
                        // create new entity recursively
                        resultArray = resultArray.concat(await ngsildify(v));
                    }
                } else {
                    // property
                    result[key] = {
                        "@type": "Property",
                        "value": value
                    }
                }
            } else {
                // no JSON-LD context found; just copy
                result[key] = value;
            }
        }

        resultArray.push(result);
    } else {
        for (let i in input) if (typeof input[i] === "object") resultArray = resultArray.concat(await ngsildify(input[i]));
    }

    return resultArray;
}
