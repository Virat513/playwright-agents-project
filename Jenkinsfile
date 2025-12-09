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

                REM IMPORTANT:
                REM - No --alluredir (Playwright does not support it)
                REM - Allure reporter will auto-generate allure-results/

                npx playwright test ^
                    --project=chromium ^
                    --reporter=list,allure-playwright
                """
            }
        }

        stage('Publish Allure Report') {
            steps {
                script {
                    echo "📊 Publishing Allure Report..."
                }

                allure includeProperties: false, jdk: '', results: [[path: "${ALLURE_RESULTS}"]]
            }
        }
    }

    post {
        always {
            echo "📦 Archiving Allure results only..."
            archiveArtifacts artifacts: "${ALLURE_RESULTS}/**", allowEmptyArchive: true
        }
    }
}
