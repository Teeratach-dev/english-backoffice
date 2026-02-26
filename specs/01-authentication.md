# Feature: Authentication & Authorization

## Overview

ระบบ Authentication ใช้ JWT token-based สำหรับจัดการการเข้าสู่ระบบและการควบคุมสิทธิ์ผู้ใช้

## Pages

### 1. Login Page (`/login`)

- **Route**: `src/app/(auth)/login/page.tsx`
- **Component**: `LoginForm`
- เข้าสู่ระบบด้วย Email + Password
- เมื่อ login สำเร็จจะ redirect ไปหน้า Dashboard
- JWT token ถูกเก็บใน httpOnly cookie

### 2. Change Password Page (`/change-password`)

- **Route**: `src/app/(dashboard)/change-password/page.tsx`
- **Component**: `ChangePasswordForm`
- เปลี่ยนรหัสผ่านของ user ที่ login อยู่
- ต้อง login ก่อนถึงจะเข้าถึงได้

## Roles

| Role        | Description                     |
| ----------- | ------------------------------- |
| `admin`     | ผู้ดูแลทั่วไป                   |
| `superadmin`| ผู้ดูแลระบบระดับสูงสุด          |

## Auth Flow

1. User กรอก email/password ที่หน้า `/login`
2. Frontend ส่ง `POST /api/auth/login`
3. Backend ตรวจสอบ credentials ด้วย bcryptjs
4. สร้าง JWT token ด้วย jose แล้วส่งกลับ
5. Token ถูกเก็บใน Redux store (`authSlice`) และ cookie
6. ทุก request ที่ต้องการ auth จะแนบ token ไปด้วย
7. `AuthProvider` จะ restore session จาก `GET /api/auth/me` เมื่อ app โหลด

## API Endpoints

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| POST   | `/api/auth/login`         | เข้าสู่ระบบ            |
| GET    | `/api/auth/me`            | ดึงข้อมูล user ปัจจุบัน |
| POST   | `/api/auth/change-password`| เปลี่ยนรหัสผ่าน       |

## State Management

```typescript
// Redux: authSlice
{
  auth: {
    user: { id, email, name, role } | null
    isAuthenticated: boolean
    token: string | null
  }
}

// Actions
- setCredentials(user, token) // login
- logout()                    // logout
```

## Key Files

- `src/lib/auth.ts` - hashPassword, verifyPassword (bcryptjs)
- `src/lib/jwt.ts` - createToken, verifyToken (jose)
- `src/store/slices/authSlice.ts` - Redux auth state
- `src/components/providers/auth-provider.tsx` - Session restore on load
- `src/components/features/auth/login-form.tsx` - Login form component
- `src/components/features/auth/change-password-form.tsx` - Change password form
