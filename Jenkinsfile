pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:18-alpine
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

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh '''
                    npm install
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                container('node') {
                    sh '''
                    npm run build
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                    docker build -t resumebuilder .
                    '''
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
