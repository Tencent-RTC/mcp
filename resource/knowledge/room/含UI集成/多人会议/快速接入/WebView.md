---
sync_node_id: '207623890760589312'
nav_path:
  - "视频会议 SDK"
  - "含 UI 集成"
  - "多人会议"
  - "快速接入"
  - "WebView"
product: "room"
---
This document explains how to integrate TUIRoomKit into Android and iOS applications using WebView.

## Use WebView in Native Android Apps

**Java Example**
1. Add a WebView component to your `res/layout/activity_main.xml` file.

   ``` xml
   <?xml version="1.0" encoding="utf-8"?>
   <androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
       xmlns:app="http://schemas.android.com/apk/res-auto"
       xmlns:tools="http://schemas.android.com/tools"
       android:id="@+id/main"
       android:layout_width="match_parent"
       android:layout_height="match_parent"
       tools:context=".MainActivity">
   
       <WebView
           android:id="@+id/web_view"
           android:layout_width="match_parent"
           android:layout_height="match_parent" />
   </androidx.constraintlayout.widget.ConstraintLayout>
   ```
2. Add the required media permissions to your `AndroidManifest.xml` file.

   ``` xml
   <uses-permission android:name="android.permission.INTERNET"/>
   <uses-permission android:name="android.permission.RECORD_AUDIO"/>
   <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"/>
   <uses-permission android:name="android.permission.CAMERA"/>
   <uses-feature android:name="android.hardware.camera.autofocus" android:required="false"/>
   <uses-feature android:name="android.hardware.camera" android:required="false"/>
   ```
3. Implement permission requests in your `MainActivity.java` file.

   ``` java
   package com.example.webview_test; // Replace with your actual package name
   import androidx.appcompat.app.AppCompatActivity;
   import androidx.core.app.ActivityCompat;
   import androidx.core.content.ContextCompat;
   import android.Manifest;
   import android.annotation.TargetApi;
   import android.content.pm.PackageManager;
   import android.os.Build;
   import android.os.Bundle;
   import android.webkit.PermissionRequest;
   import android.webkit.WebChromeClient;
   import android.webkit.WebSettings;
   import android.webkit.WebView;
   import android.webkit.WebViewClient;
   
   public class MainActivity extends AppCompatActivity {
       private static final int MY_PERMISSIONS_RECORD_AUDIO = 1;
       private static final int MY_PERMISSIONS_CAMERA = 1;
       private static final int MY_PERMISSIONS_MODIFY_AUDIO_SETTINGS = 1;
       private WebView webView;
       @Override
       protected void onCreate(Bundle savedInstanceState) {
           super.onCreate(savedInstanceState);
           setContentView(R.layout.activity_main);
           webView = (WebView) findViewById(R.id.web_view);
           webView.setWebViewClient(new WebViewClient());
           webView.loadUrl("https://www.example.com");
           WebSettings webSettings = webView.getSettings();
           webSettings.setJavaScriptEnabled(true);
           webSettings.setDomStorageEnabled(true);
           webSettings.setMediaPlaybackRequiresUserGesture(false);
           webView.setWebChromeClient(new WebChromeClient(){
               @TargetApi(Build.VERSION_CODES.LOLLIPOP)
               @Override
               public void onPermissionRequest(final PermissionRequest request) {
                   request.grant(request.getResources());
               }
           });
   
           if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
               ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, MY_PERMISSIONS_RECORD_AUDIO);
           }
   
           if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
               ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, MY_PERMISSIONS_CAMERA);
           }
   
           if (ContextCompat.checkSelfPermission(this, Manifest.permission.MODIFY_AUDIO_SETTINGS) != PackageManager.PERMISSION_GRANTED) {
               ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.MODIFY_AUDIO_SETTINGS}, MY_PERMISSIONS_MODIFY_AUDIO_SETTINGS);
           }
       }
   }
   ```

## Using WebView in Native HarmonyOS Apps
1. Add a WebView component to the `ability_main.xml` file.

   ``` java
   <?xml version="1.0" encoding="utf-8"?>
   <DirectionalLayout
       xmlns:ohos="http://schemas.huawei.com/res/ohos"
       ohos:height="match_parent"
       ohos:width="match_parent"
       ohos:orientation="vertical">
   
       <WebView
           ohos:id="$+id:web_view"
           ohos:height="match_parent"
           ohos:width="match_parent"
           ohos:background_element="#FFFFFF"/>
   </DirectionalLayout>
   ```
2. Add permission request logic to `MainAbility.java`.

   ``` java
   // MainAbility.java
   import ohos.aafwk.ability.Ability;
   import ohos.aafwk.content.Intent;
   import ohos.agp.components.webengine.WebView;
   import ohos.agp.components.webengine.WebConfig;
   import ohos.agp.components.Component;
   import ohos.bundle.IBundleManager;
   
   public class MainAbility extends Ability {
       private WebView webView;
       private static final int PERMISSION_REQUEST_CODE = 1001;
       @Override
       public void onStart(Intent intent) {
           super.onStart(intent);
           super.setUIContent(ResourceTable.Layout_ability_main);
           // Request necessary permissions
           requestPermissions();
           // Initialize WebView
           initWebView();
       }
   
       private void requestPermissions() {
           String[] permissions = {
               "ohos.permission.MICROPHONE",
               "ohos.permission.CAMERA"
           };
           requestPermissionsFromUser(permissions, PERMISSION_REQUEST_CODE);
       }
   
       private void initWebView() {
           // Get WebView instance
           webView = (WebView) findComponentById(ResourceTable.Id_web_view);
           // Configure WebView
           WebConfig webConfig = webView.getWebConfig();
           // Enable JavaScript
           webConfig.setJavaScriptPermit(true);
           // Load URL
           webView.loadUrl("https://www.example.com");
       }
   }
   ```
3. Add the necessary permission declarations to `config.json`.

   ``` json
   {
       "app": {
           "bundleName": "com.example.webview",
           "vendor": "example",
           "version": {
               "code": 1000000,
               "name": "1.0.0"
           }
       },
       "deviceConfig": {},
       "module": {
           "requestPermissions": [
               {
                   "name": "ohos.permission.INTERNET"
               },
               {
                   "name": "ohos.permission.CAMERA"
               },
               {
                   "name": "ohos.permission.MICROPHONE"
               }
           ]
       }
   }
   ```

## Use WebView in Native iOS Apps
1. Open the `ViewController.swift` file.

2. Import the WebKit framework.

   ``` swift
   import UIKit
   import WebKit
   ```
3. Add a WebView in the ViewController class and load a web page.

   ``` swift
   class ViewController: UIViewController, WKNavigationDelegate {
       var webView: WKWebView!
       override func viewDidLoad() {
           super.viewDidLoad()
           // Create WebView
           webView = WKWebView(frame: self.view.frame)
           webView.navigationDelegate = self
           self.view.addSubview(webView)
           // Load web page
           if let url = URL(string: "https://www.example.com") {
               let request = URLRequest(url: url)
               webView.load(request)
           }
       }
   }
   ```
4. Ensure your app has permissions to access the camera and microphone. Add the following entries to your `Info.plist` file:

   ``` xml
   <key>NSCameraUsageDescription</key>
   <string>We need access to your camera to use certain features.</string>
   <key>NSMicrophoneUsageDescription</key>
   <string>We need access to your microphone to use certain features.</string>
   ```
5. To request permissions at runtime, add the following code in your ViewController:

   ``` swift
   import UIKit
   import WebKit
   
   class ViewController: UIViewController {
       private var webView: WKWebView!
   
       override func viewDidLoad() {
           super.viewDidLoad()
           setupWebView()
           requestPermissions()
           loadWebContent()
       }
   
       private func setupWebView() {
           webView = WKWebView(frame: view.frame)
           webView.navigationDelegate = self
           view.addSubview(webView)
       }
   
       private func loadWebContent() {
           guard let url = URL(string: "https://www.example.com") else {
               return
           }
           let request = URLRequest(url: url)
           webView.load(request)
       }
   
       private func requestPermissions() {
           requestCameraPermission()
           requestMicrophonePermission()
       }
   
       private func requestCameraPermission() {
           let status = AVCaptureDevice.authorizationStatus(for: .video)
           switch status {
           case .authorized:
               print("Camera access granted")
           case .notDetermined:
               AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                   DispatchQueue.main.async {
                       if granted {
                           print("Camera access granted")
                       } else {
                           self?.showPermissionDeniedAlert(for: "Camera")
                       }
                   }
               }
           case .denied, .restricted:
               showPermissionDeniedAlert(for: "Camera")
           @unknown default:
               print("Unknown camera access status")
           }
       }
   
       private func requestMicrophonePermission() {
           let status = AVCaptureDevice.authorizationStatus(for: .audio)
           switch status {
           case .authorized:
               print("Microphone access granted")
           case .notDetermined:
               AVCaptureDevice.requestAccess(for: .audio) { [weak self] granted in
                   DispatchQueue.main.async {
                       if granted {
                           print("Microphone access granted")
                       } else {
                           self?.showPermissionDeniedAlert(for: "Microphone")
                       }
                   }
               }
           case .denied, .restricted:
               showPermissionDeniedAlert(for: "Microphone")
           @unknown default:
               print("Unknown microphone access status")
           }
       }
   
       private func showPermissionDeniedAlert(for device: String) {
           let alert = UIAlertController(
               title: "\(device) Access Required",
               message: "Please enable \(device.lowercased()) access in Settings to use this feature.",
               preferredStyle: .alert
           )
   
           alert.addAction(UIAlertAction(title: "Settings", style: .default) { _ in
               if let settingsURL = URL(string: UIApplication.openSettingsURLString) {
                   UIApplication.shared.open(settingsURL)
               }
           })
   
           alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
   
           present(alert, animated: true)
       }
   }
   
   extension ViewController: WKNavigationDelegate {
       func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
           print("Web page loaded successfully")
       }
   
       func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
           print("Failed to load web page: \(error.localizedDescription)")
       }
   }
   ```

## FAQ

### Does WebView support screen sharing?

WebView currently does not support screen sharing.
