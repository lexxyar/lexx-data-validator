export interface DataValidatorRuleSchemaMap {
    [key: string]: DataValidatorRule;
}
export declare class DataValidatorRule {
    private _fieldName;
    private _email;
    private _string;
    private _number;
    private _required;
    private _min;
    private _max;
    constructor(_fieldName?: string);
    min(nValue: number): DataValidatorRule;
    max(nValue: number): DataValidatorRule;
    email(): DataValidatorRule;
    string(): DataValidatorRule;
    number(): DataValidatorRule;
    required(): DataValidatorRule;
    private _is;
    private _isEmail;
    private _isString;
    private _isNumber;
    private _isRequired;
    private _isMin;
    private _isMax;
    validate(mValue: any): boolean | string;
}
export declare function ValidationRule(sTitle?: string): DataValidatorRule;
export declare class DataValidator {
    private _oSchema;
    private _aError;
    schema(oSchema: DataValidatorRuleSchemaMap): DataValidator;
    getErrors(): string[];
    validate(oObject: Object): boolean;
}
