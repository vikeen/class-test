"use strict";

const logger = require("../lib/helpers/logger"),
    path = require("path");

class ClassyTestRunner {
    constructor(files) {
        this.files = files;
        this.results = [];
    }

    run() {
        console.time("time taken");
        this.testFiles();
        this.report();
        console.timeEnd("time taken");

        if (this.hasFailedTest) {
            process.exit(1);
        } else {
            process.exit(0);
        }
    }

    get hasFailedTest() {
        return this.failedTests.length > 0;
    }

    get failedTests() {
        return this.results.filter(item => item.isFailedStatus);
    }

    get passedTests() {
        return this.results.filter(item => item.isPassedStatus);
    }


    testFiles() {
        this.files.forEach(file => {
            const filePath = path.normalize(path.join(process.cwd(), file));
            this.testFile(filePath);
        });
    }

    testFile(filePath) {
        let TestCases = require(filePath).TestCases;

        if (!Array.isArray(TestCases)) {
            TestCases = [TestCases];
        }

        TestCases.forEach(TestCase => {
            const testCase = new TestCase();
            testCase.__run();
            this.results = this.results.concat(testCase.__results);
        });
    }

    report() {
        this.failedTests.forEach(failedTest => {
            logger.error(`Test Case Failed (${failedTest.testCaseName}:${failedTest.testName})`);
            logger.error(failedTest.error);
        });

        logger.info("================================");
        logger.info(`pass: ${this.passedTests.length} -- fail: ${this.failedTests.length}`);
        logger.info("================================");
    }
}

module.exports = ClassyTestRunner;