"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */
describe("create", function(){
  const newJob = {
    title: 'Job',
    salary: 100,
    equity: 0.5,
    company_handle: 'c1'
  }
  const jobBadHandle = {
    title: 'Job No Handle',
    salary: 100,
    equity: 0.5,
    company_handle: 'not_a_handle'
  }

  test("works", async function(){
    let job = await Job.create(newJob);
    let jobId = Job.id;
    expect(job).toEqual(newJob);

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
        FROM jobs
        WHERE  id = ${jobId}`
    );
    expect(result.rows).toEqual([
      {
        id: jobId,
        title: 'Job',
        salary: 100,
        equity: 0.5,
        company_handle: 'c1'
      }
    ]);
  });

  test("bad request with non-existent company_handle", async function(){
    try{
      await Job.create(jobBadHandle);
      throw new Error("fail test, shouldn't get here")
    }catch(err){
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  })
})