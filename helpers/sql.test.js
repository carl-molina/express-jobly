"use strict";

const { sqlForPartialUpdate } = require("./sql");

console.error = jest.fn();

describe('sqlForPartialUpdate function', function () {

  it("tests for valid input", function () {

    const result = sqlForPartialUpdate(
      { firstName: 'Aliyah', age: 32 },
      { firstName: "first_name", age: "age" }
      // TODO: don't pass in age yourself
    );

    expect(result).toEqual({
      setCols: "\"first_name\"=$1, \"age\"=$2",
      // TODO: use single quotes at ends of strings to get rid of delimiter
      values: ['Aliyah', 32]
    });
  });

  it("tests for invalid input", function () {

    let result = 'Should be reset';
    // TODO: ^ can check if result is still this
    try {
      result = sqlForPartialUpdate({}, { firstName: "first_name", age: "age" });
      // shouldn't get here:
      expect(true).toEqual(false);
    } catch (err) {
      expect(err.status).toEqual(400);
      expect(err.message).toEqual("No Data");
    }
    // expect(result).toEqual(undefined);
  });

  it("tests for empty jsToSql input", function () {
    const result = sqlForPartialUpdate({ firstName: 'Aliyah', age: 32 }, {});

    expect(result).toEqual(
      {
        setCols: "\"firstName\"=$1, \"age\"=$2",
        values: ['Aliyah', 32]
      });
  });

});