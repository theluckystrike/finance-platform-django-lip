from rq import Queue, SimpleWorker
from rq.job import Job
import psutil
from rq.job import JobStatus
# import tracemalloc
import gc
from .models import Script, Report


class CustomWorker(SimpleWorker):
    def perform_job(self, job: Job, queue: Queue) -> bool:
        process = psutil.Process()
        memory_usage = process.memory_info()
        memory_usage_mb = memory_usage.rss / (1024 * 1024)
        self.log.info(
            f"Job {job.id} about to run. Memory usage: {memory_usage_mb:.2f} MB")

        result = super().perform_job(job, queue)

        memory_usage = process.memory_info()
        memory_usage_mb = memory_usage.rss / (1024 * 1024)
        gc.collect()

        self.log.info(
            f"Job {job.id} completed. Memory usage: {memory_usage_mb:.2f} MB")

        if job.get_status() == JobStatus.FAILED:
            if len(job.args) > 0:
                if isinstance(job.args[0], Script):
                    script = job.args[0]
                    script.status = "failure"
                    script.error_message = ""
                    script.save(update_fields=['status', 'error_message'])
                elif isinstance(job.args[0], Report):
                    report = job.args[0]
                    report.status = "failure"
                    report.save(update_fields=['status'])
        return result
