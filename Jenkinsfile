pipeline {
    agent any

    triggers {
        githubPush() // Triggers on GitHub push
    }

    environment {
        EC2_IP = '34.230.40.32' // Your EC2 Public IP
        SSH_CRED = 'cf0fd30a-c4e7-4017-a7b5-f7cd712eb3c5' 
        APP_DIR = '/home/ubuntu/react-app'
        GIT_REPO = 'https://github.com/vivek476/VivekJPS.git'
    }

    stages {
        stage('Deploy React App to EC2') {
            steps {
                sshagent (credentials: [SSH_CRED]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} '
                        echo "Cleaning old build and repo"
                        rm -rf ${APP_DIR}
                        git clone ${GIT_REPO} ${APP_DIR}
                        cd ${APP_DIR}
                        npm install
                        npm run build
                        echo "Deploying build to Nginx"
                        sudo rm -rf /var/www/html/*
                        sudo cp -r build/* /var/www/html/
                    '
                    """
                }
            }
        }
    }
}

