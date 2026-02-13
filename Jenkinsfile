pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1" 
        S3_BUCKET = "frontendapp101"
        CLOUDFRONT_DISTRIBUTION_ID = "E175I2YBDDSB62"
        AWS_CREDENTIALS_ID = "d5729a17-0769-4e34-8d21-75a5519c9eae"
    }

    options {
        timestamps()
        
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'Frontendapp101',
                    url: 'https://github.com/kaviyarashugayu1997-maker/Frontend-application.git'
            }
        }
           
        stage('Check Node & NPM') {
            steps {
                sh '''
                  node -v
                  npm -v
                '''
            }
        }

        stage('Install & Build') {
            steps {
                
                dir('Frontend') {
                    sh '''
                      
                        
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Verify Build') {
            steps {
               
                sh 'ls -la Frontend/dist || ls -la Frontend/build'
            }
        }

        stage('Deploy to S3') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                  credentialsId: "${AWS_CREDENTIALS_ID}"]]) {
                    dir('Frontend') {
                        
                        sh """
                            if [ -d "dist" ]; then
                                aws s3 sync dist/ s3://${S3_BUCKET}/ --delete --region ${AWS_REGION}
                            else
                                aws s3 sync build/ s3://${S3_BUCKET}/ --delete --region ${AWS_REGION}
                            fi
                        """
                    }
                }
            }
        }

        stage('Invalidate CloudFront') {
            when {
                expression { env.CLOUDFRONT_DISTRIBUTION_ID != null && env.CLOUDFRONT_DISTRIBUTION_ID != "" }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                  credentialsId: "${AWS_CREDENTIALS_ID}"]]) {
                    sh """
                        aws cloudfront create-invalidation \
                        --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
                        --paths "/*"
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful! Your frontend is live."
        }
        failure {
            echo "❌ Pipeline failed. Please check the Console Output for errors."
        }
    }
}
