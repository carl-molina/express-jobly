"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");

const jobNewSchema = require("../schemas/jobNew.json");
// const jobUpdateSchema = require("../schemas/jobUpdate.json");
// const jobSearchSchema = require("../schemas/jobSearch.json");

const router = new express.Router();

/** POST / { job } =>  { job }
 *
 * job should be { title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next){
  const validator = jsonschema.validate(
    req.body,
    jobNewSchema,
    {required: true}
  );

  const { title, salary, equity, companyHandle } = req.body;

  if(!validator.valid){
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const job = await Job.create({ title, salary, equity, companyHandle });
  return res.status(201).json({ job});
})

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, companyHandle }, ...] }
 *
 *
 * Authorization required: none
 */

router.get("/", async function(req, res, next){
  const jobs = await Job.findAll();
  debugger;
  // TODO: check in jobly_test db

  return res.json({ jobs });
})


/** GET /[id]  =>  { job }
 *
 *  Job is  {job: { id, title, salary, equity, companyHandle }
 *
 *
 * Authorization required: none
 */
router.get("/:id", async function (req, res, next){
  const job = await Job.get(req.params.id);
  return res.json({ job })
})
module.exports = router;