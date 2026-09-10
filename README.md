# Firebase setup for Bhartiya Bazar

The browser SDK is initialized in `client/src/firebase/config.js` using the supplied Firebase Web config.

In Firebase Console for project `bhartiya-bazar-9ef00`:

1. Authentication → Sign-in method → enable **Phone** and **Email/Password**.
2. Firestore Database → create the database in **Test mode** for development.
3. Storage → enable the default bucket.
4. Firestore → create document `settings/appConfig` with:

```json
{
  "commissionPercent": 5,
  "referralBonus": 20,
  "referralCommissionPercent": 1
}
```

5. For development-only rules, use:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

This rule is intentionally insecure and must be replaced before production. Product photos upload to `shops/{shopId}/products/{timestamp}_{filename}` through `uploadProductPhoto()`.
