import {JsonLdContext} from "jsonld-context-parser";

export default class Ngsildify {
    private resultArray: any = [];
    private jsonLdContext: JsonLdContext;

    public constructor() {
    }

    public async ngsildify(input: any): Promise<any[]> {
        if (Array.isArray(input)) {
            for (let i in input) if (typeof input[i] === "object") this.resultArray = this.resultArray.concat(await this.ngsildify(input[i]));
        } else if (typeof input === "object" && (input["@id"] || input["id"])) {
            const id = this.getIdFromValue(input, "",  "", 0);
            let result: any = {
                "@context": [
                    "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"
                ]
            };
            // Add context from input to result
            if (input["@context"]) result["@context"] = result["@context"].concat(input["@context"]);
            // Set context to be used across entities
            if (!this.jsonLdContext) this.jsonLdContext = result["@context"];

            // fetch provided context and look up the json key that is used for identifiers
            for (const [key, value] of Object.entries(input)) {
                if (key != "@context") {
                    if (Array.isArray(value)) {
                        let expandedValueResult = [];
                        for (let v in value) expandedValueResult.push(await this.expandValue(value[v], id, key, parseInt(v)));
                        result[key] = expandedValueResult;
                    } else if (key === "@id" || key === "id" || key === "@type" || key === "type") {
                        result[key] = value;
                    } else {
                        result[key] = await this.expandValue(value, id, key, 1);
                    }
                }
            }
            this.resultArray.push(result);
        }
        return this.resultArray;
    }

    protected async expandValue(value: any, prevId: string, relation: string, index: number) {
        // Property when value is not a string starting with http://
        //                     has a @value key
        if (Array.isArray(value)) for (let v in value) this.expandValue(value[v], prevId, relation, parseInt(v))
        if ((typeof value === "string" && !value.startsWith('http'))
            || (typeof value === "object" && value["@value"])) {
            return {
                "@type": "Property",
                "value": value
            }
        } else {
            // Relationship
            const id = this.getIdFromValue(value, prevId, relation, index);
            if (id) {
                // if (!(value instanceof "string") && !value["@id"] && !value["id"]) value["@id"] = id; // make sure identifier is filled in
                // const expandedValue = await this.ngsildify(value);
                return {
                    "@type": "Relationship",
                    "object": id
                }
            }
        }
    }

    protected getIdFromValue(value: any, prevId: string, relation: string, index: number) {
        if (typeof value === "string") return value; // value is only a string
        else if (value['@id']) return value['@id'];
        else if (value['id']) return value['id'];
        else return prevId + "/" + relation + "/" + index;
    }
}

