export declare class Ngsildify {
    private resultArray;
    private jsonLdContext;
    constructor();
    transform(input: any): Promise<any[]>;
    protected handleRoot(input: any): Promise<any>;
    protected handleValue(value: any, prevId: string, relation: string, index: number): Promise<any>;
    protected getIdFromValue(value: any, prevId: string, relation: string, index: number): any;
}
