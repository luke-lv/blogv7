
$import("lib/jobs.js");
$import("jobs/testPos.js");
function main(){
    var job = new Jobs();
    job.add("testPos");
    job.start();
}
