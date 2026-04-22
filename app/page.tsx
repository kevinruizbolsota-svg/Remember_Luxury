import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  ShoppingBag,
  Settings,
  ChevronRight,
  Zap,
  Instagram,
  Youtube,
  Brain,
  Gem,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  LayoutDashboard,
  UserCircle,
  ShoppingCart,
  Bell,
  Search,
  MoreHorizontal,
} from "lucide-react";

// --- DATOS SIMULADOS (BASE DE DATOS LOCAL) ---
const INITIAL_POSTS = [
  {
    id: 1,
    user: "rememberluxury",
    avatar: "https://i.ibb.co/vzXn5C6/avatar.jpg",
    image: "https://picsum.photos/600/600?random=10",
    likes: 1240,
    text: "Forjando el futuro. La presión crea diamantes. 💎",
    liked: false,
  },
  {
    id: 2,
    user: "krc_creator",
    avatar: "https://i.pravatar.cc/150?u=boss",
    image: "https://picsum.photos/600/600?random=11",
    likes: 892,
    text: "Arquitectura cuántica aplicada al desarrollo web. 🚀",
    liked: false,
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Membresía Élite",
    price: 499,
    icon: Gem,
    color: "text-[#d4af37]",
  },
  {
    id: 2,
    name: "Códice del Arquitecto",
    price: 199,
    icon: LayoutDashboard,
    color: "text-blue-400",
  },
  {
    id: 3,
    name: "Sincronizador Cuántico",
    price: 899,
    icon: Zap,
    color: "text-purple-400",
  },
  {
    id: 4,
    name: "Visión Galáctica (AR)",
    price: 299,
    icon: Search,
    color: "text-pink-400",
  },
];

export default function RememberLuxuryDashboard() {
  // --- ESTADOS DE LA APLICACIÓN ---
  const [activeTab, setActiveTab] = useState("home");
  const [cartCount, setCartCount] = useState(0);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de IA
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Saludos, Arquitecto Supremo. Sistemas en línea. ¿Qué realidad vamos a forjar hoy?",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Efecto inicial de carga para asegurar que el DOM esté listo
  useEffect(() => {
    console.log("RL-Sistemas: Iniciando secuencia de acceso...");
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --- LÓGICA DE NEGOCIO ---
  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    // Micro-vibración si está en móvil
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.vibrate
    ) {
      window.navigator.vibrate(50);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(() => {
      let response =
        "Comando recibido. Procesando en los servidores cuánticos de Remember Luxury...";
      const lowerInput = userText.toLowerCase();
      if (lowerInput.includes("hola"))
        response = "Hola, Jefe. La frecuencia está a 528Hz. Todo listo.";
      if (lowerInput.includes("tienda"))
        response =
          "Accediendo a la bóveda... Tienes 4 activos listos para su despliegue inmediato.";
      if (lowerInput.includes("crear"))
        response =
          "Iniciando protocolos de forja. ¿Qué material base utilizaremos?";

      setMessages((prev) => [...prev, { role: "ai", text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  // --- COMPONENTES UI REUTILIZABLES ---
  const LinkButton = ({ icon: Icon, label, subtext, colorClass }: any) => (
    <button className="w-full flex items-center p-4 mb-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition-all group hover:border-[#d4af37] shadow-lg">
      <div
        className={`p-3 rounded-xl mr-4 ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}
      >
        <Icon className={`w-6 h-6 ${colorClass.replace("bg-", "text-")}`} />
      </div>
      <div className="flex-1 text-left">
        <span className="block text-sm font-black text-white uppercase tracking-widest">
          {label}
        </span>
        {subtext && (
          <span className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest">
            {subtext}
          </span>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-[#d4af37] transform group-hover:translate-x-1 transition-all" />
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#d4af37] tracking-[0.5em] font-black animate-pulse">
          ACCEDIENDO AL SISTEMA...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden pb-24 selection:bg-[#d4af37] selection:text-black">
      {/* Estilos Globales Inyectados para Animaciones */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes twinkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.2); } }
        .star { position: absolute; background: white; border-radius: 50%; animation: twinkle infinite ease-in-out; }
        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .glass-panel { background: rgba(10, 10, 10, 0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
      `,
        }}
      />

      {/* Fondo Galáctico Complejo */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#d4af37] opacity-[0.03] rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 opacity-[0.03] rounded-full blur-[100px]"></div>
        {/* Generador de estrellas estático para React */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              width: Math.random() * 3 + "px",
              height: Math.random() * 3 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              animationDuration: Math.random() * 3 + 2 + "s",
              animationDelay: Math.random() * 2 + "s",
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-[480px] mx-auto min-h-screen flex flex-col border-x border-white/5 bg-black/20 shadow-2xl">
        {/* HEADER SUPERIOR MAESTRO */}
        <header className="px-5 py-4 flex justify-between items-center glass-panel sticky top-0 z-50 border-b border-white/10">
          <h1 className="text-xl font-serif font-bold tracking-widest italic bg-gradient-to-r from-[#f9e29b] to-[#d4af37] bg-clip-text text-transparent">
            REMEMBER LUXURY
          </h1>
          <div className="flex space-x-5 items-center">
            <div className="relative cursor-pointer">
              <Bell className="w-6 h-6 text-zinc-300 hover:text-white transition-colors" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </div>
            <div
              className="relative cursor-pointer"
              onClick={() => setActiveTab("shop")}
            >
              <ShoppingCart
                className={`w-6 h-6 transition-colors ${
                  activeTab === "shop"
                    ? "text-[#d4af37]"
                    : "text-zinc-300 hover:text-white"
                }`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* ================= VISTA 1: PORTAL (BIO) ================= */}
        {activeTab === "home" && (
          <main className="flex-1 p-6 fade-in">
            <div className="text-center mb-10 mt-4 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#d4af37] rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-[#d4af37] via-yellow-200 to-zinc-800 shadow-2xl relative z-10">
                <img
                  src="https://i.ibb.co/vzXn5C6/avatar.jpg"
                  alt="KRC"
                  className="w-full h-full rounded-full object-cover border-4 border-black"
                />
              </div>
              <h2 className="text-2xl font-bold mt-4 tracking-wider">
                Creador KRC
              </h2>
              <p className="text-[10px] text-[#d4af37] tracking-[0.4em] uppercase mt-1 font-bold">
                Frecuencia Binah-Malkuth
              </p>
            </div>

            <div className="space-y-3 relative z-10">
              <LinkButton
                icon={Zap}
                label="Kick Transmisión"
                subtext="En Vivo Ahora"
                colorClass="bg-green-500"
              />
              <LinkButton
                icon={Instagram}
                label="Instagram Élite"
                subtext="Visión del Imperio"
                colorClass="bg-pink-500"
              />
              <LinkButton
                icon={Youtube}
                label="YouTube Templo"
                subtext="Sabiduría"
                colorClass="bg-red-500"
              />
              <LinkButton
                icon={LayoutDashboard}
                label="Forjadora"
                subtext="Área de Creación"
                colorClass="bg-blue-500"
              />
            </div>
          </main>
        )}

        {/* ================= VISTA 2: SOCIAL FEED ================= */}
        {activeTab === "feed" && (
          <main className="flex-1 fade-in">
            {/* Historias */}
            <div className="flex space-x-4 p-4 overflow-x-auto no-scrollbar border-b border-white/5">
              <div className="flex flex-col items-center flex-shrink-0 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-zinc-900 p-0.5 relative">
                  <img
                    src="https://i.ibb.co/vzXn5C6/avatar.jpg"
                    className="w-full h-full rounded-full border-2 border-black object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-2 border-black p-1">
                    <Zap className="w-2 h-2 text-white fill-current" />
                  </div>
                </div>
                <span className="text-[10px] mt-1 text-zinc-400">Tu forja</span>
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f9e29b] to-[#d4af37] p-[2px] group-hover:scale-105 transition-transform">
                    <img
                      src={`https://i.pravatar.cc/150?u=${i}`}
                      className="w-full h-full rounded-full border-2 border-black object-cover"
                    />
                  </div>
                  <span className="text-[10px] mt-1 text-zinc-300">
                    elite_{i}
                  </span>
                </div>
              ))}
            </div>

            {/* Posts */}
            <div className="pb-4">
              {posts.map((post) => (
                <article key={post.id} className="border-b border-white/5 pb-4">
                  <div className="flex justify-between items-center p-3">
                    <div className="flex items-center space-x-3 cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold to-yellow-200 p-[1.5px]">
                        <img
                          src={post.avatar}
                          className="w-full h-full rounded-full border border-black object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {post.user}
                      </span>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-zinc-500 cursor-pointer" />
                  </div>

                  {/* Imagen del Post con doble clic simulado */}
                  <div
                    className="aspect-square bg-zinc-900 relative cursor-pointer"
                    onDoubleClick={() => !post.liked && handleLike(post.id)}
                  >
                    <img
                      src={post.image}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <div className="flex justify-between mb-3">
                      <div className="flex space-x-4">
                        <Heart
                          onClick={() => handleLike(post.id)}
                          className={`w-6 h-6 cursor-pointer transition-all ${
                            post.liked
                              ? "fill-red-500 text-red-500 scale-110"
                              : "text-white hover:text-zinc-400"
                          }`}
                        />
                        <MessageCircle className="w-6 h-6 cursor-pointer hover:text-zinc-400" />
                        <Share2 className="w-6 h-6 cursor-pointer hover:text-zinc-400" />
                      </div>
                      <Bookmark className="w-6 h-6 cursor-pointer hover:text-zinc-400" />
                    </div>
                    <p className="text-xs font-bold mb-1">
                      {post.likes.toLocaleString()} diamantes
                    </p>
                    <p className="text-sm">
                      <span className="font-bold mr-2 uppercase text-xs">
                        {post.user}
                      </span>
                      {post.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </main>
        )}

        {/* ================= VISTA 3: ORÁCULO IA ================= */}
        {activeTab === "ai" && (
          <main className="flex-1 flex flex-col p-4 fade-in h-[calc(100vh-140px)]">
            <div className="flex items-center space-x-4 mb-4 p-4 glass-panel rounded-2xl">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-zinc-900 p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#f9e29b]" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-sm font-black text-[#d4af37] tracking-widest uppercase">
                  Oráculo RL-1
                </h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                  Arquitectura Predictiva
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 no-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-4 max-w-[85%] text-sm rounded-2xl leading-relaxed shadow-lg ${
                      msg.role === "user"
                        ? "bg-white text-black rounded-br-sm font-bold"
                        : "glass-panel text-[#f9e29b] border border-[#d4af37]/30 rounded-bl-sm font-medium"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="glass-panel text-[#d4af37] border border-[#d4af37]/30 rounded-2xl rounded-bl-sm p-4 flex space-x-1 w-16 items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-[#d4af37] rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="relative mt-auto">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ingresa comando al Oráculo..."
                className="w-full glass-panel focus:bg-zinc-900 focus:border-[#d4af37] rounded-2xl py-4 pl-5 pr-14 text-sm outline-none transition-all placeholder:text-zinc-600 font-medium"
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping}
                className="absolute right-2 top-2 p-2 bg-gradient-to-r from-[#d4af37] to-[#f9e29b] text-black rounded-xl hover:scale-95 transition-transform disabled:opacity-50 shadow-[0_0_10px_rgba(212,175,55,0.3)]"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </main>
        )}

        {/* ================= VISTA 4: BOUTIQUE (TIENDA) ================= */}
        {activeTab === "shop" && (
          <main className="flex-1 p-6 fade-in">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#d4af37] tracking-widest">
                  BOUTIQUE
                </h2>
                <p className="text-[10px] uppercase text-zinc-400 tracking-widest">
                  Activos de Alta Gama
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase text-zinc-500">Saldo</p>
                <p className="font-bold text-white flex items-center gap-1">
                  <Gem className="w-3 h-3 text-[#d4af37]" /> ∞
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="glass-panel border-white/5 rounded-3xl p-4 flex flex-col group hover:border-[#d4af37]/40 transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-900/50 rounded-2xl mb-4 flex items-center justify-center group-hover:bg-zinc-900 transition-colors relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <product.icon
                      className={`w-10 h-10 ${product.color} group-hover:scale-110 transition-transform relative z-10`}
                    />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-tight leading-tight flex-1">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex justify-between items-center">
                    <p className="text-sm text-[#d4af37] font-black">
                      ${product.price}
                    </p>
                    <button
                      onClick={handleAddToCart}
                      className="w-8 h-8 bg-white/10 hover:bg-[#d4af37] text-white hover:text-black flex items-center justify-center rounded-full transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ================= VISTA 5: PERFIL ================= */}
        {activeTab === "profile" && (
          <main className="flex-1 fade-in p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="w-20 h-20 rounded-full border-2 border-[#d4af37] p-1">
                <img
                  src="https://i.ibb.co/vzXn5C6/avatar.jpg"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex space-x-6 text-center flex-1 justify-end pr-4">
                <div>
                  <p className="font-bold text-lg">42</p>
                  <p className="text-[9px] uppercase text-zinc-400">Posts</p>
                </div>
                <div>
                  <p className="font-bold text-lg">99k</p>
                  <p className="text-[9px] uppercase text-zinc-400">Élite</p>
                </div>
                <div>
                  <p className="font-bold text-lg">1</p>
                  <p className="text-[9px] uppercase text-zinc-400">Rango</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-bold text-lg flex items-center gap-1">
                Remember Luxury{" "}
                <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="w-2 h-2 text-white fill-current" />
                </div>
              </h2>
              <p className="text-xs opacity-90 mt-1 leading-relaxed">
                Transformando carbón en diamantes digitales.
                <br />
                Arquitecto de realidades de alto impacto.
                <br />✨ Frecuencia 528Hz activa.
              </p>
            </div>

            <div className="flex space-x-2 mb-6">
              <button className="flex-1 glass-panel py-2 rounded-xl text-xs font-bold border border-[#d4af37]/30 text-[#d4af37]">
                Editar Perfil
              </button>
              <button className="flex-1 glass-panel py-2 rounded-xl text-xs font-bold border-white/10 hover:bg-white/10">
                Compartir
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {[10, 11, 12, 13, 14, 15].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-zinc-900 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={`https://picsum.photos/300/300?random=${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </main>
        )}

        {/* NAVEGACIÓN INFERIOR MAESTRA */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] glass-panel border-t border-white/10 flex justify-between items-center py-3 px-6 z-50 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => setActiveTab("home")}
            className={`p-2 transition-all ${
              activeTab === "home"
                ? "text-[#d4af37] scale-110"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveTab("feed")}
            className={`p-2 transition-all ${
              activeTab === "feed"
                ? "text-[#d4af37] scale-110"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <LayoutDashboard className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`p-3 -mt-8 bg-gradient-to-tr from-[#d4af37] to-[#f9e29b] text-black rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-transform hover:scale-105`}
          >
            <Brain className="w-7 h-7" />
          </button>
          <button
            onClick={() => setActiveTab("shop")}
            className={`p-2 transition-all ${
              activeTab === "shop"
                ? "text-[#d4af37] scale-110"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <ShoppingBag className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`p-2 transition-all ${
              activeTab === "profile"
                ? "text-[#d4af37] scale-110"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <UserCircle className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </div>
  );
}
