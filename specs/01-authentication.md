# Feature: Authentication & Authorization

## Overview

ระบบ Authentication ใช้ JWT Token-based แบบ **single-token**
โดย token ถูกเก็บใน **httpOnly cookie** ชื่อ `token` เพื่อป้องกัน XSS
รองรับทั้ง **cookie** (สำหรับ browser) และ **Bearer token** ใน `Authorization` header (สำหรับ external client / mobile app)
Middleware ของ Next.js (`src/proxy.ts`) ทำหน้าที่ guard ทุก route

---

## Pages

### 1. Login Page (`/login`)

- **Route**: `src/app/(auth)/login/page.tsx`
- **Component**: `LoginForm`
- เข้าสู่ระบบด้วย Email + Password
- เมื่อ login สำเร็จ server จะ set cookie `token` และ return `token` ใน response body แล้ว redirect ไปหน้า Dashboard
- Redux store (`authSlice`) เก็บข้อมูล user ที่ login อยู่

### 2. Change Password Page (`/change-password`)

- **Route**: `src/app/(dashboard)/change-password/page.tsx`
- **Component**: `ChangePasswordForm`
- เปลี่ยนรหัสผ่านของ user ที่ login อยู่ (ต้องกรอกรหัสเดิม)

---

## Token System

| Token | Cookie Name | อายุ  | Cookie Flags      |
| ----- | ----------- | ----- | ----------------- |
| JWT   | `token`     | 1 วัน | httpOnly, Secure* |

> *Secure flag เปิดเฉพาะ production (`NODE_ENV === "production"`)

### การส่ง Token

API รองรับ 2 วิธีในการส่ง token (ลำดับความสำคัญ: cookie ก่อน, Bearer fallback):

1. **Cookie** (สำหรับ browser) — browser จะแนบ cookie `token` ไปอัตโนมัติ
2. **Authorization header** (สำหรับ external client) — `Authorization: Bearer <token>`

Shared utility: `src/lib/auth-utils.ts`
- `getTokenFromRequest(req)` — ดึง token จาก cookie หรือ Bearer header
- `getUserIdFromRequest(req)` — ดึง token + verify แล้ว return userId

---

## Auth Flow

### Login

```
1. User กรอก email + password ที่ /login
2. POST /api/auth/login
3. Backend ตรวจสอบ credentials ด้วย bcryptjs
4. สร้าง JWT token (1d) ด้วย jose (HS256)
5. Set cookie `token` (httpOnly) + return token ใน response body
6. Return user data → Redux store บันทึก user
7. Redirect ไปหน้า Dashboard
```

### Token Verification (Middleware — `src/proxy.ts`)

```
Request เข้ามาทุก route ที่ไม่ใช่ public:
  ↓
มี token cookie และ valid?
  → ✅ ผ่าน
  ↓
(เฉพาะ API route) มี Authorization: Bearer token และ valid?
  → ✅ ผ่าน
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
2. dispatch logout() → เคลียร์ Redux state
3. Redirect ไปหน้า /login
```

> **หมายเหตุ:** ยังไม่มี `/api/auth/logout` endpoint — ปัจจุบัน logout เป็นแค่ client-side (เคลียร์ Redux state + redirect)

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
| POST   | `/api/auth/login`           | ❌            | เข้าสู่ระบบ set `token` cookie + return token ใน body |
| GET    | `/api/auth/me`              | ✅            | ดึงข้อมูล user ที่ login อยู่          |
| POST   | `/api/auth/change-password` | ✅            | เปลี่ยนรหัสผ่าน                       |

---

## Middleware Protection

**File**: `src/proxy.ts` (เรียกจาก `src/middleware.ts`)

**Public paths** (ไม่ต้องมี token):
- `/_next/*` — Static assets
- `/api/auth/login`
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
| `src/middleware.ts` | Route protection (เรียก proxy.ts) |
| `src/proxy.ts` | Token verification logic (cookie + Bearer) |
| `src/lib/auth.ts` | `hashPassword`, `verifyPassword` (bcryptjs) |
| `src/lib/jwt.ts` | `createToken`, `verifyToken` (jose HS256) |
| `src/lib/auth-utils.ts` | `getTokenFromRequest`, `getUserIdFromRequest` (shared utility) |
| `src/store/slices/authSlice.ts` | Redux auth state |
| `src/components/providers/auth-provider.tsx` | Session restore เมื่อ app โหลด |
| `src/components/features/auth/login-form.tsx` | Login form |
| `src/components/features/auth/change-password-form.tsx` | Change password form |
| `src/components/layouts/user-profile-button.tsx` | Logout button + แสดง user info |
| `src/app/api/auth/login/route.ts` | Login API (set cookie + return token) |
| `src/app/api/auth/me/route.ts` | Current user info API |
| `src/app/api/auth/change-password/route.ts` | Change password API |
