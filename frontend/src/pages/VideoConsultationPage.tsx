import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const VideoConsultationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Initializing...');
  const [chatMessages, setChatMessages] = useState<{sender: string; message: string; timestamp: Date}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Mock appointment data
  const appointment = {
    id,
    doctorName: 'Dr. Sarah Johnson',
    doctorId: '101',
    patientName: 'John Doe',
    patientId: '201',
    date: '2023-08-15',
    time: '10:00 AM',
    status: 'confirmed',
  };

  // Initialize WebRTC
  useEffect(() => {
    const initializeWebRTC = async () => {
      try {
        setConnectionStatus('Requesting media permissions...');
        
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        localStreamRef.current = stream;
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        // Initialize peer connection
        const configuration = {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ]
        };
        
        peerConnectionRef.current = new RTCPeerConnection(configuration);
        
        // Add local tracks to peer connection
        stream.getTracks().forEach(track => {
          if (peerConnectionRef.current) {
            peerConnectionRef.current.addTrack(track, stream);
          }
        });
        
        // Handle incoming tracks
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setIsConnected(true);
            setConnectionStatus('Connected');
          }
        };
        
        // Handle ICE candidate events
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            // In a real app, send this candidate to the signaling server
            console.log('New ICE candidate:', event.candidate);
          }
        };
        
        // Handle connection state changes
        peerConnectionRef.current.onconnectionstatechange = () => {
          if (peerConnectionRef.current) {
            const state = peerConnectionRef.current.connectionState;
            console.log('Connection state changed:', state);
            
            switch (state) {
              case 'connected':
                setConnectionStatus('Connected');
                setIsConnected(true);
                break;
              case 'disconnected':
              case 'failed':
                setConnectionStatus('Disconnected');
                setIsConnected(false);
                break;
              case 'closed':
                setConnectionStatus('Call ended');
                setIsConnected(false);
                setIsCallEnded(true);
                break;
              default:
                setConnectionStatus(`Connecting (${state})...`);
            }
          }
        };
        
        // In a real app, you would connect to a signaling server here
        // and exchange SDP offers/answers and ICE candidates
        
        // For demo purposes, we'll simulate a connection after a delay
        simulateConnection();
        
      } catch (error) {
        console.error('Error initializing WebRTC:', error);
        setConnectionStatus('Failed to access camera/microphone');
      }
    };
    
    initializeWebRTC();
    
    // Cleanup function
    return () => {
      // Stop all tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, []);
  
  // Simulate a connection (for demo purposes)
  const simulateConnection = () => {
    // Simulate connecting
    setConnectionStatus('Connecting to remote peer...');
    
    // Simulate connected after 3 seconds
    setTimeout(() => {
      setConnectionStatus('Connected');
      setIsConnected(true);
      
      // Add a system message
      addChatMessage('System', 'Call connected. You can now communicate with the other participant.');
    }, 3000);
  };
  
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };
  
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };
  
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        
        // Replace video track with screen sharing track
        if (peerConnectionRef.current && localStreamRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0];
          
          // Find the sender for the video track
          const senders = peerConnectionRef.current.getSenders();
          const videoSender = senders.find(sender => 
            sender.track?.kind === 'video'
          );
          
          if (videoSender) {
            videoSender.replaceTrack(videoTrack);
          }
          
          // Update local video
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          
          // Handle the screen sharing stream ending
          videoTrack.onended = () => {
            toggleScreenShare();
          };
          
          setIsScreenSharing(true);
        }
      } catch (error) {
        console.error('Error starting screen share:', error);
      }
    } else {
      // Switch back to camera
      if (peerConnectionRef.current && localStreamRef.current) {
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        
        // Find the sender for the video track
        const senders = peerConnectionRef.current.getSenders();
        const videoSender = senders.find(sender => 
          sender.track?.kind === 'video'
        );
        
        if (videoSender && videoTrack) {
          videoSender.replaceTrack(videoTrack);
        }
        
        // Update local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
        
        setIsScreenSharing(false);
      }
    }
  };
  
  const endCall = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    setIsCallEnded(true);
    setConnectionStatus('Call ended');
    setIsConnected(false);
    
    // Add a system message
    addChatMessage('System', 'Call ended.');
  };
  
  const addChatMessage = (sender: string, message: string) => {
    setChatMessages(prev => [...prev, {
      sender,
      message,
      timestamp: new Date()
    }]);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // Add message to chat
    addChatMessage('You', newMessage);
    
    // In a real app, you would send this message through a data channel
    // For demo purposes, simulate receiving a response
    setTimeout(() => {
      addChatMessage(appointment.doctorName, 'I received your message. Thank you.');
    }, 1000);
    
    setNewMessage('');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Video Consultation
            </h1>
            <p className="text-sm text-gray-500">
              Appointment with {appointment.doctorName} - {appointment.date} at {appointment.time}
            </p>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {connectionStatus}
            </span>
            <Link
              to={`/appointments/${id}`}
              className="ml-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Back to Appointment
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {isCallEnded ? (
          <div className="w-full flex items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h3.375c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-.75m13.5 0h-.75a1.125 1.125 0 01-1.125-1.125v-.75c0-.621.504-1.125 1.125-1.125H18a2.25 2.25 0 012.25 2.25v6.75" />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Call ended</h3>
              <p className="mt-1 text-sm text-gray-500">The video consultation has ended.</p>
              <div className="mt-6">
                <Link
                  to={`/appointments/${id}`}
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  Return to Appointment
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Video area */}
            <div className="flex-1 flex flex-col p-4 bg-gray-900">
              <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Remote video (main) */}
                <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    ref={remoteVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  >
                    <source src="" type="video/mp4" />
                  </video>
                  
                  {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                      <div className="text-center text-white">
                        <svg className="animate-spin h-10 w-10 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-lg font-medium">{connectionStatus}</p>
                        <p className="text-sm opacity-75 mt-2">Please wait while we connect you to {appointment.doctorName}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Local video (picture-in-picture) */}
                <div className="absolute bottom-4 right-4 w-1/4 max-w-xs rounded-lg overflow-hidden shadow-lg border-2 border-white">
                  <video
                    ref={localVideoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  >
                    <source src="" type="video/mp4" />
                  </video>
                </div>
              </div>
              
              {/* Controls */}
              <div className="mt-4 flex items-center justify-center space-x-4">
                <button
                  onClick={toggleMute}
                  className={`p-3 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                  {isMuted ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                  {isVideoOff ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  )}
                </button>
                
                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full ${isScreenSharing ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'} hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                </button>
                
                <button
                  onClick={endCall}
                  className="p-3 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h3.375c.621 0 1.125.504 1.125 1.125v.75c0 .621-.504 1.125-1.125 1.125h-.75m13.5 0h-.75a1.125 1.125 0 01-1.125-1.125v-.75c0-.621.504-1.125 1.125-1.125H18a2.25 2.25 0 012.25 2.25v6.75" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Chat area */}
            <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col bg-white">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Chat</h2>
                <p className="text-sm text-gray-500">Send messages during your consultation</p>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                      <div 
                        className={`max-w-xs rounded-lg px-4 py-2 ${msg.sender === 'System' 
                          ? 'bg-gray-100 text-gray-700' 
                          : msg.sender === 'You' 
                            ? 'bg-primary-100 text-primary-800' 
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {msg.sender === 'System' && (
                          <div className="flex items-center justify-center mb-1">
                            <span className="text-xs font-medium text-gray-500">System Message</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <div className="mt-1 text-right">
                          <span className="text-xs text-gray-500">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
                    <p className="mt-1 text-sm text-gray-500">Start the conversation with {appointment.doctorName}.</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    disabled={!isConnected || isCallEnded}
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md border border-transparent bg-primary-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isConnected || isCallEnded}
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoConsultationPage;