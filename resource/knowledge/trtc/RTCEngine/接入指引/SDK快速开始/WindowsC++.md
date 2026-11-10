---
sync_node_id: '150174465859776512'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "SDK 快速开始"
  - "Windows C++"
product: "trtc"
---
This tutorial mainly introduces how to implement a basic audio and video call.

## Prerequisites
- OS: Windows 7 or later.

- Development environment: Visual Studio 2019 or later (v2022 is recommended).

## Integration guideline

### Step 1. Import TRTC SDK
1. Open **Visual Studio** and create your own **MFC** application. On the **MFC Application** page of the wizard, select **Dialog based** for **Application type** and default for other wizard configurations. Then click **Finish**.

   

2. Download the [WIndows SDK](https://liteav.sdk.qcloud.com/download/latest/v1/TXLiteAVSDK_TRTC_Win_latest.zip) and copy the decompressed **SDK** files to the directory where the `.vcxproj` file resides.

   

### Step 2. Configure project

Double-click the `.sln` project file, **Solution Explorer** in the right toolbar > **Right-click menu** for the project > **Properties**, and perform the following configurations:
1. **Add Additional Include Directories:**

   Following **C/C++** > **General** > **Additional Include Directories**, add the **SDK header directory:**`$(ProjectDir)SDK\CPlusPlus\Win64\include` and `$(ProjectDir)SDK\CPlusPlus\Win64\include\TRTC`.

   

2. **Add Additional Library Directories:**

   Following **Linker** > **General** > **Additional Library Directories**, add the **SDK library directory**: `$(ProjectDir)SDK\CPlusPlus\Win64\lib`.

   

3. **Add Additional Dependencies:**

   Following **Linker** > **Input** > **Additional Dependencie**, add **SDK library files**: `liteav.lib`.

   

4. **Add Command line:**

   Following **Build Events** > **Post-Build Event** > **Command line**, add `copy /Y $(ProjectDir)SDK\CPlusPlus\Win64\lib\*.dll  $(OutDir)`.

   

5. **Print SDK version:**

   Double-click the **.cpp** file in **Solution Explorer** and import the **TRTC** header file:

   ``` cpp
   #include "ITRTCCloud.h"
   ```

   > **Note:**
   > 
   > Refer to **"ITRTCCloud.h"** after the existing header file, otherwise you will get an error `ITRTCCloud: undefined identifier`.
   > 

   Add the following codes in the `OnInitDialog` function:

   ``` cpp
   ITRTCCloud * pTRTCCloud = getTRTCShareInstance();
   CString szText;
   szText.Format(L"SDK version: %hs", pTRTCCloud->getSDKVersion());
   
   CWnd *pStatic = GetDlgItem(IDC_STATIC);
   pStatic->SetWindowTextW(szText);
   ```

   After completing the preceding steps, click **Run** to print the SDK version number.

   

   > **Note:**
   > 
   > If you get the error message **"module machine type 'x86' conflicts with target machine type 'x64' "** , select **'x64'** in the solution platform.
   > 

### Step 3. Create TRTC instance
1. Reference the header file `"ITRTCCloud.h"` in the **'PROJECTNAME'.h** file, make the class in this file publicly inherit from **CWinApp** and **ITRTCCloudCallback**, and declare listening events and **TRTCCloud** member variables.

   ``` cpp
   #include "ITRTCCloud.h" // Include the TRTC header file
   
   class CRTCWindowsApp : public CWinApp, public ITRTCCloudCallback
   {
   public:
   	CRTCWindowsApp();
   
   // Overrides
   public:
   	virtual BOOL InitInstance();
   	virtual void onError(TXLiteAVError errCode, const char* errMsg, void* extraInfo) override; // Listen for the 'onError' event
   	virtual void onWarning(TXLiteAVWarning warningCode, const char* warningMsg, void* extraInfo) override; // Listen for the 'onWarning' event
   	virtual void onEnterRoom(int result) override; // Listen for the 'onEnterRoom' event
   	virtual void onExitRoom(int reason) override; // Listen for the 'onExitRoom' event
    
       // Get the TRTCCloud instance
       static CRTCWindowsApp* GetInstance()
   	{
   		return static_cast<CRTCWindowsApp*>(AfxGetApp());
   	}
    
   // Implementation
   	DECLARE_MESSAGE_MAP()
   
   public:
   	ITRTCCloud* trtc_cloud_; // Declare the TRTCCloud member variable
   };
   ```

   > **Note:**
   > 
   > The project name created in this article is **RTCWindows**, replace it with the name of your own project or class throughout the access process.
   > 

2. Initialize the TRTC instance by calling `getTRTCShareInstance` in the `InitInstance` function of the **'PROJECTNAME'.h** file.

   ``` cpp
   // Initialize the TRTCCloud instance and add event listening
   trtc_cloud_ = getTRTCShareInstance();
   trtc_cloud_->addCallback(this);
   ```

   > **Note:**
   > 
   > Recommend to add the codes that initializes the TRTC instance below the `SetRegistryKey(_T("Local AppWizard-Generated Applications"))` method.
   > 

3. Implement the declared listening events.

   ``` cpp
   // Handle the listening events
   void CRTCWindowsApp::onError(TXLiteAVError errCode, const char* errMsg, void* extraInfo) {
   	// Listen for the "onError" event and print the corresponding information
   }
   
   void CRTCWindowsApp::onWarning(TXLiteAVWarning warningCode, const char* warningMsg, void* extraInfo) {
   	// Listen for the "onWarning" event and print the corresponding information
   }
   
   void CRTCWindowsApp::onEnterRoom(int result) { // Listen for the "onEnterRoom" event and print the corresponding information
   	if (result > 0) {
   		MessageBox(NULL, TEXT("Enter room successfully"), TEXT("Notice"), MB_OK | MB_ICONINFORMATION); 
   	}
   	else {
   		MessageBox(NULL, TEXT("Enter room failed"), TEXT("Notice"), MB_OK | MB_ICONINFORMATION); 
   	}
   }
   
   void CRTCWindowsApp::onExitRoom(int reason) { // Listen for the "onExitRoom" event and print the corresponding information
       if (reason == 0) {
           MessageBox(NULL, TEXT("Exit current room by calling the 'exitRoom' api of sdk"), TEXT("Notice"), MB_OK | MB_ICONINFORMATION); 
       } else if (reason == 1) {
           MessageBox(NULL, TEXT("Kicked out of the current room by server through the restful api"), TEXT("Notice"), MB_OK | MB_ICONINFORMATION); 
       } else if (reason == 2) {
           MessageBox(NULL, TEXT("The current room is dissolved by server through the restful api"), TEXT("Notice"), MB_OK | MB_ICONINFORMATION); 
       }
   }
   ```

### Step 4. Enter the room

Add a **Button** component in the resource file **IDD_TRTCDEMO_DIALOG**, double-click the newly created Button. Then set the entry parameter `TRTCParams` and call `enterRoom` to successfully enter the room, which is usually called after clicking the **Start Call** button.

|Parameter|Type|Description|
|---------|---------|---------|
|sdkAppId|number|The sdkAppId of the audio and video application you created in [TRTC Console](https://trtc.io/login).|
|userId|string|User ID specified by you.|
|userSig|string|User signature, refer to [UserSig](https://trtc.io/document/35166).|
|roomId|number|Room ID specified by you, usually a unique room ID. |

For more detailed parameter descriptions,  please refer to the interface document [enterRoom](https://trtc.io/zh/document/50770#b6eb951dc67569848a415ba028f6746d) .
``` cpp
void CRTCWindowsApp::OnBnClickedButton() {
    // Modify the following trtcParams parameters to your own
    liteav::TRTCParams trtcParams;
    trtcParams.sdkAppId = 1400000123;
    trtcParams.userId = "denny"; 
    trtcParams.userSig = "xxx";
    trtcParams.roomId = 123321;

    // For multi-party video calls, `TRTC_APP_SCENE_LIVE` is recommended
    trtc_cloud_->enterRoom(trtcParams, liteav::TRTCAppSceneLIVE);
}
```

### Step 5. Turn on/off Camera
1. In the resource file **IDD_TRTCDEMO_DIALOG**, click **Toolbox** in the left border and add **Picture Control** to the dialog box.

2. Select **Properties** from the right-click menu and select A**FX_IDC_PICTURE** for ID.

3. Add a **Button** component in the resource file **IDD_TRTCDEMO_DIALOG**, double-click the newly created Button. Initialize the **pLocalVideoView** and set the rendering parameter `setLocalRenderParams` for local preview, then call `startLocalPreview` for local preview. After successfully calling `enterRoom`, the stream push will start.

   ``` cpp
   void CRTCWindowsApp::OnBnClickedButton()
   {
   	// Set local preview rendering parameters
   	liteav::TRTCRenderParams render_params;
   	render_params.mirrorType = liteav::TRTCVideoMirrorType_Enable;
   	render_params.fillMode = TRTCVideoFillMode_Fill;
   	ITRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
   	trtcCloud->setLocalRenderParams(render_params);
   
   	// Initialize pLocalVideoView
   	CWnd* pLocalVideoView = GetDlgItem(AFX_IDC_PICTURE);
   	if (pLocalVideoView != nullptr) {
   		auto local_view = (liteav::TXView)(pLocalVideoView->GetSafeHwnd());
           // Preview the collected content locally 
   		trtcCloud->startLocalPreview(local_view);
   	}
   }
   ```

   Call `stopLocalPreview` to turn off the camera preview and stop pushing local video information.

   ``` java
   void CRTCWindowsApp::OnBnClickedButton()
   {
       TRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
       trtcCloud->stopLocalPreview();
   }
   ```

### Step 6. Turn on/off microphone

Call the `startLocalAudio` to turn on microphone capture. **Select one of the following sound** `Quality` **parameters according to your requirements**.
``` cpp
// Enable microphone acquisition and set the current scene to: Voice mode 
// For high noise suppression capability, strong and weak network resistance
ITRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
trtcCloud->startLocalAudio(TRTCAudioQualitySpeech);
```

``` cpp
// Enable microphone acquisition, and set the current scene to: Music mode 
// For high fidelity acquisition, low sound quality loss, recommended to use with professional sound cards
ITRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
trtcCloud->startLocalAudio(TRTCAudioQualityMusic);
```

Call `stopLocalAudio` to turn off microphone collection and stop pushing local audio information.
``` java
ITRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
trtcCloud->stopLocalAudio();
```

### Step 7. Play/stop video streaming
1. Listen to [onUserVideoAvailable](https://trtc.io/document/50771#6d1cb6b1fcf292ac6f34cd8baa) before entering the room. When you receive the `onUserVideoAvailable(userId, true)` notification, it means that there are video frames available to play in the road screen.

2. Call `startRemoteView/stopRemoteView` to play or stop the remote video.

   ``` cpp
   // Play the video
   CWnd* pLocalVideoView = GetDlgItem(AFX_IDC_PICTURE);
   if (pLocalVideoView != nullptr) {
       auto local_view = (liteav::TXView)(pLocalVideoView->GetSafeHwnd());
       ITRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
       trtcCloud->startRemoteView("denny", liteav::TRTCVideoStreamTypeBig, video_view); // Start playing denny's video
   }
   
   // Stop the video
   ITRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
   trtcCloud->stopRemoteView("denny", liteav::TRTCVideoStreamTypeBig); // Stop playing denny's video
   trtcCloud->stopAllRemoteView(); // Stop all videos
   ```

### Step 8. Play/stop the audio stream

Call `muteRemoteAudio` to mute or unmute the remote side's sound.
``` objectivec
// Mute
ITRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
trtcCloud->muteRemoteAudio("denny", true);  // Mute denny

trtcCloud->muteAllRemoteAudio(true); // Mute all remote users
```

``` objectivec
// Unmute
ITRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
trtcCloud->muteRemoteAudio("denny", false); // Unmute denny

trtcCloud->muteAllRemoteAudio(false); // Unmute all remote users
```

### Step 9. Exit the room

Add a **Button** component in the resource file **IDD_TRTCDEMO_DIALOG**, double-click the newly created Button. Call `exitRoom` to exit the current room, and the TRTC SDK will notify you after check-out via the `onExitRoom` callback event.
``` java
// Exit current room
void CRTCWindowsApp::OnBnClickedButton()
{
	ITRTCCloud* trtcCloud = CRTCWindowsApp::GetInstance()->trtc_cloud_;
    trtcCloud->exitRoom();
}
```

## FAQs

API Reference at [API Reference](https://trtc.io/document/35131).

If you encounter any issues during integration and use, please refer to [Frequently Asked Questions](https://trtc.io/document/36058).
