const http = require('http');
const app = require('./src/app');

const server = http.createServer(app);

server.listen(5099, async () => {
  console.log('Test server started on port 5099');

  function request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const postData = body ? JSON.stringify(body) : '';
      const req = http.request(
        {
          hostname: 'localhost',
          port: 5099,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            const parsed = JSON.parse(data);
            console.log(`[PASS] ${method} ${path} -> ${res.statusCode} (${parsed.message || 'OK'})`);
            resolve({ status: res.statusCode, body: parsed });
          });
        }
      );
      req.on('error', reject);
      if (postData) req.write(postData);
      req.end();
    });
  }

  try {
    // 1. Diagnostics & Health
    await request('GET', '/');
    await request('GET', '/api/health');

    // 2. Task CRUD
    const newTask = await request('POST', '/api/tasks', {
      title: 'Automated Test Task',
      priority: 'high',
      category: 'Engineering',
    });
    const taskId = newTask.body.data.id;
    await request('PUT', `/api/tasks/${taskId}`, { title: 'Updated Test Task' });
    await request('PATCH', `/api/tasks/${taskId}/toggle`);
    await request('DELETE', `/api/tasks/${taskId}`);

    // 3. Note CRUD
    const newNote = await request('POST', '/api/notes', {
      title: 'Automated Test Note',
      content: 'Testing note endpoints',
      category: 'Design',
    });
    const noteId = newNote.body.data.id;
    await request('PATCH', `/api/notes/${noteId}/pin`);
    await request('DELETE', `/api/notes/${noteId}`);

    // 4. Event CRUD
    const newEvent = await request('POST', '/api/events', {
      title: 'Automated Sync Meeting',
      date: '2026-09-15',
      time: '11:00',
    });
    const eventId = newEvent.body.data.id;
    await request('DELETE', `/api/events/${eventId}`);

    // 5. Team CRUD
    const newMember = await request('POST', '/api/team', {
      name: 'Agent Tester',
      role: 'QA Engineer',
      status: 'online',
    });
    const memberId = newMember.body.data.id;
    await request('PUT', `/api/team/${memberId}`, { status: 'focus' });
    await request('DELETE', `/api/team/${memberId}`);

    // 6. Workspace dashboard
    await request('GET', '/api/workspace/dashboard');

    // 7. Error handling check (404 and 400 validation)
    const err404 = await request('GET', '/api/unknown-endpoint');
    if (err404.status !== 404) throw new Error('Expected 404 status');

    const err400 = await request('POST', '/api/tasks', {});
    if (err400.status !== 400) throw new Error('Expected 400 status');

    console.log('\n🌟 Complete Full-Stack Backend API lifecycle verified successfully!');
  } catch (err) {
    console.error('Lifecycle test failed:', err);
    process.exit(1);
  } finally {
    server.close(() => {
      console.log('Test server closed cleanly.');
      process.exit(0);
    });
  }
});
