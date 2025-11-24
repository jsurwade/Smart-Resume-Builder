pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:20-alpine
    command: ["cat"]
    tty: true
  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
  imagePullSecrets:
  - name: dockerhub-secret
'''
        }
    }

    environment {
        SONAR_TOKEN = credentials('sonar-token')       // SonarQube token stored in Jenkins
        DOCKER_IMAGE = "resumebuilder"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                container('node') {
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                container('node') {
                    sh '''
                    # Run SonarQube scan
                    sonar-scanner \
                        -Dsonar.projectKey=SmartResumeBuilder \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://your-sonarqube-server \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Docker Login') {
            steps {
                container('dind') {
                    sh '''
                    # Login to Docker Hub using pre-configured Jenkins secret
                    docker login -u <YOUR_DOCKER_USERNAME> -p <YOUR_DOCKER_TOKEN>
                    
                    # Optional: Pre-pull images to avoid rate limits
                    docker pull node:20-alpine
                    docker pull alpine:3.18
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh "docker build -t $DOCKER_IMAGE ."
                }
            }
        }

        stage('Build Complete') {
            steps {
                echo "Build Finished Successfully!"
            }
        }
    }
}
