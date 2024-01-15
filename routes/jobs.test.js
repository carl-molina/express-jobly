"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const Job = require("../models/job")

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
  jobIds
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function(){
  const newJob = {
    	title: "new job 3",
	    salary: 100,
	    equity: 0.5,
	    companyHandle: "c1"
  };

  const jobNoCompany = {
    title: "new job 3",
    salary: 100,
    equity: 0.5,
    companyHandle: "fake"
};

test("bad request for no such company", async function () {
  try {
    const resp = await request(app)
    .post("/jobs")
    .send(jobNoCompany)
    .set("authorization", `Bearer ${adminToken}`);
  } catch (err) {
    expect(err.statusCode).toEqual(404);
    expect(err.toString()).toContain("No company: fake");
  }

});

  test("ok for admin", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "new job 3",
        salary: 100,
        equity: "0.5",
        companyHandle: "c1"
      }
    });
  });

  test("unauth - not admin", async function(){
    const resp = await request(app)
      .post("/companies")
      .send(newJob)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/companies")
      .send({
        title: "new",
        salary: 10,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });


  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/companies")
      .send({
        ...newJob,
        salary: "invalid-salary",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
})

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
        [
          {
            id: expect.any(Number),
            title: "c1 job",
            salary: 10,
            equity: "0.2",
            companyHandle: "c1"
          },
          {
            id: expect.any(Number),
            title: "c2 job",
            salary: 10,
            equity: "0.2",
            companyHandle: "c2"
          },
          {
            id: expect.any(Number),
            title: "c3 job",
            salary: 10,
            equity: "0.2",
            companyHandle: "c3"
          },
        ],
    });
  });

});

describe("GET /jobs/:id", function () {
  const newJob = {
    title: "new job 4",
    salary: 100,
    equity: 0.5,
    companyHandle: "c1"
}

  test("works for anon", async function () {
    let newJobData = await Job.create(newJob);
    let newJobId = newJobData.id;

    const resp = await request(app).get(`/jobs/${newJobId}`);
    expect(resp.body).toEqual({
      job: {
        id: newJobId,
        title: "new job 4",
        salary: 100,
        equity: "0.5",
        companyHandle: "c1"
      }
    });
  });


  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/0`);
    expect(resp.statusCode).toEqual(404);
  });
});