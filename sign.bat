pushd %~dp0

if "%2" == "" (
	set CONFIG=release
) else (
	set CONFIG=%2
)

copy platforms\android\app\build\outputs\apk\%CONFIG%\app-%CONFIG%-unsigned.apk F:\Dev\Projects\GooglePlay
cd F:\Dev\Projects\GooglePlay
"C:\Program Files\Java\jdk1.8.0_181\bin\jarsigner.exe" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore android.keystore app-release-unsigned.apk android-app-key
"C:\Program Files (x86)\Android\android-sdk\build-tools\23.0.1\zipalign.exe" -v 4 app-%CONFIG%-unsigned.apk app-%CONFIG%-signed.apk
mkdir "Free %1"

copy app-%CONFIG%-signed.apk "Free %1"
copy app-%CONFIG%-unsigned.apk "Free %1"

del app-%CONFIG%-unsigned.apk
del app-%CONFIG%-signed.apk

popd