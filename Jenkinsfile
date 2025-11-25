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

  - name: jnlp
    image: jenkins/inbound-agent:latest
    tty: true
"""
        }
    }

    environment {
        SONARQUBE_ENV        = "sonarqube-2401115"
        SONARQUBE_AUTH_TOKEN = credentials('sonartoken')

        NEXUS_URL    = "nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085"
        DOCKER_IMAGE = "${NEXUS_URL}/my-repository/resume-builder-app"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aniketlangote03/resumebuildervite.git',
                    credentialsId: 'git-token-creds'
            }
        }

        stage('Install Dependencies') {
            steps {
                container('node') {
                    sh "npm install"
                }
            }
        }

        stage('Build React App') {
            steps {
                container('node') {
                    sh "npm run build"
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh """
                            sonar-scanner \
                              -Dsonar.projectKey=Resumebuilder_Aniket_2401115 \
                              -Dsonar.sources=src \
                              -Dsonar.host.url=http://sonarqube.imcc.com \
                              -Dsonar.token=${SONARQUBE_AUTH_TOKEN}
                        """
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                container('docker') {

                    // Login to Docker Hub (to avoid 429 pull rate limits)
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DUSER',
                        passwordVariable: 'DPASS'
                    )]) {

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
                                echo "$DPASS" | docker login -u "$DUSER" --password-stdin

                                docker build -t ${DOCKER_IMAGE}:${tag} .
                                docker tag ${DOCKER_IMAGE}:${tag} ${DOCKER_IMAGE}:latest
                            """
                        }
                    }
                }
            }
        }

        stage('Push Docker Image to Nexus') {
            steps {
                container('docker') {
                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-creds-resumebuilder',
                        usernameVariable: 'NUSER',
                        passwordVariable: 'NPASS'
                    )]) {

                        sh """
                            echo "$NPASS" | docker login ${NEXUS_URL} -u "$NUSER" --password-stdin
                            docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }
        }
    }

    post {
        success { echo "🚀 Build & Push Successful!" }
        failure { echo "❌ Pipeline failed — check logs." }
    }
}
