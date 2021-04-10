const {ValidationRule} = require("../dist");
const {DataValidator} = require("../dist");

const oValidator = new DataValidator()
let data = {}

const schema = {
  email: ValidationRule().email(),
  alpha: ValidationRule().alpha(),
  number: ValidationRule().number(),
  min: ValidationRule().min(2),
  max: ValidationRule().max(6),
  between: ValidationRule().min(8).max(10),
  required: ValidationRule().required()
}

describe('Validator', function () {
  it('E-mail [jdoe@mail.com] is valid', function () {
    data = {email: 'jdoe@mail.com'}
    return oValidator.schema(schema).validate(data)
  });

  it(`E-mail [jdoe@ma@il.com] is NOT valid`, () => {
    data = {email: 'jdoe@ma@il.com'}
    return !oValidator.schema(schema).validate(data)
  })

  it(`[My name is John] is NOT alpha`, () => {
    data = {alpha: 'My name is John'}
    return !oValidator.schema(schema).validate(data)
  })

  it(`[MyNameIsJohn] is alpha`, () => {
    data = {alpha: 'MyNameIsJohn'}
    return oValidator.schema(schema).validate(data)
  })

  it(`[6] is number`, () => {
    data = {number: 6}
    return oValidator.schema(schema).validate(data)
  })

  it(`['6'] is number too`, () => {
    data = {number: '6'}
    return oValidator.schema(schema).validate(data)
  })

  it(`[0] is lower than min(2)`, () => {
    data = {min: 0}
    return !oValidator.schema(schema).validate(data)
  })

  it(`[4] is greater than min(2)`, () => {
    data = {min: 4}
    return oValidator.schema(schema).validate(data)
  })

  it(`[5] is lower than max(6)`, () => {
    data = {max: 5}
    return oValidator.schema(schema).validate(data)
  })

  it(`[8] is greater than max(6)`, () => {
    data = {max: 9}
    return !oValidator.schema(schema).validate(data)
  })

  it(`[5] is NOT between min(8) and max(10)`, () => {
    data = {between: 5}
    return oValidator.schema(schema).validate(data) === false
  })

  it(`[9] is between min(8) and max(10)`, () => {
    data = {between: 9}
    return oValidator.schema(schema).validate(data)
  })
});