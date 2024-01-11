"use strict";

const { BadRequestError } = require("../expressError");

/**
 *  sqlForPartialUpdate:
 *
 *  Takes in a an object(dataToUpdate) like:
 *    { firstName: 'Aliya', age: 32 }
 *
 *  Takes in an object (jsToSql) like:
 *    { firstName: first_name, age: age }
 *
 *  Calling this function helps format the SET clause of a SQL UPDATE.
 *
 *  FINDS colName in jsToSql object and returns the snake_case version

 *  returns an object:
 *    {
 *      setCols: '"first_name"=$1', '"age"=$2'
 *      values: ['Aliyah', 32]
 *    }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) {
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
