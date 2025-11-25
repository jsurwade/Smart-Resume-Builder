pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command: ["cat"]
    tty: true

  - name: kubectl
    image: bitnami/kubectl:latest
    command: ["cat"]
    tty: true
    securityContext:
      runAsUser: 0
    env:
    - name: KUBECONFIG
      value: /kube/config
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig

  - name: dind
    image: docker:dind
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    args: 
    - "--storage-driver=overlay2"
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
    - name: workspace-volume
      mountPath: /home/jenkins/agent

  - name: node
    image: node:20-alpine
    command: ["cat"]
    tty: true
    volumeMounts:
    - mountPath: /home/jenkins/agent
      name: workspace-volume

  - name: jnlp
    image: jenkins/inbound-agent:3309.v27b_9314fd1a_4-1
    env:
    - name: JENKINS_AGENT_WORKDIR
      value: "/home/jenkins/agent"
    volumeMounts:
    - mountPath: "/home/jenkins/agent"
      name: workspace-volume

  volumes:
  - name: workspace-volume
    emptyDir: {}
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred')
        IMAGE_BACKEND = "jsurwade/smart-resume-backend"
        IMAGE_FRONTEND = "jsurwade/smart-resume-frontend"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        NAMESPACE = "smart-resume-builder"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Build & Docker Image') {
            steps {
                container('node') {
                    sh '''
                        cd backend
                        npm install
                        npm run build
                    '''
                }
                container('dind') {
                    sh '''
                        docker build -t $IMAGE_BACKEND:latest ./backend
                    '''
                }
            }
        }

        stage('Frontend Build & Docker Image') {
            steps {
                container('node') {
                    sh '''
                        cd frontend
                        npm install
                        npm run build
                    '''
                }
                container('dind') {
                    sh '''
                        docker build -t $IMAGE_FRONTEND:latest ./frontend
                    '''
                }
            }
        }

        stage('SonarQube Scan') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonar-token-2401106', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                              -Dsonar.projectKey=2401106_smart_resume \
                              -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                              -Dsonar.login=$SONAR_TOKEN
                        '''
                    }
                }
            }
        }

        stage('Login to Nexus Registry') {
            steps {
                container('dind') {
                    sh '''
                        echo "$DOCKERHUB_CREDENTIALS_PSW" | docker login -u "$DOCKERHUB_CREDENTIALS_USR" --password-stdin
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                container('dind') {
                    sh '''
                        docker tag $IMAGE_BACKEND:latest $IMAGE_BACKEND:$BUILD_NUMBER
                        docker tag $IMAGE_FRONTEND:latest $IMAGE_FRONTEND:$BUILD_NUMBER

                        docker push $IMAGE_BACKEND:$BUILD_NUMBER
                        docker push $IMAGE_FRONTEND:$BUILD_NUMBER
                    '''
                }
            }
        }

        stage('Create Namespace & Secrets') {
            steps {
                container('kubectl') {
                    withCredentials([
                        string(credentialsId: 'mongo-uri-2401106', variable: 'MONGO_URI'),
                        string(credentialsId: 'jwt-secret-2401106', variable: 'JWT_SECRET'),
                        string(credentialsId: 'gmail-user-2401106', variable: 'GMAIL_USER'),
                        string(credentialsId: 'gmail-pass-2401106', variable: 'GMAIL_PASS')
                    ]) {
                        sh '''
                            kubectl get namespace $NAMESPACE || kubectl create namespace $NAMESPACE

                            kubectl create secret docker-registry nexus-secret \
                              --docker-server=docker.io \
                              --docker-username=$DOCKERHUB_CREDENTIALS_USR \
                              --docker-password=$DOCKERHUB_CREDENTIALS_PSW \
                              --namespace $NAMESPACE || true

                            kubectl create secret generic smart-resume-secrets -n $NAMESPACE \
                              --from-literal=MONGO_URI="$MONGO_URI" \
                              --from-literal=JWT_SECRET="$JWT_SECRET" \
                              --from-literal=GMAIL_USER="$GMAIL_USER" \
                              --from-literal=GMAIL_PASS="$GMAIL_PASS" || true
                        '''
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    dir('k8s-deployment') {
                        sh '''
                            sed -i "s|image:.*smart-resume-backend:.*|image: $IMAGE_BACKEND:$BUILD_NUMBER|g" deployment.yaml
                            sed -i "s|image:.*smart-resume-frontend:.*|image: $IMAGE_FRONTEND:$BUILD_NUMBER|g" deployment.yaml

                            kubectl apply -f deployment.yaml -n $NAMESPACE
                            kubectl get pods -n $NAMESPACE
                        '''
                    }
                }
            }
        }
    }

    post {
        success { echo "🎉 CI/CD Pipeline Completed Successfully!" }
        failure { echo "❌ CI/CD Pipeline Failed!" }
    }
}
