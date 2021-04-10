# lexx-data-validator

![GitHub package.json version](https://img.shields.io/github/package-json/v/lexxyar/lexx-data-validator)
![GitHub](https://img.shields.io/github/license/lexxyar/lexx-data-validator)
![GitHub all releases](https://img.shields.io/github/downloads/lexxyar/lexx-data-validator/total)

This is simple data validator

# Installation
```shell script
npm i lexx-data-validator
```

# Usage
```ts
import {DataValidator, DataValidatorRuleSchemaMap, ValidationRule} from "lexx-data-validator";

const data = {
  name: 'John Doe',
  age: 10,
  email: 'jdoe@mail.@.com',
  gender: ''
}

const schema: DataValidatorRuleSchemaMap = {
  email: ValidationRule().email(),
  gender: ValidationRule('gender').required(),
  age: ValidationRule('Age').min(12)
}

const oValidator = new DataValidator()
oValidator.schema(schema).validate(data);
console.log(oValidator.getErrors())
```

Result is:

```js
[
  '10 should be greater than or equal to 12',
  'jdoe@mail.@.com is not valid',
  'gender is required'
]
```

# Features

# Change log
Version|Changes
---|---
0.1.3|If field is required and it not pass with data object - it is an error
0.1.2|**string** is deprecated. Use **alpha** method instead
0.1.1|min, max, email, string, number, required