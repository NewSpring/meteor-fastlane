import { execSync as ExecSync } from "child_process";

const prepareApk = (env, cb) => {
  return new Promise((resolve, reject) => {
    console.log("Removing existing apk...");
    try {
      ExecSync("rm $ANDROID_BUILD_FOLDER/production.apk", {
        stdio: [0,1,2],
        env: env,
      });
    } catch (error) {
      console.log("No apk to remove...");
    }

    console.log("Signing Android apk...");
    const signCommand = `
      jarsigner -verbose \
        -sigalg SHA1withRSA \
        -digestalg SHA1 \
        -storepass $ANDROID_STORE_PASS \
        $ANDROID_BUILD_FOLDER/release-unsigned.apk \
        $ANDROID_KEY
    `
    ExecSync(signCommand, {
      stdio: [0,1,2],
      env: env,
    });

    console.log("Aligning Android apk...");
    const alignCommand = `
      $ANDROID_ZIPALIGN 4 \
        $ANDROID_BUILD_FOLDER/release-unsigned.apk \
        $ANDROID_BUILD_FOLDER/production.apk
    `
    ExecSync(alignCommand, {
      stdio: [0,1,2],
      env: env,
    });

    return resolve();

  });
}

export default {
  prepareApk,
}
