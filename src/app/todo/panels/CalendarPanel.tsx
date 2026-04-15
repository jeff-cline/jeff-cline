"use client";
import { useState, useEffect, useCallback } from "react";

interface User { name: string; email: string; role: string; userId: string }
interface CalEvent { _id: string; title: string; assignedTo: string; followUpDate: string; status: string }

export default function CalendarPanel({ user }: { user: User }) {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [filter, setFilter] = useState(user.name);
  const [month, setMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [showTestSms, setShowTestSms] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testSending, setTestSending] = useState(false);

  const isAdmin = user.role === "admin";

  const showToast = useCallback((msg: string, type: "ok" | "err") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  useEffect(() => {
    const start = new Date(month.getFullYear(), month.getMonth(), 1).toISOString();
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString();
    fetch(`/api/todo/calendar?start=${start}&end=${end}&assignedTo=${filter}`)
      .then(r => r.json())
      .then(d => setEvents(Array.isArray(d) ? d : []));
  }, [month, filter]);

  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const getEventsForDay = (day: number) => {
    return events.filter(e => {
      const d = new Date(e.followUpDate);
      return d.getDate() === day && d.getMonth() === month.getMonth();
    });
  };

  const sendReminder = async (todoId: string) => {
    setSendingId(todoId);
    try {
      const res = await fetch("/api/todo/sms/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todoId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("SMS reminder sent", "ok");
      } else {
        showToast(data.error || "Failed to send", "err");
      }
    } catch {
      showToast("Network error", "err");
    }
    setSendingId(null);
  };

  const sendTestSms = async () => {
    if (!testPhone.trim()) return;
    setTestSending(true);
    try {
      const res = await fetch("/api/todo/sms/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: testPhone }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Test SMS sent", "ok");
        setShowTestSms(false);
        setTestPhone("");
      } else {
        showToast(data.error || "Failed", "err");
      }
    } catch {
      showToast("Network error", "err");
    }
    setTestSending(false);
  };

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <>
      <style>{`
        .cal-wrap { padding: 16px; position: relative; }
        .cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px; }
        .cal-filters { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
        .cal-filter-btn { padding: 5px 10px; border: 1px solid #333; border-radius: 4px; cursor: pointer; font-size: 12px; }
        .cal-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .cal-nav-btn { background: #222; border: 1px solid #333; color: #aaa; padding: 6px 14px; border-radius: 4px; cursor: pointer; }
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .cal-day-header { text-align: center; color: #666; font-size: 11px; padding: 4px 0; }
        .cal-day { background: #1a1a1a; border: 1px solid #222; border-radius: 4px; padding: 4px; min-height: 60px; cursor: pointer; transition: border-color 0.15s; }
        .cal-day:hover { border-color: #FF890066; }
        .cal-day-active { border-color: #FF8900 !important; }
        .cal-day-num { font-size: 11px; color: #888; margin-bottom: 2px; }
        .cal-event { background: #FF890022; color: #FF8900; font-size: 9px; padding: 2px 3px; border-radius: 2px; margin-bottom: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .cal-popup-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .cal-popup { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px; max-width: 380px; width: 90%; max-height: 70vh; overflow-y: auto; }
        .cal-popup-title { color: #FF8900; font-size: 14px; font-weight: 600; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
        .cal-popup-close { background: none; border: none; color: #666; font-size: 18px; cursor: pointer; padding: 0 4px; }
        .cal-popup-close:hover { color: #aaa; }
        .cal-popup-event { background: #222; border: 1px solid #333; border-radius: 6px; padding: 10px; margin-bottom: 8px; }
        .cal-popup-event-title { color: #f0f0f0; font-size: 13px; font-weight: 600; margin-bottom: 4px; }
        .cal-popup-event-meta { color: #888; font-size: 11px; margin-bottom: 2px; }
        .cal-popup-event-status { display: inline-block; font-size: 10px; padding: 1px 6px; border-radius: 3px; }
        .cal-sms-btn { background: #FF8900; color: #000; border: none; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer; font-weight: 600; margin-top: 6px; }
        .cal-sms-btn:hover { background: #e07a00; }
        .cal-sms-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cal-test-btn { background: none; border: 1px solid #444; color: #888; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer; }
        .cal-test-btn:hover { border-color: #FF8900; color: #FF8900; }
        .cal-test-input { background: #222; border: 1px solid #444; color: #f0f0f0; padding: 6px 8px; border-radius: 4px; font-size: 12px; width: 100%; margin-bottom: 8px; }
        .cal-test-modal { background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 16px; width: 280px; }
        .cal-toast { position: fixed; top: 20px; right: 20px; padding: 10px 16px; border-radius: 6px; font-size: 12px; z-index: 2000; animation: calToastIn 0.2s ease; }
        .cal-toast-ok { background: #1a3a1a; color: #4ade80; border: 1px solid #2d5a2d; }
        .cal-toast-err { background: #3a1a1a; color: #f87171; border: 1px solid #5a2d2d; }
        @keyframes calToastIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .cal-no-events { color: #666; font-size: 12px; text-align: center; padding: 20px 0; }
        @media (max-width: 768px) {
          .cal-wrap { padding: 10px; }
          .cal-day { min-height: 44px; padding: 2px; }
          .cal-day-num { font-size: 10px; }
          .cal-event { font-size: 8px; padding: 1px 2px; }
          .cal-day-header { font-size: 10px; }
          .cal-filter-btn { padding: 4px 8px; font-size: 11px; }
          .cal-popup { max-width: 95%; padding: 12px; }
        }
      `}</style>
      <div className="cal-wrap">
        {toast && (
          <div className={`cal-toast ${toast.type === "ok" ? "cal-toast-ok" : "cal-toast-err"}`}>
            {toast.msg}
          </div>
        )}
        <div className="cal-header">
          <h2 style={{ margin: 0, color: "#FF8900", fontSize: 17 }}>Calendar</h2>
          <div className="cal-filters">
            {["My Calendar", "Jeff", "Krystalore", "ALL"].map(f => (
              <button key={f} className="cal-filter-btn" onClick={() => setFilter(f === "My Calendar" ? user.name : f)}
                style={{ background: (f === "My Calendar" ? user.name : f) === filter ? "#FF8900" : "#222", color: (f === "My Calendar" ? user.name : f) === filter ? "#000" : "#aaa" }}>
                {f}
              </button>
            ))}
            {isAdmin && (
              <button className="cal-test-btn" onClick={() => setShowTestSms(true)}>
                Test SMS
              </button>
            )}
          </div>
        </div>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}>&#8592;</button>
          <span style={{ color: "#f0f0f0", fontWeight: 600, fontSize: 14 }}>{month.toLocaleString("default", { month: "long", year: "numeric" })}</span>
          <button className="cal-nav-btn" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}>&#8594;</button>
        </div>
        <div className="cal-grid">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="cal-day-header">{d}</div>
          ))}
          {blanks.map(i => <div key={`b${i}`} />)}
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day}
                className={`cal-day ${selectedDay === day ? "cal-day-active" : ""}`}
                onClick={() => dayEvents.length > 0 && setSelectedDay(selectedDay === day ? null : day)}
              >
                <div className="cal-day-num">{day}</div>
                {dayEvents.slice(0, 2).map(e => (
                  <div key={e._id} className="cal-event">{e.title}</div>
                ))}
                {dayEvents.length > 2 && <div style={{ color: "#666", fontSize: 8 }}>+{dayEvents.length - 2}</div>}
              </div>
            );
          })}
        </div>

        {selectedDay !== null && selectedEvents.length > 0 && (
          <div className="cal-popup-overlay" onClick={() => setSelectedDay(null)}>
            <div className="cal-popup" onClick={e => e.stopPropagation()}>
              <div className="cal-popup-title">
                <span>
                  {month.toLocaleString("default", { month: "short" })} {selectedDay}, {month.getFullYear()}
                </span>
                <button className="cal-popup-close" onClick={() => setSelectedDay(null)}>x</button>
              </div>
              {selectedEvents.map(ev => {
                const fDate = new Date(ev.followUpDate).toLocaleDateString("en-US", {
                  weekday: "short", month: "short", day: "numeric",
                });
                const statusColor = ev.status === "done" ? "#4ade80" : ev.status === "in-progress" ? "#FF8900" : "#888";
                return (
                  <div key={ev._id} className="cal-popup-event">
                    <div className="cal-popup-event-title">{ev.title}</div>
                    <div className="cal-popup-event-meta">Assigned: {ev.assignedTo || "Unassigned"}</div>
                    <div className="cal-popup-event-meta">Follow up: {fDate}</div>
                    <div className="cal-popup-event-meta" style={{ marginTop: 2 }}>
                      <span className="cal-popup-event-status" style={{ background: statusColor + "22", color: statusColor }}>
                        {ev.status}
                      </span>
                    </div>
                    {isAdmin && (
                      <button
                        className="cal-sms-btn"
                        disabled={sendingId === ev._id}
                        onClick={() => sendReminder(ev._id)}
                      >
                        {sendingId === ev._id ? "Sending..." : "SMS Reminder"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showTestSms && (
          <div className="cal-popup-overlay" onClick={() => setShowTestSms(false)}>
            <div className="cal-test-modal" onClick={e => e.stopPropagation()}>
              <div className="cal-popup-title">
                <span>Test SMS</span>
                <button className="cal-popup-close" onClick={() => setShowTestSms(false)}>x</button>
              </div>
              <input
                className="cal-test-input"
                placeholder="Phone number"
                value={testPhone}
                onChange={e => setTestPhone(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendTestSms()}
              />
              <button
                className="cal-sms-btn"
                style={{ width: "100%" }}
                disabled={testSending}
                onClick={sendTestSms}
              >
                {testSending ? "Sending..." : "Send Test"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
