TUIKit Flutter includes built-in language packs for **Simplified Chinese, Traditional Chinese, English, Japanese, Korean, and Arabic**. These packs allow you to set the user interface language easily. With a simple configuration, you can enable dynamic language switching in your app.

## Using Built-in Languages

### Language Setup

``` javascript
  @override
  Widget build(BuildContext context) {
    return ComponentTheme(
      child: MultiProvider(
        providers: [
          // Language provider for dynamic language switching; notifies components when the language changes
          ChangeNotifierProvider.value(value: LocaleProvider()),
        ],
        child: Builder(builder: (context) {
          final themeState = BaseThemeProvider.of(context);
          final isDarkMode = themeState.isDarkMode;
          // Access the language provider
          final localeProvider = Provider.of<LocaleProvider>(context);
          return MaterialApp(
            // ...... other configurations omitted
            localizationsDelegates: const [
              AtomicLocalizations.delegate,
            // ...... you can add other localization delegates for additional components
            ],
            supportedLocales: AtomicLocalizations.supportedLocales, // Supported app languages
            locale: localeProvider.locale, // Current language setting
          );
        }),
      ),
    );
```

### System Language Adaptation

Once language configuration is complete, the plugin automatically matches the system language by default.

### Real-time Language Switching

`LocaleProvider` offers a `changeLanguage` method for switching languages at runtime. The selected language is cached locally, so your app will remember the user's choice after restart by reading the value from the `locale` field.

For implementation details, refer to the [settings page demo](https://github.com/Tencent-RTC/TUIKit_Flutter/blob/main/chat/demo/lib/pages/settings_page.dart). To switch languages, obtain the `LocaleProvider` instance and call `changeLanguage`:
``` javascript
final localeProvider = Provider.of<LocaleProvider>(context, listen: false);
// Switch to English
localeProvider.changeLanguage('en');
```

After switching languages, the `State` subclass of a `StatefulWidget` will trigger the `didChangeDependencies` lifecycle method. In this method, initialize the `AtomicLocalizations` object and use the built-in localized entries.

Example:
``` javascript
class ContactList extends StatefulWidget {
  const ContactList({
    super.key,
  });

  @override
  State<ContactList> createState() => _ContactListState();
}

class _ContactListState extends State<ContactList> {
  late AtomicLocalizations atomicLocale;
  // Other code omitted

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Initialize localization dynamically
    atomicLocale = AtomicLocalizations.of(context);
  }

  @override
  Widget build(BuildContext context) {
    // Display the addFriend label in the current language
    return Text(atomicLocale.addFriend);
  }
}
```

## Custom Internationalization

To add custom internationalization, integrate the tuikit_atomic_x component from source as described in [TUIKit Flutter](https://www.tencentcloud.com/document/product/1047/77489).

### Adding Language Resource Files

Localization entries are stored in `.arb` files in the [l10n](https://github.com/Tencent-RTC/TUIKit_Flutter/tree/main/atomic-x/lib/base_component/l10n) directory. To add a new language, create a new `.arb` file with the appropriate language code and translate all entries.
- Create the file: Copy an existing language file and rename it to `l10n_xx.arb` (for example, Spanish: `l10n_es.arb`).

- Translate the content: Update all entries in the new file with translations for your target language.

   Next, run the `flutter gen-l10n` command in the component's root directory. This will update the localizations directory with your new language file.

    Add logic in `locale_provider.dart` to cache Spanish locally, then call `changeLanguage('es')` to switch to Spanish.

### Customizing Translations

All language keys in the resource files under the l10n directory are consistent. You can modify or add translations as needed, then run the `flutter gen-l10n` command in the component's root directory to update the localization files.
