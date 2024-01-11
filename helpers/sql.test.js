"use strict";

const { BadRequestError } = require("../expressError");
const { sqlForPartialUpdate } = require("./sql");

console.error = jest.fn();

describe('sqlForPartialUpdate function', function () {

  it("tests for valid input", function () {

    const result = sqlForPartialUpdate(
      { firstName: 'Aliyah', isAdmin: true },
      { firstName: "first_name", isAdmin: "is_admin" }
    );

    expect(result).toEqual({
      setCols: '"first_name"=$1, "is_admin"=$2',
      values: ['Aliyah', true]
    });
  });

  it("tests for invalid input", function () {

    let result = "Shouldn't reach here";

    try {
      sqlForPartialUpdate({}, { firstName: "first_name", age: "age" });
      throw new Error("fail test, shouldn't get here");

    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
    expect(result).toEqual("Shouldn't reach here");
  });

  it("tests for empty jsToSql input", function () {
    const result = sqlForPartialUpdate({ firstName: 'Aliyah', isAdmin: true }, {});

    expect(result).toEqual(
      {
        setCols: '"firstName"=$1, "isAdmin"=$2',
        values: ['Aliyah', true]
      });
  });

});