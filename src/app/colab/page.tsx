"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ColabUser {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "member";
  color: string;
  lastBoardId?: string | null;
}

interface BoardSummary {
  id: string;
  title: string;
  category: "business" | "project";
  ownerId: string;
  ownerName: string;
  containerId?: string | null;
  containerName?: string | null;
  containerOwnerId?: string | null;
  memberIds: string[];
  updatedAt: string;
  createdAt: string;
  lastEditedByName: string | null;
  thumbnail: string | null;
  baseImageUrl?: string | null;
}

interface ContainerSummary {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  createdAt: string;
}
interface BoardMember {
  userId: string;
  accessRole: "owner" | "editor" | "viewer";
  name: string;
  email: string;
  color: string;
  globalRole: "admin" | "member";
}

interface BoardEvent {
  id: string;
  boardId: string;
  type:
    | "board_created"
    | "board_deleted"
    | "base_image_set"
    | "stroke"
    | "shape"
    | "text"
    | "clear"
    | "renamed"
    | "invite_created"
    | "member_added"
    | "member_joined"
    | "image"
    | "item_update";
  payload: Record<string, unknown>;
  userId: string;
  userName: string;
  userColor: string;
  createdAt: string;
}

interface PresenceUser {
  userId: string;
  name: string;
  color: string;
  lastSeenAt: string;
}

type ToolMode = "pointer" | "pen" | "eraser" | "line" | "rect" | "text" | "image";
type DeviceType = "mobile" | "tablet" | "desktop";

const BOARD_ASPECT_RATIO = 16 / 9;

function clamp01(value: number) {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function useInterval(callback: () => void, delay: number | null) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = window.setInterval(() => callbackRef.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}

function formatAgo(iso?: string | null) {
  if (!iso) return "just now";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function normalizeBaseImageUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("/colab-uploads/")) {
    const filename = url.replace("/colab-uploads/", "");
    return `/api/colab/file/${filename}`;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsed = new URL(url);
      if (parsed.pathname.startsWith("/colab-uploads/")) {
        const filename = parsed.pathname.replace("/colab-uploads/", "");
        return `/api/colab/file/${filename}`;
      }
      if (parsed.pathname.startsWith("/api/colab/file/")) {
        return parsed.pathname;
      }
    } catch {
      // keep original
    }
  }

  return url;
}

export default function ColabPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ColabUser | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginError, setLoginError] = useState("");

  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [containers, setContainers] = useState<ContainerSummary[]>([]);
  const [selectedContainerId, setSelectedContainerId] = useState<string>("all");
  const [newContainerName, setNewContainerName] = useState("");
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [activeBoardTitle, setActiveBoardTitle] = useState("Untitled Board");
  const [activeBoardCategory, setActiveBoardCategory] = useState<"business" | "project">("project");
  const [activeBaseImageUrl, setActiveBaseImageUrl] = useState<string | null>(null);
  const [isBaseImageMissing, setIsBaseImageMissing] = useState(false);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [presence, setPresence] = useState<PresenceUser[]>([]);
  const [events, setEvents] = useState<BoardEvent[]>([]);
  const [lastEventId, setLastEventId] = useState<string | null>(null);

  const [tool, setTool] = useState<ToolMode>("pen");
  const [lineWidth, setLineWidth] = useState(4);
  const [drawColor, setDrawColor] = useState("#111111");
  const [textBoxWidth, setTextBoxWidth] = useState(260);
  const [textFontSize, setTextFontSize] = useState(24);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [draggingSelection, setDraggingSelection] = useState<
    | {
        eventId: string;
        type: "text" | "image";
        coordSpace: "canvas" | "image";
        anchorOffsetX: number;
        anchorOffsetY: number;
      }
    | null
  >(null);
  const [dragPreviewAnchor, setDragPreviewAnchor] = useState<{ x: number; y: number } | null>(null);
  const [dragMoved, setDragMoved] = useState(false);

  const [showHamburger, setShowHamburger] = useState(false);
  const [showAllBoards, setShowAllBoards] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardCategory, setNewBoardCategory] = useState<"business" | "project">("project");
  const [newBoardContainerId, setNewBoardContainerId] = useState<string>("none");
  const [newBoardBaseImageUrl, setNewBoardBaseImageUrl] = useState<string | null>(null);
  const [isUploadingNewBoardImage, setIsUploadingNewBoardImage] = useState(false);
  const [dropdownCategoryFilter, setDropdownCategoryFilter] = useState<"all" | "business" | "project">("all");
  const [boardSearch, setBoardSearch] = useState("");

  const [showShare, setShowShare] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [inviteLink, setInviteLink] = useState("");
  const [shareableUsers, setShareableUsers] = useState<ColabUser[]>([]);
  const [shareNewUserName, setShareNewUserName] = useState("");
  const [shareNewUserPassword, setShareNewUserPassword] = useState("");

  const [showAdmin, setShowAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState<ColabUser[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPass, setNewUserPass] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "member">("member");
  const [adminMessage, setAdminMessage] = useState("");

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [activeStroke, setActiveStroke] = useState<Array<{ x: number; y: number }>>([]);
  const [pendingImageInsertPoint, setPendingImageInsertPoint] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const baseImageRef = useRef<HTMLImageElement | null>(null);
  const activeBoardUploadInputRef = useRef<HTMLInputElement | null>(null);
  const newBoardUploadInputRef = useRef<HTMLInputElement | null>(null);
  const canvasImageUploadInputRef = useRef<HTMLInputElement | null>(null);
  const interactiveItemsRef = useRef<
    Array<{
      eventId: string;
      type: "text" | "image";
      x: number;
      y: number;
      w: number;
      h: number;
      anchorX: number;
      anchorY: number;
      coordSpace: "canvas" | "image";
    }>
  >([]);
  const imageAssetCacheRef = useRef<Record<string, HTMLImageElement>>({});
  const activeBoardIdRef = useRef<string | null>(null);

  const activeBoard = useMemo(() => boards.find((b) => b.id === activeBoardId) || null, [boards, activeBoardId]);
  const isViewer = useMemo(() => {
    if (!user || !activeBoardId) return false;
    if (user.role === "admin") return false;
    const m = boardMembers.find((item) => item.userId === user.userId);
    return m?.accessRole === "viewer";
  }, [boardMembers, activeBoardId, user]);

  const isBoardOwner = useMemo(() => {
    if (!user || !activeBoard) return false;
    return activeBoard.ownerId === user.userId;
  }, [activeBoard, user]);

  const isMobileDevice = deviceType === "mobile";

  const selectedEvent = useMemo(() => events.find((e) => e.id === selectedEventId) || null, [events, selectedEventId]);

  const wrapText = useCallback((ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(/\s+/).filter(Boolean);
    if (!words.length) return [""];

    const lines: string[] = [];
    let current = words[0];

    for (let i = 1; i < words.length; i++) {
      const probe = `${current} ${words[i]}`;
      if (ctx.measureText(probe).width <= maxWidth) {
        current = probe;
      } else {
        lines.push(current);
        current = words[i];
      }
    }

    lines.push(current);
    return lines;
  }, []);

  const getMergedPayloadForEvent = useCallback(
    (eventId: string) => {
      const base = events.find((e) => e.id === eventId);
      if (!base) return null;
      const merged: Record<string, unknown> = { ...(base.payload || {}) };
      for (const evt of events) {
        if (evt.type !== "item_update") continue;
        if (String(evt.payload?.targetEventId || "") !== eventId) continue;
        Object.assign(merged, evt.payload || {});
      }
      return merged;
    },
    [events]
  );

  useEffect(() => {
    activeBoardIdRef.current = activeBoardId;
  }, [activeBoardId]);

  const requestJson = useCallback(async <T,>(url: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(url, options);
    const data = (await res.json()) as T & { error?: string };
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  }, []);

  const loadSession = useCallback(async () => {
    const data = await requestJson<{ user: ColabUser | null }>("/api/colab/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "session" }),
    });
    setUser(data.user);
    return data.user;
  }, [requestJson]);

  const loadContainers = useCallback(async () => {
    const data = await requestJson<{ containers: ContainerSummary[] }>("/api/colab/containers");
    setContainers(data.containers);
    setSelectedContainerId((prev) => {
      if (prev === "all") return prev;
      return data.containers.some((c) => c.id === prev) ? prev : "all";
    });
  }, [requestJson]);

  const loadBoards = useCallback(async (preferredBoardId?: string | null) => {
    const data = await requestJson<{ boards: BoardSummary[] }>("/api/colab/boards");
    setBoards(data.boards);

    if (data.boards.length === 0) {
      setActiveBoardId(null);
      setActiveBoardTitle("Untitled Board");
      setActiveBaseImageUrl(null);
      setEvents([]);
      setLastEventId(null);
      return;
    }

    const currentBoardId = activeBoardIdRef.current;
    const nextId =
      preferredBoardId && data.boards.some((b) => b.id === preferredBoardId)
        ? preferredBoardId
        : currentBoardId && data.boards.some((b) => b.id === currentBoardId)
        ? currentBoardId
        : data.boards[0].id;

    if (nextId) setActiveBoardId(nextId);
  }, [requestJson]);

  const loadBoardState = useCallback(async (boardId: string, since?: string | null) => {
    const url = since ? `/api/colab/boards/${boardId}?since=${encodeURIComponent(since)}` : `/api/colab/boards/${boardId}`;
    const data = await requestJson<{
      board: { id: string; title: string; category: "business" | "project"; baseImageUrl: string | null };
      members: BoardMember[];
      presence: PresenceUser[];
      events: BoardEvent[];
    }>(url);

    setActiveBoardTitle(data.board.title);
    setActiveBoardCategory(data.board.category);
    setActiveBaseImageUrl(normalizeBaseImageUrl(data.board.baseImageUrl));
    setBoardMembers(data.members);
    setPresence(data.presence);

    if (!since) {
      setEvents(data.events);
      setLastEventId(data.events.length ? data.events[data.events.length - 1].id : null);
      return;
    }

    if (data.events.length) {
      setEvents((prev) => [...prev, ...data.events]);
      setLastEventId(data.events[data.events.length - 1].id);
    }
  }, [requestJson]);

  const sendEvent = useCallback(
    async (type: BoardEvent["type"], payload: Record<string, unknown>) => {
      if (!activeBoardId) return;
      await requestJson<{ ok: boolean; id: string }>(`/api/colab/boards/${activeBoardId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "event", type, payload }),
      });
    },
    [activeBoardId, requestJson]
  );

  const sendPresence = useCallback(async () => {
    if (!activeBoardId) return;
    try {
      await requestJson<{ ok: boolean }>(`/api/colab/boards/${activeBoardId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "presence" }),
      });
    } catch {
      // no-op
    }
  }, [activeBoardId, requestJson]);

  const getDrawSpaceRect = useCallback(
    (canvas: HTMLCanvasElement, space: "canvas" | "image") => {
      if (space === "image" && baseImageRef.current) {
        const img = baseImageRef.current;
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const offsetX = (canvas.width - drawW) / 2;
        const offsetY = (canvas.height - drawH) / 2;
        return { x: offsetX, y: offsetY, w: drawW, h: drawH };
      }

      const canvasAspect = canvas.width / Math.max(canvas.height, 1);
      let drawW = canvas.width;
      let drawH = canvas.height;

      if (canvasAspect > BOARD_ASPECT_RATIO) {
        drawH = canvas.height;
        drawW = drawH * BOARD_ASPECT_RATIO;
      } else {
        drawW = canvas.width;
        drawH = drawW / BOARD_ASPECT_RATIO;
      }

      const offsetX = (canvas.width - drawW) / 2;
      const offsetY = (canvas.height - drawH) / 2;
      return { x: offsetX, y: offsetY, w: drawW, h: drawH };
    },
    []
  );

  const toNormalizedPoint = useCallback(
    (point: { x: number; y: number }, space: "canvas" | "image") => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = getDrawSpaceRect(canvas, space);
      return {
        x: clamp01((point.x - rect.x) / Math.max(rect.w, 1)),
        y: clamp01((point.y - rect.y) / Math.max(rect.h, 1)),
      };
    },
    [getDrawSpaceRect]
  );

  const fromNormalizedPoint = useCallback(
    (norm: { x: number; y: number }, canvas: HTMLCanvasElement, space: "canvas" | "image") => {
      const rect = getDrawSpaceRect(canvas, space);
      return {
        x: rect.x + norm.x * rect.w,
        y: rect.y + norm.y * rect.h,
      };
    },
    [getDrawSpaceRect]
  );

  const renderBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = wrapperRef.current;
    const width = parent?.clientWidth || window.innerWidth;
    const height = parent?.clientHeight || window.innerHeight;

    const nextWidth = Math.max(1, Math.floor(width));
    const nextHeight = Math.max(1, Math.floor(height));

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    interactiveItemsRef.current = [];

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (baseImageRef.current) {
      const img = baseImageRef.current;
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const offsetX = (canvas.width - drawW) / 2;
      const offsetY = (canvas.height - drawH) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }

    const updateMap = new Map<string, Record<string, unknown>>();
    for (const event of events) {
      if (event.type !== "item_update") continue;
      const targetEventId = String(event.payload.targetEventId || "");
      if (!targetEventId) continue;
      updateMap.set(targetEventId, event.payload);
    }

    for (const event of events) {
      if (event.type === "clear") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        continue;
      }

      if (event.type === "stroke") {
        const coordSpace = event.payload.coordSpace === "image" ? "image" : "canvas";
        const normPoints = event.payload.normPoints as Array<{ x: number; y: number }> | undefined;
        const legacyPoints = event.payload.points as Array<{ x: number; y: number }> | undefined;

        const points =
          normPoints && normPoints.length
            ? normPoints.map((p) => fromNormalizedPoint(p, canvas, coordSpace))
            : legacyPoints || [];

        if (points.length < 2) continue;
        ctx.strokeStyle = String(event.payload.color || "#111111");
        ctx.lineWidth = Number(event.payload.size || 4);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
        continue;
      }

      if (event.type === "shape") {
        const coordSpace = event.payload.coordSpace === "image" ? "image" : "canvas";
        const shapeType = String(event.payload.shapeType || "line");

        const normFrom = event.payload.normFrom as { x: number; y: number } | undefined;
        const normTo = event.payload.normTo as { x: number; y: number } | undefined;
        const legacyFrom = event.payload.from as { x: number; y: number } | undefined;
        const legacyTo = event.payload.to as { x: number; y: number } | undefined;

        const from = normFrom ? fromNormalizedPoint(normFrom, canvas, coordSpace) : legacyFrom;
        const to = normTo ? fromNormalizedPoint(normTo, canvas, coordSpace) : legacyTo;

        if (!from || !to) continue;
        ctx.strokeStyle = String(event.payload.color || "#111111");
        ctx.lineWidth = Number(event.payload.size || 4);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        if (shapeType === "rect") {
          const x = Math.min(from.x, to.x);
          const y = Math.min(from.y, to.y);
          const w = Math.abs(to.x - from.x);
          const h = Math.abs(to.y - from.y);
          ctx.strokeRect(x, y, w, h);
        } else {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
        continue;
      }

      if (event.type === "text") {
        const updates = updateMap.get(event.id) || {};
        const payload = { ...event.payload, ...updates };
        const text = String(payload.text || "");
        const coordSpace = payload.coordSpace === "image" ? "image" : "canvas";
        const normPoint = payload.normPoint as { x: number; y: number } | undefined;
        const legacyPoint = payload.point as { x: number; y: number } | undefined;
        const point = normPoint ? fromNormalizedPoint(normPoint, canvas, coordSpace) : legacyPoint;
        if (!text || !point) continue;
        const renderPoint = draggingSelection?.eventId === event.id && dragPreviewAnchor ? dragPreviewAnchor : point;

        const fontSize = Number(payload.size || 24);
        const boxWidth = Number(payload.boxWidth || 260);
        const lineHeight = Math.max(18, Math.floor(fontSize * 1.25));
        ctx.font = `${fontSize}px Inter, Arial, sans-serif`;
        ctx.fillStyle = String(payload.color || "#111111");

        const lines = wrapText(ctx, text, boxWidth);
        let maxLine = 0;
        lines.forEach((line, idx) => {
          maxLine = Math.max(maxLine, ctx.measureText(line).width);
          ctx.fillText(line, renderPoint.x, renderPoint.y + idx * lineHeight);
        });

        interactiveItemsRef.current.push({
          eventId: event.id,
          type: "text",
          x: renderPoint.x,
          y: renderPoint.y - fontSize,
          w: Math.max(maxLine, boxWidth),
          h: Math.max(lineHeight, lines.length * lineHeight),
          anchorX: renderPoint.x,
          anchorY: renderPoint.y,
          coordSpace,
        });
        continue;
      }

      if (event.type === "image") {
        const updates = updateMap.get(event.id) || {};
        const payload = { ...event.payload, ...updates };
        const url = String(payload.url || "");
        if (!url) continue;

        const coordSpace = payload.coordSpace === "image" ? "image" : "canvas";
        const normPoint = payload.normPoint as { x: number; y: number } | undefined;
        const legacyPoint = payload.point as { x: number; y: number } | undefined;
        const point = normPoint ? fromNormalizedPoint(normPoint, canvas, coordSpace) : legacyPoint;
        if (!point) continue;
        const renderPoint = draggingSelection?.eventId === event.id && dragPreviewAnchor ? dragPreviewAnchor : point;

        const widthPx = Number(payload.width || 280);
        const heightPx = Number(payload.height || 180);
        const cached = imageAssetCacheRef.current[url];
        if (!cached) {
          const img = new Image();
          img.onload = () => window.dispatchEvent(new Event("resize"));
          img.onerror = () => window.dispatchEvent(new Event("resize"));
          img.src = url;
          imageAssetCacheRef.current[url] = img;
        } else if (cached.complete && cached.naturalWidth > 0) {
          ctx.drawImage(cached, renderPoint.x, renderPoint.y, widthPx, heightPx);
        }

        interactiveItemsRef.current.push({
          eventId: event.id,
          type: "image",
          x: renderPoint.x,
          y: renderPoint.y,
          w: widthPx,
          h: heightPx,
          anchorX: renderPoint.x,
          anchorY: renderPoint.y,
          coordSpace,
        });
      }
    }

    if (isDrawing && activeStroke.length > 1 && (tool === "pen" || tool === "eraser")) {
      ctx.strokeStyle = tool === "eraser" ? "#ffffff" : drawColor;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(activeStroke[0].x, activeStroke[0].y);
      for (let i = 1; i < activeStroke.length; i++) ctx.lineTo(activeStroke[i].x, activeStroke[i].y);
      ctx.stroke();
    }

    if (isDrawing && activeStroke.length > 1 && (tool === "line" || tool === "rect")) {
      const from = activeStroke[0];
      const to = activeStroke[activeStroke.length - 1];
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = lineWidth;
      if (tool === "line") {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      } else {
        const x = Math.min(from.x, to.x);
        const y = Math.min(from.y, to.y);
        const w = Math.abs(to.x - from.x);
        const h = Math.abs(to.y - from.y);
        ctx.strokeRect(x, y, w, h);
      }
    }
  }, [activeStroke, dragPreviewAnchor, draggingSelection, drawColor, events, fromNormalizedPoint, isDrawing, lineWidth, tool, wrapText]);

  useEffect(() => {
    void (async () => {
      try {
        const currentUser = await loadSession();
        if (currentUser) {
          await loadContainers();
          await loadBoards(currentUser.lastBoardId || null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [loadBoards, loadContainers, loadSession]);

  useEffect(() => {
    const detectDeviceType = () => {
      const ua = navigator.userAgent || "";
      const mobileUa = /iPhone|Android.+Mobile|Mobile/i.test(ua);
      const tabletUa = /iPad|Tablet|Android(?!.*Mobile)/i.test(ua);
      if (mobileUa || window.innerWidth < 768) {
        setDeviceType("mobile");
        return;
      }
      if (tabletUa || window.innerWidth < 1100) {
        setDeviceType("tablet");
        return;
      }
      setDeviceType("desktop");
    };

    detectDeviceType();
    window.addEventListener("resize", detectDeviceType);
    return () => window.removeEventListener("resize", detectDeviceType);
  }, []);

  useEffect(() => {
    if (!user || !activeBoardId) return;
    setSelectedEventId(null);
    setDraggingSelection(null);
    setDragPreviewAnchor(null);
    setDragMoved(false);
    setEvents([]);
    setLastEventId(null);
    setInviteEmail("");
    setInviteLink("");
    void loadBoardState(activeBoardId, null);
  }, [activeBoardId, loadBoardState, user]);

  useEffect(() => {
    if (!showShare || !activeBoardId || !isBoardOwner) {
      setShareableUsers([]);
      return;
    }
    void (async () => {
      try {
        const data = await requestJson<{ users: ColabUser[] }>(`/api/colab/users?scope=share&boardId=${encodeURIComponent(activeBoardId)}`);
        setShareableUsers(data.users || []);
      } catch {
        setShareableUsers([]);
      }
    })();
  }, [activeBoardId, isBoardOwner, requestJson, showShare]);

  useEffect(() => {
    if (!activeBaseImageUrl) {
      setIsBaseImageMissing(false);
      baseImageRef.current = null;
      renderBoard();
      return;
    }

    setIsBaseImageMissing(false);
    const image = new Image();
    image.onload = () => {
      setIsBaseImageMissing(false);
      baseImageRef.current = image;
      renderBoard();
    };
    image.onerror = () => {
      setIsBaseImageMissing(true);
      const fallbackThumb = activeBoard?.thumbnail;
      if (typeof fallbackThumb === "string" && fallbackThumb.startsWith("data:image/")) {
        const thumbImage = new Image();
        thumbImage.onload = () => {
          baseImageRef.current = thumbImage;
          renderBoard();
        };
        thumbImage.onerror = () => {
          baseImageRef.current = null;
          renderBoard();
        };
        thumbImage.src = fallbackThumb;
        return;
      }

      baseImageRef.current = null;
      renderBoard();
    };
    image.src = activeBaseImageUrl;
  }, [activeBaseImageUrl, activeBoard?.thumbnail, renderBoard]);

  useEffect(() => {
    renderBoard();
  }, [events, renderBoard]);

  useEffect(() => {
    const onResize = () => renderBoard();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [renderBoard]);

  useInterval(
    () => {
      if (!activeBoardId || !user) return;
      void loadBoardState(activeBoardId, lastEventId);
    },
    activeBoardId ? 1500 : null
  );

  useInterval(
    () => {
      if (!activeBoardId || !user) return;
      void sendPresence();
    },
    activeBoardId ? 10_000 : null
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("invite");
    if (!token) return;
    if (!user) return;
    void (async () => {
      try {
        const data = await requestJson<{ ok: boolean; boardId: string }>(`/api/colab/invite/${encodeURIComponent(token)}`, {
          method: "POST",
        });
        await loadBoards(data.boardId);
        params.delete("invite");
        const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
        window.history.replaceState({}, "", next);
      } catch {
        // no-op
      }
    })();
  }, [loadBoards, requestJson, user]);

  const completeAuthenticatedLoad = async () => {
    const currentUser = await loadSession();
    await loadContainers();
    await loadBoards(currentUser?.lastBoardId || null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await requestJson<{ ok: boolean }>("/api/colab/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      await completeAuthenticatedLoad();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed");
    }
  };

  const handleRegister = async () => {
    setLoginError("");
    try {
      await requestJson<{ ok: boolean }>("/api/colab/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", name: registerName.trim(), email, password }),
      });
      await completeAuthenticatedLoad();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Account creation failed");
    }
  };

  const handleLogout = async () => {
    await requestJson<{ ok: boolean }>("/api/colab/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setUser(null);
    setBoards([]);
    setActiveBoardId(null);
    setEvents([]);
  };

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isViewer) return;
    const p = getCanvasPoint(e);

    if (tool === "pointer") {
      const hit = [...interactiveItemsRef.current].reverse().find((item) => p.x >= item.x && p.x <= item.x + item.w && p.y >= item.y && p.y <= item.y + item.h);
      if (!hit) {
        setSelectedEventId(null);
        setDraggingSelection(null);
        return;
      }

      setSelectedEventId(hit.eventId);
      setDraggingSelection({
        eventId: hit.eventId,
        type: hit.type,
        coordSpace: hit.coordSpace,
        anchorOffsetX: p.x - hit.anchorX,
        anchorOffsetY: p.y - hit.anchorY,
      });
      setDragPreviewAnchor({ x: hit.anchorX, y: hit.anchorY });
      setDragMoved(false);
      return;
    }

    if (tool === "image") {
      setPendingImageInsertPoint(p);
      canvasImageUploadInputRef.current?.click();
      return;
    }

    if (tool === "text") {
      const text = window.prompt("Enter text for board");
      if (text && text.trim()) {
        const thumb = canvasRef.current?.toDataURL("image/jpeg", 0.35) || null;
        const coordSpace = baseImageRef.current ? "image" : "canvas";
        void sendEvent("text", {
          text: text.trim(),
          normPoint: toNormalizedPoint(p, coordSpace),
          coordSpace,
          color: drawColor,
          size: textFontSize,
          boxWidth: textBoxWidth,
          thumbnail: thumb,
        });
      }
      return;
    }

    setIsDrawing(true);
    setStartPoint(p);
    setActiveStroke([p]);
  };

  const handlePointerDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isViewer || tool !== "pointer") return;
    const p = getCanvasPoint(e as unknown as React.PointerEvent<HTMLCanvasElement>);
    const hit = [...interactiveItemsRef.current]
      .reverse()
      .find((item) => item.type === "text" && p.x >= item.x && p.x <= item.x + item.w && p.y >= item.y && p.y <= item.y + item.h);
    if (!hit) return;
    setSelectedEventId(hit.eventId);
    void updateSelectedText(hit.eventId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = getCanvasPoint(e);

    if (draggingSelection) {
      const selectedItem = interactiveItemsRef.current.find((item) => item.eventId === draggingSelection.eventId);
      if (!selectedItem) return;

      const nextAnchor = {
        x: p.x - draggingSelection.anchorOffsetX,
        y: p.y - draggingSelection.anchorOffsetY,
      };

      setDragPreviewAnchor(nextAnchor);
      if (!dragMoved) {
        const dx = Math.abs(nextAnchor.x - selectedItem.anchorX);
        const dy = Math.abs(nextAnchor.y - selectedItem.anchorY);
        if (dx > 2 || dy > 2) setDragMoved(true);
      }
      return;
    }

    if (!isDrawing) return;

    if (tool === "pen" || tool === "eraser") {
      setActiveStroke((prev) => [...prev, p]);
      return;
    }
    if (tool === "line" || tool === "rect") {
      setActiveStroke((prev) => [prev[0] || p, p]);
    }
  };

  const handlePointerUp = () => {
    if (draggingSelection) {
      if (dragMoved && dragPreviewAnchor) {
        const targetNorm = toNormalizedPoint(dragPreviewAnchor, draggingSelection.coordSpace);
        const thumb = canvasRef.current?.toDataURL("image/jpeg", 0.35) || null;
        void sendEvent("item_update", {
          targetEventId: draggingSelection.eventId,
          normPoint: targetNorm,
          coordSpace: draggingSelection.coordSpace,
          thumbnail: thumb,
        });
      }
      setDraggingSelection(null);
      setDragPreviewAnchor(null);
      setDragMoved(false);
      return;
    }

    if (!isDrawing || !activeBoardId || !startPoint) return;
    const thumb = canvasRef.current?.toDataURL("image/jpeg", 0.35) || null;
    const coordSpace = baseImageRef.current ? "image" : "canvas";

    if (tool === "pen" || tool === "eraser") {
      if (activeStroke.length > 1) {
        void sendEvent("stroke", {
          normPoints: activeStroke.map((p) => toNormalizedPoint(p, coordSpace)),
          coordSpace,
          color: tool === "eraser" ? "#ffffff" : drawColor,
          size: lineWidth,
          tool,
          thumbnail: thumb,
        });
      }
    } else if (tool === "line" || tool === "rect") {
      const to = activeStroke[activeStroke.length - 1] || startPoint;
      void sendEvent("shape", {
        shapeType: tool,
        normFrom: toNormalizedPoint(startPoint, coordSpace),
        normTo: toNormalizedPoint(to, coordSpace),
        coordSpace,
        color: drawColor,
        size: lineWidth,
        thumbnail: thumb,
      });
    }

    setIsDrawing(false);
    setStartPoint(null);
    setActiveStroke([]);
  };

  const uploadImageFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/colab/upload", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const createBoard = async () => {
    if (!newBoardTitle.trim()) return;
    const data = await requestJson<{ id: string }>("/api/colab/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newBoardTitle.trim(),
        category: newBoardCategory,
        containerId: newBoardContainerId === "none" ? null : newBoardContainerId,
        baseImageUrl: newBoardBaseImageUrl,
      }),
    });
    setNewBoardTitle("");
    setNewBoardCategory("project");
    setNewBoardContainerId("none");
    setNewBoardBaseImageUrl(null);
    setShowCreateBoard(false);
    await loadContainers();
    await loadBoards(data.id);
  };

  const createContainer = async () => {
    if (!newContainerName.trim()) return;
    const data = await requestJson<{ id: string }>("/api/colab/containers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newContainerName.trim() }),
    });
    setNewContainerName("");
    await loadContainers();
    setSelectedContainerId(data.id);
    setNewBoardContainerId(data.id);
  };

  const handleNewBoardBaseUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      setIsUploadingNewBoardImage(true);
      const imageUrl = await uploadImageFile(file);
      setNewBoardBaseImageUrl(imageUrl);
    } finally {
      setIsUploadingNewBoardImage(false);
    }
  };

  const handleActiveBoardBaseUpload = async (file?: File | null) => {
    if (!file || !activeBoardId) return;
    await setBaseImageForBoard(activeBoardId, file);
  };

  const handleCanvasImageInsert = async (file?: File | null) => {
    if (!file || !activeBoardId || !pendingImageInsertPoint) return;
    const coordSpace = baseImageRef.current ? "image" : "canvas";
    const uploadedUrl = await uploadImageFile(file);
    const thumb = canvasRef.current?.toDataURL("image/jpeg", 0.35) || null;
    await sendEvent("image", {
      url: uploadedUrl,
      normPoint: toNormalizedPoint(pendingImageInsertPoint, coordSpace),
      coordSpace,
      width: 320,
      height: 220,
      thumbnail: thumb,
    });
    setPendingImageInsertPoint(null);
  };

  const undoLastAction = async () => {
    if (!activeBoardId || isViewer) return;
    await requestJson<{ ok: boolean }>(`/api/colab/boards/${activeBoardId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "undo" }),
    });
    await loadBoardState(activeBoardId, null);
  };

  const redoLastAction = async () => {
    if (!activeBoardId || isViewer) return;
    await requestJson<{ ok: boolean }>(`/api/colab/boards/${activeBoardId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "redo" }),
    });
    await loadBoardState(activeBoardId, null);
  };

  const updateSelectedText = async (eventIdOverride?: string) => {
    const targetId = eventIdOverride || selectedEvent?.id;
    if (!targetId) return;
    const baseEvent = events.find((e) => e.id === targetId);
    if (!baseEvent || baseEvent.type !== "text") return;

    const merged = getMergedPayloadForEvent(targetId) || {};
    const currentText = String(merged.text || "");
    const nextText = window.prompt("Edit text", currentText);
    if (nextText === null) return;
    const thumb = canvasRef.current?.toDataURL("image/jpeg", 0.35) || null;
    await sendEvent("item_update", {
      targetEventId: targetId,
      text: nextText,
      color: drawColor,
      boxWidth: textBoxWidth,
      size: textFontSize,
      thumbnail: thumb,
    });
  };

  const clearBoard = async () => {
    if (!activeBoardId || isViewer) return;
    const okay = window.confirm("Clear this board for everyone?");
    if (!okay) return;
    await sendEvent("clear", { thumbnail: null });
  };

  const renameBoard = async () => {
    if (!activeBoardId) return;
    const next = window.prompt("Rename board", activeBoardTitle);
    if (!next || !next.trim()) return;
    await requestJson<{ ok: boolean }>(`/api/colab/boards/${activeBoardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rename", title: next.trim() }),
    });
    await loadBoards(activeBoardId);
    await loadBoardState(activeBoardId);
  };

  const setBaseImageForBoard = async (boardId: string, file: File) => {
    const imageUrl = await uploadImageFile(file);
    await requestJson<{ ok: boolean }>(`/api/colab/boards/${boardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set_base_image", baseImageUrl: imageUrl }),
    });
    if (boardId === activeBoardId) {
      setActiveBaseImageUrl(imageUrl);
    }
    await loadBoards(boardId);
    await loadBoardState(boardId);
  };

  const inviteToBoard = async () => {
    if (!activeBoardId || !inviteEmail.trim()) return;
    const data = await requestJson<{ ok: boolean; inviteUrl: string }>(`/api/colab/boards/${activeBoardId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
    });
    setInviteLink(data.inviteUrl);
  };

  const addExistingUserToBoard = async () => {
    if (!activeBoardId || !inviteEmail.trim()) return;
    await requestJson<{ ok: boolean }>(`/api/colab/boards/${activeBoardId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
    });
    setInviteLink("User added to board.");
    await loadBoardState(activeBoardId);
  };

  const createAndAddUserToBoard = async () => {
    if (!activeBoardId || user?.role !== "admin") return;
    if (!inviteEmail.trim() || !shareNewUserName.trim() || !shareNewUserPassword.trim()) return;

    await requestJson<{ userId: string }>("/api/colab/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: inviteEmail.trim(),
        name: shareNewUserName.trim(),
        password: shareNewUserPassword,
        role: "member",
      }),
    });

    await requestJson<{ ok: boolean }>(`/api/colab/boards/${activeBoardId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
    });

    setInviteLink("New user created and added to board.");
    setShareNewUserName("");
    setShareNewUserPassword("");
    await loadBoardState(activeBoardId);
  };

  const loadAdminUsers = async () => {
    if (!user || user.role !== "admin") return;
    const data = await requestJson<{ users: ColabUser[] }>("/api/colab/users");
    setAdminUsers(data.users);
  };

  const createUser = async () => {
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPass.trim()) return;
    await requestJson<{ userId: string }>("/api/colab/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        password: newUserPass,
        role: newUserRole,
      }),
    });
    setAdminMessage(`Created ${newUserEmail}`);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPass("");
    setNewUserRole("member");
    await loadAdminUsers();
  };

  const canDeleteBoard = (board: BoardSummary) => {
    if (!user) return false;
    if (board.containerId) return board.containerOwnerId === user.userId;
    return user.role === "admin" || board.ownerId === user.userId;
  };

  const deleteBoard = async (boardId: string) => {
    const board = boards.find((b) => b.id === boardId);
    if (!board) return;
    if (!canDeleteBoard(board)) {
      window.alert("You cannot delete this board. Only the container creator can delete boards in that container.");
      return;
    }

    const okay = window.confirm(`Delete "${board.title}"? This removes it from your board list.`);
    if (!okay) return;

    try {
      await requestJson<{ ok: boolean }>(`/api/colab/boards/${boardId}`, {
        method: "DELETE",
      });

      const fallbackBoardId = boardId === activeBoardId ? boards.find((b) => b.id !== boardId)?.id || null : activeBoardId;
      await loadBoards(fallbackBoardId);
      if (showAllBoards && boards.length <= 1) setShowAllBoards(false);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const downloadPdf = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { jsPDF } = await import("jspdf");
    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";
    const pdf = new jsPDF({ orientation, unit: "px", format: [canvas.width, canvas.height] });
    const image = canvas.toDataURL("image/png");
    pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${activeBoardTitle.replace(/\s+/g, "-").toLowerCase() || "colab-board"}.pdf`);
  };

  const allBoardsFiltered = useMemo(() => {
    const byContainer =
      selectedContainerId === "all"
        ? boards
        : boards.filter((b) => (b.containerId || "none") === selectedContainerId);

    const byCategory =
      dropdownCategoryFilter === "all"
        ? byContainer
        : byContainer.filter((b) => b.category === dropdownCategoryFilter);

    const q = boardSearch.trim().toLowerCase();
    if (!q) return byCategory;

    return byCategory.filter((b) => {
      const created = new Date(b.createdAt).toLocaleString().toLowerCase();
      const updated = new Date(b.updatedAt).toLocaleString().toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        (b.containerName || "").toLowerCase().includes(q) ||
        b.ownerName.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        created.includes(q) ||
        updated.includes(q)
      );
    });
  }, [boards, dropdownCategoryFilter, boardSearch, selectedContainerId]);

  const recentBoards = useMemo(() => allBoardsFiltered.slice(0, 10), [allBoardsFiltered]);
  const activity = useMemo(() => events.slice(-2).reverse(), [events]);
  const invitePending = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("invite");

  if (loading) {
    return <div className="min-h-screen bg-black text-white grid place-items-center">Loading Colab...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white grid place-items-center p-6">
        <form
          onSubmit={(e) => {
            if (authMode === "register") {
              e.preventDefault();
              void handleRegister();
              return;
            }
            void handleLogin(e);
          }}
          className="w-full max-w-md bg-[#171717] border border-[#2a2a2a] rounded-2xl p-6 space-y-4"
        >
          <div>
            <h1 className="text-2xl font-bold">COLAB</h1>
            <p className="text-sm text-zinc-400">Secure whiteboard workspace</p>
            {invitePending && <p className="text-xs text-emerald-400 mt-1">Invite detected — log in or create an account to open the shared board.</p>}
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-lg bg-black p-1 border border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setLoginError("");
              }}
              className={`rounded-md py-2 text-sm ${authMode === "login" ? "bg-[#FF8900] text-black font-semibold" : "text-zinc-300"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setLoginError("");
              }}
              className={`rounded-md py-2 text-sm ${authMode === "register" ? "bg-[#FF8900] text-black font-semibold" : "text-zinc-300"}`}
            >
              Create Account
            </button>
          </div>

          {authMode === "register" && (
            <input
              className="w-full rounded-lg bg-black border border-zinc-700 px-3 py-2"
              placeholder="Full name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />
          )}
          <input className="w-full rounded-lg bg-black border border-zinc-700 px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-lg bg-black border border-zinc-700 px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {loginError && <p className="text-sm text-red-400">{loginError}</p>}

          {authMode === "login" ? (
            <button className="w-full rounded-lg bg-[#FF8900] text-black font-semibold py-2">Enter Colab</button>
          ) : (
            <button type="button" onClick={handleRegister} className="w-full rounded-lg bg-[#FF8900] text-black font-semibold py-2">
              Create Account
            </button>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#f8fafc] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-20 h-14 bg-black/88 text-white flex items-center gap-3 px-3 border-b border-zinc-800">
        <button
          onClick={() => {
            setNewBoardContainerId(selectedContainerId === "all" ? "none" : selectedContainerId);
            setShowCreateBoard(true);
          }}
          className="text-sm px-3 py-1.5 rounded-md bg-[#FF8900] text-black font-semibold"
        >
          + New Board
        </button>
        <button onClick={() => void undoLastAction()} className="text-sm px-3 py-1.5 rounded-md bg-zinc-800">Back</button>
        <button onClick={() => void redoLastAction()} className="text-sm px-3 py-1.5 rounded-md bg-zinc-800">Forward</button>
        <button onClick={renameBoard} className="text-sm px-3 py-1.5 rounded-md bg-zinc-800">Rename</button>
        <button
          onClick={() => activeBoardUploadInputRef.current?.click()}
          disabled={!activeBoardId}
          className="text-sm px-3 py-1.5 rounded-md bg-zinc-800 disabled:opacity-50"
        >
          Upload Image
        </button>
        <input
          ref={activeBoardUploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            void handleActiveBoardBaseUpload(file);
            e.currentTarget.value = "";
          }}
        />
        <input
          ref={canvasImageUploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            void handleCanvasImageInsert(file);
            e.currentTarget.value = "";
          }}
        />

        <div className="text-sm truncate max-w-[36vw] leading-tight">
          <div className="font-semibold truncate">{activeBoardTitle}</div>
          {activeBoard && !isMobileDevice && (
            <div className="text-[10px] text-zinc-400 uppercase tracking-wide">
              {(activeBoard.containerName || "unassigned")} · {activeBoard.category} · {new Date(activeBoard.createdAt).toLocaleString()}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={clearBoard} disabled={isViewer} className="text-sm px-3 py-1.5 rounded-md bg-zinc-800 disabled:opacity-50">Clear</button>
          {isBoardOwner && <button onClick={() => setShowShare((v) => !v)} className="text-sm px-3 py-1.5 rounded-md bg-zinc-800">Share</button>}
          <button onClick={downloadPdf} className="text-sm px-3 py-1.5 rounded-md bg-zinc-800">Download PDF</button>
          {user.role === "admin" && (
            <button
              onClick={() => {
                setShowAdmin((v) => !v);
                void loadAdminUsers();
              }}
              className="text-sm px-3 py-1.5 rounded-md bg-zinc-800"
            >
              Admin
            </button>
          )}
          <button onClick={handleLogout} className="text-sm px-3 py-1.5 rounded-md bg-zinc-800">Logout</button>
          <button onClick={() => setShowHamburger((v) => !v)} className="text-xl px-3">☰</button>
        </div>
      </div>

      <div className="absolute top-14 left-0 right-0 z-10 bg-white/95 border-b border-zinc-200 px-3 py-2 flex items-center gap-2 overflow-x-auto">
        {(["pointer", "pen", "eraser", "line", "rect", "text", "image"] as ToolMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setTool(mode)}
            className={`px-3 py-1.5 rounded-md text-sm border ${tool === mode ? "bg-black text-white border-black" : "bg-white text-zinc-700 border-zinc-300"}`}
          >
            {mode}
          </button>
        ))}
        <div className="flex items-center gap-1">
          <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="h-8 w-10 border border-zinc-300 rounded" disabled={tool === "eraser"} />
          <input
            type="text"
            value={drawColor}
            onChange={(e) => setDrawColor(e.target.value)}
            className="w-24 text-xs px-2 py-1 border border-zinc-300 rounded"
            placeholder="#111111"
          />
        </div>
        <input type="range" min={1} max={24} value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} />
        <span className="text-xs text-zinc-500">{lineWidth}px</span>

        {tool === "text" && (
          <>
            <input type="range" min={80} max={700} value={textBoxWidth} onChange={(e) => setTextBoxWidth(Number(e.target.value))} />
            <span className="text-xs text-zinc-500">Box {textBoxWidth}px</span>
            <input type="range" min={12} max={72} value={textFontSize} onChange={(e) => setTextFontSize(Number(e.target.value))} />
            <span className="text-xs text-zinc-500">Font {textFontSize}px</span>
          </>
        )}

        {tool === "pointer" && selectedEvent?.type === "text" && (
          <button onClick={() => void updateSelectedText()} className="px-3 py-1.5 rounded-md text-xs border border-zinc-300 bg-white">
            Edit Selected Text
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-zinc-400">{deviceType}</span>
          {presence.map((p) => (
            <div key={p.userId} className="px-2 py-1 rounded-full text-xs text-white" style={{ background: p.color }} title={`${p.name} active`}>
              {p.name.split(" ")[0]}
            </div>
          ))}
        </div>
      </div>

      {isBaseImageMissing && activeBaseImageUrl && (
        <div className="absolute left-3 right-3 top-[98px] z-20 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-3 py-2 text-sm flex items-center gap-3">
          <span className="font-medium">Base image file is missing for this board. Re-upload image to restore full background.</span>
          <button
            onClick={() => activeBoardUploadInputRef.current?.click()}
            className="ml-auto px-3 py-1.5 rounded-md bg-amber-900 text-white text-xs"
          >
            Re-upload Image
          </button>
        </div>
      )}

      <div ref={wrapperRef} className="absolute left-0 right-0 top-[92px] bottom-0">
        <canvas
          ref={canvasRef}
          className={`w-full h-full touch-none ${tool === "pointer" ? "cursor-default" : "cursor-crosshair"}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onDoubleClick={handlePointerDoubleClick}
        />
      </div>

      <div className="absolute left-3 bottom-3 z-20 w-[360px] max-w-[45vw] max-h-[130px] overflow-auto bg-black/80 text-white rounded-xl p-3 border border-zinc-700">
        <div className="text-xs uppercase tracking-wider text-zinc-400 mb-2">Who changed what</div>
        <div className="space-y-2">
          {activity.map((item) => (
            <div key={item.id} className="text-xs">
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: item.userColor }} />
              <span style={{ color: item.userColor }}>{item.userName}</span>
              <span className="text-zinc-300"> {item.type.replaceAll("_", " ")} </span>
              <span className="text-zinc-500">{formatAgo(item.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>

      {showHamburger && (
        <div className="absolute right-3 top-[98px] z-30 w-[380px] max-w-[94vw] bg-white border border-zinc-200 rounded-xl shadow-2xl p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Recent Boards</h3>
            <button onClick={() => setShowHamburger(false)} className="text-zinc-500">✕</button>
          </div>

          <div className="mb-3 space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500">CONTAINERS (Tabs)</div>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => {
                  setSelectedContainerId("all");
                  setNewBoardContainerId("none");
                }}
                className={`px-2 py-1.5 rounded-md text-xs border ${
                  selectedContainerId === "all" ? "bg-black text-white border-black" : "bg-white text-zinc-700 border-zinc-300"
                }`}
              >
                All Containers
              </button>
              {containers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedContainerId(c.id);
                    setNewBoardContainerId(c.id);
                  }}
                  className={`px-2 py-1.5 rounded-md text-xs border ${
                    selectedContainerId === c.id ? "bg-black text-white border-black" : "bg-white text-zinc-700 border-zinc-300"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="flex gap-1">
              <input
                value={newContainerName}
                onChange={(e) => setNewContainerName(e.target.value)}
                placeholder="Add container (Business, Project name...)"
                className="flex-1 border border-zinc-300 rounded-md px-2 py-1.5 text-xs"
              />
              <button onClick={() => void createContainer()} className="px-2 py-1.5 rounded-md bg-black text-white text-xs">
                Add Container
              </button>
            </div>

            <div className="text-[11px] uppercase tracking-wider text-zinc-500">BUSINESS / PROJECT ORGANIZER</div>
            <div className="grid grid-cols-3 gap-1">
              {([
                { key: "all", label: "All" },
                { key: "business", label: "Business" },
                { key: "project", label: "Project" },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setDropdownCategoryFilter(opt.key)}
                  className={`px-2 py-1.5 rounded-md text-xs border ${
                    dropdownCategoryFilter === opt.key ? "bg-black text-white border-black" : "bg-white text-zinc-700 border-zinc-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <input
              value={boardSearch}
              onChange={(e) => setBoardSearch(e.target.value)}
              placeholder="Search board name, owner, date..."
              className="w-full border border-zinc-300 rounded-md px-2 py-1.5 text-xs"
            />
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-auto">
            {recentBoards.length === 0 && <div className="text-xs text-zinc-500 p-2">No boards in this category yet.</div>}
            {recentBoards.map((b) => (
              <div key={b.id} className={`p-2 rounded-lg border ${b.id === activeBoardId ? "border-black" : "border-zinc-200"}`}>
                <button
                  onClick={() => {
                    setActiveBoardId(b.id);
                    setShowHamburger(false);
                  }}
                  className="w-full text-left"
                >
                  <div className="h-16 rounded bg-zinc-100 overflow-hidden border border-zinc-200 mb-2">
                    {b.thumbnail ? <img src={b.thumbnail} alt={b.title} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-xs text-zinc-400">No Thumbnail</div>}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-sm truncate">{b.title}</div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${b.category === "business" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                      {b.category === "business" ? "BUSINESS" : "PROJECT"}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">Container: {b.containerName || "Unassigned"}</div>
                  <div className="text-xs text-zinc-500">Updated {formatAgo(b.updatedAt)} · {new Date(b.createdAt).toLocaleString()}</div>
                </button>

                {canDeleteBoard(b) && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => void deleteBoard(b.id)}
                      className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setShowAllBoards(true)} className="mt-3 w-full bg-black text-white rounded-lg py-2 text-sm">See All</button>
        </div>
      )}

      {showAllBoards && (
        <div className="absolute inset-0 z-40 bg-black/70 grid place-items-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl">All Boards</h2>
              <button onClick={() => setShowAllBoards(false)}>✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allBoardsFiltered.map((b) => (
                <div key={b.id} className="text-left border border-zinc-200 rounded-xl p-2 hover:border-black">
                  <button
                    onClick={() => {
                      setActiveBoardId(b.id);
                      setShowAllBoards(false);
                    }}
                    className="w-full text-left"
                  >
                    <div className="h-28 bg-zinc-100 rounded-md mb-2 overflow-hidden">
                      {b.thumbnail ? <img src={b.thumbnail} alt={b.title} className="w-full h-full object-cover" /> : <div className="w-full h-full grid place-items-center text-xs text-zinc-400">No Thumbnail</div>}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-sm truncate">{b.title}</div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${b.category === "business" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>
                        {b.category === "business" ? "BUSINESS" : "PROJECT"}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500">{b.lastEditedByName ? `Last: ${b.lastEditedByName}` : "No edits yet"}</div>
                    <div className="text-[11px] text-zinc-500">Container: {b.containerName || "Unassigned"}</div>
                    <div className="text-[11px] text-zinc-400">{new Date(b.createdAt).toLocaleString()}</div>
                  </button>
                  {canDeleteBoard(b) && (
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => void deleteBoard(b.id)}
                        className="text-xs px-2 py-1 rounded bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCreateBoard && (
        <div className="absolute inset-0 z-40 bg-black/65 grid place-items-center p-6">
          <div className="bg-white w-full max-w-md rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-lg">Create New Colab</h3>
            <input className="w-full border border-zinc-300 rounded-lg px-3 py-2" value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} placeholder="Board name" />
            <select className="w-full border border-zinc-300 rounded-lg px-3 py-2" value={newBoardCategory} onChange={(e) => setNewBoardCategory(e.target.value as "business" | "project")}>
              <option value="business">Business Board</option>
              <option value="project">Project Board</option>
            </select>
            <select
              className="w-full border border-zinc-300 rounded-lg px-3 py-2"
              value={newBoardContainerId}
              onChange={(e) => setNewBoardContainerId(e.target.value)}
            >
              <option value="none">No Container</option>
              {containers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="text-xs text-zinc-500">Timestamp: {new Date().toLocaleString()}</div>

            <div className="space-y-2">
              <button
                onClick={() => newBoardUploadInputRef.current?.click()}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm"
                disabled={isUploadingNewBoardImage}
              >
                {isUploadingNewBoardImage ? "Uploading..." : "Upload Image (Base Layer)"}
              </button>
              <input
                ref={newBoardUploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.currentTarget.files?.[0];
                  void handleNewBoardBaseUpload(file);
                  e.currentTarget.value = "";
                }}
              />
              {newBoardBaseImageUrl && (
                <div className="border border-zinc-200 rounded-lg p-2">
                  <img src={newBoardBaseImageUrl} alt="Board base" className="w-full h-32 object-contain bg-zinc-100 rounded" />
                  <button className="mt-2 text-xs underline" onClick={() => setNewBoardBaseImageUrl(null)}>Remove base image</button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCreateBoard(false);
                  setNewBoardContainerId(selectedContainerId === "all" ? "none" : selectedContainerId);
                  setNewBoardBaseImageUrl(null);
                }}
                className="px-3 py-2 rounded-lg bg-zinc-200"
              >
                Cancel
              </button>
              <button onClick={createBoard} className="px-3 py-2 rounded-lg bg-black text-white">Create New Colab</button>
            </div>
          </div>
        </div>
      )}

      {showShare && activeBoardId && isBoardOwner && (
        <div className="absolute right-3 top-[150px] z-30 w-[420px] max-w-[95vw] bg-white border border-zinc-200 rounded-xl shadow-xl p-4 space-y-3">
          <h3 className="font-semibold">Share / Invite (Board Creator Only)</h3>
          {shareableUsers.length > 0 && (
            <select
              className="w-full border border-zinc-300 rounded-lg px-3 py-2"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            >
              <option value="">Select member to share with...</option>
              {shareableUsers.map((u) => (
                <option key={u.userId} value={u.email}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          )}
          <input className="w-full border border-zinc-300 rounded-lg px-3 py-2" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="user@email.com" />
          <select className="w-full border border-zinc-300 rounded-lg px-3 py-2" value={inviteRole} onChange={(e) => setInviteRole(e.target.value as "editor" | "viewer")}>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={addExistingUserToBoard} className="px-3 py-2 rounded-lg bg-zinc-800 text-white text-sm">Add Existing User</button>
            <button onClick={inviteToBoard} className="px-3 py-2 rounded-lg bg-black text-white text-sm">Create Invite Link</button>
          </div>

          {user.role === "admin" && (
            <div className="space-y-2 border border-zinc-200 rounded-lg p-2">
              <div className="text-xs font-semibold">Create New User + Add to Board</div>
              <input
                className="w-full border border-zinc-300 rounded-lg px-2 py-1.5 text-xs"
                placeholder="New user full name"
                value={shareNewUserName}
                onChange={(e) => setShareNewUserName(e.target.value)}
              />
              <input
                className="w-full border border-zinc-300 rounded-lg px-2 py-1.5 text-xs"
                placeholder="Temp password"
                value={shareNewUserPassword}
                onChange={(e) => setShareNewUserPassword(e.target.value)}
              />
              <button onClick={createAndAddUserToBoard} className="w-full px-3 py-2 rounded-lg bg-emerald-700 text-white text-sm">
                Create + Add User
              </button>
            </div>
          )}

          {inviteLink && (
            <div className="text-xs bg-zinc-100 rounded-lg p-2 break-all">
              {inviteLink}
              {inviteLink.startsWith("http") && (
                <button
                  className="ml-2 underline"
                  onClick={() => {
                    void navigator.clipboard.writeText(inviteLink);
                  }}
                >
                  Copy
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {showAdmin && user.role === "admin" && (
        <div className="absolute inset-0 z-50 bg-black/70 grid place-items-center p-6">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[88vh] overflow-auto p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Admin: Manage Users</h3>
              <button onClick={() => setShowAdmin(false)}>✕</button>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <h4 className="font-semibold">Create User</h4>
                <input className="w-full border border-zinc-300 rounded px-3 py-2" placeholder="Name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                <input className="w-full border border-zinc-300 rounded px-3 py-2" placeholder="Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
                <input className="w-full border border-zinc-300 rounded px-3 py-2" placeholder="Password" value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)} />
                <select className="w-full border border-zinc-300 rounded px-3 py-2" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value as "admin" | "member")}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={createUser} className="px-3 py-2 bg-black text-white rounded">Create User</button>
                {adminMessage && <p className="text-xs text-emerald-700">{adminMessage}</p>}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Users</h4>
                <div className="space-y-2 max-h-[60vh] overflow-auto">
                  {adminUsers.map((u) => (
                    <div key={u.userId} className="rounded border border-zinc-200 p-2 text-sm">
                      <div className="font-medium">{u.name}</div>
                      <div className="text-zinc-500">{u.email}</div>
                      <div className="text-xs text-zinc-400">{u.role} · last board: {u.lastBoardId || "none"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!activeBoard && user && (
        <div className="absolute inset-0 z-10 grid place-items-center text-zinc-500">
          <div className="text-center">
            <p className="mb-3">No board yet. Create one to start collaborating.</p>
            <button
              onClick={() => {
                setNewBoardContainerId(selectedContainerId === "all" ? "none" : selectedContainerId);
                setShowCreateBoard(true);
              }}
              className="px-4 py-2 rounded-lg bg-black text-white font-semibold"
            >
              Create First Board
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
