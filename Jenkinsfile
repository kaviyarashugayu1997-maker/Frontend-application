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
                    credentialsId: 'username',
                    url: 'https://github.com/kaviyarashugayu1997-maker/Frontend-application.git'
            }
        }

        stage('Install & Build') {
            steps {
                dir('Frontend') {
                    sh '''
                        echo "Checking package.json scripts..."
                        cat package.json | grep scripts -A 5
                        
                        npm install
                        
                        # Try to build, if 'npm run build' fails, try 'npx vite build'
                        npm run build || npx vite build || npx react-scripts build
                    '''
                }
            }
        }

        stage('Verify Build Output') {
            steps {
                dir('Frontend') {
                    
                    sh 'ls -F' 
                }
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
                            elif [ -d "build" ]; then
                                aws s3 sync build/ s3://${S3_BUCKET}/ --delete --region ${AWS_REGION}
                            else
                                echo "❌ ERROR: Neither dist/ nor build/ folder found!"
                                exit 1
                            fi
                        """
                    }
                }
            }
        }

        stage('Invalidate CloudFront') {
            when {
                expression { env.CLOUDFRONT_DISTRIBUTION_ID != "" }
            }
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', 
                                  credentialsId: "${AWS_CREDENTIALS_ID}"]]) {
                    sh "aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths '/*'"
                }
            }
        }
    }

    post {
        success { echo "✅ Deployment Successful!" }
        failure { echo "❌ Deployment Failed. Check if 'build' script exists in package.json" }
    }
}
