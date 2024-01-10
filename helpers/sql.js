"use strict";

const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.


/**
 *  sqlForPartialUpdate:
 *
 *  TODO: Takes in a an object(dataToUpdate) and stores its keys in keys.
 *  dataToUpdate -> { firstName: 'Aliya', age: 32 }
 *
 *  keys = ['firstName', 'age']
 *
 *  Takes in an object (jsToSql)
 *  Coerces jsCamelCase to SQL snake_case
 *
 *  FINDS colName in jsToSql array/object and returns the snake_case version
 *
 *  TODO: jsToSql takes in an object { firstName: first_name, age: age }
 *
 *
 *  returns an object:
 *    {
 *      setCols: '"first_name"=$1', '"age"=$2'
 *      values: ['Aliyah', 32]
 *    }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  console.log('This is keys', keys);
  console.log('This is Object.keys(dataToUpdate)', Object.keys(dataToUpdate));
  if (keys.length === 0) {
    console.error('This is err: BadRequestError: No Data');
    throw new BadRequestError("No Data");
  }

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
