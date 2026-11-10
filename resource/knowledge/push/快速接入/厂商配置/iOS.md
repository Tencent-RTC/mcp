---
sync_node_id: '159322791598448640'
nav_path:
  - "推送服务（Push）"
  - "快速接入"
  - "厂商配置"
  - "iOS"
product: "push"
---
Before integrating TIMPush into an iOS App, complete Apple Developer push capability configuration and upload the APNs push certificate in the console. After finishing this guide, you will have the information required for subsequent SDK integration.

## Prerequisites

Before you start, confirm that you have the following:

|Requirement|Description|
|---------|---------|
|Apple Developer account|Used to create App IDs, APNs certificates, provisioning profiles, and App Groups.|
|iOS App Bundle ID|Must match the Bundle Identifier of the main App target in the Xcode project exactly.|
|Tencent Cloud account and Chat app permissions|Used to create a Push app, upload APNs certificates, and obtain subsequent SDK integration parameters.|
|Xcode project|Used for the main App target configuration in this document.|

## Xcode configuration

### Confirm Bundle ID

The Bundle ID is the shared matching key across the APNs push topic, Apple App ID, provisioning profile, Xcode project, and Tencent Cloud APNs certificate configuration. First confirm the Bundle Identifier of the main App target in Xcode.
1. Open the Xcode project.

2. Select the main App target.

3. Click **Signing & Capabilities**.

4. Check the **Bundle Identifier**.

   Record this value. You will need it later in both Apple Developer Center and the console.

   

   > **Note:**
   > 
   > The Bundle ID cannot use the wildcard `*`; otherwise APNs remote push cannot be used.
   > 

### Enable Push Notifications

After confirming the Bundle ID, we recommend enabling Push Notifications on the main App target in Xcode so you do not need to return to Xcode later.
1. Open the Xcode project.

2. Select the main App target.

3. Click **Signing & Capabilities**.

4. Click **+ Capability**.

5. Add **Push Notifications**.

6. Confirm that the **Push Notifications** capability appears on the target.

   

   > **Note:**
   > 
   > Whether you use Xcode automatic signing or manual signing, you must enable Push Notifications on the App ID in Apple Developer Center. See the next Apple Developer Center steps. Automatic signing syncs the provisioning profile automatically; manual signing also requires regenerating and downloading the provisioning profile manually.
   > 

## Apple Developer Center configuration

> **Note:**
> You can follow Apple's official [User Notifications - Setting up a remote notification server](https://developer.apple.com/documentation/usernotifications) documentation for this configuration. If the pages change, follow Apple's latest official documentation.
> 

### Create or confirm the App ID

The App ID declares capabilities for your iOS App. If you already have an App ID that matches the main App Bundle ID (the Bundle Identifier obtained in the previous step), you can confirm its capability configuration directly. If not, create a new App ID by following the steps below.
1. Sign in to [Apple Developer](https://developer.apple.com/account/).

2. Go to **Certificates, Identifiers & Profiles**.

3. In the left navigation pane, select **Identifiers**.

4. Click **+**.

5. Select **App IDs**, then click **Continue**.

6. Select **App**, then click **Continue**.

7. Enter the App ID description and Bundle ID.

8. Click **Continue** and confirm creation.

### Enable the Push Notifications capability

After creating or confirming the App ID, enable Push Notifications for that App ID.
1. In the **Identifiers** list, select the target App ID.

2. Switch to the **Capabilities** tab.

3. Select **Push Notifications**.

4. Click **Save**, and confirm the App ID changes in the dialog.

5. After completion, a **Configure** button appears on the right of the **Push Notifications** row. If you later use a p12 certificate, enter the certificate creation flow from this button. If you use a p8 certificate, you can ignore this button.

   

   After completion, confirm that **Push Notifications** is included in the capability list of the target App ID.

### Choose the APNs certificate type

Apple APNs push certificates mainly use p8 or p12. **For new TIMPush integrations, we recommend using a p8 certificate first**.

|Type|Recommendation|Applicable scenarios|Notes|
|---------|---------|---------|---------|
|p8 certificate|**Recommended**|Preferred for new integrations.|The p8 file can be downloaded only once and must be stored securely. The Auth Key file itself has no expiration date. For handling multiple Bundle IDs, see Confirm Bundle ID above.|
|p12 certificate|Traditional method|Projects that already use a p12 certificate system, or must use certificate-based authentication.|Certificates have an expiration date and require an export password. Since 2020, Apple has merged Sandbox and Production into a single certificate, so you no longer need separate certificates for development and production.|

【Create a p8 certificate (recommended)】

A p8 certificate is an APNs Auth Key used by the Tencent Cloud server to authenticate with APNs. Before creating a p8 certificate, ensure that the App ID and Push Notifications configuration are complete.
1. Sign in to [Apple Developer](https://developer.apple.com/account/).

2. Go to **Certificates, Identifiers & Profiles**.

3. In the left navigation pane, select **Keys**.

4. Click **+** to create a new Key.

5. Enter a Key name.

6. Select **Apple Push Notifications service (APNs)**.

   

7. (Optional) Click **Configure** to further limit the Key scope:

   - **Environment**: Default is Sandbox & Production (shared by development and production). You can also limit it to Sandbox only or Production only.

   - **Topic**: Default is Team-scoped (available to all Apps under the same Team). You can also choose Topic-specific and specify a Bundle ID.

   

For new TIMPush integrations without special security requirements, keep the defaults. This capability is an optional enhancement introduced by Apple in February 2025; existing Keys are not affected.
8. Click **Continue**.

9. After confirming the information, click **Register**.

10. Click **Download** to download the `.p8` file.

> **Warning:**
> The p8 file can be downloaded only once. Store it securely. If the file is lost, you must create a new Key.
> 

Also record the following information. You will need it when uploading to the console later:
| Information | Where to find it |
| --- | --- |
| Key ID | The corresponding row in the Keys list or the Key details page in Apple Developer Center; 10 characters. |
| Team ID | Account information in the upper-right corner of the Apple Developer website, or the <strong>Account > Membership details</strong> page; 10 characters. |
| Bundle ID | The Bundle ID of the main App. |
| p8 file | The <code>.p8</code> file downloaded after creating the Key. |

【Create a p12 certificate (traditional)】

If you choose a p12 certificate, create an APNs push certificate by following the steps below. For detailed rules, see Apple's documentation on how to [Establishing a certificate-based connection to APNs](https://developer.apple.com/documentation/usernotifications/establishing-a-certificate-based-connection-to-apns).
1. Sign in to [Apple Developer](https://developer.apple.com/account/).

2. Go to **Certificates, Identifiers & Profiles**.

3. In the left navigation pane, select **Identifiers**.

4. Select the target App ID.

5. In the **Push Notifications** section, click **Configure**.

6. In the **Production SSL Certificate** section, click **Create Certificate**. Since 2020, Apple SSL certificates have been merged into a single certificate that covers both Sandbox and Production (**Apple Push Notification service SSL (Sandbox & Production)**), so you no longer need separate certificates for development and production.

7. Follow the on-screen instructions to generate a Certificate Signing Request (CSR) file in **Keychain Access** on your Mac.

8. Upload the CSR file and generate the APNs certificate.

9. Download the certificate and double-click to import it into Keychain. After import, the certificate appears under the **login** keychain in the **My Certificates** category.

10. In **Keychain Access** > **login** > **My Certificates**, find the certificate named `Apple Push Services: <Your Bundle ID>`, click the **disclosure triangle** on the left, and confirm that the corresponding **private key** is nested under the certificate.

11. Select both the **certificate** and the **private key**, right-click and choose **Export 2 Items**, set the file format to **Personal Information Exchange (.p12)**, and enter a password in the dialog to protect the p12 file.

> **Note:**
> - You must export the private key together; otherwise the generated p12 file cannot be used for APNs authentication. If there is no private key under the certificate, the CSR was not generated on the current Mac. Go back to the Mac where the CSR was generated and export again.
> - When uploading the p12 certificate to the console, you must enter the certificate password. A missing or incorrect password may cause push failures.

### Create or confirm the provisioning profile

A provisioning profile binds App ID, certificate, device, and other signing information to the Xcode project.

> **Note:**
> If you use **Automatically manage signing** in Xcode, Xcode automatically syncs the provisioning profile after Push Notifications is enabled on the App ID, and you can skip this section. Create a provisioning profile with the steps below only when using manual signing, or when Xcode automatic signing fails and manual handling is required.
> 

To manage manually, create it in Apple Developer Center:
1. Sign in to [Apple Developer](https://developer.apple.com/account/).

2. Go to **Certificates, Identifiers & Profiles**.

3. In the left navigation pane, select **Profiles**.

4. Click **+** to create a new Profile.

5. Depending on the purpose, select **iOS App Development** or **App Store**.

6. Select the App ID corresponding to the main App.

7. Select the signing certificate and devices (development profiles require selecting devices).

8. Enter a Profile name and generate it.

9. Download and install the provisioning profile.

## Console configuration

### Create a Push app in the console and enable the service

After preparing certificates on the Apple side, create a Push app in the console and confirm that the Push service is enabled.
1. Sign in to the [console](https://console.trtc.io/).

2. Go to **Push** > **App Push** > **Overview**.

3. Create or select the target Push app.

4. Record the `SDKAppID` and client key displayed in the console.

5. In the console, confirm the Push service status and complete activation as prompted. Note that creating a Push app does not mean the Push service is already enabled.

   

   After you create a Push app, the console automatically creates a Chat app with the same `SDKAppID`.

   > **Warning:**
   > 
   > The Push key and the Chat key are different and must not be mixed. Later, call `registerPush` with the Push client key; use the Chat key for Chat login.
   > 

### Upload the APNs certificate to the console

After you upload the APNs certificate in the console, the console generates a certificate ID. This certificate ID is the `businessID` used in subsequent SDK integration documents.

Path: **console** > **Push** > **App Push** > **Push Settings** > **Manufacturer configuration** > **iOS** > **Add certificate**.

> **Note:**
> Upload either a p8 or a p12 certificate.
> 

【Upload a p8 certificate (recommended)】
1. Open the iOS APNs certificate configuration page.

2. Select the p8 certificate type.

3. Upload the `.p8` file.

4. Enter the Key ID, Team ID, and Bundle ID.

5. Select the development or production environment as required by the console.

6. Save the configuration.

7. Record the certificate ID generated by the console.

【Upload a p12 certificate】
1. Open the iOS APNs certificate configuration page.

2. Select the p12 certificate type.

3. Upload the `.p12` file.

4. Enter the certificate password set when exporting the p12.

5. Select the development or production environment as required by the console.

6. Save the configuration.

7. Record the certificate ID generated by the console.

> **Note:**
> - When uploading the certificate, confirm that the Bundle ID matches the main App Bundle Identifier. Apps published to the App Store must use the production environment certificate configuration.
> - If the IPA was re-signed (especially with an enterprise certificate), confirm that the enterprise certificate / Provisioning Profile used for re-signing also has Push Notifications enabled in Apple Developer, and that the re-signed IPA still includes the aps-environment entitlement.

## Reach statistics resource configuration (optional)

If you only need to receive regular offline push and do not need to measure push reach rate, skip this section.

If you need to measure push reach rate, prepare App Groups in Apple Developer Center and Xcode as described below. If you later create a Notification Service Extension, you also need to prepare the corresponding App ID and provisioning profile for the Extension.

Reach statistics use iOS [App Groups](https://developer.apple.com/documentation/xcode/configuring-app-groups) to share data between the main App and [UNNotificationServiceExtension](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension). The Extension is invoked by the system before the notification is delivered and reports reach events to TIMPush.

### Create an App Group ID in Apple Developer Center
1. Sign in to [Apple Developer](https://developer.apple.com/account/).

2. Go to **Certificates, Identifiers & Profiles**.

3. In the left navigation pane, select **Identifiers**.

4. Select **App Groups**.

5. Click **+** to create a new App Group.

6. Enter an App Group ID, for example `group.<Your Bundle ID>`. We recommend associating it with the main App Bundle ID for easier identification.

7. Save the configuration.

### Bind App Groups in Apple Developer Center
1. Bind the main App's App ID to this App Group.

2. If you need reach statistics, create or confirm the Extension App ID. The Extension Bundle ID **must be prefixed with the main App Bundle ID** (required by Apple). For example, if the main App Bundle ID is `com.example.myapp`, the Extension Bundle ID should be `com.example.myapp.NotificationServiceExtension`.

3. Bind the Extension App ID to the same App Group.

4. Create or confirm the provisioning profile for the Extension App ID.

### Configure App Groups in Xcode
1. Open the Xcode project.

2. Select the main App target.

3. Click **Signing & Capabilities**.

4. Click **+ Capability**, then add **App Groups**.

5. Select the App Group ID created in Apple Developer Center.

6. If an Extension target already exists in the project, select the same App Group ID on the Extension target.

   

## Configuration checklist

After completing this configuration guide, check the following in order:

|Check item|Expected result|
|---------|---------|
|Bundle ID consistency|The main App Bundle ID is confirmed and is not a wildcard; it matches exactly the Bundle ID bound to the Apple App ID, APNs certificate, and console APNs configuration.|
|Xcode Push capability|The main App target has **Push Notifications** enabled under **Signing & Capabilities**.|
|Apple App ID|The main App App ID has been created or confirmed, and Push Notifications is enabled for that App ID.|
|APNs certificate|A p8 or p12 certificate has been created. For p8, the `.p8` file, Key ID, Team ID, and Bundle ID are saved. For p12, the `.p12` file, certificate password (set at export), and Bundle ID are saved.|
|Provisioning profile|The main App provisioning profile has been created or confirmed (automatic signing is synced by Xcode; manual signing requires regenerating and downloading manually).|
|Tencent Cloud Push app|A Push app has been created in the console, and the `SDKAppID` and client key have been recorded.|
|Push key vs Chat key|You understand that the Push key and Chat key are different. Later, `registerPush` uses the Push client key, and Chat login uses the Chat key; they must not be mixed.|
|Tencent Cloud APNs certificate|The APNs certificate has been uploaded in the console, and the certificate ID generated by the console (that is, `businessID`) has been recorded.|
|Push service activation status|Push service activation has been confirmed in the console (creating a Push app does not mean the service is already enabled).|
|App Group (optional)|If reach statistics are needed, an App Group ID has been created and the same App Group is configured for both the main App and the Notification Service Extension; the corresponding App ID and provisioning profile for the Extension are also prepared.|

Next, go to iOS SDK integration to integrate TIMPush.
