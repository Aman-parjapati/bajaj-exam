# BFHL Tree Analyzer API

## Stack
- **Backend**: Node.js + Express
- **Frontend**: Vanilla HTML/CSS/JS (served as static files by Express)
- **Hosting**: Vercel (recommended) / Render / Railway

---

## Local Development

```bash
npm install
npm run dev        # uses nodemon for hot-reload
# or
npm start          # plain node
```

Server starts at `http://localhost:3000`

---

## Fill In Your Identity

Edit `server.js` and update the `IDENTITY` block:

```js
const IDENTITY = {
  user_id: "yourfullname_ddmmyyyy",
  email_id: "yourname@srmist.edu.in",
  college_roll_number: "RA2XXXXXXXXXXXXXXXXX",
};
```

Or set environment variables before starting:

```bash
USER_ID="johndoe_17091999" EMAIL_ID="john@srmist.edu.in" ROLL_NO="RA2111003012345" npm start
```

---

## Deploy to Vercel (Recommended)

1. Push this repo to GitHub (make it **public**).
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo.
3. Set environment variables in Vercel dashboard:
   - `USER_ID`
   - `EMAIL_ID`
   - `ROLL_NO`
4. Deploy. Your API will be live at `https://your-project.vercel.app/bfhl`.

---

## Deploy to Render

1. New Web Service → connect GitHub repo.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add env vars: `USER_ID`, `EMAIL_ID`, `ROLL_NO`.

---

## API Usage

```
POST /bfhl
Content-Type: application/json

{
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X", "hello"]
}
```

---

## Test

```bash
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"data":["A->B","A->C","B->D","C->E","E->F","X->Y","Y->Z","Z->X","P->Q","Q->R","G->H","G->H","G->I","hello","1->2","A->"]}'
```