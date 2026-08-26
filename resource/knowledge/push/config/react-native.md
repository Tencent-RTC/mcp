React Native push currently supports vendor channels such as Xiaomi, Huawei, Honor, OPPO, vivo, Meizu, APNs, OnePlus, realme, iQOO, FCM, and Apple.

> **Note:**
> Each vendor only supports the configuration of one certificate.
>

【iOS】

Before integrating **@tencentcloud/react-native-push**, you need to apply for an APNs push certificate from Apple and upload it to the Chat console. Then follow the Quick Connection steps to integrate.

There are currently two mainstream types of certificates for Apple Manufacturer Configuration: p12 certificates and p8 certificates. Each type of certificate has its advantages and drawbacks, and you can choose one according to your needs.
|  | <strong>Certificate Type</strong> | <strong>Validity Period and Management</strong> | <strong>Security</strong> | <strong>Dynamic Island</strong> |
| --- | --- | --- | --- | --- |
| <strong>p12 Certificate</strong> | A p12 certificate is a binary file containing a public key and a private key, used for certificate-based authentication. It bundles the public key certificate and the private key into one file with the extension .p12 or .pfx. | A p12 certificate typically has a validity period of one year and needs to be regenerated and deployed after expiration. Each application requires a separate p12 certificate to handle push notifications. | A p12 certificate uses certificate-based authentication and requires storing the private key on the server. This may increase security risks as the private key could be accessed by unauthorized users. | Not supported. |
| <strong>p8 Certificate</strong> | A p8 certificate is an Auth Key used for token-based authentication. It is a text file containing a private key with the extension .p8. | A p8 certificate does not have an expiration date, so you do not need to worry about certificate expiration. Additionally, using a p8 certificate simplifies certificate management as you can use one p8 certificate to provide push notification services for multiple applications. | A p8 certificate uses token-based authentication, which means your server periodically generates a JSON Web Token (JWT) to establish a connection with APNs. This method is more secure as it does not require storing the private key on the server. | Support Dynamic Island Push |

##
1. Using a p12 certificate (traditional push certificate)

### Step 1: Apply for an APNs certificate

#### Enable remote push for the app
1. log in to [Apple Developer Center](https://developer.apple.com/account/) website, click **Certificates, Identifiers & Profiles** or the sidebar's **Certificates, IDs & Profiles**, enter the **Certificates, IDS & Profiles** page.

2. click the **+** next to Identifiers.

3. You can follow the steps below to create a new AppID or add a `Push Notification` `Service` to your existing AppID.

   > **Note:**
   >
   >  Your App's `Bundle ID` cannot use the wildcard `*`, otherwise, the remote push service cannot be used.
   >

4. Check the **App IDs** box, click **Continue** to proceed to the next step.

5. Select **App**, click **Continue** to proceed to the next step.

6. Configure the `Bundle ID` and other information, click **Continue** to proceed to the next step.

7. Check the **Push Notifications** box to enable the remote push service.

#### Certificate Generation
1. Select your AppID and choose **Configure**.

3. We first select the **Create Certificate** for the Development environment, the system will prompt us that we need a Certificate Signing Request (CSR).

4. On a Mac, open **Keychain Access tool**, in the menu select **Keychain Access** > **Certificate Assistant** > **Request a Certificate From a Certificate Authority** (`Keychain Access - Certificate Assistant - Request a Certificate From a Certificate Authority`).

5. Enter your email address, Common Name (your name or company name), select **Save to disk**, click **continue**, the system will generate a `*.certSigningRequest` file.

6. Go back to the page on the Apple Developer website mentioned in Step 3, click **Choose File** to upload the generated `*.certSigningRequest` file.

7. Click **Continue** to generate the push certificate.

8. click **Download** to download the `Development SSL Certificate` to your local environment.

9. Repeat steps 1 - 8 above to download the `Production SSL Certificate` for the production environment to your local machine.

   > **Note:**
   >
   > The certificate for the production environment is actually a combined certificate of Development (Sandbox) + Production, and it can be used as a certificate for both the development and production environments.
   >

10. Double-click the downloaded `SSL Certificate` for the development and production environments. The system will import it into the keychain.

11. Open the Keychain App, go to **log in to** > **My Certificates**, right-click to export the newly created `Apple Development IOS Push Services` and `Apple Push Services` for the development and production environments as `p12` files respectively.

   > **Note**
   >
   >  Note: Set the password when saving the `.p12` file.
   >

### Step 2: Upload the certificate to the console
1. Log in to the [Chat Console](https://console.trtc.io/chat/push-plugin-push-identifier).

2. Enter **Access Settings** > **Manufacturer Configuration** > **iOS**.

3. Click **Add Certificate**.

4. Select the certificate type, upload the iOS Certificate (.p12), set the certificate password, and click **Confirm**.

> **Note:**
> - We recommend naming the uploaded certificate in English (special characters such as brackets are not allowed).
> - You need to set a password for the uploaded certificate. Without a password, push notifications cannot be received.
> - For an app published on App Store, the environment of the certificate must be the production environment. Otherwise, push notifications cannot be received.
> - The uploaded .p12 certificate must be your own authentic and valid certificate.

## Second, using a p8 certificate (supports Dynamic Island push notifications)

p8 Certificate: A p8 certificate does not have an expiration date, so you don't have to worry about the certificate expiring. Moreover, using a p8 certificate can simplify certificate management, as you can use a single p8 certificate to provide push notification services for multiple applications. In addition, p8 certificates support Dynamic Island push notifications.

### Step 1: Apply for an APNs certificate

To create a p8 certificate file, first log in to [Apple Developer Center](https://developer.apple.com/).

1.  Enter Certificates, Identifiers & Profiles: In the top right corner of the page, click **Account**, then select **Certificates, Identifiers & Profiles** from the dropdown menu.

2. To create a new App ID: in the left-hand menu, click **Identifiers**, then click the **+** on the right to create a new App ID. Fill in the relevant information and click **Continue**.

3. To create a new key: in the left-hand menu, click **Keys**, then click the **+** on the right to create a new key. Enter the name of the key, then check **Apple Push Notifications service (APNs)** and click **Continue**.

Confirm and generate the key: On the confirmation page, verify your key information, then click **Register**. Next, you'll see a page prompting you to download the key. Click **Download** and save the generated .p8 file to your computer.

   > **Note:**
   >
   > - The p8 certificate can only be downloaded once; please save it properly.
   > - Please safeguard the downloaded p8 file, as you will not be able to download it again. You can use this p8 certificate to configure your iOS applications to receive push notifications.

### Step 2: Upload the p8 certificate to the Chat console
1. Log in to the [Chat Console](https://console.trtc.io/chat/push-plugin-push-identifier).

2. Click the target app card to go to the basic configuration page of the app.

3. Click **iOS Native Offline Push Settings** on the right side and then click **Add Certificate**.

4. Select the .p8 certificate, upload the iOS Certificate (.p8), set **KeyID、TeamID and BundleID**, and click **Confirm**.

> **Note:**
> - **KeyID**: This is the unique identifier for your APNs Auth Key. When you create a new APNs Auth Key in the Apple Developer Center, a Key ID will be generated for you. You can find it in the "Certificates, Identifiers & Profiles" section under "Keys".
> - **TeamID**: This is the unique identifier for your developer account. You can find it on the account details page of the Apple Developer Center. Click "Membership" in the upper right corner, and you can find your Team ID in the "Membership Details" section.
> - **BundleID**: This is the unique identifier for your application, also known as the app ID. You can find it in the "Certificates, Identifiers & Profiles" section of the Apple Developer Center. Select "Identifiers", then find the corresponding Bundle ID in your list of applications.

【Android】

## Operation Steps

### Step 1. Register your app with vendor push platforms

Offline push requires you to register your app with each vendor's push platform to obtain parameters such as AppID and AppKey, enabling the offline push feature. Currently, the domestic smartphone vendors supported are: [Xiaomi](https://dev.mi.com/console/doc/detail), [Huawei](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/service-introduction-0000001050040060), [Honor](https://developer.hihonor.com/cn/kitdoc), [OPPO](https://open.oppomobile.com/wiki/doc#id=10195), [VIVO](https://dev.vivo.com.cn/documentCenter/doc/281), [Meizu](https://open.flyme.cn/service/3), and overseas support includes [Google FCM](https://console.firebase.google.com/u/0/).

### Step 2. Create resources in the Chat console

Log in to Tencent Cloud [Chat Console](https://console.trtc.io/chat/push-plugin-push-identifier), under **Push Management** > **Access Settings** feature tab, add the push certificates for each vendor, and configure the AppId, AppKey, AppSecret, and other parameters obtained in step one to the added push certificates.

> **Note:**
> Regarding the **Action after Click** option, to use the click-to-navigate feature provided by this plugin, please keep the default value unchanged, which is usually `Open a specified page within the app` with default settings. (Note)
>
> To use the reporting statistics feature, also keep this item at its default value. (Note)
>

【Mi】

【Huawei】
| Vendor Push Platform | Configuring in the Chat console |
| --- | --- |
|  | <strong>Note:</strong><br>Client ID corresponds to AppID, and Client Secret corresponds to AppSecret. |

#### Receipt configuration

**Receipt Address:**
- Singapore : https://apisgp.im.qcloud.com/v3/offline_push_report/huawei

- Korea: https://apikr.im.qcloud.com/v3/offline_push_report/huawei

- USA: https://apiusa.im.qcloud.com/v3/offline_push_report/huawei

- Germany: https://apiger.im.qcloud.com/v3/offline_push_report/huawei

- Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/huawei

- China: https://api.im.qcloud.com/v3/offline_push_report/huawei

【OPPO】

【vivo】

#### Receipt configuration

**Receipt Address:**
- Singapore :https://apisgp.im.qcloud.com/v3/offline_push_report/vivo

- Korea:https://apikr.im.qcloud.com/v3/offline_push_report/vivo

- USA: https://apiusa.im.qcloud.com/v3/offline_push_report/vivo

- Germany: https://apiger.im.qcloud.com/v3/offline_push_report/vivo

- Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/vivo

- China: https://api.im.qcloud.com/v3/offline_push_report/vivo

【Meizu】

#### Receipt configuration

**Receipt Address:**
- Singapore : https://apisgp.im.qcloud.com/v3/offline_push_report/meizu

- Korea: https://apikr.im.qcloud.com/v3/offline_push_report/meizu

- USA: https://apiusa.im.qcloud.com/v3/offline_push_report/meizu

- Germany: https://apiger.im.qcloud.com/v3/offline_push_report/meizu

- Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/meizu

- China: https://api.im.qcloud.com/v3/offline_push_report/meizu

【HONOR】

#### Receipt configuration

**Receipt Address:**
- Singapore : https://apisgp.im.qcloud.com/v3/offline_push_report/honor

- Korea: https://apikr.im.qcloud.com/v3/offline_push_report/honor

- USA: https://apiusa.im.qcloud.com/v3/offline_push_report/honor

- Germany: https://apiger.im.qcloud.com/v3/offline_push_report/honor

- Indonesia: https://apiidn.im.qcloud.com/v3/offline_push_report/honor

- China: https://api.im.qcloud.com/v3/offline_push_report/honor

【Google FCM】

