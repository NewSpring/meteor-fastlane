#!/usr/bin/env node
"use strict";

const Vorpal = require('vorpal')(),
      Path = require('path'),
      _ = require('underscore');

const Meteor = require('./lib/meteor'),
      Hockey = require('./lib/hockey'),
      iTunes = require('./lib/iTunes'),
      Android = require('./lib/android'),
      Play = require('./lib/play'),
      Util = require('./lib/util');

let launchFile, launchVars, fastFile, superEnv;

if (Util.launchFile()) {
  launchFile = Path.join(process.cwd(), 'launch.json');
  launchVars = require(launchFile);
  fastFile = {
    FL_FASTFILE: Path.join(__dirname, "fastlane")
  };
  superEnv = _.extend(launchVars, fastFile, process.env);
}

Vorpal
  .command('init', 'Generates launch.json file for environment vars')
  .action(function(args) {
    Util.init(superEnv, (result) => {
      console.log(result);
    })
  });

Vorpal
  .command('build', 'Builds the Meteor app in the .build folder')
  .action(function(args) {
    Meteor.build(superEnv, (result) => {
      return
    })
  });

Vorpal
  .command('hockey', 'Build and deploy to Hockey')
  .action(function(args) {
    Meteor.build(superEnv, (result) => {
      Android.prepareApk(superEnv, (result) => {
        Hockey.uploadAndroid(superEnv, (result) => {
          Hockey.uploadIOS(superEnv, (result) => {
            return
          })
        })
      })
    })
  });

Vorpal
  .command('testflight', 'Build and deploy to TestFlight')
  .action(function(args) {
    Meteor.build(superEnv, (result) => {
      iTunes.uploadTestFlight(superEnv, (result) => {
        return
      })
    })
  });

Vorpal
  .command('appstore', 'Build and deploy to iTunes App Store')
  .action(function(args) {
    Meteor.build(superEnv, (result) => {
      iTunes.uploadAppStore(superEnv, (result) => {
        return
      })
    })
  });

Vorpal
  .command('playstore', 'Build and deploy to Google Play Store')
  .action(function(args) {
    Meteor.build(superEnv, (result) => {
      Android.prepareApk(superEnv, (result) => {
        Play.uploadPlayStore(superEnv, (result) => {
          return
        })
      })
    })
  });

Vorpal
  .command('production', 'Build and deploy to iTunes and Play')
  .action(function(args) {
    Meteor.build(superEnv, (result) => {
      Android.prepareApk(superEnv, (result) => {
        Play.uploadPlayStore(superEnv, (result) => {
          iTunes.uploadAppStore(superEnv, (result) => {
            return
          })
        })
      })
    })
  });

Vorpal
  .parse(process.argv);
