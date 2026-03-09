# Sub-Skill: Generate Listening Sessions

สร้าง Session Detail type `listening` สำหรับแอปเรียนภาษาอังกฤษ
เน้นให้ผู้เรียนฝึกฟัง เข้าใจเนื้อหาจากการฟัง จับใจความสำคัญได้

## Input ที่รับจาก Workflow

- `sessionGroupName` — ชื่อ session group
- `objectives` — วัตถุประสงค์ของ session group
- `cefrLevel` — ระดับ CEFR
- `concept` — concept (คำศัพท์, สถานการณ์, บทสนทนา)

## Action Types ที่ใช้

| Action | หน้าที่ใน Listening |
|--------|---------------------|
| `explain` | คำแนะนำ "ฟังบทสนทนาต่อไปนี้" |
| `audio` | ไฟล์เสียง (เสียงบทสนทนา, เสียงคำถาม) |
| `chat` | แสดงบทสนทนาพร้อมเสียง |
| `choice` | ตอบคำถามจากที่ฟัง |
| `fill_sentence_with_choice` | เติมคำจากที่ฟัง |

## Screen Template

### Pattern A: ฟังบทสนทนา + ตอบคำถาม (3 screens)

```
Screen 1: "Listen to Conversation"
  [explain] — "ฟังบทสนทนาต่อไปนี้แล้วตอบคำถาม"
  [audio] — เสียงบทสนทนาทั้งหมด (placeholder "")
  [chat] — ตัวละคร A พูด (พร้อม audioUrl)
  [chat] — ตัวละคร B ตอบ (พร้อม audioUrl)
  [chat] — ตัวละคร A พูดต่อ
  [chat] — ตัวละคร B ตอบ

Screen 2: "Listen & Answer"
  [audio] — เสียงคำถาม (placeholder "")
  [explain] — คำถาม
  [choice] — ตัวเลือกคำตอบ (3-4 ตัวเลือก)

Screen 3: "Listen & Fill"
  [audio] — เสียงประโยค (placeholder "")
  [fill_sentence_with_choice] — เติมคำที่หายจากที่ฟัง
```

### Pattern B: ฟังเสียงเดี่ยว + จับใจความ (2 screens)

```
Screen 1: "Listen"
  [explain] — "ฟังข้อความต่อไปนี้"
  [audio] — เสียงข้อความ (placeholder "")

Screen 2: "Comprehension"
  [choice] — "ข้อความนี้พูดเกี่ยวกับอะไร?"
  [choice] — "คำใดถูกต้องตามที่ฟัง?"
```

## JSON Template ตัวอย่าง (Pattern A)

```json
{
  "name": "Listening - ฟังคำคุณศัพท์ในบทสนทนา",
  "type": "listening",
  "cefrLevel": "A1",
  "sequence": 2,
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
            { "text": "ฟังบทสนทนาต่อไปนี้แล้วตอบคำถาม", "translation": [], "isBlank": false, "bold": true }
          ],
          "alignment": "center",
          "size": 18
        },
        {
          "id": "uuid-1-2",
          "type": "audio",
          "sequence": 1,
          "audio": ""
        },
        {
          "id": "uuid-1-3",
          "type": "chat",
          "sequence": 2,
          "sender": { "name": "Anna", "imageUrl": "" },
          "position": "left",
          "text": [
            { "text": "This", "translation": ["นี่"], "isBlank": false },
            { "text": "is", "translation": ["คือ"], "isBlank": false },
            { "text": "a", "translation": [], "isBlank": false },
            { "text": "beautiful", "translation": ["สวยงาม"], "isBlank": false, "bold": true, "highlight": true },
            { "text": "park.", "translation": ["สวนสาธารณะ"], "isBlank": false }
          ],
          "audioUrl": "",
          "isDisplay": true,
          "isReadable": true
        },
        {
          "id": "uuid-1-4",
          "type": "chat",
          "sequence": 3,
          "sender": { "name": "Ben", "imageUrl": "" },
          "position": "right",
          "text": [
            { "text": "Yes,", "translation": ["ใช่"], "isBlank": false },
            { "text": "and", "translation": ["และ"], "isBlank": false },
            { "text": "the", "translation": [], "isBlank": false },
            { "text": "flowers", "translation": ["ดอกไม้"], "isBlank": false },
            { "text": "are", "translation": ["เป็น/อยู่/คือ"], "isBlank": false },
            { "text": "colorful.", "translation": ["สีสันสดใส"], "isBlank": false, "bold": true, "highlight": true }
          ],
          "audioUrl": "",
          "isDisplay": true,
          "isReadable": true
        }
      ]
    },
    {
      "id": "uuid-2",
      "sequence": 1,
      "actions": [
        {
          "id": "uuid-2-1",
          "type": "audio",
          "sequence": 0,
          "audio": ""
        },
        {
          "id": "uuid-2-2",
          "type": "explain",
          "sequence": 1,
          "text": [
            { "text": "Anna", "translation": [], "isBlank": false },
            { "text": "said", "translation": ["พูดว่า"], "isBlank": false },
            { "text": "the", "translation": [], "isBlank": false },
            { "text": "park", "translation": ["สวนสาธารณะ"], "isBlank": false },
            { "text": "is", "translation": ["คือ"], "isBlank": false },
            { "text": "___", "translation": [], "isBlank": false }
          ],
          "alignment": "left",
          "size": 16
        },
        {
          "id": "uuid-2-3",
          "type": "choice",
          "sequence": 2,
          "items": [
            {
              "text": { "text": "beautiful", "translation": ["สวยงาม"], "isBlank": false },
              "isCorrect": true
            },
            {
              "text": { "text": "ugly", "translation": ["น่าเกลียด"], "isBlank": false },
              "isCorrect": false
            },
            {
              "text": { "text": "small", "translation": ["เล็ก"], "isBlank": false },
              "isCorrect": false
            }
          ]
        }
      ]
    },
    {
      "id": "uuid-3",
      "sequence": 2,
      "actions": [
        {
          "id": "uuid-3-1",
          "type": "audio",
          "sequence": 0,
          "audio": ""
        },
        {
          "id": "uuid-3-2",
          "type": "fill_sentence_with_choice",
          "sequence": 1,
          "sentence": [
            {
              "text": { "text": "The", "translation": [], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "flowers", "translation": ["ดอกไม้"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "are", "translation": ["เป็น/อยู่/คือ"], "isBlank": false },
              "isBlank": false,
              "inSentence": true
            },
            {
              "text": { "text": "colorful", "translation": ["สีสันสดใส"], "isBlank": false },
              "isBlank": true,
              "inSentence": true
            },
            {
              "text": { "text": "boring", "translation": ["น่าเบื่อ"], "isBlank": false },
              "isBlank": false,
              "inSentence": false
            },
            {
              "text": { "text": "expensive", "translation": ["แพง"], "isBlank": false },
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

## Guidelines เฉพาะ Listening

1. **Audio URL ใส่ "" เสมอ** — เป็น placeholder ยังไม่มี audio จริง
2. **Chat actions ต้องมี audioUrl** — แม้จะเป็น "" เพื่อรองรับ audio ในอนาคต
3. **คำถามต้องตอบได้จากสิ่งที่ฟัง** — ไม่ต้องเดา ไม่ต้องรู้นอกเหนือจากบทสนทนา
4. **บทสนทนาต้องชัดเจน** — ใช้ประโยคง่าย ไม่กำกวม
5. **fill_sentence_with_choice ต้องมี distractors** — items ที่ `inSentence: false` คือ distractors
6. **Distractors ต้องเป็น word type เดียวกัน** — ถ้าเติม adjective ตัวเลือกผิดก็ต้องเป็น adjective
7. **ปริมาณตาม CEFR**:
   - A1: บทสนทนา 4 ประโยค, คำถาม 1-2 ข้อ
   - A2: บทสนทนา 6 ประโยค, คำถาม 2-3 ข้อ
   - B1+: บทสนทนา 8+ ประโยค, คำถาม 3-4 ข้อ
