import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  User,
  MessageCircle,
  Clock,
  CheckCheck,
  Check,
  Heart,
  AlertTriangle
} from "lucide-react";
import { API_CONFIG, STORAGE_KEYS } from "../../utils/constants";
import { useAuth } from "../../contexts/AuthContext";

const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPsychologists, setShowPsychologists] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadConversations();
    // Cargar psicólogos para cualquier usuario que no sea psicólogo
    if (user?.instituciones?.[0]?.rol !== 'PSICOLOGO') {
      loadPsychologists();
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const response = await fetch(`${API_CONFIG.API_BASE}/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setConversations(result.data);
      }
    } catch (error) {
      console.error("Error cargando conversaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPsychologists = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const response = await fetch(`${API_CONFIG.API_BASE}/chat/psychologists`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setPsychologists(result.data);
      }
    } catch (error) {
      console.error("Error cargando psicólogos:", error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const response = await fetch(`${API_CONFIG.API_BASE}/chat/conversations/${conversationId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setMessages(result.data.mensajes);
      }
    } catch (error) {
      console.error("Error cargando mensajes:", error);
    }
  };

  const createConversation = async (psychologistId) => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const response = await fetch(`${API_CONFIG.API_BASE}/chat/conversations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          psicologoId: psychologistId,
          titulo: "Nueva consulta psicológica"
        })
      });

      if (response.ok) {
        const result = await response.json();
        setShowPsychologists(false);
        loadConversations();
        // Seleccionar la nueva conversación
        setTimeout(() => {
          const newConv = conversations.find(c => c.id === result.conversacionId);
          if (newConv) {
            setSelectedConversation(newConv);
            loadMessages(newConv.id);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error creando conversación:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const response = await fetch(`${API_CONFIG.API_BASE}/chat/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mensaje: newMessage.trim()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessages(prev => [...prev, result.data]);
        setNewMessage("");
        loadConversations(); // Actualizar lista para mostrar último mensaje
      }
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-2rem)] bg-gray-50 rounded-lg overflow-hidden flex">
      {/* Lista de conversaciones */}
      <div className="w-1/3 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Mensajes</h2>
            {user?.instituciones?.[0]?.rol !== 'PSICOLOGO' && (
              <button
                onClick={() => setShowPsychologists(!showPsychologists)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Lista de psicólogos para nueva conversación */}
          {showPsychologists && user?.rol === 'ESTUDIANTE' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 space-y-2"
            >
              <p className="text-sm text-gray-600">Iniciar nueva conversación:</p>
              {psychologists.map(psychologist => (
                <button
                  key={psychologist.id}
                  onClick={() => createConversation(psychologist.id)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{psychologist.nombreCompleto}</p>
                    <p className="text-xs text-gray-500">{psychologist.conversacionesActivas} conversaciones activas</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay conversaciones</p>
              {user?.instituciones?.[0]?.rol !== 'PSICOLOGO' && (
                <p className="text-sm mt-1">Inicia una nueva conversación con un psicólogo</p>
              )}
            </div>
          ) : (
            conversations.map(conversation => (
              <button
                key={conversation.id}
                onClick={() => {
                  setSelectedConversation(conversation);
                  loadMessages(conversation.id);
                }}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.instituciones?.[0]?.rol === 'PSICOLOGO' ? conversation.estudianteNombre : conversation.psicologoNombre}
                      </p>
                      {conversation.fechaUltimoMensaje && (
                        <span className="text-xs text-gray-500">
                          {formatDate(conversation.fechaUltimoMensaje)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.ultimoMensaje || "Sin mensajes"}
                    </p>
                    {conversation.mensajesNoLeidos > 0 && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                        {conversation.mensajesNoLeidos}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header del chat */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.instituciones?.[0]?.rol === 'PSICOLOGO' ? selectedConversation.estudianteNombre : selectedConversation.psicologoNombre}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.estado === 'ACTIVA' ? 'Conversación activa' : 'Conversación cerrada'}
                  </p>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.remitenteId === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.remitenteId === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}>
                    {message.tipoMensaje === 'SISTEMA' && (
                      <div className="flex items-center space-x-1 mb-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs opacity-75">Sistema</span>
                      </div>
                    )}
                    <p className="text-sm">{message.mensaje}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs opacity-75">
                        {formatTime(message.fechaEnvio)}
                      </span>
                      {message.remitenteId === user?.id && (
                        <div className="ml-2">
                          {message.leido ? (
                            <CheckCheck className="w-3 h-3 opacity-75" />
                          ) : (
                            <Check className="w-3 h-3 opacity-75" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input para nuevo mensaje */}
            {selectedConversation.estado === 'ACTIVA' && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Selecciona una conversación</p>
              <p className="text-sm">para comenzar a chatear</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;