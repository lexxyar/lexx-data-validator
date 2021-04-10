// export namespace LexxSoft {
class ValidationRegexp {
  static alfa = /^[A-Za-z]+$/
  static number = /^[0-9]+$/
  static email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
}

export interface DataValidatorRuleSchemaMap {
  [key: string]: DataValidatorRule
}

export class DataValidatorRule {
  private _email = false
  private _string = false
  private _number = false
  private _required = false
  private _min: number | null = null
  private _max: number | null = null

  constructor(private _fieldName = '') {
  }

  min(nValue: number): DataValidatorRule {
    this._min = nValue
    return this
  }

  max(nValue: number): DataValidatorRule {
    this._min = nValue
    return this
  }

  public email(): DataValidatorRule {
    this._email = true
    return this
  }

  public string(): DataValidatorRule {
    this._string = true
    return this
  }

  public number(): DataValidatorRule {
    this._number = true
    return this
  }

  public required(): DataValidatorRule {
    this._required = true
    return this
  }

  private _is(sValue: any, regExp: RegExp, sErrText: string = ''): boolean {
    const oRegexp: RegExp = new RegExp(regExp);
    const bRes = oRegexp.test(sValue);
    if (!bRes) {
      throw new Error(sErrText ? sErrText : `${sValue} is not valid`)
    }
    return bRes
  }

  private _isEmail(sValue: any): boolean {
    return this._is(sValue, ValidationRegexp.email)
  }

  private _isString(sValue: any): boolean {
    return this._is(sValue, ValidationRegexp.alfa, `${sValue} is not a string`)
  }

  private _isNumber(sValue: any): boolean {
    return this._is(sValue, ValidationRegexp.number, `${sValue} is not a number`)
  }

  private _isRequired(sValue: any): boolean {
    const sVal = sValue.toString().trim()
    if (!sVal) {
      throw new Error(`${this._fieldName} is required`)
    }
    return !!sVal
  }

  private _isMin(nValue: any): boolean {
    const nVal = Number(nValue)
    // @ts-ignore
    if (nVal < this._min) {
      throw new Error(`${nVal} should be greater than or equal to ${this._min}`)
    }
    // @ts-ignore
    return nVal < this._min
  }

  private _isMax(nValue: any): boolean {
    const nVal = Number(nValue)
    // @ts-ignore
    if (nVal > this._min) {
      throw new Error(`${nVal} should be lower than or equal to ${this._max}`)
    }
    // @ts-ignore
    return nVal > this._max
  }

  public validate(mValue: any): boolean|string {
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
    catch (e: Error) {
      return e.message
    }

    return true
  }
}

export function ValidationRule(sTitle = ''): DataValidatorRule {
  return new DataValidatorRule(sTitle)
}

export class DataValidator {
  private _oSchema: DataValidatorRuleSchemaMap | null = null
  private _aError = []

  schema(oSchema: DataValidatorRuleSchemaMap): DataValidator {
    this._oSchema = oSchema
    return this
  }

  public getErrors(): string[] {
    return this._aError
  }

  public validate(oObject: Object): boolean {
    if (!this._oSchema) {
      return true
    }
    let bGlobalRes = true
    const aKeys = Object.keys(oObject)
    const aSchemaKeys: string[] = Object.keys(this._oSchema)
    aKeys.forEach(sKey => {
      const oSchemaItem = aSchemaKeys.find(itm => itm === sKey)
      if (oSchemaItem) {
        const oRule: DataValidatorRule = this._oSchema?.[oSchemaItem] as DataValidatorRule

        // @ts-ignore
        let mRes = oRule.validate(oObject[sKey])
        if (mRes !== true) {
          // @ts-ignore
          this._aError.push(mRes)
        }
        bGlobalRes = bGlobalRes && mRes === true
      }
    })
    return true
  }
}
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
