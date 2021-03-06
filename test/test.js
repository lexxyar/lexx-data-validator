const {strictEqual} = require("assert");
const {ValidationRule} = require("../dist");
const {DataValidator} = require("../dist");

const oValidator = new DataValidator()
let data = {}

const schema = {
  email: ValidationRule().email('E-mail is not valid'),
  alpha: ValidationRule().alpha('Should be an alpha'),
  number: ValidationRule().number('Should be a number'),
  min: ValidationRule().min(2),
  max: ValidationRule().max(6),
  between: ValidationRule().min(8).max(10),
  // field_not_passed: ValidationRule('field_not_passed').required()
}

const requiredSchema = {
  name: ValidationRule().alpha('Alphas only').required('Required')
}

describe('Validator', function () {
  describe('Validation', function () {
    it('E-mail [jdoe@mail.com] is valid', function () {
      data = {email: 'jdoe@mail.com'}

      strictEqual(oValidator.schema(schema).validate(data), true)
    });

    it(`E-mail [jdoe@ma@il.com] is NOT valid`, () => {
      data = {email: 'jdoe@ma@il.com'}
      strictEqual(oValidator.schema(schema).validate(data), false)
    })

    it(`[My name is John] is NOT alpha`, () => {
      data = {alpha: 'My name is John'}
      strictEqual(oValidator.schema(schema).validate(data), false)
    })

    it(`[MyNameIsJohn] is alpha`, () => {
      data = {alpha: 'MyNameIsJohn'}
      strictEqual(oValidator.schema(schema).validate(data), true)
    })

    it(`[6] is number`, () => {
      data = {number: 6}
      strictEqual(oValidator.schema(schema).validate(data), true)
    })

    it(`['6'] is number too`, () => {
      data = {number: '6'}
      strictEqual(oValidator.schema(schema).validate(data), true)
    })

    it(`[0] is lower than min(2)`, () => {
      data = {min: 0}
      strictEqual(oValidator.schema(schema).validate(data), false)
    })

    it(`[4] is greater than min(2)`, () => {
      data = {min: 4}
      strictEqual(oValidator.schema(schema).validate(data), true)
    })

    it(`[5] is lower than max(6)`, () => {
      data = {max: 5}
      strictEqual(oValidator.schema(schema).validate(data), true)
    })

    it(`[8] is greater than max(6)`, () => {
      data = {max: 9}
      strictEqual(oValidator.schema(schema).validate(data), false)
    })

    it(`[5] is NOT between min(8) and max(10)`, () => {
      data = {between: 5}
      strictEqual(oValidator.schema(schema).validate(data), false)
    })

    it(`[9] is between min(8) and max(10)`, () => {
      data = {between: 9}
      strictEqual(oValidator.schema(schema).validate(data), true)
    })

    it(`[field_not_passed] is missing in data object and should be an error when required`, () => {
      data = {another_field: 'Miss me?'}
      const schema1 = {
        field_not_passed: ValidationRule('field_not_passed').required()
      }
      strictEqual(oValidator.schema(schema1).validate(data), false)
    })

    it(`Empty is not valid. Data is required`, () => {
      data = {name: ''}
      strictEqual(oValidator.schema(requiredSchema).validate(data), false)
    })

    it(`[12John] should contain alphas only`, () => {
      data = {name: '12John'}
      strictEqual(oValidator.schema(requiredSchema).validate(data), false)
    })

    it(`[John] are alpha and filled`, () => {
      data = {name: 'John'}
      strictEqual(oValidator.schema(requiredSchema).validate(data), true)
    })

    describe('Messages', function () {
      it(`Correct message format`, () => {
        data = {max: 9}
        oValidator.clearErrors()
        oValidator.schema(schema).validate(data)
        strictEqual(JSON.stringify(oValidator.getErrors()), `[{"key":"max","message":"9 should be lower than or equal to 6"}]`)
      })
    })
  })
});