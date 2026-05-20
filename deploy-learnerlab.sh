#!/bin/bash

# TDSE Microservices - AWS Learner Lab Deployment Script
# Compatible with AWS Academy Learner Lab restrictions

set -e

echo "=== TDSE Microservices - Learner Lab Deployment ==="
echo "Region: us-east-1"
echo "Using pre-created LabRole (no IAM creation)"
echo ""

# Configuration
STACK_NAME="tdse-microservices-$(date +%s)"
REGION="us-east-1"
# Use actual values from template.yaml defaults
AUTH0_ISSUER="${AUTH0_ISSUER:-https://dev-2ewcpm72kdub4wzu.auth0.com/}"
AUTH0_AUDIENCE="${AUTH0_AUDIENCE:-https://api.twitter.com}"

echo "Stack Name: $STACK_NAME"
echo "Auth0 Issuer: $AUTH0_ISSUER"
echo "Auth0 Audience: $AUTH0_AUDIENCE"
echo ""

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "ERROR: AWS CLI is not installed or not in PATH"
    exit 1
fi

# Check if SAM CLI is available
if ! command -v sam &> /dev/null; then
    echo "ERROR: SAM CLI is not installed or not in PATH"
    echo "Install SAM CLI: pip install aws-sam-cli"
    exit 1
fi

# Verify we're in the correct directory
if [ ! -f "template.yaml" ]; then
    echo "ERROR: template.yaml not found in current directory"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "=== Building Maven Applications ==="
# Debug: Show current directory and files
echo "Current directory: $(pwd)"
echo "Files in current directory:"
ls -la

# Check if Maven is available, install if needed
if ! command -v mvn &> /dev/null; then
    echo "Maven not found, installing Maven..."
    # Install Maven in CloudShell
    sudo yum update -y
    sudo yum install -y maven
    
    # Verify Maven installation
    if ! command -v mvn &> /dev/null; then
        echo "ERROR: Failed to install Maven"
        exit 1
    fi
    echo "Maven installed successfully"
fi

# Build each service individually since root pom.xml might not be available
echo "Building user-service..."
cd user-service
if ! mvn clean package -DskipTests; then
    echo "Failed to build user-service with parent POM, creating standalone POM..."
    cat > pom-standalone.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.tdse</groupId>
    <artifactId>user-service</artifactId>
    <version>1.0.0</version>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2022.0.4</spring-cloud.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-function-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-function-adapter-aws</artifactId>
        </dependency>
        <dependency>
            <groupId>com.amazonaws</groupId>
            <artifactId>aws-lambda-java-core</artifactId>
            <version>1.2.2</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-oauth2-jose</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-oauth2-resource-server</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.2.0</version>
        </dependency>
    </dependencies>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>com.tdse.user.UserServiceApplication</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
EOF
    mv pom-standalone.xml pom.xml
    mvn clean package -DskipTests
fi
cd ..

echo "Building post-service..."
cd post-service
if ! mvn clean package -DskipTests; then
    echo "Failed to build post-service with parent POM, creating standalone POM..."
    cat > pom-standalone.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.tdse</groupId>
    <artifactId>post-service</artifactId>
    <version>1.0.0</version>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2022.0.4</spring-cloud.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-function-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-function-adapter-aws</artifactId>
        </dependency>
        <dependency>
            <groupId>com.amazonaws</groupId>
            <artifactId>aws-lambda-java-core</artifactId>
            <version>1.2.2</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.2.0</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-oauth2-jose</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-oauth2-resource-server</artifactId>
        </dependency>
    </dependencies>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>com.tdse.post.PostServiceApplication</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
EOF
    mv pom-standalone.xml pom.xml
    mvn clean package -DskipTests
fi
cd ..

echo "Building stream-service..."
cd stream-service
if ! mvn clean package -DskipTests; then
    echo "Failed to build stream-service with parent POM, creating standalone POM..."
    cat > pom-standalone.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.tdse</groupId>
    <artifactId>stream-service</artifactId>
    <version>1.0.0</version>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>
    
    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2022.0.4</spring-cloud.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-function-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-function-adapter-aws</artifactId>
        </dependency>
        <dependency>
            <groupId>com.amazonaws</groupId>
            <artifactId>aws-lambda-java-core</artifactId>
            <version>1.2.2</version>
        </dependency>
    </dependencies>
    
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <mainClass>com.tdse.stream.StreamServiceApplication</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
EOF
    mv pom-standalone.xml pom.xml
    mvn clean package -DskipTests
fi
cd ..

# Verify JAR files were created
if [ ! -f "user-service/target/user-service-1.0.0.jar" ]; then
    echo "ERROR: user-service JAR not found after Maven build"
    exit 1
fi

if [ ! -f "post-service/target/post-service-1.0.0.jar" ]; then
    echo "ERROR: post-service JAR not found after Maven build"
    exit 1
fi

if [ ! -f "stream-service/target/stream-service-1.0.0.jar" ]; then
    echo "ERROR: stream-service JAR not found after Maven build"
    exit 1
fi

echo "All JAR files created successfully!"

echo "=== Building SAM Application ==="
# Now SAM will use the pre-built JAR files
sam build --region $REGION --base-dir . --debug

echo ""
echo "=== Creating S3 Bucket for Deployment ==="
S3_BUCKET="tdse-microservices-deployment-$(date +%s)"
echo "Creating S3 bucket: $S3_BUCKET"

if ! aws s3api create-bucket --bucket $S3_BUCKET --region $REGION; then
    echo "ERROR: Failed to create S3 bucket"
    exit 1
fi

echo "S3 bucket created successfully: $S3_BUCKET"

echo ""
echo "=== Deploying SAM Application ==="
echo "This will use the pre-created LabRole (no IAM creation needed)"

sam deploy \
    --stack-name $STACK_NAME \
    --region $REGION \
    --no-confirm-changeset \
    --no-fail-on-empty-changeset \
    --capabilities CAPABILITY_AUTO_EXPAND \
    --parameter-overrides Auth0Issuer=$AUTH0_ISSUER Auth0Audience=$AUTH0_AUDIENCE \
    --s3-bucket $S3_BUCKET

echo ""
echo "=== Deployment Complete ==="
echo "Stack Name: $STACK_NAME"
echo "Region: $REGION"

# Get the API Gateway endpoint
API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
    --output text)

echo "API Gateway Endpoint: $API_ENDPOINT"
echo ""
echo "=== API Endpoints ==="
echo "User Service: $API_ENDPOINT/api/users"
echo "Post Service: $API_ENDPOINT/api/posts"
echo "Stream Service: $API_ENDPOINT/api/stream"
echo ""
echo "=== Cleanup Command ==="
echo "To delete the stack when done:"
echo "aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"
echo ""
echo "=== Test the Deployment ==="
echo "Test health endpoint:"
echo "curl -H 'Authorization: Bearer YOUR_JWT_TOKEN' $API_ENDPOINT/api/users/me"
echo ""

# Save stack name for cleanup
echo $STACK_NAME > .stack-name
echo "Stack name saved to .stack-name file"
