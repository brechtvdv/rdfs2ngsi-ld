export interface NgsildifyOptions {
    versionOfPath?: string;
    timestampPath?: string;
}
export declare class Ngsildify {
    private resultArray;
    private jsonLdContext;
    private timestampPath;
    private versionOfPath;
    private observedAt;
    constructor(options?: NgsildifyOptions);
    transform(input: any): Promise<any[]>;
    protected handleRoot(input: any): Promise<any>;
    private removeCRS;
    protected handleValue(value: any, prevId: string, relation: string, index: number): Promise<any>;
    protected getIdFromValue(value: any, prevId: string, relation: string, index: number): string;
}
