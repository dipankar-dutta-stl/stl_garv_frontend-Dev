pipeline {
    agent any

    environment {
        FRONTEND_ECR_REPO = '817555535470.dkr.ecr.us-east-1.amazonaws.com/stl-garv-frontend'
        ZAP_TARGET = 'https://appseksdev.stlgarv.com/'
    }

    stages {
        stage('Unit Testing') {
            steps {
                sh 'npm install --package-lock'
                sh "jest 'module-management.component.spec.ts' 'user-api.service.spec.ts'"
                // sh 'rm -rf node_modules/'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarServer') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('OWASP Dependency-Check Vulnerabilities') {
            steps {
                //sh 'npm install --package-lock'
                dependencyCheck additionalArguments: '--disableYarnAudit', odcInstallation: 'OWAS-Dependency-Check'
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
                sh 'cp dependency-check-report.xml /var/lib/jenkins/workspace/reports'
                sh 'rm -rf node_modules/'
            }
        }

        stage('Build docker image') {
            steps {
                sh 'docker build --no-cache -t ${FRONTEND_ECR_REPO}:${BUILD_NUMBER} .'

            }
        }

        stage('Docker image scan') {
            steps {
                sh 'trivy --cache-dir $HOME/tmp  image --format template --template "@/usr/local/share/trivy/templates/html.tpl" -o ./trivy_report.html ${FRONTEND_ECR_REPO}:${BUILD_NUMBER}'
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: '', reportFiles: 'trivy_report.html', reportName: 'Trivy_Scan_Report', reportTitles: ''])
            }
        }

        stage('Push docker image to ECR') {
            steps {
                sh '''aws ecr get-login-password --region us-east-1 |     \
                        docker login \
                            --username AWS  \
                            --password-stdin 817555535470.dkr.ecr.us-east-1.amazonaws.com
                '''
                sh 'docker push ${FRONTEND_ECR_REPO}:${BUILD_NUMBER}'
            }
        }

        stage('Deploy') {
            steps {
                // sh 'sed -i "s/build-number/${BUILD_NUMBER}/g" manifest.yaml'
                sh 'aws eks update-kubeconfig --region us-east-1 --name stl-garv-eks-cluster'
                // sh 'kubectl apply -f manifest.yaml'
                sh '''helm upgrade \
                        --install stl-garv-frontend ./stlgarvchart \
                        --namespace stlgarvdevnamespace \
                        --set image.repository=${FRONTEND_ECR_REPO} \
                        --set image.tag=${BUILD_NUMBER}
                '''
            }
        }

    //    stage('Application Security Scanning - ZAP') {
    //        steps {
    //            script {
    //                   sh 'echo "Setting up OWASP ZAP docker container"'

    //                    sh 'docker run -dt --name owasp owasp/zap2docker-stable  /bin/bash'
    //                    sh 'docker exec owasp mkdir /zap/wrk'
    //                    sh 'docker cp zap/gen.conf owasp:/zap/wrk/gen.conf'

    //                    sh 'echo "Scanning target on owasp container"'
    //                    sh '''
    //                        docker exec owasp \
    //                                zap-full-scan.py \
    //                                -t ${ZAP_TARGET} \
    //                                -r zap_report.html \
    //                                -c gen.conf
    //                    '''

    //                    sh 'docker cp owasp:/zap/wrk/zap_report.html ${WORKSPACE}/zap_report.html'

    //                  publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: '', reportFiles: 'zap_report.html', reportName: 'Zap_Scan_Report', reportTitles: ''])
    //          }
    //        }
    //    }
    }

    post {
        always {
            sh 'docker rmi ${FRONTEND_ECR_REPO}:${BUILD_NUMBER}'
            sh 'docker container prune -f'
            sh 'docker rmi -f $(docker images -f "dangling=true" -q)'
            sh 'docker stop owasp'
            sh 'docker rm owasp'
            sh 'echo $BUILD_STATUS'
        }
        success {
            updateGitlabCommitStatus name: 'build', state: 'success'
        }
        failure {
            updateGitlabCommitStatus name: 'build', state: 'failed'
            emailext attachLog: true,
                body: '''
                    $PROJECT_NAME
                        Build # $BUILD_NUMBER - $BUILD_STATUS:
                        Check console output at $BUILD_URL to view the results.
                ''',
                subject: '$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!',
                to: 'shriram.ghadge+garv-jenkins-frontend@stl.tech, supriya.ankolekar+garv-jenkins-frontend@stl.tech, piyushk.singh+garv-jenkins-frontend@stl.tech'
        }
    }
}
