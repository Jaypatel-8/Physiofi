# Admin access – PhysioFi

## Who can see admin login

- **Main login page (`/login`)**  
  Only **Patient** and **Doctor** options are shown. There is no Admin tab.

- **Admin login**  
  Only staff should use it. It is available at a separate URL and via a small link on the main login page:
  - **URL:** [your-site]/**admin/login**
  - **Link on login page:** At the bottom of the form: “Staff? Admin login” (small, subtle).

So only people who know the URL or notice the “Admin login” link can open the admin login form. Everyone else only sees Patient and Doctor.

---

## How to create the first admin (direct access)

Admins are not created via the public site. You create them directly in the database or with a setup script.

### Option 1: Run the setup script (recommended)

From the **project root** (where `package.json` and `setup.js` are):

```bash
node setup.js
```

Or, if you have an npm script:

```bash
npm run setup
```

This will:

1. Connect to MongoDB (using `MONGODB_URI` from `.env`, or `mongodb://localhost:27017/physiofi`).
2. Create a **default admin** if one does not already exist:
   - **Email:** `admin@physiofi.com`
   - **Password:** `admin123`

**First steps after creation:**

1. Go to **/admin/login** and sign in with the credentials above.
2. Change the password (e.g. from the admin dashboard or profile, if that feature exists) or update it in the database.
3. Optionally change the email in the database if you want to use a different admin email.

### Option 2: Create an admin manually in MongoDB

1. Install and use a MongoDB client (e.g. MongoDB Compass, `mongosh`).
2. Connect to the same database your app uses (e.g. `physiofi`).
3. Open the `admins` collection (or the collection name your app uses for the Admin model).
4. Insert a document with at least:
   - `email` (unique)
   - `full_name` (or `name`)
   - `phone`
   - `password_hash`: a **bcrypt** hash of the password (same as your app uses).
   - `role`: e.g. `'superadmin'` or `'staff'`
   - `status`: `'Active'`
   - `userModel` / other fields if your schema requires them.

Generating a bcrypt hash (Node.js, one-off):

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourSecurePassword', 10).then(h => console.log(h));"
```

Use the printed hash as `password_hash` in the document.

### Option 3: Add more admins later

- **By script:** Duplicate the logic in `setup.js` (e.g. in a small script that creates an Admin with `email`, `full_name`, `phone`, `password`) and run it when you need a new admin.
- **By database:** Same as Option 2, inserting a new document in the admins collection with a bcrypt `password_hash`.

---

## Summary

| Question | Answer |
|----------|--------|
| Who can see admin login? | Only people who open **/admin/login** or use the “Admin login” link on the main login page. The main login shows only Patient and Doctor. |
| How do I give admin access? | Create an admin with **node setup.js** (default `admin@physiofi.com` / `admin123`), or add a document in the admins collection with a bcrypt `password_hash`. |
| Where do admins sign in? | **/admin/login** (e.g. `https://yoursite.com/admin/login`). |
