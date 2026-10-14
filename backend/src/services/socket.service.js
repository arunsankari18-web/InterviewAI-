export function initSocketService(io) {
  io.on('connection', (socket) => {
    // Join a specific interview room
    socket.on('join_interview_room', (sessionId) => {
      socket.join(`interview_${sessionId}`);
    });

    // Real-time transcript ping
    socket.on('speech_transcript_update', ({ sessionId, transcript, isFinal }) => {
      socket.to(`interview_${sessionId}`).emit('live_transcript_stream', {
        transcript,
        isFinal,
        timestamp: new Date().toISOString()
      });
    });

    // Real-time behavior indicators (face presence / eye contact)
    socket.on('behavior_metric_update', ({ sessionId, faceDetected, gazeDirection, attentionLevel }) => {
      socket.to(`interview_${sessionId}`).emit('live_behavior_stream', {
        faceDetected,
        gazeDirection,
        attentionLevel,
        timestamp: Date.now()
      });
    });

    socket.on('disconnect', () => {
      // room cleanup handled automatically by Socket.io
    });
  });
}
