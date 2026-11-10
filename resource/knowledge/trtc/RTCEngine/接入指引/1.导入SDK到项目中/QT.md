---
sync_node_id: '89644534009741312'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "1. 导入 SDK 到项目中"
  - "QT"
product: "trtc"
---
This document describes how to quickly integrate the TRTC Windows or macOS SDK into your project using Qt.

## Integration for Windows

### Development environment requirements
- OS: Windows 7 or later

- Development environment: Visual Studio 2015 or later (you need to set up a Qt development environment). Visual Studio 2015 is recommended.

   > **Note:**
   > 
   > If you are not sure how to set up a Qt development environment in Visual Studio, see step 4 in [README](https://github.com/tencentyun/TRTCSDK/blob/master/Windows/QTDemo/README.md).
   > 

### Directions

The following describes how to integrate the TRTC Windows C++ SDK into a Qt project in Visual Studio.

#### Step 1. Download the SDK

Download the latest version of the [TRTC SDK](https://liteav.sdk.qcloud.com/download/latest/v1/TXLiteAVSDK_TRTC_Win_latest.zip).

You only need to import the SDK files for Windows C++ in the `SDK` folder. For example, you can find the SDK files for 64-bit Windows in `./SDK/CPlusPlus/Win64/`. The folder contains the following files:

|Directory|Description|
|---------|---------|
|include|API header files with comments|
|lib|The LIB file for compilation and DLL files to load|

#### Step 2. Create a project

Take Visual Studio 2015 for example. Make sure you have installed Qt and [Qt Visual Studio Add-in](https://download.qt.io/archive/vsaddin/2.6.0/qt-vsaddin-msvc2015-2.6.0.vsix). Then, open Visual Studio and create a Qt application named `TRTCDemo`.

For the example in this guide, **Qt Widgets Application** is chosen. Click **Add**, and then click **Next** in subsequent steps until the project is created.

#### Step 3. Copy and paste files

Copy the `SDK` folder to the directory where `TRTCDemo.vcxproj` is located.

> **Note:**
> Because you will only need the C++ SDK, you can delete the `CSharp` folder in `SDK`.
> 

#### Step 4. Modify project configuration

Select **Solution Explorer**, right-click `TRTCDemo`, and select **Properties**. Configure the project as follows:
1. **Add include directories.**
Go **C/C++** > **General**. Add the `$(ProjectDir)SDK\CPlusPlus\Win64\include` and `$(ProjectDir)SDK\CPlusPlus\Win64\include\TRTC` header file directories (for 64-bit Windows) to **Additional Include Directories**.

   > **Note:**
   > 
   > For 32-bit Windows, add `$(ProjectDir)SDK\CPlusPlus\Win32\include` and `$(ProjectDir)SDK\CPlusPlus\Win32\include\TRTC`.
   > 

   

2. **Add additional library directories**

   Go to **Linker** > **General**. Add the `$(ProjectDir)SDK\CPlusPlus\Win64\lib` directory (for 64-bit Windows) to Additional **Library Directories**.

   > **Note:**
   > 
   > For 32-bit Windows, add `$(ProjectDir)SDK\CPlusPlus\Win32\lib`.
   > 

   

3. **Add the library file**

   Go to **Linker** > **Input**, and add the library file `liteav.lib` to **Additional Dependencies**.

   

4. **Add the copy command**

   Go to **Build Events** > **Post-build Events** and add the copy command `copy /Y $(ProjectDir)SDK\CPlusPlus\Win64\lib\*.dll  $(OutDir)` (for 64-bit Windows) to **Command Line**. This ensures that the DLL files of the SDK are automatically copied to the project’s execution directory after compilation.

   > **Note:**
   > 
   > For 32-bit Windows, add `copy /Y $(ProjectDir)SDK\CPlusPlus\Win32\lib\*.dll  $(OutDir)`.
   > 

   

#### Step 5. Print the SDK version number
1. At the top of the `TRTCDemo.cpp` file, add the code below to import the header file:

   ``` c++
   #include "ITRTCCloud.h"
   #include <QLabel>
   ```
2. In the `TRTCDemo::TRTCDemo` constructor of `TRTCDemo.cpp`, add the following testing code:

   ``` C++
   ITRTCCloud * pTRTCCloud = getTRTCShareInstance();
   std::string version(pTRTCCloud->getSDKVersion());
   
   QString sdk_version = QString("SDK Version: %1").arg(version.c_str());
   QLabel* label_text = new QLabel(this);
   label_text->setAlignment(Qt::AlignCenter);
   label_text->resize(this->width(), this->height());
   label_text->setText(sdk_version);
   ```
3. Press F5 to run the project and print the version number of the SDK.

   

## Integration for macOS

### Development environment requirements
- OS: OS X 10.10 or later

- Development environment: Qt Creator 4.10.3 or later (Qt Creator 4.13.3 or later is recommended.)

- Development framework: Qt 5.10 or later

### Directions

This section uses a QtTest project as an example to show you how to integrate the TRTC C++ SDK into your project in Qt Creator.

1. **Download the cross-platform C++ SDK**

   1. Download the [SDK](https://liteav.sdk.qcloud.com/download/latest/TXLiteAVSDK_TRTC_Mac_latest.tar.bz2), and decompress and open the file.

   2. Create an empty folder for the SDK in the same directory as your QtTest project, and copy `TXLiteAVSDKTRTCMacx.x.x/SDK/TXLiteAVSDKTRTC_Mac.framework` to the folder.

2. **Configure QTTest.pro**
Go to the directory of your QtTest project, open `QTTest.pro` with a text editor, and add the following SDK references.

   ``` MAC
   INCLUDEPATH += $$PWD/.
   DEPENDPATH += $$PWD/.
   
   LIBS += "-F$$PWD/base/util/mac/usersig"
   LIBS += "-F$$PWD/../SDK"
   LIBS += -framework TXLiteAVSDK_TRTC_Mac
   LIBS += -framework Accelerate
   LIBS += -framework AudioUnit
   
   INCLUDEPATH += $$PWD/../SDK/TXLiteAVSDK_TRTC_Mac.framework/Headers/cpp_interface
   
   INCLUDEPATH += $$PWD/base/util/mac/usersig/include
   DEPENDPATH += $$PWD/base/util/mac/usersig/include
   ```
3. **Grant camera and mic permissions**
The TRTC SDK will use the device’s camera and mic, so you need to add permission requests to `Info.plist`.

   ``` none
   NSMicrophoneUsageDescription: requesting mic access
   NSCameraUsageDescription: requesting camera access
   ```

4. **Reference the TRTC SDK**

   - Reference the SDK via the header file: `#include "ITRTCCloud.h"`.

   - Use the namespace: The methods and types of cross-platform C++ APIs are all defined in the `trtc` namespace. To simplify your code, we recommend you use the `trtc` namespace.

      > **Note:**
      > 
      > This concludes the integration process, and you can proceed to compile your project. You can download [QTDemo](https://github.com/tencentyun/TRTCSDK/tree/master/Mac) to get more information on the use of cross-platform APIs of the SDK.
      > 

## FAQs
- If the following error occurs, check whether the SDK header file directories are correctly added as described in the project configuration step above.

   ``` bash
   fatal error C1083: Could not open include file: “TRTCCloud.h”: No such file or directory
   ```
- If the following error occurs, check whether the SDK library directory and library file are correctly added as described in the project configuration step above.

   ``` bash
   error LNK2019: unresolved external symbol "__declspec(dllimport) public: static class TXString __cdecl TRTCCloud::getSDKVersion(void)" (__imp_?getSDKVersion@TRTCCloud@@SA?AVTXString@@XZ), referenced in function "protected: virtual int __thiscall CTRTCDemoDlg::OnInitDialog(void)" (?OnInitDialog@CTRTCDemoDlg@@MAEHXZ)
   ```
