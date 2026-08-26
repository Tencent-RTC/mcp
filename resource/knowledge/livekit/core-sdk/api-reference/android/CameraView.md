## Introduction

`CameraView` is a view component specifically designed to display camera preview. When starting camera test, the camera rendering view will be displayed on this view.

> **Note:**
> This class is only available on Android platform.
>

## Features
- **Camera Preview**: Used to display real-time view during camera testing.

- **Multiple Construction Methods**: Supports multiple constructors for different use cases.

## API List

|**Function**|**Description**|
|---------|---------|
|CameraView(Context)|Constructor.|
|CameraView(SurfaceView)|Constructor.|
|CameraView(Context, AttributeSet)|Constructor.|
|CameraView(Context, AttributeSet, SurfaceView)|Constructor.|

### Creating Instance

#### CameraView(Context)

Constructor.

#### CameraView(SurfaceView)

Constructor.

#### CameraView(Context, AttributeSet)

Constructor.

#### CameraView(Context, AttributeSet, SurfaceView)

Constructor.

## Usage Example
``` kotlin
// Method 1: Create via Context
val cameraView = CameraView(context)
// Method 2: Create via SurfaceView
val surfaceView = SurfaceView(context)
val cameraView = CameraView(surfaceView)
// Method 3: Use in XML layout
// <io.trtc.tuikit.atomicxcore.api.view.CameraView
//     android:id="@+id/camera_view"
//     android:layout_width="match_parent"
//     android:layout_height="match_parent" />
```
