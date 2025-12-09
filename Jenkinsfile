pipeline {
    agent any

    tools {
        allure 'allure'
        nodejs 'Node18'
    }

    environment {
        ALLURE_RESULTS = "allure-results"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/Virat513/playwright-agents-project.git'
            }
        }

        stage('Install Node Dependencies') {
            steps {
                bat """
echo Installing dependencies...
npm ci
"""
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat """
echo Installing Chromium browser...
npx playwright install chromium
"""
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat """
echo Running Playwright tests on Chromium...
npx playwright test --project=chromium --reporter=list,allure-playwright
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
            echo "Archiving allure-results..."
            archiveArtifacts artifacts: "${ALLURE_RESULTS}/**", allowEmptyArchive: true
        }
    }
}
