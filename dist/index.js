"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataValidator = exports.ValidationRule = exports.DataValidatorRule = void 0;
// export namespace LexxSoft {
class ValidationRegexp {
}
ValidationRegexp.alfa = /^[A-Za-z]+$/;
ValidationRegexp.number = /^[0-9]+$/;
ValidationRegexp.email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
class DataValidatorRule {
    constructor(_fieldName = '') {
        this._fieldName = _fieldName;
        this._email = false;
        this._string = false;
        this._number = false;
        this._required = false;
        this._min = null;
        this._max = null;
    }
    min(nValue) {
        this._min = nValue;
        return this;
    }
    max(nValue) {
        this._min = nValue;
        return this;
    }
    email() {
        this._email = true;
        return this;
    }
    string() {
        this._string = true;
        return this;
    }
    number() {
        this._number = true;
        return this;
    }
    required() {
        this._required = true;
        return this;
    }
    _is(sValue, regExp, sErrText = '') {
        const oRegexp = new RegExp(regExp);
        const bRes = oRegexp.test(sValue);
        if (!bRes) {
            throw new Error(sErrText ? sErrText : `${sValue} is not valid`);
        }
        return bRes;
    }
    _isEmail(sValue) {
        return this._is(sValue, ValidationRegexp.email);
    }
    _isString(sValue) {
        return this._is(sValue, ValidationRegexp.alfa, `${sValue} is not a string`);
    }
    _isNumber(sValue) {
        return this._is(sValue, ValidationRegexp.number, `${sValue} is not a number`);
    }
    _isRequired(sValue) {
        const sVal = sValue.toString().trim();
        if (!sVal) {
            throw new Error(`${this._fieldName} is required`);
        }
        return !!sVal;
    }
    _isMin(nValue) {
        const nVal = Number(nValue);
        // @ts-ignore
        if (nVal < this._min) {
            throw new Error(`${nVal} should be greater than or equal to ${this._min}`);
        }
        // @ts-ignore
        return nVal < this._min;
    }
    _isMax(nValue) {
        const nVal = Number(nValue);
        // @ts-ignore
        if (nVal > this._min) {
            throw new Error(`${nVal} should be lower than or equal to ${this._max}`);
        }
        // @ts-ignore
        return nVal > this._max;
    }
    validate(mValue) {
        try {
            if (this._email) {
                this._isEmail(mValue);
            }
            if (this._required) {
                this._isRequired(mValue);
            }
            if (this._min !== null) {
                this._isMin(mValue);
            }
            if (this._max !== null) {
                this._isMax(mValue);
            }
            if (this._string) {
                this._isString(mValue);
            }
            if (this._number) {
                this._isNumber(mValue);
            }
        }
        // @ts-ignore
        catch (e) {
            return e.message;
        }
        return true;
    }
}
exports.DataValidatorRule = DataValidatorRule;
function ValidationRule(sTitle = '') {
    return new DataValidatorRule(sTitle);
}
exports.ValidationRule = ValidationRule;
class DataValidator {
    constructor() {
        this._oSchema = null;
        this._aError = [];
    }
    schema(oSchema) {
        this._oSchema = oSchema;
        return this;
    }
    getErrors() {
        return this._aError;
    }
    validate(oObject) {
        if (!this._oSchema) {
            return true;
        }
        let bGlobalRes = true;
        const aKeys = Object.keys(oObject);
        const aSchemaKeys = Object.keys(this._oSchema);
        aKeys.forEach(sKey => {
            var _a;
            const oSchemaItem = aSchemaKeys.find(itm => itm === sKey);
            if (oSchemaItem) {
                const oRule = (_a = this._oSchema) === null || _a === void 0 ? void 0 : _a[oSchemaItem];
                // @ts-ignore
                let mRes = oRule.validate(oObject[sKey]);
                if (mRes !== true) {
                    // @ts-ignore
                    this._aError.push(mRes);
                }
                bGlobalRes = bGlobalRes && mRes === true;
            }
        });
        return true;
    }
}
exports.DataValidator = DataValidator;
// }
// import {DataValidator, DataValidatorRuleSchemaMap, ValidationRule} from "./DataValidator";
//
// const schema: DataValidatorRuleSchemaMap = {
//   email: ValidationRule().email(),
//   gender: ValidationRule('gender').required(),
//   age: ValidationRule('Age').string().min(12)
// }
//
// const data = {
//   name: 'John Doe',
//   age: 10,
//   email: 'jdoe@mail.@.com',
//   gender: ''
// }
//
// const oValidator = new DataValidator()
// oValidator.schema(schema).validate(data);
// console.log(oValidator.getErrors())
