pipeline {
    agent any

    environment {
        SONAR_HOST_URL = 'http://localhost:9000'
        DOCKER_IMAGE = "jsurwade/smart-resume-builder"
    }

    tools {
        nodejs "node16"
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/jsurwade/Smart-Resume-Builder.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withCredentials([string(credentialsId: 'sonarqube_token', variable: 'SONAR_TOKEN')]) {
                        sh """
                        npx sonar-scanner \
                        -Dsonar.projectKey=Smart-Resume-Builder \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_TOKEN
                        """
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub_credentials', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh """
                    docker build -t $DOCKER_IMAGE:latest .
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $DOCKER_IMAGE:latest
                    """
                }
            }
        }

        stage('Deploy on Server') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'server_ssh', usernameVariable: 'SERVER_USER', passwordVariable: 'SERVER_PASS')]) {
                    sh """
                    sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@YOUR_SERVER_IP \
                    "docker pull $DOCKER_IMAGE:latest &&
                     docker stop resume || true &&
                     docker rm resume || true &&
                     docker run -d --name resume -p 3000:3000 $DOCKER_IMAGE:latest"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "🚀 Build Complete & Successfully Deployed!"
        }
        failure {
            echo "❌ Build Failed — Check Logs"
        }
    }
}
