import {
  BookOpen,
  ChevronRight,
  Clock3,
  IndianRupee,
  MessageCircle,
  Search,
  Send,
  Star,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import PageHeader from "../components/PageHeader";
import { EmptyState, ErrorBanner, Loading } from "../components/Feedback";
import api, { errorMessage } from "../services/api";

const colors = [
  "bg-[#e3c3ff]",
  "bg-[#bce4d3]",
  "bg-[#ffd8a1]",
  "bg-[#b9dffc]",
  "bg-[#ffc9d2]",
  "bg-[#d6e9a6]",
];

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "CC";

export default function Tutors() {
  const [query, setQuery] = useState("");
  const [tutors, setTutors] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("campus_user") || "{}"));
  const [chatTarget, setChatTarget] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [showChats, setShowChats] = useState(false);
  const [ratingNotice, setRatingNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [profileResponse, tutorsResponse] = await Promise.all([
          api.get("/auth/me"),
          api.get("/tutors"),
        ]);
        setUser(profileResponse.data);
        localStorage.setItem("campus_user", JSON.stringify(profileResponse.data));
        setTutors(tutorsResponse.data);
        setChatRooms((await api.get("/chats")).data);
      } catch (e) {
        setError(errorMessage(e, "Could not load tutors."));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const shown = useMemo(
    () =>
      tutors.filter((t) =>
        `${t.tutorName} ${(t.subjects || []).join(" ")} ${t.branch}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, tutors],
  );

  const rateTutor = async (tutor, rating) => {
    setError("");
    setRatingNotice("");
    try {
      const { data } = await api.post(`/tutors/${tutor.id}/rating`, { rating });
      setTutors(tutors.map((item) => (item.id === tutor.id ? data : item)));
      setRatingNotice(`You rated ${tutor.tutorName} ${rating} star${rating > 1 ? "s" : ""}.`);
    } catch (e) {
      setError(errorMessage(e, "Could not save this rating."));
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <PageHeader
          eyebrow="Peer learning"
          title="Find your next tutor"
          description="Learn from students who have been there before. Tutor profiles are managed from student profiles."
          action={
            <button onClick={() => setShowChats(true)} className="secondary-btn">
              <MessageCircle size={18} />
              My chats
            </button>
          }
        />
        <ErrorBanner message={error} />
        {ratingNotice && (
          <div className="mb-6 rounded-2xl border border-moss/15 bg-mint p-4 text-sm font-bold text-moss">
            {ratingNotice}
          </div>
        )}
        <div className="mb-8 flex max-w-2xl items-center gap-3 rounded-full border border-ink/10 bg-white px-5 shadow-sm focus-within:border-moss focus-within:ring-4 focus-within:ring-mint">
          <Search className="shrink-0 text-moss" size={20} />
          <input
            className="w-full bg-transparent py-4 text-sm outline-none"
            placeholder="Search by subject, name or department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {loading ? (
          <Loading />
        ) : shown.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((t, index) => {
              const subjectText = (t.subjects || []).join(", ") || "General tutoring";
              const isMe = t.tutorUserId === user.id || t.tutorEmail === user.email;
              return (
                <article
                  key={t.id}
                  className="card group p-6 transition hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`grid h-16 w-16 place-items-center rounded-[1.4rem] font-display text-xl font-bold ${colors[index % colors.length]}`}
                    >
                      {initials(t.tutorName)}
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-mint/60 px-3 py-1.5 text-xs font-extrabold">
                      <Star className="fill-sun text-sun" size={14} />
                      {t.rating}
                    </span>
                  </div>
                  <h2 className="mt-5 font-display text-xl font-semibold">
                    {t.tutorName}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-moss">
                    {subjectText}
                  </p>
                  <p className="mt-1 text-xs text-ink/45">
                    {t.branch} · {t.yearOfStudy}
                  </p>
                  <p className="mt-4 min-h-12 text-sm leading-6 text-ink/55">
                    {t.bio || "Open to helping classmates learn and practice."}
                  </p>
                  {!isMe && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs font-bold text-ink/45">Rate</span>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          aria-label={`Rate ${t.tutorName} ${rating} stars`}
                          onClick={() => rateTutor(t, rating)}
                          className="text-sun hover:scale-110"
                        >
                          <Star size={17} className={rating <= Math.round(t.rating || 0) ? "fill-sun" : ""} />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="my-5 h-px bg-ink/5" />
                  <div className="flex items-center justify-between text-xs text-ink/55">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={15} />
                      {t.isAvailable ? "Available" : "Unavailable"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      45 min
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream p-3">
                    <span className="flex items-center gap-2 text-xs font-bold">
                      <IndianRupee className="text-moss" size={16} />
                      {t.hourlyRate ? `${t.hourlyRate}/hr` : "Rate flexible"}
                    </span>
                    <button
                      aria-label={`Chat with ${t.tutorName}`}
                      onClick={() => setChatTarget({ name: t.tutorName, email: t.tutorEmail })}
                      disabled={isMe}
                      className="grid h-8 w-8 place-items-center rounded-full bg-white text-moss group-hover:bg-pine group-hover:text-white"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No tutors found"
            text={
              query
                ? "No tutor profiles match that search yet."
                : "No students have turned on tutor profiles yet."
            }
          />
        )}
      </main>
      {showChats && (
        <ChatInbox
          rooms={chatRooms}
          onClose={() => setShowChats(false)}
          onOpen={(room) => {
            setShowChats(false);
            setChatTarget({ name: room.otherName, email: room.otherEmail, roomId: room.roomId });
          }}
        />
      )}
      {chatTarget && (
        <TutorChat
          target={chatTarget}
          user={user}
          onClose={async () => {
            setChatTarget(null);
            try {
              setChatRooms((await api.get("/chats")).data);
            } catch {
              setChatRooms([]);
            }
          }}
        />
      )}
    </>
  );
}

function ChatInbox({ rooms, onClose, onOpen }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-ink/20 p-4 sm:p-6">
      <section className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-ink/10 p-4">
          <div>
            <h2 className="font-display text-lg font-semibold">My chats</h2>
            <p className="text-xs text-ink/45">Messages from students and tutors</p>
          </div>
          <button
            aria-label="Close chats"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-cream text-ink/60 hover:bg-ink hover:text-white"
          >
            <X size={18} />
          </button>
        </header>
        <div className="max-h-[28rem] overflow-y-auto p-3">
          {rooms.length ? (
            rooms.map((room) => (
              <button
                key={room.roomId}
                onClick={() => onOpen(room)}
                className="mb-2 flex w-full items-center justify-between rounded-2xl bg-cream p-4 text-left hover:bg-mint"
              >
                <span className="min-w-0">
                  <span className="block font-bold">{room.otherName}</span>
                  <span className="block truncate text-xs text-ink/50">{room.lastMessage}</span>
                </span>
                <ChevronRight className="shrink-0 text-moss" size={18} />
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-ink/45">
              No messages yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TutorChat({ target, user, onClose }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const roomId = target.roomId || [user.email, target.email].sort().join("-");

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setMessages((await api.get(`/chats/${encodeURIComponent(roomId)}/messages`)).data);
      } catch {
        setMessages([]);
      }
    };
    loadMessages();

    const baseUrl = (api.defaults.baseURL || "http://localhost:8080/api")
      .replace(/^http/, "ws")
      .replace(/\/api$/, "");
    const ws = new WebSocket(`${baseUrl}/ws/chat?roomId=${encodeURIComponent(roomId)}`);

    ws.onmessage = (event) => {
      try {
        setMessages((current) => [...current, JSON.parse(event.data)]);
      } catch {
        setMessages((current) => [...current, { sender: "CampusConnect", text: event.data }]);
      }
    };

    setSocket(ws);
    return () => ws.close();
  }, [roomId]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({
      roomId,
      sender: user.name || user.email,
      senderEmail: user.email,
      receiverEmail: target.email,
      text: text.trim(),
    }));
    setText("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-ink/20 p-4 sm:p-6">
      <section className="flex h-[32rem] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-ink/10 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-mint text-moss">
              <MessageCircle size={20} />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold">{target.name}</h2>
              <p className="text-xs text-ink/45">Tutor chat</p>
            </div>
          </div>
          <button
            aria-label="Close chat"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-cream text-ink/60 hover:bg-ink hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto bg-cream/55 p-4">
          {messages.length ? (
            messages.map((message, index) => {
              const mine = message.sender === (user.name || user.email);
              return (
                <div key={index} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[78%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-pine text-white" : "bg-white text-ink"}`}>
                    <p className="mb-1 text-[10px] font-bold uppercase opacity-60">{message.sender}</p>
                    <p>{message.text}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid h-full place-items-center text-center text-sm text-ink/45">
              Send a message to start the chat.
            </div>
          )}
        </div>

        <form onSubmit={send} className="flex gap-2 border-t border-ink/10 p-3">
          <input
            className="field"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button className="primary-btn px-4" aria-label="Send message">
            <Send size={17} />
          </button>
        </form>
      </section>
    </div>
  );
}
