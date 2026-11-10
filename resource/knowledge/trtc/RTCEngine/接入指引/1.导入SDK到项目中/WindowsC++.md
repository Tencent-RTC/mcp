---
sync_node_id: '89644534165979136'
nav_path:
  - "RTC Engine"
  - "接入指引"
  - "1. 导入 SDK 到项目中"
  - "Windows C++"
product: "trtc"
---
This document describes how to quickly integrate the TRTC Windows C++ SDK using an MFC project.

## Environment Requirements
- OS: Windows 7 or later

- Development environment: Visual Studio 2010 or later (v2015 is recommended)

### Integrating C++ SDK via MFC project

The following describes how to integrate the TRTC Windows C++ SDK into an MFC project in Visual Studio.

### Step 1. Download the SDK

[Download the SDK](https://liteav.sdk.qcloud.com/download/latest/v1/TXLiteAVSDK_TRTC_Win_latest.zip), decompress, and open it. You only need to import the SDK files for Windows C++ in the `SDK` folder. For example, you can find the SDK files for 64-bit Windows in `./SDK/CPlusPlus/Win64/`. The folder contains the following files:

|Directory|Description|
|---------|---------|
|include|API header files with comments|
|lib|The LIB file for compilation and DLL files to load|

### Step 2. Create a project

Open Visual Studio and create an MFC application named `TRTCDemo`.
To better describe how to integrate quickly, we choose the relatively simple **Dialog-based** type on the **Application Type** page of the wizard.
For other configuration items, keep the default configurations.

### Step 3. Copy and paste files

Copy the `SDK` folder to the directory where `TRTCDemo.vcxproj` is located.

> **Note:**
> Because you will only need the C++ SDK, you can delete the `CSharp` folder in `SDK`.
> 

### Step 4. Modify the project configuration

Select **Solution Explorer**, right-click `TRTCDemo`, and select **Properties**. Configure the project as follows:
1. **Add include directories.**

   Go to **C/C++** > **General**. Add the `$(ProjectDir)SDK\CPlusPlus\Win64\include` and `$(ProjectDir)SDK\CPlusPlus\Win64\include\TRTC` header file directories (for 64-bit Windows) to **Additional Include Directories**.

   > **Note:**
   > 
   > For 32-bit Windows, add `$(ProjectDir)SDK\CPlusPlus\Win32\include` and `$(ProjectDir)SDK\CPlusPlus\Win32\include\TRTC`.
   > 

   

2. **Add additional library directories**

   Go to **Linker** > **General**. Add the `$(ProjectDir)SDK\CPlusPlus\Win64\lib` directory to **Additional Library Directories**.

   > **Note:**
   > 
   > For 32-bit Windows, add `$(ProjectDir)SDK\CPlusPlus\Win32\lib`.
   > 

   

3. **Add the library file**

   Go to **Linker** > **Input**, and add the library file `liteav.lib` to **Additional Dependencies**.

   

4. **Add the copy command**

   Go to **Build Events** > **Post-build Events** and add the copy command `copy /Y $(ProjectDir)SDK\CPlusPlus\Win64\lib\*.dll  $(OutDir)` (for 64-bit Windows) to **Command Line**. This ensures that the DLL files of the SDK are automatically copied to the project's execution directory after compilation.

   > **Note:**
   > 
   > For 32-bit Windows, add `copy /Y $(ProjectDir)SDK\CPlusPlus\Win32\lib\*.dll  $(OutDir)`.
   > 

   

### Step 5. Print the SDK version number
1. At the top of the `TRTCDemoDlg.cpp` file, add the code below to import the header file:

   ``` c++
   #include "ITRTCCloud.h"
   ```
2. In the `CTRTCDemoDlg::OnInitDialog` function, add the following test code:

   ``` c++
   ITRTCCloud * pTRTCCloud = getTRTCShareInstance();
   CString szText;
   szText.Format(L"SDK version: %hs", pTRTCCloud->getSDKVersion());
   
   CWnd *pStatic = GetDlgItem(IDC_STATIC);
   pStatic->SetWindowTextW(szText);
   ```
3. Press F5 to run the project and print the version number of the SDK.

   

## FAQs
- If the following error occurs, check whether the SDK header file directories are correctly added as described in the project configuration step above.

   ``` bash
   fatal error C1083: Could not open include file: "TRTCCloud.h": No such file or directory
   ```
- If the following error occurs, check whether the SDK library directory and library file are correctly added as described in the project configuration step above.

   ``` bash
   error LNK2019: unresolved external symbol "__declspec(dllimport) public: static class TXString __cdecl TRTCCloud::getSDKVersion(void)" (__imp_?getSDKVersion@TRTCCloud@@SA?AVTXString@@XZ), referenced in function "protected: virtual int __thiscall CTRTCDemoDlg::OnInitDialog(void)" (?OnInitDialog@CTRTCDemoDlg@@MAEHXZ)
   ```
