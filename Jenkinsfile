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
    command:
    - cat
    tty: true
  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
'''
        }
    }

    environment {
        SONAR_TOKEN = credentials('sonar-token') // Jenkins credential
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

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh 'docker build -t resumebuilder .'
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
