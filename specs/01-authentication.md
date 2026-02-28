# Feature: Authentication & Authorization

## Overview

ระบบ Authentication ใช้ JWT Token-based แบบ **dual-token** (Access Token + Refresh Token)
โดยทั้งสอง token ถูกเก็บใน **httpOnly cookie** เพื่อป้องกัน XSS
Middleware ของ Next.js ทำหน้าที่ guard ทุก route และ auto-refresh access token โดยอัตโนมัติ

---

## Pages

### 1. Login Page (`/login`)

- **Route**: `src/app/(auth)/login/page.tsx`
- **Component**: `LoginForm`
- เข้าสู่ระบบด้วย Email + Password
- เมื่อ login สำเร็จ server จะ set cookie `accessToken` และ `refreshToken` แล้ว redirect ไปหน้า Dashboard
- Redux store (`authSlice`) เก็บข้อมูล user ที่ login อยู่

### 2. Change Password Page (`/change-password`)

- **Route**: `src/app/(dashboard)/change-password/page.tsx`
- **Component**: `ChangePasswordForm`
- เปลี่ยนรหัสผ่านของ user ที่ login อยู่ (ต้องกรอกรหัสเดิม)

---

## Token System

| Token         | Cookie Name    | อายุ    | Cookie Flags         |
| ------------- | -------------- | ------- | -------------------- |
| Access Token  | `accessToken`  | 1 วัน   | httpOnly, Secure*    |
| Refresh Token | `refreshToken` | 7 วัน   | httpOnly, Secure*    |

> *Secure flag เปิดเฉพาะ production (`NODE_ENV === "production"`)

---

## Auth Flow

### Login

```
1. User กรอก email + password ที่ /login
2. POST /api/auth/login
3. Backend ตรวจสอบ credentials ด้วย bcryptjs
4. สร้าง accessToken (1d) + refreshToken (7d) ด้วย jose (HS256)
5. Set cookie ทั้งสอง token (httpOnly)
6. Return user data → Redux store บันทึก user
7. Redirect ไปหน้า Dashboard
```

### Token Verification (Middleware)

```
Request เข้ามาทุก route ที่ไม่ใช่ public:
  ↓
มี accessToken cookie และ valid?
  → ✅ ผ่าน
  ↓
accessToken หมดอายุ/invalid + มี refreshToken valid?
  → สร้าง accessToken ใหม่ ตั้ง cookie → ✅ ผ่าน (transparent to client)
  ↓
ไม่มี token ที่ valid:
  → API route: return 401 Unauthorized
  → Page route: redirect ไป /login
```

### Session Restore (เมื่อ App โหลด)

```
1. AuthProvider เรียก GET /api/auth/me
2. Middleware ตรวจสอบ accessToken (auto-refresh ถ้าต้องการ)
3. ถ้าสำเร็จ → บันทึก user ใน Redux store
4. ถ้าล้มเหลว → dispatch logout() → เคลียร์ Redux state
```

### Logout

```
1. User กด Log out (UserProfileButton)
2. POST /api/auth/logout → server clear cookies ทั้งสอง
3. dispatch logout() → เคลียร์ Redux state
4. Redirect ไปหน้า /login
```

---

## Roles

| Role        | Description                                |
| ----------- | ------------------------------------------ |
| `admin`     | ผู้ดูแลทั่วไป - จัดการเนื้อหาได้            |
| `superadmin`| ผู้ดูแลระบบระดับสูงสุด - จัดการเนื้อหาและ users ได้ |

---

## API Endpoints

| Method | Endpoint                    | Auth Required | Description                           |
| ------ | --------------------------- | ------------- | ------------------------------------- |
| POST   | `/api/auth/login`           | ❌            | เข้าสู่ระบบ set accessToken + refreshToken cookie |
| GET    | `/api/auth/me`              | ✅            | ดึงข้อมูล user ที่ login อยู่          |
| POST   | `/api/auth/logout`          | ✅            | ออกจากระบบ (clear cookies)            |
| POST   | `/api/auth/refresh`         | refreshToken cookie | ขอ accessToken ใหม่              |
| POST   | `/api/auth/change-password` | ✅            | เปลี่ยนรหัสผ่าน                       |

---

## Middleware Protection

**File**: `src/middleware.ts`

**Public paths** (ไม่ต้องมี token):
- `/_next/*` — Static assets
- `/api/auth/login`
- `/api/auth/refresh`
- `/login`

**Protected paths** (ทุกอย่างนอกจาก public):
- Page route → redirect `/login` ถ้าไม่มี valid token
- API route → return `401 Unauthorized` ถ้าไม่มี valid token

---

## State Management

```typescript
// Redux: authSlice (src/store/slices/authSlice.ts)
{
  auth: {
    user: { id, email, name, role } | null
    isAuthenticated: boolean
    token: string | null  // ไม่ได้ใช้จริง (token อยู่ใน httpOnly cookie)
  }
}

// Actions
setCredentials({ user, token })  // เมื่อ login / restore session
logout()                          // เมื่อ logout หรือ session invalid
```

---

## Key Files

| File | Description |
| ---- | ----------- |
| `src/middleware.ts` | Route protection + auto token refresh |
| `src/lib/auth.ts` | `hashPassword`, `verifyPassword` (bcryptjs) |
| `src/lib/jwt.ts` | `createToken`, `verifyToken` (jose HS256) |
| `src/store/slices/authSlice.ts` | Redux auth state |
| `src/components/providers/auth-provider.tsx` | Session restore เมื่อ app โหลด |
| `src/components/features/auth/login-form.tsx` | Login form |
| `src/components/features/auth/change-password-form.tsx` | Change password form |
| `src/components/layouts/user-profile-button.tsx` | Logout button + แสดง user info |
| `src/app/api/auth/login/route.ts` | Login API |
| `src/app/api/auth/logout/route.ts` | Logout API (clear cookies) |
| `src/app/api/auth/refresh/route.ts` | Refresh token API |
| `src/app/api/auth/me/route.ts` | Current user info API |
| `src/app/api/auth/change-password/route.ts` | Change password API |
