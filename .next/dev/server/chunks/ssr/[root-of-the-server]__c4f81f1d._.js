module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAccessToken",
    ()=>clearAccessToken,
    "getAccessToken",
    ()=>getAccessToken,
    "setAccessToken",
    ()=>setAccessToken
]);
let accessToken = null;
function setAccessToken(token) {
    accessToken = token;
}
function getAccessToken() {
    return accessToken;
}
function clearAccessToken() {
    accessToken = null;
}
}),
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addMovie",
    ()=>addMovie,
    "addSong",
    ()=>addSong,
    "apiFetch",
    ()=>apiFetch,
    "discoverMovies",
    ()=>discoverMovies,
    "discoverSongs",
    ()=>discoverSongs,
    "getMovies",
    ()=>getMovies,
    "getSongs",
    ()=>getSongs,
    "updateMovie",
    ()=>updateMovie,
    "updateSong",
    ()=>updateSong
]);
// front/lib/api.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-ssr] (ecmascript)");
;
const API = "http://localhost:8000";
/* ----------------------------- */ /* 🔐 Core Auth-Aware Fetch */ /* ----------------------------- */ async function refreshAccessToken() {
    const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include"
    });
    if (!res.ok) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAccessToken"])();
        return false;
    }
    const data = await res.json();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(data.access_token);
    return true;
}
async function apiFetch(endpoint, options = {}) {
    const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])();
    let res = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...token ? {
                Authorization: `Bearer ${token}`
            } : {},
            ...options.headers
        },
        credentials: "include"
    });
    // If access token expired → try refresh
    if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
            throw new Error("Unauthorized");
        }
        const newToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAccessToken"])();
        res = await fetch(`${API}${endpoint}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...newToken ? {
                    Authorization: `Bearer ${newToken}`
                } : {},
                ...options.headers
            },
            credentials: "include"
        });
    }
    return res;
}
async function getMovies(params) {
    const query = params ? "?" + new URLSearchParams(Object.entries(params).filter(([_, v])=>v !== undefined && v !== null).map(([k, v])=>[
            k,
            String(v)
        ])).toString() : "";
    const res = await apiFetch(`/movies${query}`);
    if (!res.ok) {
        throw new Error("Failed to fetch movies");
    }
    return res.json();
}
async function updateMovie(imdb_id, payload) {
    const res = await apiFetch(`/movies/${imdb_id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        throw new Error("Failed to update movie");
    }
    return res.json();
}
async function addMovie(imdb_id, friends_recommended) {
    const res = await apiFetch("/movies", {
        method: "POST",
        body: JSON.stringify({
            imdb_id,
            friends_recommended
        })
    });
    if (!res.ok) {
        throw new Error("Failed to add movie");
    }
    return res.json();
}
async function discoverMovies(query) {
    if (!query) return [];
    const res = await fetch(`${API}/discover/movies?query=${encodeURIComponent(query)}`);
    if (!res.ok) {
        throw new Error("Discover failed");
    }
    return res.json();
}
async function getSongs(params) {
    const query = params ? "?" + new URLSearchParams(Object.entries(params).filter(([_, v])=>v !== undefined && v !== null).map(([k, v])=>[
            k,
            String(v)
        ])).toString() : "";
    const res = await apiFetch(`/songs${query}`);
    if (!res.ok) {
        throw new Error("Failed to fetch songs");
    }
    return res.json();
}
async function addSong(track_id, friends_recommended) {
    const res = await apiFetch("/songs", {
        method: "POST",
        body: JSON.stringify({
            track_id,
            friends_recommended,
            listened: false,
            rating: 0
        })
    });
    if (!res.ok) {
        throw new Error("Failed to add song");
    }
    return res.json();
}
async function updateSong(song_id, payload) {
    const res = await apiFetch(`/songs/${song_id}`, {
        method: "PATCH",
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        throw new Error("Failed to update song");
    }
    return res.json();
}
async function discoverSongs(query) {
    if (!query) return [];
    const res = await fetch(`${API}/discover/songs?query=${encodeURIComponent(query)}`);
    if (!res.ok) {
        throw new Error("Discover failed");
    }
    return res.json();
}
}),
"[project]/context/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    async function restoreSession() {
        try {
            const refresh = await fetch("http://localhost:8000/auth/refresh", {
                method: "POST",
                credentials: "include"
            });
            if (!refresh.ok) {
                setLoading(false);
                return;
            }
            const data = await refresh.json();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(data.access_token);
            const meRes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])("/auth/me");
            const me = await meRes.json();
            setUser(me);
        } catch  {
            setUser(null);
        } finally{
            setLoading(false);
        }
    }
    async function login(token) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAccessToken"])(token);
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiFetch"])("/auth/me");
        const me = await res.json();
        setUser(me);
    }
    async function logout() {
        await fetch("http://localhost:8000/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearAccessToken"])();
        setUser(null);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        restoreSession();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            logout
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/AuthContext.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c4f81f1d._.js.map