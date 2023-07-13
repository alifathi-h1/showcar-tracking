pipeline {
  // Execute the pipeline on the master, stages will still be executed on the agents
  agent none 

  options {
    timestamps() // Enable timestamps in the build log
    disableConcurrentBuilds() // The pipeline should run only once at a time
    preserveStashes(buildCount: 5)
    buildDiscarder(logRotator(daysToKeepStr: '90'))
  }

  // Environment variables for all stages
  environment {
    AWS_DEFAULT_REGION="eu-west-1"
    SERVICE="brave-flamingo"
  }

  stages {
    stage('Build') {
      when {
        beforeAgent true
        branch 'master'
      }

      agent { node { label 'build-as24assets' } }

      steps {
        sh './deploy/build.sh'
        stash includes: 'dist/**/*', name: 'output-dist'
      }
    }

    stage('DeployProd') {
      when {
        beforeAgent true
        branch 'master'
      }

      environment {
        BRANCH="master"
      }

      agent { node { label 'deploy-as24assets' } }

      steps {
        unstash 'output-dist'
        sh './deploy/deploy.sh'
      }
    }
  }
  
  post {
    changed {
      script {
        if (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'main') {
          slackSend channel: 'bsg-ignition-fizz',
          color: determineSlackMessageStatus(),
          message: "The pipeline <${env.BUILD_URL}|${currentBuild.fullDisplayName}> changed to ${currentBuild.currentResult}."
        }
      }
    }
  }
}
