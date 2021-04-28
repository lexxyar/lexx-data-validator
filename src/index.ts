class ValidationRegexp {
  static required = /^\S+.*$/
  static alfa = /^[A-Za-z]+$/
  static number = /^[0-9]+$/
  static email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
}

export interface DataValidatorRuleSchemaMap {
  [key: string]: DataValidatorRule
}

interface DataValidatorMessageMap {
  [key: number]: string
}

enum Operators {
  none, min, max, required, email, alpha, number
}

export class DataValidatorRule {
  private _email = false
  private _alpha = false
  private _number = false
  private _required = false
  private _min: number | null = null
  private _max: number | null = null
  private _message: Map<number, string> = new Map<number, string>()

  /**
   *
   * @deprecated @param _fieldName is deprecated since v 0.2.0
   */
  constructor() {
  }

  markAsRequired(): boolean {
    return this._required
  }

  min(nValue: number, sErrorMessage: string = ''): this {
    this._min = nValue
    this._message.set(Operators.min, sErrorMessage)
    return this
  }

  max(nValue: number, sErrorMessage: string = ''): this {
    this._max = nValue
    this._message.set(Operators.max, sErrorMessage)
    return this
  }

  email(sErrorMessage: string = ''): this {
    this._email = true
    this._message.set(Operators.email, sErrorMessage)
    return this
  }

  /**
   * @deprecated sins 0.1.2
   * string() method was deprecated. Use alpha() method instead
   */
  string(): this {
    return this.alpha()
  }

  alpha(sErrorMessage: string = ''): this {
    this._alpha = true
    this._message.set(Operators.alpha, sErrorMessage)
    return this
  }

  number(sErrorMessage: string = ''): this {
    this._number = true
    this._message.set(Operators.number, sErrorMessage)
    return this
  }

  required(sErrorMessage: string = ''): this {
    this._required = true
    this._message.set(Operators.required, sErrorMessage)
    return this
  }

  validate(mValue: any): boolean | string {
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

      if (this._alpha) {
        this._isAlpha(mValue);
      }

      if (this._number) {
        this._isNumber(mValue);
      }
    } catch (e: any) {
      return e.message
    }

    return true
  }

  private _is(sValue: any, regExp: RegExp, operator: Operators = Operators.none): boolean {
    const oRegexp: RegExp = new RegExp(regExp);
    const bRes = oRegexp.test(sValue);
    if (!bRes) {
      const sErrText = this._message.get(operator)
      throw new Error(sErrText ? sErrText : `${sValue} is not valid`)
    }
    return bRes
  }

  private _isEmail(sValue: any): boolean {
    return this._is(sValue, ValidationRegexp.email, Operators.email)
  }

  private _isAlpha(sValue: any): boolean {
    return this._is(sValue, ValidationRegexp.alfa, Operators.alpha)
  }

  private _isNumber(sValue: any): boolean {
    return this._is(sValue, ValidationRegexp.number, Operators.alpha)
  }

  private _isRequired(sValue: any): boolean {
    return this._is(sValue, ValidationRegexp.required, Operators.required)
  }

  private _isMin(nValue: any): boolean {
    const nVal = Number(nValue)
    if (this._min) {
      if (nVal < this._min) {
        const sErrText = this._message.get(Operators.min)
        throw new Error(sErrText ? sErrText : `${nVal} should be greater than or equal to ${this._min}`)
      }
      return nVal < this._min
    } else {
      return true
    }
  }

  private _isMax(nValue: any): boolean {
    const nVal = Number(nValue)
    if (this._max) {
      if (nVal > this._max) {
        const sErrText = this._message.get(Operators.max)
        throw new Error(sErrText ? sErrText : `${nVal} should be lower than or equal to ${this._max}`)
      }
      return nVal > this._max
    } else {
      return true
    }
  }
}

export function ValidationRule(): DataValidatorRule {
  return new DataValidatorRule()
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
    const aUsedRequired: string[] = []
    aKeys.forEach((sKey: string) => {
      const oSchemaItem = aSchemaKeys.find(itm => itm === sKey)
      if (oSchemaItem) {
        const oRule: DataValidatorRule = this._oSchema?.[oSchemaItem] as DataValidatorRule

        // @ts-ignore
        let mRes = oRule.validate(oObject[sKey])
        if (mRes !== true) {
          // @ts-ignore
          this._aError.push(mRes)
        }
        if (oRule.markAsRequired()) {
          aUsedRequired.push(sKey)
        }
        bGlobalRes = bGlobalRes && mRes === true
      }
    })

    // Required check existing
    const aSchemaRequired: string[] = []
    aSchemaKeys.forEach(sKey => {
      const oRule: DataValidatorRule = this._oSchema?.[sKey] as DataValidatorRule
      if (oRule.markAsRequired() && !aUsedRequired.includes(sKey)) {
        aSchemaRequired.push(sKey)
      }
    })

    // let intersection = aSchemaRequired.filter(x => aKeys.includes(x));
    let difference = aSchemaRequired.filter(x => !aKeys.includes(x));

    // console.log(aKeys, aSchemaRequired, intersection, difference)

    difference.forEach(item => {
      // @ts-ignore
      this._aError.push(`${item} is required`)
      bGlobalRes = false
    })

    return bGlobalRes
  }
}
