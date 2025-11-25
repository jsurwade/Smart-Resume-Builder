pipeline {
    agent any

    environment {
        IMAGE_NAME = "resumebuilder"
        IMAGE_TAG = "latest"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies & Build Project') {
            steps {
                sh '''
                echo "📦 Installing dependencies..."
                npm install

                echo "🏗 Building project..."
                npm run build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-username', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh '''
                    echo "🔐 Logging in to Docker Hub..."
                    echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin

                    echo "🐳 Building Docker image..."
                    docker build -t $IMAGE_NAME:$IMAGE_TAG .
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-username', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    sh '''
                    echo "📤 Pushing Docker image to Docker Hub..."
                    docker tag $IMAGE_NAME:$IMAGE_TAG $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG
                    docker push $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                echo "🚀 Deploying container..."
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
