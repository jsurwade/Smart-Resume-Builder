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
    command: ["cat"]
    tty: true

  - name: docker
    image: docker:24.0.2-dind
    securityContext:
      privileged: true
    command: ["dockerd-entrypoint.sh"]
    args:
      - "--host=tcp://0.0.0.0:2376"
      - "--storage-driver=overlay2"
      - "--insecure-registry=nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
    env:
      - name: DOCKER_TLS_CERTDIR
        value: ""
    tty: true

  - name: sonar
    image: sonarsource/sonar-scanner-cli:latest
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true

  - name: jnlp
    image: jenkins/inbound-agent:latest
    tty: true
"""
        }
    }

    environment {
        SONARQUBE_ENV = "sonarqube-2401106"
        NEXUS_URL = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        BACKEND_IMAGE = "${NEXUS_URL}/my-repository/smart-resume-backend"
        FRONTEND_IMAGE = "${NEXUS_URL}/my-repository/smart-resume-frontend"
        K8S_NAMESPACE = "2401106"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/jsurwade/Smart-Resume-Builder.git',
                    credentialsId: 'git-token-creds'
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Install Backend') {
                    steps {
                        container('node') {
                            sh "cd Backend && npm install"
                        }
                    }
                }
                stage('Install Frontend') {
                    steps {
                        container('node') {
                            sh "cd Frontend && npm install"
                        }
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                container('node') {
                    sh "cd Frontend && npm run build"
                }
            }
        }

        stage('SonarQube Code Analysis') {
            steps {
                container('sonar') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh """
                            sonar-scanner \
                              -Dsonar.projectKey=Smart_Resume_Builder_2401106 \
                              -Dsonar.sources=. \
                              -Dsonar.token=$SONAR_TOKEN
                        """
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                container('docker') {
                    sh '''
                        echo "Waiting for Docker daemon..."
                        for i in {1..30}; do
                            if docker info >/dev/null 2>&1; then echo "Docker Ready"; break; fi
                            sleep 2
                        done

                        TAG=${BUILD_NUMBER}

                        docker build -t backend-temp ./Backend
                        docker build -t frontend-temp ./Frontend
                    '''
                }
            }
        }

        stage('Push Docker Images to Nexus') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(credentialsId: 'nexus-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh '''
                            TAG=${BUILD_NUMBER}

                            echo "$PASS" | docker login ${NEXUS_URL} -u "$USER" --password-stdin

                            docker tag backend-temp ${BACKEND_IMAGE}:${TAG}
                            docker tag backend-temp ${BACKEND_IMAGE}:latest
                            docker tag frontend-temp ${FRONTEND_IMAGE}:${TAG}
                            docker tag frontend-temp ${FRONTEND_IMAGE}:latest

                            docker push ${BACKEND_IMAGE}:${TAG}
                            docker push ${BACKEND_IMAGE}:latest
                            docker push ${FRONTEND_IMAGE}:${TAG}
                            docker push ${FRONTEND_IMAGE}:latest
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    withCredentials([
                        string(credentialsId: 'mongo-uri-2401106', variable: 'MONGO_URI'),
                        string(credentialsId: 'jwt-secret-2401106', variable: 'JWT_SECRET')
                    ]) {
                        sh '''
                            kubectl get namespace ${K8S_NAMESPACE} || kubectl create namespace ${K8S_NAMESPACE}

                            kubectl create secret docker-registry nexus-secret \
                              --docker-server=${NEXUS_URL} \
                              --docker-username=$USER \
                              --docker-password=$PASS \
                              --namespace=${K8S_NAMESPACE} || true

                            kubectl apply -f k8s/ -n ${K8S_NAMESPACE}

                            kubectl get pods -n ${K8S_NAMESPACE}
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "🎯 Deployment Successfully Done!"
        }
        failure {
            echo "❌ Build Failed — Check logs!"
        }
    }
}
