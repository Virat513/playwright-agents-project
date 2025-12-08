pipeline {
    agent any

    tools {
        allure 'allure'
        nodejs 'Node18'    // make sure Node18 is configured in Global Tool Configuration
    }

    environment {
        ALLURE_RESULTS = "allure-results"
        PW_REPORT = "playwright-report"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/Virat513/playwright-agents-project.git',
                    credentialsId: '***REMOVED***'
            }
        }

        stage('Install Node Dependencies') {
            steps {
                script {
                    echo "📦 Verifying Node & NPM"
                }
                bat """
                node --version
                npm --version

                echo Installing dependencies...
                npm ci
                """
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat """
                echo Installing Chromium for Playwright...
                npx playwright install chromium
                """
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat """
                echo Running Playwright tests on Chromium...
                npx playwright test --project=chromium --reporter=line --output=${PW_REPORT} --alluredir=${ALLURE_RESULTS}
                """
            }
        }

        stage('Publish Allure Report') {
            steps {
                allure includeProperties: false, jdk: '', results: [[path: "${ALLURE_RESULTS}"]]
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: """
                ${ALLURE_RESULTS}/**,
                ${PW_REPORT}/**
            """, allowEmptyArchive: true
        }
    }
}
