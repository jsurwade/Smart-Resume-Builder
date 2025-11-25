pipeline {
    agent {
        kubernetes {
            yaml """
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
"""
        }
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                container('node') {
                    sh '''
                    cd Backend
                    npm install
                    '''
                }
            }
        }

        stage('Frontend Install') {
            steps {
                container('node') {
                    sh '''
                    cd Frontend
                    npm install
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
