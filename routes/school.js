import express from "express"
import { wrapAsync } from "../utils/wrapAsync.js";
import { addSchool, createSchoolsTable, listSchools } from "../controllers/school.js";
const router = express.Router({ mergeParams: true });

router.route('/')
.get((req, res) => res.send('route'))

router.route('/createdb')
.get(wrapAsync(createSchoolsTable))

router.route('/addSchool')
.post(wrapAsync(addSchool))

router.route('/listSchools')
.get(wrapAsync(listSchools))

export default router