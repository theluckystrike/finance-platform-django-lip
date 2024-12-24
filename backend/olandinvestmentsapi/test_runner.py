from collections.abc import Callable  # Modern way to import Callable
from django_nose.runner import NoseTestSuiteRunner
import subprocess
import time
import logging
from django.test.runner import DiscoverRunner
from unittest.runner import TextTestResult, TextTestRunner

GREEN = '\033[32m'
RED = '\033[31m'
YELLOW = '\033[33m'
RESET = '\033[0m'


class ColorTextTestResult(TextTestResult):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dots = False
        self.errors_to_print = []
        self.failures_to_print = []

    def addSuccess(self, test):
        self.stream.write(f'{GREEN}.{RESET}')
        self.stream.flush()

    def addError(self, test, err):
        self.stream.write(f'{YELLOW}E{RESET}')
        self.errors_to_print.append((test, err))

    def addFailure(self, test, err):
        self.stream.write(f'{RED}F{RESET}')
        self.failures_to_print.append((test, err))

    def printErrors(self):
        self.stream.write('\n')
        if self.errors_to_print or self.failures_to_print:
            self.stream.write('=' * 70 + '\n')

            for test, err in self.failures_to_print:
                self.stream.write(f"{RED}FAIL: {test.id()}{RESET}\n")
                self.stream.write('-' * 70 + '\n')
                trace = self._exc_info_to_string(err, test)
                self.stream.write(f'{RED}{trace}\n{RESET}')
                self.stream.write('-' * 70 + '\n')

            for test, err in self.errors_to_print:
                self.stream.write(f"{YELLOW}ERROR: {test.id()}{RESET}\n")
                self.stream.write('-' * 70 + '\n')
                trace = self._exc_info_to_string(err, test)
                self.stream.write(f'{YELLOW}{trace}{RESET}\n')
                self.stream.write('-' * 70 + '\n')

    def wasSuccessful(self):
        result = super().wasSuccessful()
        return result


class ColorTextTestRunner(TextTestRunner):
    resultclass = ColorTextTestResult


class RedisProcess:
    def __init__(self):
        self.process = None

    def start(self):
        self.process = subprocess.Popen(
            ['redis-server'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1)

    def stop(self):
        if self.process:
            self.process.terminate()
            self.process.wait()


class RQWorkerProcess:
    def __init__(self):
        self.process = None

    def start(self):
        self.process = subprocess.Popen(
            ['python', 'manage.py', 'rqworker', 'scripts'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1)

    def stop(self):
        if self.process:
            self.process.terminate()
            self.process.wait()


class ColorTestRunner(DiscoverRunner):
    test_runner = ColorTextTestRunner

    def setup_test_environment(self, **kwargs):
        logging.disable(logging.CRITICAL)
        super().setup_test_environment(**kwargs)
        self.redis_process = RedisProcess()
        self.worker_process = RQWorkerProcess()
        self.redis_process.start()
        self.worker_process.start()

    def teardown_test_environment(self, **kwargs):
        logging.disable(logging.NOTSET)
        self.worker_process.stop()
        self.redis_process.stop()
        super().teardown_test_environment(**kwargs)


class CustomNoseTestRunner(NoseTestSuiteRunner):
    def setup_test_environment(self, **kwargs):
        logging.disable(logging.CRITICAL)
        super().setup_test_environment(**kwargs)
        self.redis_process = RedisProcess()
        self.worker_process = RQWorkerProcess()
        self.redis_process.start()
        self.worker_process.start()

    def teardown_test_environment(self, **kwargs):
        logging.disable(logging.NOTSET)
        self.worker_process.stop()
        self.redis_process.stop()
        super().teardown_test_environment(**kwargs)

    def run_suite(self, nose_argv):
        from nose.suite import LazySuite
        # Monkey patch the Callable check
        import collections
        if not hasattr(collections, 'Callable'):
            collections.Callable = Callable
        return super().run_suite(nose_argv)
