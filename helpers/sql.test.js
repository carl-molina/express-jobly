"use strict"
const { sqlForPartialUpdate } = require("./sql");



describe('sqlForPartialUpdate function', function() {

  it("tests for valid input", function () {

    const result = sqlForPartialUpdate(
      {firstName: 'Aliyah', age: 32},
      {firstName: "first_name", age: "age"}
    );

    expect(result).toEqual({setCols: "\"first_name\"=$1, \"age\"=$2",
    values: ['Aliyah', 32]})
  });

  it("tests for invalid input", function () {

    const result = sqlForPartialUpdate(
      {firstName: 'Aliyah', age: 32},
      {firstName: "first_name", age: "age"}
    );

    expect(result).toEqual({setCols: "\"first_name\"=$1, \"age\"=$2",
    values: ['Aliyah', 32]})
  });

});



// "use strict";

// const jwt = require("jsonwebtoken");
// const { createToken } = require("./tokens");
// const { SECRET_KEY } = require("../config");

// describe("createToken", function () {
//   test("works: not admin", function () {
//     const token = createToken({ username: "test", is_admin: false });
//     const payload = jwt.verify(token, SECRET_KEY);
//     expect(payload).toEqual({
//       iat: expect.any(Number),
//       username: "test",
//       isAdmin: false,
//     });
//   });

//   test("works: admin", function () {
//     const token = createToken({ username: "test", isAdmin: true });
//     const payload = jwt.verify(token, SECRET_KEY);
//     expect(payload).toEqual({
//       iat: expect.any(Number),
//       username: "test",
//       isAdmin: true,
//     });
//   });

//   test("works: default no admin", function () {
//     // given the security risk if this didn't work, checking this specifically
//     const token = createToken({ username: "test" });
//     const payload = jwt.verify(token, SECRET_KEY);
//     expect(payload).toEqual({
//       iat: expect.any(Number),
//       username: "test",
//       isAdmin: false,
//     });
//   });
// });
