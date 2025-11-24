pipeline {
    agent any

    environment {
        DOCKERHUB_USER = credentials('dockerhub-username')   // add in Jenkins Credentials
        DOCKERHUB_PASS = credentials('dockerhub-password')
        IMAGE_NAME = "resumebuilder"
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                echo "🔐 Logging in to Docker Hub..."
                echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin
                
                echo "🐳 Building Docker Image..."
                docker build -t $IMAGE_NAME:$IMAGE_TAG .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh '''
                docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG
                docker push $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker stop resumebuilder || true
                docker rm resumebuilder || true
                docker run -d -p 3000:3000 --name resumebuilder $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 Deployment Successful!"
        }
        failure {
            echo "❌ Build failed!"
        }
    }
}
