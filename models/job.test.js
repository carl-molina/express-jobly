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
    companyHandle: 'c1'
  }
  const jobBadHandle = {
    title: 'Job No Handle',
    salary: 100,
    equity: 0.5,
    companyHandle: 'not_a_handle'
  }

  test("works", async function(){
    const job = await Job.create(newJob);
    console.log('This is job', job);
    const jobId = job.id;
    expect(job).toEqual({
      id: jobId,
      title: "Job",
      salary: 100,
      equity: "0.5",
      companyHandle: 'c1'
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
        FROM jobs
        WHERE  id = $1`, [jobId]
    );
    expect(result.rows).toEqual([
      {
        id: jobId,
        title: 'Job',
        salary: 100,
        equity: "0.5",
        companyHandle: 'c1'
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
  });
});
/************************************** findAll */

describe("findAll", function () {

  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: jobs[0].id,
        title: "Job1",
        salary: 1000,
        equity: "1.0",
        company_handle: 'c1'
      },
      {
        id: jobs[1].id,
        title: "Job2",
        salary: 2000,
        equity: "0.5",
        company_handle: "c2"
      },
      {
        id: jobs[2].id,
        title: "Job3",
        salary: 3000,
        equity: "0.2",
        company_handle: "c3"
      }
    ]);
  });
});

/************************************** get */

describe("get", function () {

  const newJob = {
    title: 'Job',
    salary: 100,
    equity: 0.5,
    companyHandle: 'c1'
  }

  test("works", async function () {

    const newJobData = await Job.create(newJob);
    const newJobId = newJobData.id;
    const job = await Job.get(newJobId);
    expect(job).toEqual({
      title: "Job",
      salary: 100,
      equity: "0.5",
      companyHandle: 'c1'
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.get("nope");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "NewTitle",
    salary: 4000,
    equity: 10.0,
  };

  const updateDataSetNulls = {
    title: "NewTitle",
    salary: null,
    equity: null,
  };

  test("works", async function() {
    let job = await Job.update(1, updateData);
    expect(job).toEqual({
      id: 1,
      company_handle: 'c1',
      ...updateData,
    });

    const result = await db.query(
        `SELECT id, title, salary, equity, company_handle
        FROM jobs
        WHERE id = 1`
    );

    expect(result.rows).toEqual([{
      id: 1,
      title: "NewTitle",
      salary: 4000,
      equity: 10.0,
      company_handle: "c1"
    }]);
  });

  test("works: null fields", async function () {
    let job = await Job.update(1, updateDataSetNulls);
    expect(job).toEqual({
      id: 1,
      company_handle: 'c1',
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
      FROM jobs
      WHERE id = 1`
  );

    expect(result.rows).toEqual([{
      id: 1,
      title: "NewTitle",
      salary: null,
      equity: null,
      company_handle: "c1"
    }]);
  });

  test("not found if no such job", async function () {
    try {
      await Job.update("nope", updateData);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect (err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update("c1", {});
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function() {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
      "SELECT id FROM jobs WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Job.remove("nope");
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});