pipeline {

    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  hostAliases:
  - ip: "192.168.20.250"
    hostnames:
      - "sonarqube.imcc.com"

  containers:
  // --- BUILD CONTAINERS ---
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
    
  // --- DEPLOYMENT CONTAINER ---
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
        // SonarQube credentials
        SONARQUBE_ENV      = "sonarqube-2401115"
        SONARQUBE_AUTH_TOKEN = credentials('sonartoken')

        // Nexus configuration
        NEXUS_URL          = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        BACKEND_IMAGE_NAME = "${NEXUS_URL}/my-repository/smart-resume-backend"
        FRONTEND_IMAGE_NAME = "${NEXUS_URL}/my-repository/smart-resume-frontend"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/jsurwade/Smart-Resume-Builder.git',
                    credentialsId: 'git-token-creds'
            }
        }
        
        // --- 1. FRONTEND CI STAGES ---
        stage('Frontend: Install Dependencies & Build') {
            steps {
                container('node') {
                    sh """
                    cd frontend/ 
                    npm install
                    npm run build
                    """
                }
            }
        }

        stage('Frontend: SonarQube Analysis') {
            steps {
                container('sonar') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        // Scan the frontend directory
                        sh """
                            sonar-scanner \\
                              -Dsonar.projectKey=smart-resume-frontend-CICD \\
                              -Dsonar.sources=frontend/src \\
                              -Dsonar.host.url=http://sonarqube.imcc.com \\
                              -Dsonar.token=${SONARQUBE_AUTH_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Frontend: Build & Push Docker Image') {
            steps {
                container('docker') {
                    // Login to Docker Hub
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DUSER',
                        passwordVariable: 'DPASS'
                    )]) {
                        // Wait for Docker daemon
                        sh '''
                            echo "Waiting for Docker daemon..."
                            for i in {1..30}; do
                                if docker info >/dev/null 2>&1; then
                                    echo "Docker is ready!"
                                    break
                                fi
                                sleep 2
                            done
                        '''

                        script {
                            def tag = env.BUILD_NUMBER
                            sh """
                                // Login to Docker Hub
                                echo "$DPASS" | docker login -u "$DUSER" --password-stdin
                                
                                // Build the frontend image using Dockerfile in frontend/
                                docker build -t ${FRONTEND_IMAGE_NAME}:${tag} -f frontend/Dockerfile frontend/
                                docker tag ${FRONTEND_IMAGE_NAME}:${tag} ${FRONTEND_IMAGE_NAME}:latest

                                // Push to Nexus
                                withCredentials([usernamePassword(
                                    credentialsId: 'nexus-creds-resumebuilder',
                                    usernameVariable: 'NUSER',
                                    passwordVariable: 'NPASS'
                                )]) {
                                    sh """
                                        echo "$NPASS" | docker login ${NEXUS_URL} -u "$NUSER" --password-stdin
                                        docker push ${FRONTEND_IMAGE_NAME}:${tag}
                                        docker push ${FRONTEND_IMAGE_NAME}:latest
                                    """
                                }
                            """
                        }
                    }
                }
            }
        }
        
        // --- 2. BACKEND CI STAGES ---
        stage('Backend: SonarQube Analysis') {
            steps {
                container('sonar') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        // Scan the backend directory (or root if backend is at root)
                        sh """
                            sonar-scanner \\
                              -Dsonar.projectKey=smart-resume-backend-CICD \\
                              -Dsonar.sources=./ \\
                              -Dsonar.exclusions=frontend/** \\
                              -Dsonar.host.url=http://sonarqube.imcc.com \\
                              -Dsonar.token=${SONARQUBE_AUTH_TOKEN}
                        """
                    }
                }
            }
        }
        
        stage('Backend: Build & Push Docker Image') {
            steps {
                container('docker') {
                    // Login to Docker Hub
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DUSER',
                        passwordVariable: 'DPASS'
                    )]) {
                        // Docker daemon wait is skipped here as it ran in the previous stage
                        script {
                            def tag = env.BUILD_NUMBER
                            sh """
                                // Login to Docker Hub
                                echo "$DPASS" | docker login -u "$DUSER" --password-stdin
                                
                                // Build the backend image using Dockerfile in the root (or backend/)
                                docker build -t ${BACKEND_IMAGE_NAME}:${tag} .
                                docker tag ${BACKEND_IMAGE_NAME}:${tag} ${BACKEND_IMAGE_NAME}:latest

                                // Push to Nexus
                                withCredentials([usernamePassword(
                                    credentialsId: 'nexus-creds-resumebuilder',
                                    usernameVariable: 'NUSER',
                                    passwordVariable: 'NPASS'
                                )]) {
                                    sh """
                                        echo "$NPASS" | docker login ${NEXUS_URL} -u "$NUSER" --password-stdin
                                        docker push ${BACKEND_IMAGE_NAME}:${tag}
                                        docker push ${BACKEND_IMAGE_NAME}:latest
                                    """
                                }
                            """
                        }
                    }
                }
            }
        }

        // --- 3. CONTINUOUS DEPLOYMENT STAGE ---
        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    file(credentialsId: 'kubeconfig-2401194', variable: 'KUBECONFIG_FILE')
                ]) {
                    container('kubectl') {
                        script {
                            def namespace = "2401194"
                            def backend_image = "${BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
                            def frontend_image = "${FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER}"

                            sh "export KUBECONFIG=$KUBECONFIG_FILE"
                            
                            echo "Updating backend deployment with image: ${backend_image}"
                            sh "kubectl set image deployment/backend backend=${backend_image} -n ${namespace}"

                            echo "Updating frontend deployment with image: ${frontend_image}"
                            sh "kubectl set image deployment/frontend frontend=${frontend_image} -n ${namespace}"
                            
                            echo "Waiting for deployments to roll out..."
                            sh "kubectl rollout status deployment/backend -n ${namespace} --timeout=5m"
                            sh "kubectl rollout status deployment/frontend -n ${namespace} --timeout=5m"
                        }
                    }
                }
            }
        }
    }

    post {
        success { echo "🚀 Full CI/CD Pipeline Successful! Backend and Frontend deployed." }
        failure { echo "❌ Pipeline failed — check logs for errors." }
    }
}
