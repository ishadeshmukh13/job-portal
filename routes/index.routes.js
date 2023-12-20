import candidateRoutes from "./candidate.routes.js";
import  recruiterRoutes from "./recruiter.routes.js"

function intialize (app) {
app.use('/candidate',candidateRoutes)
app.use('/recruiter',recruiterRoutes)
}

export default intialize;