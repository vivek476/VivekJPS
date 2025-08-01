pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        EC2_IP = '34.230.40.32'
        SSH_CRED = 'cf0fd30a-c4e7-4017-a7b5-f7cd712eb3c5'
        APP_DIR = '/home/ubuntu/react-app'
        REPO = 'git clone https://github.com/vivek476/VivekJPS.git /home/ubuntu/react-app'
    }

    stages {
        stage('Pull Code & Build React App') {
            steps {
                sshagent (credentials: ["${SSH_CRED}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '
                            rm -rf ${APP_DIR} &&
                            git clone ${REPO} ${APP_DIR} &&
                            cd ${APP_DIR} &&
                            npm install &&
                            npm run build
                        '
                    """
                }
            }
        }

        stage('Deploy to Nginx') {
            steps {
                sshagent (credentials: ["${SSH_CRED}"]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '
                            sudo rm -rf /var/www/html/* &&
                            sudo cp -r ${APP_DIR}/build/* /var/www/html/
                        '
                    """
                }
            }
        }
    }
}
