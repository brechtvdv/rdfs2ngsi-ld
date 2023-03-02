"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ngsildify = void 0;
class Ngsildify {
    constructor() {
        this.resultArray = [];
        this.jsonLdContext = "";
    }
    async transform(input) {
        this.resultArray = [];
        let context = {
            "@context": [
                "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
            ],
        };
        let rootObjects = [];
        if (Array.isArray(input)) {
            for (let i in input) {
                // reset context on new object!
                context = {
                    "@context": [
                        "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
                    ],
                };
                if (typeof input[i] === "object") {
                    if (input[i]["@context"]) {
                        // Add context from input to result
                        context["@context"] = context["@context"].concat(input[i]["@context"]);
                    }
                    // Set context to be used across entities
                    this.jsonLdContext = context["@context"];
                    rootObjects = rootObjects.concat(await this.handleRoot(input[i]));
                }
            }
        }
        else {
            if (input["@context"]) {
                // Add context from input to result
                context["@context"] = context["@context"].concat(input["@context"]);
            }
            // Set context to be used across entities
            this.jsonLdContext = context["@context"];
            const tempHandleRoot = await this.handleRoot(input);
            if (tempHandleRoot != null)
                rootObjects.push(tempHandleRoot);
        }
        this.resultArray.push(...rootObjects);
        return this.resultArray;
    }
    async handleRoot(input) {
        if (typeof input === "object" && (input["@id"] || input["id"])) {
            const id = this.getIdFromValue(input, "", "", 1);
            let result = {
                "@context": this.jsonLdContext,
            };
            for (const [key, value] of Object.entries(input)) {
                if (key != "@context") {
                    if (Array.isArray(value) && key != "@type" && key != "type") {
                        let expandedValueResult = [];
                        for (let v in value)
                            expandedValueResult.push(await this.handleValue(value[v], id, key, parseInt(v)));
                        result[key] = expandedValueResult;
                    }
                    else if (key === "@id" ||
                        key === "id" ||
                        key === "@type" ||
                        key === "type") {
                        result[key] = value;
                    }
                    else {
                        result[key] = await this.handleValue(value, id, key, 1);
                    }
                }
            }
            if (!result["@type"])
                result["@type"] = "Entity"; // fallback when no @type found
            return result;
        }
        return input;
    }
    async handleValue(value, prevId, relation, index) {
        if ((typeof value === "object" &&
            relation !== "@type" &&
            relation !== "type")) {
            const typeOfValue = value["@type"];
            const startsWith = typeof typeOfValue.startsWith === 'function';
            // if the value is actually typed as Literal or XMLSchema type, don't handle it as root
            if ((value["@language"]) ||
                (typeOfValue && startsWith && (typeOfValue.startsWith('http://www.w3.org/2000/01/rdf-schema#Literal') ||
                    typeOfValue.startsWith('http://www.w3.org/2001/XMLSchema#') ||
                    typeOfValue.startsWith('http://www.opengis.net/ont/geosparql#wktLiteral') ||
                    typeOfValue.startsWith('http://w3id.org/lindt/custom_datatypes#')))) {
                const valueOfValue = value["@value"];
                const result = {
                    "@type": "Property",
                    value: {
                        "@value": valueOfValue,
                        "@type": typeOfValue
                    },
                };
                if (value["@language"]) {
                    result["@language"] = value["@language"];
                }
                return result;
            }
            else {
                // go deeper
                const id = this.getIdFromValue(value, prevId, relation, index);
                if (!value["id"] && !value["@id"])
                    value["@id"] = id; // make sure value has an identifier
                // create new result from this object and return the relationship
                const newResult = await this.handleRoot(value);
                if (newResult && newResult["@type"])
                    this.resultArray.push(newResult);
                return {
                    "@type": "Relationship",
                    object: id,
                };
            }
        }
        else if (typeof value === "string" && value.startsWith('http')) {
            return {
                "@type": "Relationship",
                object: value,
            };
        }
        else if (typeof value === "string" &&
            relation !== "@type" &&
            relation !== "type") {
            // create new property from this string and return the value
            return {
                "@type": "Property",
                value: value,
            };
        }
        else {
            return value;
        }
    }
    getIdFromValue(value, prevId, relation, index) {
        if (typeof value === "string")
            return value;
        // value is only a string
        else if (value["@id"])
            return value["@id"];
        else if (value["id"])
            return value["id"];
        else
            return prevId + "/" + relation.toLowerCase() + "/" + index;
    }
}
exports.Ngsildify = Ngsildify;
//# sourceMappingURL=ngsildify.js.map