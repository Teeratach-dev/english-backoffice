# Feature: Dashboard

## Overview

หน้า Dashboard แสดงภาพรวมของข้อมูลทั้งหมดในระบบผ่าน Statistics Cards

## Page

- **Route**: `src/app/(dashboard)/page.tsx`
- **URL**: `/` (root, protected)
- เป็นหน้าแรกหลังจาก login สำเร็จ

## Statistics Cards

Dashboard แสดง cards สรุปจำนวนข้อมูลต่อไปนี้:

| Card             | Description              | Icon         |
| ---------------- | ------------------------ | ------------ |
| Total Users      | จำนวน users ทั้งหมด      | Users        |
| Active Courses   | จำนวน courses ที่ active  | BookOpen     |
| Topics           | จำนวน topics ทั้งหมด     | FileText     |
| Session Groups   | จำนวน session groups     | FolderOpen   |
| Session Details  | จำนวน sessions ทั้งหมด   | Layers       |
| Templates        | จำนวน templates ทั้งหมด  | LayoutTemplate |

## Data Source

- **Service**: `DashboardService.getDashboardStats()`
- ดึง count จากทุก collection ใน MongoDB ด้วย aggregation

## Key Files

- `src/app/(dashboard)/page.tsx` - Dashboard page
- `src/services/dashboard.service.ts` - Statistics aggregation service
