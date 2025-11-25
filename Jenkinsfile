pipeline {
    agent {
        kubernetes {
            yaml """
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
"""
        }
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred')   // DockerHub credentials ID
        IMAGE_NAME = "jsurwade/smart-resume-builder"
        SERVER_SSH = credentials('windows-server-ssh')          // SSH credential ID
        SERVER_IP = "YOUR_WINDOWS_SERVER_IP"                   // replace with server IP
        SERVER_USER = "YOUR_WINDOWS_USER"                      // replace with server username
        CONTAINER_NAME = "smart-resume-builder"
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Backend Build') {
            steps {
                container('node') {
                    sh '''
                    cd backend
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Frontend Build') {
            steps {
                container('node') {
                    sh '''
                    cd frontend
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('dind') {
                    sh '''
                    docker build -t $IMAGE_NAME:latest .
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                container('dind') {
                    sh '''
                    echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin
                    docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy to Windows Server') {
            steps {
                sshagent(['windows-server-ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP \\
                    "docker stop $CONTAINER_NAME || true && \\
                     docker rm $CONTAINER_NAME || true && \\
                     docker pull $IMAGE_NAME:latest && \\
                     docker run -d -p 3000:3000 --name $CONTAINER_NAME $IMAGE_NAME:latest"
                    """
                }
            }
        }
    }

    post {
        success { echo "🎉 Deployment Successful!" }
        failure { echo "❌ Build Failed!" }
    }
}
