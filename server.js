const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const path = require('path');

app.use(express.json()); // JSON 형식으로 데이터를 처리할 수 있도록 설정

let db;
const url = 'mongodb+srv://admin:qwer1234@cluster0.fbytm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
new MongoClient(url).connect().then((client) => {
  console.log('DB 연결 성공');
  db = client.db('board');
}).catch((err) => {
  console.log(err);
});

app.use(express.static(path.join(__dirname, 'blog/build')));

// 클라이언트에서 데이터를 받아와 DB에 저장하는 POST 엔드포인트
app.post('/api/words', async (req, res) => {
  try {
    const { title, content } = req.body; // 클라이언트에서 받은 데이터
    const result = await db.collection('word').insertOne({ title, content });
    res.status(200).json({ title, content, _id: result.insertedId }); // 성공적으로 저장 시 결과 반환
  } catch (error) {
    res.status(500).json({ error: '데이터 저장 중 오류 발생' });
  }
});

app.get('/api/words', async (req, res) => {
  try {
    const result = await db.collection('word').find().toArray();
    console.log(result)
    res.json(result); // JSON 형식으로 데이터 반환
  } catch (error) {
    res.status(500).json({ error: '데이터를788 가져오는 중 오류 발생' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/blog/build/index.html'));
});

app.listen(8080, () => {
  console.log('http://localhost:8080 에서 서버 실행중');
});
