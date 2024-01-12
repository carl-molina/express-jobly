"use strict";

const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");
let testJobs;

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query("DELETE FROM jobs")

  await db.query(`
      INSERT INTO companies(handle, name, num_employees, description, logo_url)
      VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
             ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
             ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  await db.query(`
      INSERT INTO users(username,
                        password,
                        first_name,
                        last_name,
                        email)
      VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
             ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
      RETURNING username`, [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
  ]);

  await db.query(`
  INSERT INTO jobs (title, salary, equity, company_handle)
  VALUES ('Job1', 1000, 1.0, 'c1'),
         ('Job2', 2000, 0.5, 'c2'),
         ('Job3', 3000, 0.2, 'c3')`);

  // TODO: unsuccessfully exported test jobs as variable to use in job.test
  // testJobs = await db.query(`
  // INSERT INTO jobs (title, salary, equity, company_handle)
  // VALUES ('Job1', 1000, 1.0, 'c1'),
  //        ('Job2', 2000, 0.5, 'c2'),
  //        ('Job3', 3000, 0.2, 'c3')
  //     RETURNING id`);
  // testJobs = testJobs.rows
  // console.log("Test Jobs in test common=", testJobs)
  // return testJobs;
  // let job1Id = jobs.rows[0];
  // let jobId2 = jobs.rows[1];
  // let jobId3 = jobs.rows[2];
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  // testJobs
  // jobId1,
  // jobId2,
  // jobId3
};