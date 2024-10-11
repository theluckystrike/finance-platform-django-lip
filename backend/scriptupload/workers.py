from rq import Queue, SimpleWorker, Worker
from rq.job import Job
from rq.job import JobStatus
from .models import Script, Report

excStatus = Script.ExecutionStatus


class SimpleJobWorker(SimpleWorker):
    def perform_job(self, job: Job, queue: Queue) -> bool:

        result = super().perform_job(job, queue)

        if job.get_status() == JobStatus.FAILED:
            if len(job.args) > 0:
                if isinstance(job.args[0], Script):
                    script = job.args[0]
                    script.set_status(excStatus.FAILURE, "Please try again")
                    # script.error_message = "Please try again"
                    # script.save(update_fields=['error_message'])
                elif isinstance(job.args[0], Report):
                    report = job.args[0]
                    report.status = "failure"
                    report.save(update_fields=['status'])
        return result


class JobWorker(Worker):
    def perform_job(self, job: Job, queue: Queue) -> bool:

        result = super().perform_job(job, queue)

        if job.get_status() == JobStatus.FAILED:
            if len(job.args) > 0:
                if isinstance(job.args[0], Script):
                    script = job.args[0]
                    script.set_status(excStatus.FAILURE, "Please try again")
                elif isinstance(job.args[0], Report):
                    report = job.args[0]
                    report.status = "failure"
                    report.save(update_fields=['status'])
        return result
