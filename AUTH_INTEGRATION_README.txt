Added:
- AccountPill (language-style segmented control) fixed at top-left via Header.
- Address fields to registration form (line1, line2, city, state, postalCode, country).
- AuthContext extended to store address.
- Shop checkout now sends address inside customer_hint.
How to remove the pill from Home: edit src/pages/Home.tsx and remove <Header /> line.
