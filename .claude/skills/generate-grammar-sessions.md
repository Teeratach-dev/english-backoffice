# Sub-Skill: Generate Grammar Sessions

สร้าง Session Detail type `grammar` สำหรับแอปเรียนภาษาอังกฤษ
เน้นสอนกฎไวยากรณ์ที่เกี่ยวข้องกับหัวข้อของ Session Group พร้อมตัวอย่างและฝึกทำ

## Input ที่รับจาก Workflow

- `sessionGroupName` — ชื่อ session group
- `objectives` — วัตถุประสงค์ของ session group
- `cefrLevel` — ระดับ CEFR
- `concept` — concept (กฎไวยากรณ์, pattern, ตัวอย่างถูก/ผิด)

## Action Types ที่ใช้

| Action | หน้าที่ใน Grammar |
|--------|-------------------|
| `explain` | อธิบายกฎ, สูตร, pattern, หมายเหตุ |
| `reading` | ตัวอย่างประโยคถูก/ผิด |
| `image` | ภาพโครงสร้างไวยากรณ์, ตาราง |
| `fill_sentence_with_choice` | ฝึกเติมคำตามกฎที่เรียน |

## Screen Template

### Pattern A: กฎ + โครงสร้าง + ตัวอย่าง + ฝึกทำ (4 screens)

```
Screen 1: "Grammar Rule"
  [explain] — ชื่อกฎ (center, size 22, bold)
  [explain] — อธิบายกฎอย่างละเอียด (left, size 16)

Screen 2: "Structure"
  [image] — ภาพโครงสร้าง/ตาราง (placeholder "")
  [explain] — สูตร/Pattern เช่น "Subject + is/am/are + Adjective"

Screen 3: "Examples"
  [reading] — ตัวอย่างถูก ✓ (คำสำคัญ highlight)
  [reading] — ตัวอย่างถูก ✓
  [reading] — ตัวอย่างผิด ✗ (พร้อมอธิบายว่าผิดตรงไหน)

Screen 4: "Practice"
  [explain] — "ลองทำดู" (center, size 18)
  [fill_sentence_with_choice] — เติมคำตามกฎที่เรียน
  [fill_sentence_with_choice] — อีกข้อ
```

### Pattern B: กฎซับซ้อน แบ่งหลาย sessions (3 screens ต่อ session)

```
Session "Grammar 1 - กฎหลัก":
  Screen 1: กฎหลัก + โครงสร้าง
  Screen 2: ตัวอย่าง
  Screen 3: ฝึกทำ

Session "Grammar 2 - ข้อยกเว้น":
  Screen 1: ข้อยกเว้น + กรณีพิเศษ
  Screen 2: ตัวอย่าง
  Screen 3: ฝึกทำ
```

## JSON Template ตัวอย่าง (Pattern A)

```json
{
  "name": "Grammar - ตำแหน่งของ Adjective ในประโยค",
  "type": "grammar",
  "cefrLevel": "A1",
  "sequence": 3,
  "isActive": true,
  "screens": [
    {
      "id": "uuid-1",
      "sequence": 0,
      "actions": [
        {
          "id": "uuid-1-1",
          "type": "explain",
          "sequence": 0,
          "text": [
            { "text": "ตำแหน่งของ", "translation": [], "isBlank": false },
            { "text": "Adjective", "translation": ["คำคุณศัพท์"], "isBlank": false, "bold": true },
            { "text": "ในประโยค", "translation": [], "isBlank": false }
          ],
          "alignment": "center",
          "size": 22
        },
        {
          "id": "uuid-1-2",
          "type": "explain",
          "sequence": 1,
          "text": [
            { "text": "Adjective", "translation": ["คำคุณศัพท์"], "isBlank": false, "bold": true },
            { "text": "วางได้", "translation": [], "isBlank": false },
            { "text": "2", "translation": [], "isBlank": false, "bold": true },
            { "text": "ตำแหน่ง:", "translation": [], "isBlank": false }
          ],
          "alignment": "left",
          "size": 16
        },
        {
          "id": "uuid-1-3",
          "type": "explain",
          "sequence": 2,
          "text": [
            { "text": "1.", "translation": [], "isBlank": false, "bold": true },
            { "text": "หน้า", "translation": [], "isBlank": false },
            { "text": "Noun:", "translation": ["คำนาม"], "isBlank": false, "bold": true },
            { "text": "a", "translation": [], "isBlank": false },
            { "text": "big", "translation": ["ใหญ่"], "isBlank": false, "highlight": true },
            { "text": "house", "translation": ["บ้าน"], "isBlank": false }
          ],
          "alignment": "left",
          "size": 16
        },
        {
          "id": "uuid-1-4",
          "type": "explain",
          "sequence": 3,
          "text": [
            { "text": "2.", "translation": [], "isBlank": false, "bold": true },
            { "text": "หลัง", "translation": [], "isBlank": false },
            { "text": "Verb", "translation": ["คำกริยา"], "isBlank": false, "bold": true },
            { "text": "to", "translation": [], "isBlank": false },
            { "text": "be:", "translation": [], "isBlank": false, "bold": true },
            { "text": "The", "translation": [], "isBlank": false },
            { "text": "house", "translation": ["บ้าน"], "isBlank": false },
            { "text": "is", "translation": ["คือ"], "isBlank": false, "underline": true },
            { "text": "big.", "translation": ["ใหญ่"], "isBlank": false, "highlight": true }
          ],
          "alignment": "left",
          "size": 16
        }
      ]
    },
    {
      "id": "uuid-2",
      "sequence": 1,
      "actions": [
        {
          "id": "uuid-2-1",
          "type": "image",
          "sequence": 0,
          "url": ""
        },
        {
          "id": "uuid-2-2",
          "type": "explain",
          "sequence": 1,
          "text": [
            { "text": "Pattern:", "translation": [], "isBlank": false, "bold": true },
            { "text": "Subject", "translation": ["ประธาน"], "isBlank": false, "underline": true },
            { "text": "+", "translation": [], "isBlank": false },
            { "text": "is/am/are", "translation": [], "isBlank": false, "underline": true },
            { "text": "+", "translation": [], "isBlank": false },
            { "text": "Adjective", "translation": ["คำคุณศัพท์"], "isBlank": false, "highlight": true }
          ],
          "alignment": "center",
          "size": 18
        }
      ]
    },
    {
      "id": "uuid-3",
      "sequence": 2,
      "actions": [
        {
          "id": "uuid-3-1",
          "type": "reading",
          "sequence": 0,
          "text": [
            { "text": "✓", "translation": [], "isBlank": false, "bold": true },
            { "text": "She", "translation": ["เธอ"], "isBlank": false },
            { "text": "is", "translation": ["คือ"], "isBlank": false },
            { "text": "beautiful.", "translation": ["สวยงาม"], "isBlank": false, "highlight": true }
          ],
          "audioUrl": "",
          "isHide": false,
          "isReadable": true
        },
        {
          "id": "uuid-3-2",
          "type": "reading",
          "sequence": 1,
          "text": [
            { "text": "✓", "translation": [], "isBlank": false, "bold": true },
            { "text": "A", "translation": [], "isBlank": false },
            { "text": "tall", "translation": ["สูง"], "isBlank": false, "highlight": true },
            { "text": "man", "translation": ["ผู้ชาย"], "isBlank": false },
            { "text": "is", "translation": ["กำลัง"], "isBlank": false },
            { "text": "standing.", "translation": ["ยืน"], "isBlank": false }
          ],
          "audioUrl": "",
          "isHide": false,
          "isReadable": true
        },
        {
          "id": "uuid-3-3",
          "type": "reading",
          "sequence": 2,
          "text": [
            { "text": "✗", "translation": [], "isBlank": false, "bold": true },
            { "text": "She", "translation": ["เธอ"], "isBlank": false },
            { "text": "is", "translation": ["คือ"], "isBlank": false },
            { "text": "beauty.", "translation": ["ความสวย (นาม)"], "isBlank": false, "highlight": true }
          ],
          "audioUrl": "",
          "isHide": false,
          "isReadable": true
        },
        {
          "id": "uuid-3-4",
          "type": "explain",
          "sequence": 3,
          "text": [
            { "text": "→", "translation": [], "isBlank": false },
            { "text": "beauty", "translation": ["ความสวย"], "isBlank": false, "bold": true },
            { "text": "เป็น", "translation": [], "isBlank": false },
            { "text": "Noun", "translation": ["คำนาม"], "isBlank": false, "bold": true },
            { "text": "ต้องใช้", "translation": [], "isBlank": false },
            { "text": "beautiful", "translation": ["สวยงาม"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "ซึ่งเป็น", "translation": [], "isBlank": false },
            { "text": "Adjective", "translation": ["คำคุณศัพท์"], "isBlank": false, "bold": true }
          ],
          "alignment": "left",
          "size": 14
        }
      ]
    },
    {
      "id": "uuid-4",
      "sequence": 3,
      "actions": [
        {
          "id": "uuid-4-1",
          "type": "explain",
          "sequence": 0,
          "text": [
            { "text": "ลองทำดู!", "translation": [], "isBlank": false, "bold": true }
          ],
          "alignment": "center",
          "size": 18
        },
        {
          "id": "uuid-4-2",
          "type": "fill_sentence_with_choice",
          "sequence": 1,
          "sentence": [
            {
              "text": { "text": "The", "translation": [], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "cat", "translation": ["แมว"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "is", "translation": ["คือ"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "small", "translation": ["เล็ก"], "isBlank": false },
              "isBlank": true,
              "inSentence": true
            },
            {
              "text": { "text": "smallness", "translation": ["ความเล็ก (นาม)"], "isBlank": false },
              "isBlank": false,
              "inSentence": false
            },
            {
              "text": { "text": "smally", "translation": ["(ไม่มีคำนี้)"], "isBlank": false },
              "isBlank": false,
              "inSentence": false
            }
          ]
        },
        {
          "id": "uuid-4-3",
          "type": "fill_sentence_with_choice",
          "sequence": 2,
          "sentence": [
            {
              "text": { "text": "He", "translation": ["เขา"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "is", "translation": ["คือ"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "a", "translation": [], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "kind", "translation": ["ใจดี"], "isBlank": false },
              "isBlank": true,
              "inSentence": true
            },
            {
              "text": { "text": "person.", "translation": ["คน"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "kindness", "translation": ["ความใจดี (นาม)"], "isBlank": false },
              "isBlank": false,
              "inSentence": false
            },
            {
              "text": { "text": "kindly", "translation": ["อย่างใจดี (วิเศษณ์)"], "isBlank": false },
              "isBlank": false,
              "inSentence": false
            }
          ]
        }
      ]
    }
  ]
}
```

## Guidelines เฉพาะ Grammar

1. **อธิบายกฎชัดเจน** — ใช้ภาษาไทยผสมอังกฤษ ให้คนไทยเข้าใจง่าย
2. **ต้องมี Pattern/สูตร** — เช่น "Subject + is/am/are + Adjective"
3. **ตัวอย่างต้องมีทั้งถูกและผิด** — ✓ ถูก + ✗ ผิด พร้อมอธิบายว่าผิดตรงไหน
4. **Distractors ต้องเป็นคำผิด form** — เช่น ใช้ noun แทน adjective, ใช้ adverb แทน adjective
5. **ฝึกทำต้อง 2-3 ข้อ** — ไม่ใช่แค่ข้อเดียว
6. **ถ้ากฎซับซ้อน ให้แบ่ง sessions** — เช่น "Grammar 1 - กฎหลัก", "Grammar 2 - ข้อยกเว้น"
7. **คำศัพท์ที่ใช้ต้อง highlight** — ให้เห็นชัดว่าส่วนไหนคือ adjective
8. **ปริมาณตาม CEFR**:
   - A1: กฎเดียว ตัวอย่าง 3 ประโยค ฝึก 2 ข้อ
   - A2: กฎ 1-2 ข้อ ตัวอย่าง 4 ประโยค ฝึก 3 ข้อ
   - B1+: กฎซับซ้อน ตัวอย่าง 5+ ประโยค ฝึก 3-4 ข้อ
