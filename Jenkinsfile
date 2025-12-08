pipeline {
    agent any

    environment {
        NODE_TOOL_NAME = 'Node18'          // <-- Ensure this matches your Jenkins NodeJS tool name
        NODE_VERSION = '18'                // Descriptive only
        WORKSPACE_WIN = "${env.WORKSPACE}"
        ALLURE_RESULTS_PATH = "${WORKSPACE_WIN}\\allure-results"
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE_WIN}\\.playwright-browsers"
        PLAYWRIGHT_CONFIG_PROJECT_NAMES = "chromium,firefox,webkit" // comma-separated project names
        TEST_RESULTS_DIR = "${WORKSPACE_WIN}\\test-results"
        PLAYWRIGHT_REPORT_DIR = "${WORKSPACE_WIN}\\playwright-report"
    }

    parameters {
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Browser to run tests on'
        )
        choice(
            name: 'TEST_SUITE',
            choices: ['all', 'comprehensive', 'login', 'cart'],
            description: 'Test suite to execute'
        )
        booleanParam(
            name: 'HEADED_MODE',
            defaultValue: false,
            description: 'Run tests in headed mode (visible browser)'
        )
        string(
            name: 'PARALLEL_WORKERS',
            defaultValue: '2',
            description: 'Number of parallel workers for test execution'
        )
    }

    options {
        buildDiscarder(logRotator(daysToKeepStr: '30', numToKeepStr: '20'))
        timeout(time: 60, unit: 'MINUTES') // increased timeout for Windows runs
        timestamps()
        skipDefaultCheckout(false)
    }

    stages {
        stage('Checkout & Clean') {
            steps {
                script {
                    echo "🔄 Checkout and workspace preparation"

                    // Clean and create directories (Windows cmd)
                    bat """
                        echo Cleaning workspace artifacts...
                        if exist "${ALLURE_RESULTS_PATH}" rmdir /s /q "${ALLURE_RESULTS_PATH}"
                        if exist "${PLAYWRIGHT_REPORT_DIR}" rmdir /s /q "${PLAYWRIGHT_REPORT_DIR}"
                        if exist "${TEST_RESULTS_DIR}" rmdir /s /q "${TEST_RESULTS_DIR}"
                        mkdir "${ALLURE_RESULTS_PATH}" 2>nul || echo Directory exists
                        mkdir "${TEST_RESULTS_DIR}" 2>nul || echo Directory exists
                    """

                    echo "Build metadata:"
                    echo "  - Build Number: ${env.BUILD_NUMBER}"
                    echo "  - Workspace: ${env.WORKSPACE}"
                    echo "  - Browser: ${params.BROWSER}"
                    echo "  - Test Suite: ${params.TEST_SUITE}"
                    echo "  - Headed Mode: ${params.HEADED_MODE}"
                }
            }
        }

        stage('Install Node Dependencies') {
            tools {
                nodejs "${NODE_TOOL_NAME}"  // This ensures NodeJS is set up
            }
            steps {
                script {
                    echo "📦 Verify Node & NPM and install dependencies"
                    bat """
                        echo Node version:
                        node --version
                        echo NPM version:
                        npm --version

                        REM Use npm ci for reproducible installs
                        npm ci
                    """
                }
            }
        }

        stage('Ensure Playwright Browsers') {
            steps {
                script {
                    echo "🎭 Ensuring Playwright browsers are installed to workspace cache"

                    // Set PLAYWRIGHT_BROWSERS_PATH for this session, then install targeted browsers
                    // Using cmd 'set' will affect the bat subprocess
                    if (params.BROWSER == 'all') {
                        bat """
                            set PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH}
                            npx playwright install
                            npx playwright --version
                        """
                    } else {
                        bat """
                            set PLAYWRIGHT_BROWSERS_PATH=${PLAYWRIGHT_BROWSERS_PATH}
                            npx playwright install ${params.BROWSER}
                            npx playwright --version
                        """
                    }
                }
            }
        }

stage('Run Playwright Tests') {
    steps {
        script {
            echo "🧪 Running Playwright tests"

            // Build test command dynamically
            def headedFlag = params.HEADED?.toBoolean() ? "--headed" : ""
            def suiteFlag = params.TEST_SUITE && params.TEST_SUITE != "all" ? "--grep ${params.TEST_SUITE}" : ""
            def browserFlag = params.BROWSER ? "--browser=${params.BROWSER}" : "--browser=chromium"

            def testCommand = "npx playwright test ${suiteFlag} ${headedFlag} ${browserFlag}"

            echo "Executing test command: ${testCommand}"

            // Run tests & capture exit code
            def exitCode = bat(script: testCommand, returnStatus: true)
            env.TEST_EXIT_CODE = "${exitCode}"
            echo "Playwright exit code: ${exitCode}"
        }
    }

    post {
        always {
            script {
                echo "📦 Archiving Allure + Test results"

                archiveArtifacts artifacts: """
                    allure-results/**,
                    ${TEST_RESULTS_DIR}/**,
                    ${PLAYWRIGHT_REPORT_DIR}/**
                """, allowEmptyArchive: true, fingerprint: true

                // Publish JUnit report if Playwright produced it
                def junitPath = "${TEST_RESULTS_DIR}\\junit-results.xml"
                if (fileExists(junitPath)) {
                    echo "📄 Publishing JUnit results"
                    junit junitPath
                } else {
                    echo "⚠️ No JUnit results found at: ${junitPath}"
                }
            }
        }
    }
}

        stage('Generate Allure Report') {
            when {
                expression { fileExists("${ALLURE_RESULTS_PATH}") }
            }
            steps {
                script {
                    echo "📊 Generating Allure Report (via Jenkins Allure plugin if configured)"
                    // If Allure plugin is installed, this step will publish the report.
                    // If not installed, it will fail — you can alternatively generate via CLI in a bat if desired.
                    try {
                        allure([
                            includeProperties: false,
                            jdk: '',
                            properties: [],
                            reportBuildPolicy: 'ALWAYS',
                            results: [[path: "${ALLURE_RESULTS_PATH}"]]
                        ])
                    } catch (err) {
                        echo "Allure plugin reporting failed or not configured: ${err}"
                        echo "You can generate Allure report locally using 'allure generate' if Allure CLI is available."
                    }
                }
            }
        }

        stage('Publish HTML Reports') {
            steps {
                script {
                    if (fileExists("${PLAYWRIGHT_REPORT_DIR}\\index.html")) {
                        publishHTML ([ 
                            allowMissing: false, 
                            alwaysLinkToLastBuild: true, 
                            keepAll: true, 
                            reportDir: "${PLAYWRIGHT_REPORT_DIR}", 
                            reportFiles: 'index.html', 
                            reportName: 'Playwright HTML Report', 
                            reportTitles: 'Playwright Test Results' 
                        ])
                    } else {
                        echo "Playwright HTML report not found at ${PLAYWRIGHT_REPORT_DIR}\\index.html"
                    }
                }
            }
        }

        stage('Analyze Results & Finish') {
            steps {
                script {
                    echo "📋 Test result analysis"
                    if (env.TEST_EXIT_CODE == '0') {
                        echo "✅ All tests passed"
                    } else {
                        echo "❌ Some tests failed (exit code: ${env.TEST_EXIT_CODE}). Marking as UNSTABLE."
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                echo "🧹 Final cleanup and summary"
                // Optional: Keep browser cache by default. If you want to remove cache uncomment below.
                // bat "if exist ${PLAYWRIGHT_BROWSERS_PATH} rmdir /s /q ${PLAYWRIGHT_BROWSERS_PATH}"

                def testStatus = (env.TEST_EXIT_CODE == '0') ? '✅ PASSED' : '❌ FAILED/UNSTABLE'
                def duration = currentBuild.durationString ?: 'Unknown'

                echo "BUILD SUMMARY:"
                echo "  Status: ${testStatus}"
                echo "  Browser: ${params.BROWSER}"
                echo "  Test Suite: ${params.TEST_SUITE}"
                echo "  Duration: ${duration}"
                echo "  Build Number: ${env.BUILD_NUMBER}"

                echo "Reports:"
                echo " - Allure results at: ${ALLURE_RESULTS_PATH}"
                if (fileExists("${PLAYWRIGHT_REPORT_DIR}\\index.html")) {
                    echo " - Playwright HTML report published"
                }
            }
        }

        success {
            script {
                echo "✅ Pipeline completed successfully."
            }
        }

        unstable {
            script {
                echo "⚠️ Pipeline completed with test failures (UNSTABLE)."
            }
        }

        failure {
            script {
                echo "❌ Pipeline failed. Check console output and reports."
            }
        }
    }
}

