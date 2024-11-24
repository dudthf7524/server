import React, { useEffect, useState } from 'react';
import { Button, Form, Navbar, Container, Nav, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [words, setWords] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/words')
      .then((res) => res.json())
      .then((data) => setWords(data))
      .catch((error) => console.error('데이터를 불러오는 중 오류 발생:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼의 기본 제출 동작을 방지
    try {
      const response = await fetch('/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        const newWord = await response.json(); // 새로 추가된 데이터를 받아옴
        setWords((prevWords) => [...prevWords, newWord]); // 새 데이터를 기존 words 배열에 추가
        setTitle(''); // 입력값 초기화
        setContent(''); // 입력값 초기화
        alert('데이터가 성공적으로 저장되었습니다.');
      }
    } catch (error) {
      console.error('데이터 전송 중 오류 발생:', error);
    }
  };

  return (
    <>
      <div>
        <h1>단어 리스트</h1>
        {words.length > 0 ? (
          <ListGroup>
            {words.map((word, index) => (
              <ListGroup.Item key={index}>
                <h4>{word.title}</h4>
                <p>{word.content}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>로딩 중...</p>
        )}
      </div>

      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Navbar</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        {/* 폼 입력 영역 */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>글 제목</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formContent">
            <Form.Label>글 내용</Form.Label>
            <Form.Control
              as="textarea" // 텍스트박스를 텍스트 영역으로 변환
              rows={10} // 텍스트 영역의 기본 행 수 (크기 조정)
              placeholder="Enter content"
              value={content}
              
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            저장하기
          </Button>
        </Form>
      </div>
    </>
  );
}

export default App;
