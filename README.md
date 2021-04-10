# lexx-data-validator
This is simple data validator

# Installation
```shell script
npm i lexx-data-validator
```

# Usage
```ts
import {LexxSoft} from "lexx-data-validator";
import DataValidatorRuleSchemaMap = LexxSoft.DataValidatorRuleSchemaMap;
import DataValidator = LexxSoft.DataValidator;
import ValidationRule = LexxSoft.ValidationRule;


const schema: DataValidatorRuleSchemaMap = {
  email: ValidationRule().email(),
  gender: ValidationRule('gender').required(),
  age: ValidationRule('Age').string().min(12)
}

const data = {
  name: 'John Doe',
  age: 10,
  email: 'jdoe@mail.@.com',
  gender: ''
}

const oValidator = new DataValidator()
oValidator.schema(schema).validate(data);
console.log(oValidator.getErrors())
```