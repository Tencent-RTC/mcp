---
sync_node_id: '124988405690277888'
nav_path:
  - "聊天互动（含 UI）"
  - "国际化语言"
  - "iOS（UIKit）"
product: "chat"
---
## Feature Description

The iOS version of TUIKit comes standard with **Simplified Chinese**, **English**, and **Arabic** language packs, serving as the display languages for the user interface. Guided by this document, you have the option to utilize the default language packs, or to customize the language translations and add additional language packs.

> **Note：**
> Beginning with version 7.5.4852, TUIKit has introduced support for RTL languages (languages with a right-to-left script, such as Arabic and Hebrew), concurrently incorporating Arabic into its built-in languages.
> 

## Using the built-in language

If your app only requires **Simplified Chinese**, **English**, and **Arabic** languages, please .

### Follow the system language

You can use TUIKit directly without any additional steps. The language inside the component will follow the system language.

### Specify the displayed language

Should you require to specify the interface language for TUIKit, please input the desired language in [TUIGlobalization setCustomLanguage:@""]. Once the language is specified, the internal component will no longer follow the system language.
Language selection, value is:
``` Java
@"zh-Hans" ,//Simplified Chinese 
@"en", // English
@"ar", // Arabic
```

> **Note:**
> The language code inventory can be found in the [appendix](#code).
> 

## Utilizing Additional Languages/Customizing Translation Expressions

Should your application necessitate the inclusion of additional languages, or the modification of certain translation entries, please . This chapter illustrates the process of adding new language packs and customizing translations, using the addition of a Korean language pack to the **TUIGroup** component as an example.

### Adding New Language Resource Files

All inherent language packs we provide are stored within the TUICore component of your project's Pods, in the form of String file templates, located at the TUIKitLocalizable/Localizable/ path.

Please create a new directory and name it {language code}.lproj. In this directory, add a new file named Localizable.strings. Here, ${language code} needs to be replaced with the ISO 639-1 language code. (You can directly copy the language file you are familiar with, such as zh-Hans.lproj, and directly modify the directory name.)
Should you require compatibility support for multiple new languages, simply duplicate the necessary files, ensuring each one is accurately assigned its respective language encoding. 

For instance, when adding Korean, create a new language resource file: ko.lproj/Localizable.strings.

### Personalized Custom Translation

The previous step has successfully generated the Korean resource file ko.lproj/Localizable.strings. The keys within the language resource files across different languages remain identical, allowing for customized translations of the specific content.

### Follow System Language

Upon the addition of lproj resource packages for Simplified Chinese, Traditional Chinese, English, Korean, Russian, and Ukrainian, one can directly utilize TUIKit without the necessity for additional steps.

Should there be other languages, they must be added in TUIGlobalization.m's + (NSString *)tk_localizableLanguageKey. The naming of the newly added language entries must adhere to the [standard](#code), as the component will adapt to the system language internally.

> **Note：**
> The inventory of language codes can be found in the[ ISO 639-1 language codes](#code).
> 

### Specified Display Language

Should you require to specify the language for the TUIKit interface, please input the desired language in [TUIGlobalization setCustomLanguage:@""]. Once the language is specified, the internal components will no longer follow the system language.
Language selection, represented by [ISO 639-1 language codes](#code).
Using Korean as an example, [TUIGlobalization setCustomLanguage:@"ko"];

The effect is illustrated as follows:

## Appendix: Language Code Table

|Language|Code|Language|Code|
|---------|---------|---------|---------|
|Arabic|ar|Bulgarian|bg|
|Croatian|hr|Czech|cs|
|Danish language|da|German|de|
|Greek|el|English|en|
|Estonian|et|Spanish|es|
|Finnish|fi|French|fr|
|Irish|ga|Hindi|hi|
|Hungarian|hu|Hebrew|he|
|Italian|it|Japanese|ja|
|Korean|ko|Latvian|lv|
|Lithuanian|lt|Dutch|nl|
|Norwegian|no|Polish|pl|
|Portuguese|pt|Swedish|sv|
|Romanian|ro|Russian|ru|
|Serbian|sr|Slovak|sk|
|Slovenian|sl|Thai|th|
|Turkish|tr|Ukrainian|uk|
|Chinese (Simplified)|zh-Hans|Chinese (Traditional)|zh-Hant|

For the complete version, please refer [here](https://quickref.me/iso-639-1).
