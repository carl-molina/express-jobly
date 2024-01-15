"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
// const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for jobs */

class Job{
  /**Create a job (from data), update db, return new job data
   *
   * data should be {title, salary, equity, company_handle}
   *
   * Returns {id, title, salary, equity, company_handle}
   *
   * Throws BadRequestError if no matching company_handle
   */
  static async create({ title, salary, equity, companyHandle }){

    const companyPreCheck = await db.query(`
      SELECT handle
      FROM companies
      WHERE handle = $1`,
    [companyHandle]);
    const company = companyPreCheck.rows[0];

if (!company) throw new NotFoundError(`No company: ${companyHandle}`);

    const result = await db.query(`
    INSERT INTO  jobs (title,
                      salary,
                      equity,
                      company_handle)
    VALUES ($1, $2, $3, $4)
    RETURNING
        id,
        title,
        salary,
        equity,
        company_handle AS "companyHandle"`,
        [title, salary, equity, companyHandle]
    );
    const job = result.rows[0];

    return job;

  }
  /**Finds all jobs.
   *
   * Returns all job data [{id, title, salary, equity, company_handle},...]
   *
   * */

  static async findAll() {

    const jobsRes = await db.query(
      `SELECT id, title, salary, equity, company_handle AS "companyHandle"
      FROM jobs`
    )

    return jobsRes.rows;


    // TODO: for GET /companies/:handle later
    // const jobsForCompany = await db.query(
    //   `SELECT j.id, j.title, j.salary, j.equity
    //   FROM jobs AS j
    //   INNER JOIN companies ON c.handle = j.company_handle`
    // )

    // jobsRes.jobs = jobsForCompany;



    // TODO: filtering version of findAll:
    // const { title, minSalary, hasEquity } = query;

    // let q = `
    //   SELECT handle,
    //           name,
    //         description,
    //         num_employees AS "numEmployees",
    //         logo_url AS "logoUrl"
    //   FROM companies`;

    // const { whereClause, queryParams } = this._createSearchQueryAndParams(
    //   { nameLike, minEmployees, maxEmployees });

    // let companiesRes;
    // if (whereClause.length > 0) {
    //   q += whereClause;
    //   companiesRes = await db.query(q, queryParams);
    // } else {
    //   companiesRes = await db.query(q);
    // }

    // return companiesRes.rows;
  }

  /**Given a job id, return data about that job
   *
   * Returns {title, salary, equity, company_handle}
  */
  static async get(id) {
    const jobsRes = await db.query(`
    SELECT id,
          title,
           salary,
           equity,
           company_handle AS "companyHandle"
    FROM jobs
    WHERE id = $1`, [id]);

const job = jobsRes.rows[0];

if (!job) throw new NotFoundError(`No job: ${id}`);

return job;
  }

  /**Given a job id and data, update company with data
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {id, title, salary, equity, company_handle}
   */
  static async update(id, data){
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `
        UPDATE jobs
        SET ${setCols}
        WHERE id = ${idVarIdx}
        RETURNING id,
                  title,
                  salary,
                  equity, company_handle as "companyHandle"`;
    const result = await db.query(querySql, [...values, id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }

  /**Given a job id, remove job from db; returns undefined.
   *
   * Throws NotFoundError if job not found.
   */

  static async remove(id) {
    const result = await db.query(`
        DELETE
        FROM jobs
        WHERE id = $1
        RETURNING id`, [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }
}

module.exports =  Job;