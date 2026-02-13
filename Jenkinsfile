pipeline {
    agent any
 
    environment {
        AWS_REGION = "eu-east-1"
        S3_BUCKET = "frontendapp101"
        CLOUDFRONT_DISTRIBUTION_ID = "E175I2YBDDSB62"
        
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
                dir ('Frontend'){
                sh 'npm install'
                sh 'npm run build'
            }
        }
      }
 
        stage('Verify Build Output') {
            steps {
                sh 'ls -la Frontend/build'
            }
        }
 
        stage('Deploy to S3') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'd5729a17-0769-4e34-8d21-75a5519c9eae'
                ]]) dir('Frontend'){
                    sh '''
                      aws s3 sync build/ s3://${S3_BUCKET}/ \
                        --delete \
                        --region ${AWS_REGION}
                    '''
                }
            }
        }
 
        stage('Invalidate CloudFront Cache') {
            when {
                expression { env.CLOUDFRONT_DISTRIBUTION_ID?.trim() }
            }
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'd5729a17-0769-4e34-8d21-75a5519c9eae'
                ]]) {
                    sh '''
                      aws cloudfront create-invalidation \
                        --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
                        --paths "/*"
                    '''
                }
            }
        }
    }
 
    post {
        success {
            echo "✅ Frontend deployed successfully to S3 + CloudFront!"
        }
        failure {
            echo "❌ Pipeline failed. Check Jenkins logs."
        }
    }
}
