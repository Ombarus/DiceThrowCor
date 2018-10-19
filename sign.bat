pushd %~dp0

copy platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk C:\Dev\Projects\GooglePlay
cd C:\Dev\Projects\GooglePlay
"C:\Program Files\Java\jdk1.8.0_181\bin\jarsigner.exe" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android.keystore app-release-unsigned.apk android-app-key
"C:\Program Files (x86)\Android\android-sdk\build-tools\23.0.1\zipalign.exe" -v 4 app-release-unsigned.apk app-release-signed.apk
mkdir "Free %1"

copy app-release-signed.apk "Free %1"
copy app-release-unsigned.apk "Free %1"

del app-release-unsigned.apk
del app-release-signed.apk

popd