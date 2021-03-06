import {JsonLdContext} from "jsonld-context-parser";

export class Ngsildify {
    private resultArray: any = [];
    private jsonLdContext: JsonLdContext = "";

    public constructor() {
    }

    public async transform(input: any): Promise<any[]> {
        let context: any = {
            "@context": [
                "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
            ],
        };
        let rootObjects: any[] = [];
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
                        context["@context"] = context["@context"].concat(
                            input[i]["@context"]
                        );
                    }
                    // Set context to be used across entities
                    this.jsonLdContext = context["@context"];
                    rootObjects = rootObjects.concat(await this.handleRoot(input[i]));
                }
            }
        } else {
            if (input["@context"]) {
                // Add context from input to result
                context["@context"] = context["@context"].concat(input["@context"]);
                // Set context to be used across entities
                this.jsonLdContext = context["@context"];
            }

            rootObjects.push(await this.handleRoot(input));
        }

        this.resultArray.push(...rootObjects);
        return this.resultArray;
    }

    protected async handleRoot(input: any): Promise<any> {
        if (typeof input === "object" && (input["@id"] || input["id"])) {
            const id = this.getIdFromValue(input, "", "", 1);
            let result: any = {
                "@context": this.jsonLdContext,
            };
            for (const [key, value] of Object.entries(input)) {
                if (key != "@context") {
                    if (Array.isArray(value)) {
                        let expandedValueResult = [];
                        for (let v in value)
                            expandedValueResult.push(await this.handleValue(value[v], id, key, parseInt(v)));
                        result[key] = expandedValueResult;
                    } else if (
                        key === "@id" ||
                        key === "id" ||
                        key === "@type" ||
                        key === "type"
                    ) {
                        result[key] = value;
                    } else {
                        result[key] = await this.handleValue(value, id, key, 1);
                    }
                }
            }
            return result;
        }
        return input;
    }

    protected async handleValue(value: any, prevId: string, relation: string, index:number): Promise<any> {
        if (
            (typeof value === "object" &&
            relation !== "@type" &&
            relation !== "type")
        ) {
            const id = this.getIdFromValue(value, prevId, relation, index);
            if (!value["id"] && !value["@id"]) value["@id"] = id; // make sure value has an identifier
            // create new result from this object and return the relationship
            const newResult = await this.handleRoot(value);
            this.resultArray.push(newResult);
            return {
                "@type": "Relationship",
                object: id,
            };
        } else if (
            typeof value === "string" && value.startsWith('http')
        ) {
            return {
                "@type": "Relationship",
                object: value,
            }
        } else if (
            typeof value === "string" &&
            relation !== "@type" &&
            relation !== "type"
        ) {
            // create new property from this string and return the value
            return {
                "@type": "Property",
                value: value,
            };
        } else {
            return value;
        }
    }

    protected getIdFromValue(value: any, prevId: string, relation: string, index: number) {
        if (typeof value === "string") return value;
        // value is only a string
        else if (value["@id"]) return value["@id"];
        else if (value["id"]) return value["id"];
        else return prevId + "/" + relation.toLowerCase() + "/" + index;
    }
}

