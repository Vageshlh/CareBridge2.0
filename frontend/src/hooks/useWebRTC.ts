import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

interface PeerConnection {
  peerConnection: RTCPeerConnection | null;
  remoteStream: MediaStream | null;
  dataChannel: RTCDataChannel | null;
}

interface UseWebRTCProps {
  roomId: string;
  userId: string;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState | 'disconnected';
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  messages: { id: string; sender: string; content: string; timestamp: Date }[];
  sendMessage: (content: string) => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => void;
  leaveCall: () => void;
}

/**
 * Custom hook to handle WebRTC connections for video calls
 * @param roomId - The ID of the room to connect to
 * @param userId - The ID of the current user
 * @returns WebRTC state and methods
 */
export const useWebRTC = ({ roomId, userId }: UseWebRTCProps): UseWebRTCReturn => {
  const { socket } = useSocket();
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | 'disconnected'>('disconnected');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState<{ id: string; sender: string; content: string; timestamp: Date }[]>([]);
  
  const peerRef = useRef<PeerConnection>({
    peerConnection: null,
    remoteStream: null,
    dataChannel: null
  });
  
  const screenShareStreamRef = useRef<MediaStream | null>(null);
  const originalStreamRef = useRef<MediaStream | null>(null);
  
  // Initialize WebRTC
  useEffect(() => {
    const initWebRTC = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });
        
        setLocalStream(stream);
        originalStreamRef.current = stream;
        
        // Create peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        });
        
        // Create data channel for messages
        const dataChannel = peerConnection.createDataChannel('messages');
        dataChannel.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, {
              id: `msg-${Date.now()}`,
              sender: data.sender,
              content: data.content,
              timestamp: new Date()
            }]);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };
        
        // Add tracks to peer connection
        stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });
        
        // Create remote stream
        const remote = new MediaStream();
        setRemoteStream(remote);
        
        // Handle incoming tracks
        peerConnection.ontrack = (event) => {
          event.streams[0].getTracks().forEach(track => {
            remote.addTrack(track);
          });
        };
        
        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
          setConnectionState(peerConnection.connectionState);
        };
        
        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket?.emit('webrtc:ice-candidate', {
              roomId,
              userId,
              candidate: event.candidate
            });
          }
        };
        
        // Handle data channel events
        peerConnection.ondatachannel = (event) => {
          const channel = event.channel;
          channel.onmessage = (e) => {
            try {
              const data = JSON.parse(e.data);
              setMessages(prev => [...prev, {
                id: `msg-${Date.now()}`,
                sender: data.sender,
                content: data.content,
                timestamp: new Date()
              }]);
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          };
        };
        
        // Store peer connection
        peerRef.current = {
          peerConnection,
          remoteStream: remote,
          dataChannel
        };
        
        // Join room
        socket?.emit('webrtc:join-room', { roomId, userId });
      } catch (error) {
        console.error('Error initializing WebRTC:', error);
      }
    };
    
    if (socket && roomId && userId) {
      initWebRTC();
    }
    
    return () => {
      // Clean up
      leaveCall();
    };
  }, [roomId, userId, socket]);
  
  // Handle socket events
  useEffect(() => {
    if (!socket) return;
    
    // Handle offer
    const handleOffer = async ({ offer, userId: remoteUserId }: { offer: RTCSessionDescriptionInit, userId: string }) => {
      try {
        const { peerConnection } = peerRef.current;
        if (!peerConnection) return;
        
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket.emit('webrtc:answer', {
          roomId,
          userId,
          targetUserId: remoteUserId,
          answer
        });
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    };
    
    // Handle answer
    const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      try {
        const { peerConnection } = peerRef.current;
        if (!peerConnection) return;
        
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    };
    
    // Handle ICE candidate
    const handleIceCandidate = ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      try {
        const { peerConnection } = peerRef.current;
        if (!peerConnection) return;
        
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    };
    
    // Handle user joined
    const handleUserJoined = async ({ userId: remoteUserId }: { userId: string }) => {
      try {
        const { peerConnection } = peerRef.current;
        if (!peerConnection) return;
        
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        socket.emit('webrtc:offer', {
          roomId,
          userId,
          targetUserId: remoteUserId,
          offer
        });
      } catch (error) {
        console.error('Error handling user joined:', error);
      }
    };
    
    // Handle user left
    const handleUserLeft = () => {
      setRemoteStream(null);
    };
    
    // Register event listeners
    socket.on('webrtc:user-joined', handleUserJoined);
    socket.on('webrtc:offer', handleOffer);
    socket.on('webrtc:answer', handleAnswer);
    socket.on('webrtc:ice-candidate', handleIceCandidate);
    socket.on('webrtc:user-left', handleUserLeft);
    
    return () => {
      // Remove event listeners
      socket.off('webrtc:user-joined', handleUserJoined);
      socket.off('webrtc:offer', handleOffer);
      socket.off('webrtc:answer', handleAnswer);
      socket.off('webrtc:ice-candidate', handleIceCandidate);
      socket.off('webrtc:user-left', handleUserLeft);
    };
  }, [roomId, userId, socket]);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);
  
  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  }, [localStream, isVideoOff]);
  
  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    try {
      const { peerConnection } = peerRef.current;
      if (!peerConnection) return;
      
      if (!isScreenSharing) {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        // Save original stream
        screenShareStreamRef.current = screenStream;
        
        // Replace video track
        if (localStream) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const sender = peerConnection.getSenders().find(s => 
            s.track?.kind === 'video'
          );
          
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
          
          // Update local stream
          const newStream = new MediaStream();
          localStream.getAudioTracks().forEach(track => {
            newStream.addTrack(track);
          });
          newStream.addTrack(videoTrack);
          setLocalStream(newStream);
          
          // Handle screen share ended
          videoTrack.onended = () => {
            toggleScreenShare();
          };
        }
        
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing
        if (screenShareStreamRef.current) {
          screenShareStreamRef.current.getTracks().forEach(track => {
            track.stop();
          });
          screenShareStreamRef.current = null;
        }
        
        // Restore original video track
        if (originalStreamRef.current && localStream) {
          const videoTrack = originalStreamRef.current.getVideoTracks()[0];
          const sender = peerConnection.getSenders().find(s => 
            s.track?.kind === 'video'
          );
          
          if (sender && videoTrack) {
            sender.replaceTrack(videoTrack);
          }
          
          // Update local stream
          const newStream = new MediaStream();
          localStream.getAudioTracks().forEach(track => {
            newStream.addTrack(track);
          });
          if (videoTrack) {
            newStream.addTrack(videoTrack);
          }
          setLocalStream(newStream);
        }
        
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  }, [isScreenSharing, localStream]);
  
  // Send message
  const sendMessage = useCallback((content: string) => {
    try {
      const { dataChannel } = peerRef.current;
      if (!dataChannel || dataChannel.readyState !== 'open') return;
      
      const message = {
        sender: userId,
        content,
        timestamp: new Date().toISOString()
      };
      
      dataChannel.send(JSON.stringify(message));
      
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        sender: userId,
        content,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [userId]);
  
  // Leave call
  const leaveCall = useCallback(() => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      setLocalStream(null);
    }
    
    // Stop screen share stream
    if (screenShareStreamRef.current) {
      screenShareStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      screenShareStreamRef.current = null;
    }
    
    // Close peer connection
    if (peerRef.current.peerConnection) {
      peerRef.current.peerConnection.close();
    }
    
    // Reset state
    peerRef.current = {
      peerConnection: null,
      remoteStream: null,
      dataChannel: null
    };
    setRemoteStream(null);
    setConnectionState('disconnected');
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    
    // Leave room
    socket?.emit('webrtc:leave-room', { roomId, userId });
  }, [roomId, userId, socket, localStream]);
  
  return {
    localStream,
    remoteStream,
    connectionState,
    isMuted,
    isVideoOff,
    isScreenSharing,
    messages,
    sendMessage,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    leaveCall
  };
};