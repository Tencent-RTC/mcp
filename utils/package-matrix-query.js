import { loadPackageMatrix } from '../knowledge/matrix/load-matrix.js';
import { MANDATORY_FOLLOWUP_TAIL } from '../knowledge/search/search-message.js';
/** Products the package route can handle (subset of search_trtc_knowledge's product values; push/iot are not covered by the matrix). */
export const PACKAGE_ROUTABLE_PRODUCTS = ['call', 'live', 'room', 'trtc', 'chat'];
/**
 * Fixed selection constants (correspond to version/ability names in matrix.json). Centralized
 * here to avoid hardcoding scattered across query functions.
 */
export const PACKAGE_SELECTION_CONSTANTS = {
    /** Free Trial (7-day free trial) is not recommended as a real purchase. */
    trialVersion: 'Free Trial',
};
/**
 * Fixed official links (returned with every result so the LLM always surfaces a purchase
 * page + console page). purchase = package purchase entry; console = TRTC/Chat console
 * activation/management entry.
 */
export const PACKAGE_LINKS = {
    /** TRTC base package purchase entry (multi-package hub, no single "buy RTC-Engine" deep link). */
    trtcPurchaseUrl: 'https://console.trtc.io/subscription/buy/rtc',
    /** TRTC console (engine overview / activation & management entry). */
    trtcConsoleUrl: 'https://console.trtc.io',
    /** TRTC base package pricing & billing doc (authoritative page for base-package selection). */
    trtcPackageUrl: 'https://trtc.io/document/56025',
    /** Chat (IM) base plan purchase entry. */
    chatPurchaseUrl: 'https://console.trtc.io/subscription/buy/chat',
    /** Chat console (activation & management entry). */
    chatConsoleUrl: 'https://console.trtc.io',
    /** Chat base plan billing doc (authoritative page for chat base-plan selection). */
    chatPackageUrl: 'https://trtc.io/document/34349',
    /** Per-component purchase entries (unlike zh, en has a distinct purchase URL per component). */
    componentPurchaseUrls: {
        call: 'https://console.trtc.io/subscription/buy/call',
        live: 'https://console.trtc.io/subscription/buy/live',
        room: 'https://console.trtc.io/subscription/buy/conference',
    },
    /** Per-component console entries. */
    componentConsoleUrls: {
        call: 'https://console.trtc.io/call',
        live: 'https://console.trtc.io/live',
        room: 'https://console.trtc.io/conference',
    },
};
/**
 * De-generalize a requirement suffix ("microphone management" -> "microphone"): the official
 * capability table often stores sub-items under a group label (e.g. the group "Microphone
 * Management" contains sub-items like "Free/Ordered Mic Queue", "Mic Invite/Lock/Kick"), not
 * the group label itself as an ability name. When a user naturally refers to the group name
 * ("the teacher needs microphone management"), strip generic suffixes like
 * "management/feature/capability/service" and match on the bare core word too, so a group-name
 * reference doesn't fail to match and silently return zero recommendations.
 */
function capabilityKeywords(req) {
    const bare = req.replace(/\s*(?:management|feature|capability|capabilities|service)$/i, '').trim();
    return bare && bare.toLowerCase() !== req.toLowerCase() ? [req, bare] : [req];
}
/** Whether a version supports a capability (ability name and requirement word mutually-include match); applies to both component and base versions. */
function hasCapability(version, req) {
    const keywords = capabilityKeywords(req);
    return version.abilities.some((a) => keywords.some((k) => a.name.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(a.name.toLowerCase())));
}
function formatAbilities(abilities) {
    return abilities.map((a) => (a.note ? { name: a.name, note: a.note } : { name: a.name }));
}
function formatLimits(limits) {
    return limits.map((l) => ({ name: l.name, value: l.value }));
}
function formatVersion(v) {
    return {
        version: v.name,
        price: v.price,
        abilities: formatAbilities(v.abilities),
        limits: formatLimits(v.limits),
    };
}
function formatBaseVersion(v) {
    const platforms = v.platforms;
    return {
        version: v.name,
        price: v.price,
        abilities: formatAbilities(v.abilities),
        limits: formatLimits(v.limits),
        ...(platforms ? { platforms } : {}),
    };
}
/** Version-name matching: exact match (name === input) first, then fuzzy (mutual substring). Avoids "Pro" prematurely matching "Pro Plus". */
function matchVersion(versions, name) {
    return versions.find((x) => x.name === name)
        ?? versions.find((x) => x.name.includes(name) || name.includes(x.name));
}
/** Point lookup for a specific version (when a version name is matched, return that version's price + abilities + limits, no filtering/recommendation). */
function lookupVersion(matrix, product, versionName) {
    if (product === 'trtc' || product === 'chat') {
        const versions = product === 'trtc' ? matrix.trtc_versions : matrix.im_versions;
        const v = matchVersion(versions, versionName);
        return v ? formatBaseVersion(v) : null;
    }
    const component = matrix.components.find((c) => c.product === product);
    const v = matchVersion(component.versions, versionName);
    return v ? formatVersion(v) : null;
}
/**
 * next_steps copy when no version matches (used by both selectBase and selectPackage). Two
 * distinct root causes are distinguished:
 * - capability filtering alone already emptied the candidate pool (preBudgetCandidates is
 *   empty before budget filtering) -> guide the user to relax capability requirements;
 * - some version satisfies the capability requirements but budget filtering empties it
 *   (preBudgetCandidates is non-empty) -> give the deterministic cheapest price and the gap,
 *   guiding the user to raise their budget.
 *
 * Unlike zh, en has no "self-build on the base SDK" cheaper alternative to suggest here --
 * that relies on a component-price == base-price relationship which does not exist in en
 * docs (see source-map.yaml header notes) -- so this single function covers both the base
 * (trtc/chat) and component (call/live/room) scenarios.
 */
function noMatchNextSteps(preBudgetCandidates, budget) {
    if (budget != null && preBudgetCandidates.length > 0) {
        const cheapest = preBudgetCandidates
            .filter((v) => v.price != null)
            .sort((a, b) => a.price - b.price)[0];
        if (cheapest?.price != null) {
            const gap = cheapest.price - budget;
            return [`The cheapest version satisfying your other requirements costs ${cheapest.price} USD/month, which is ${gap} USD/month above your budget of ${budget}. Raise the budget to at least ${cheapest.price} USD/month, or relax capability requirements to find a cheaper fit.`];
        }
    }
    return ['No version satisfies all constraints. Consider relaxing budget/requirements or contacting support.'];
}
function filterByCapabilities(candidates, requirements, reasoning) {
    if (requirements.length === 0)
        return { candidates, degraded: false };
    let matched = candidates;
    for (const req of requirements) {
        const before = matched.length;
        matched = matched.filter((v) => hasCapability(v, req));
        if (matched.length < before)
            reasoning.push(`Excluded versions that do not support "${req}"`);
    }
    if (matched.length > 0)
        return { candidates: matched, degraded: false };
    // Degrade: full match is empty, take the candidates with the most matched capabilities.
    const scored = candidates.map((v) => ({ v, count: requirements.filter((req) => hasCapability(v, req)).length }));
    const maxCount = Math.max(...scored.map((s) => s.count), 0);
    if (maxCount === 0)
        return { candidates: matched, degraded: false };
    const degraded = scored.filter((s) => s.count === maxCount).map((s) => s.v);
    reasoning.push(`No version satisfies ALL capability requirements (${requirements.join(', ')}); degraded to closest match — ${maxCount}/${requirements.length} capabilities satisfied`);
    return { candidates: degraded, degraded: true };
}
/** Component selection (call/live/room). Filters by capability requirements then budget, in that order. */
function selectPackage(matrix, product, requirements, budget) {
    const component = matrix.components.find((c) => c.product === product);
    const label = product === 'call' ? 'CallKit' : product === 'live' ? 'LiveKit' : 'RoomKit';
    const reasoning = [`Product "${product}" → component ${label}`];
    // Free Trial is a 7-day free trial, not recommended as a real purchase.
    let candidates = component.versions.filter((v) => v.name !== PACKAGE_SELECTION_CONSTANTS.trialVersion);
    // Capability filtering (AND + degrade)
    const capabilityResult = filterByCapabilities(candidates, requirements, reasoning);
    candidates = capabilityResult.candidates;
    const degraded = capabilityResult.degraded;
    // Snapshot before budget filtering: used to diagnose root cause on no-match (capability vs
    // budget) and to compute the cheapest-price gap.
    const preBudgetCandidates = candidates;
    if (budget != null) {
        const before = candidates.length;
        candidates = candidates.filter((v) => v.price != null && v.price <= budget);
        if (candidates.length < before)
            reasoning.push(`Budget ≤ ${budget} USD/month → excluded versions above budget`);
    }
    candidates.sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY));
    if (candidates.length === 0) {
        return {
            recommendation: null,
            alternatives: [],
            reasoning,
            next_steps: noMatchNextSteps(preBudgetCandidates, budget),
            warnings: [],
        };
    }
    const rec = candidates[0];
    const alternatives = candidates.slice(1, 3).map(formatVersion);
    const warnings = [
        'Price is the list price; limited-time discounts are shown on links.purchase_url in real time.',
    ];
    if (degraded) {
        warnings.push('No version satisfies ALL the requested capabilities; this is the closest partial match. ' +
            'Explicitly tell the user which capabilities are NOT covered by this version.');
    }
    return {
        recommendation: formatVersion(rec),
        alternatives,
        reasoning,
        next_steps: [
            `Recommended ${rec.name}: ${rec.price} USD/month`,
            'You can try the Free Trial first before committing to a paid package.',
            'Buy via links.purchase_url; activate and manage via links.console_url.',
        ],
        warnings,
    };
}
/** Base selection (TRTC base package / Chat base plan). Excludes the free tier, filters by capability + budget. */
function selectBase(matrix, kind, requirements, budget) {
    const versions = kind === 'trtc' ? matrix.trtc_versions : matrix.im_versions;
    const label = kind === 'trtc' ? 'TRTC base package' : 'Chat base plan';
    const reasoning = [`Product "${kind}" → ${label}`];
    // Free tier (price 0: TRTC Free Trial / Chat Free) is not recommended as a purchase; versions with unknown price (null) are kept.
    let candidates = versions.filter((v) => v.price === null || v.price > 0);
    // Capability filtering (AND + degrade). NOTE: for kind === 'chat' this is expected to be a
    // no-op in practice -- the source "Plan Overview" table has no capability matrix, so
    // im_versions[].abilities is always empty (known limitation, see 实现方案 doc §8).
    const capabilityResult = filterByCapabilities(candidates, requirements, reasoning);
    candidates = capabilityResult.candidates;
    const degraded = capabilityResult.degraded;
    const preBudgetCandidates = candidates;
    if (budget != null) {
        const before = candidates.length;
        candidates = candidates.filter((v) => v.price != null && v.price <= budget);
        if (candidates.length < before)
            reasoning.push(`Budget ≤ ${budget} USD/month → excluded versions above budget`);
    }
    candidates.sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY));
    if (candidates.length === 0) {
        return {
            recommendation: null,
            alternatives: [],
            reasoning,
            next_steps: noMatchNextSteps(preBudgetCandidates, budget),
            warnings: [],
        };
    }
    const rec = candidates[0];
    const alternatives = candidates.slice(1, 3).map(formatBaseVersion);
    const warnings = [
        'Price is the list price; limited-time discounts are shown on links.purchase_url in real time.',
    ];
    if (degraded) {
        warnings.push('No version satisfies ALL the requested capabilities; this is the closest partial match. ' +
            'Explicitly tell the user which capabilities are NOT covered by this version.');
    }
    return {
        recommendation: formatBaseVersion(rec),
        alternatives,
        reasoning,
        next_steps: [
            `Recommended ${label}: ${rec.name}, ${rec.price ?? '?'} USD/month`,
            'Buy via links.purchase_url; activate and manage via links.console_url.',
        ],
        warnings,
    };
}
/** Billing-rule FAQ matching (matrix.faq's keywords mutually-include match against prompt). */
function queryFaq(matrix, prompt) {
    for (const item of matrix.faq) {
        const hit = item.keywords.some((k) => prompt.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(prompt.toLowerCase()));
        if (hit) {
            return { answer: item.answer, source: item.source, related_ticket: item.ticket ?? null };
        }
    }
    return null;
}
function linksForProduct(product) {
    if (product === 'trtc') {
        return {
            purchase_url: PACKAGE_LINKS.trtcPurchaseUrl,
            console_url: PACKAGE_LINKS.trtcConsoleUrl,
            trtc_package_url: PACKAGE_LINKS.trtcPackageUrl,
            chat_package_url: null,
        };
    }
    if (product === 'chat') {
        return {
            purchase_url: PACKAGE_LINKS.chatPurchaseUrl,
            console_url: PACKAGE_LINKS.chatConsoleUrl,
            trtc_package_url: null,
            chat_package_url: PACKAGE_LINKS.chatPackageUrl,
        };
    }
    return {
        purchase_url: PACKAGE_LINKS.componentPurchaseUrls[product],
        console_url: PACKAGE_LINKS.componentConsoleUrls[product],
        trtc_package_url: null,
        chat_package_url: null,
    };
}
// --- Keyword gating + prompt-internal extraction + multi-product aggregation entry ---
/** Technical/integration-intent negative words, outrank positive words -- a hit vetoes package routing (e.g. "how do I integrate virtual background in the Pro edition"). */
const NEGATIVE_RE = /\bhow (?:do|can|to) .*(?:integrate|implement|call|configure|invoke|use)\b|error code|\bexception\b|\bcrash(?:es|ed)?\b|\bdemo\b|sample code|stack trace/i;
/** Price/package intent positive words. */
const POSITIVE_RE = /how much (?:does|is|would|will)|\bprice\b|\bpricing\b|\bcost\b|\bquote\b|\bbudget\b|which (?:package|plan|edition)|\bsubscribe\b|\bsubscription\b|\bupgrade\b|\bdowngrade\b|what (?:capabilities|features) (?:does|do)/i;
/**
 * Retrieval-intent negative words (hit → veto package routing and hand off to search, which has
 * the corresponding resources):
 * - exception/investigation tone: why / overdue / charged / bill / usage / mismatch / not delivered / hacked / suspended…
 *   (e.g. "why did my monthly post-paid plan incur arrears yesterday" — contains "post-paid" but the intent is troubleshooting, not a billing-rule question)
 * - refund: refund rules live in the official refund doc and are covered by search; the matrix has no deterministic refund data.
 */
const EXCEPTION_PROBE_RE = /\bwhy\b|how come|\boverdue\b|\bcharged\b|\bdeducted\b|\bbill(?:s|ing|ed)?\b|\binvoice\b|\busage\b|mismatch|\bdiscrepanc\w+\b|\binconsistent\b|\bnot delivered\b|\bnot issued\b|\bhacked\b|\bstolen\b|\bfraudulent\b|\bsuspended\b|\brefund\w*\b/i;
/**
 * Strong selection signals: precise buy/select/budget/recommend intent, distinct from weak words
 * like "subscribe/upgrade/downgrade" that also appear in billing-exception prompts. Used to
 * override a wrong types value from the agent (still route despite non-product types).
 */
const STRONG_SELECTION_RE = /which (?:package|plan|edition|tier|version)|how much (?:does|is|would|will)|\bbudget\b|\brecommend\w*\b|\bsuggest\w*\b/i;
/**
 * Prompt product signals for package routing (fallback for when the agent doesn't pass
 * `product` / passes the wrong one -- infer the product line from the prompt text).
 */
const PACKAGE_PRODUCT_SIGNAL_RE = {
    call: /CallKit|TUICallKit|voice call|video call|audio call|1-to-1 call|one-to-one call|1v1 call/i,
    live: /LiveKit|TUILiveKit|live streaming|live room|voice room|audio chat room|co-?streaming/i,
    room: /RoomKit|TUIRoomKit|conference|online classroom|online class(?:room)?|webinar|screen shar(?:e|ing)|whiteboard|virtual classroom/i,
    trtc: /\bTRTC\b|real-time communication|real-time audio\/video|real-time audio and video/i,
    chat: /instant messaging|\bIM\b/i,
};
/**
 * Infer the package product line from prompt text (best-effort fallback). Component signals
 * (call/live/room) are strong signals and taken directly; base signals (trtc/chat) are only
 * inferred when **no component is matched**, to avoid wording like "TUICallKit is built on
 * TRTC" from misidentifying the TRTC base as the product the user actually wants to buy.
 */
function inferProductsFromPrompt(prompt) {
    const products = [];
    if (PACKAGE_PRODUCT_SIGNAL_RE.call.test(prompt))
        products.push('call');
    if (PACKAGE_PRODUCT_SIGNAL_RE.live.test(prompt))
        products.push('live');
    if (PACKAGE_PRODUCT_SIGNAL_RE.room.test(prompt))
        products.push('room');
    const hitComponent = products.length > 0;
    if (!hitComponent) {
        if (PACKAGE_PRODUCT_SIGNAL_RE.trtc.test(prompt))
            products.push('trtc');
        if (PACKAGE_PRODUCT_SIGNAL_RE.chat.test(prompt))
            products.push('chat');
    }
    return products;
}
/**
 * Budget extraction: try, in priority order:
 * ① keyword before the number ("budget of $3000" / "price around 2000 USD") -- unit is
 *    optional ("budget 1000");
 * ② number+unit before the keyword ("a 1000 dollar budget" / "$3000 price range");
 * ③ plain "number+currency-marker" fallback, no keyword required ("keep it under $2000").
 * Unit covers USD/dollar(s)/$ (case-insensitive).
 */
const CURRENCY_UNIT = '(?:usd|dollars?)';
const BUDGET_KEYWORD = '(?:budget|price|cost|quote)';
const BUDGET_KEYWORD_BEFORE_RE = new RegExp(`${BUDGET_KEYWORD}[^\\d]{0,12}\\$?\\s*([\\d,]{2,7})\\s*${CURRENCY_UNIT}?`, 'i');
const BUDGET_KEYWORD_AFTER_RE = new RegExp(`\\$?\\s*([\\d,]{2,7})\\s*${CURRENCY_UNIT}?[^\\d]{0,12}${BUDGET_KEYWORD}`, 'i');
const BUDGET_FALLBACK_DOLLAR_RE = /\$\s*([\d,]{2,7})/;
const BUDGET_FALLBACK_UNIT_RE = new RegExp(`([\\d,]{2,7})\\s*${CURRENCY_UNIT}`, 'i');
function extractBudget(prompt) {
    const m = BUDGET_KEYWORD_BEFORE_RE.exec(prompt)
        ?? BUDGET_KEYWORD_AFTER_RE.exec(prompt)
        ?? BUDGET_FALLBACK_DOLLAR_RE.exec(prompt)
        ?? BUDGET_FALLBACK_UNIT_RE.exec(prompt);
    if (!m)
        return undefined;
    const n = Number(m[1].replace(/,/g, ''));
    return Number.isFinite(n) ? n : undefined;
}
/** Version names for a product line, sorted by length descending (avoids "Pro" prematurely matching the "Pro Plus" substring). */
function versionNamesForProduct(matrix, product) {
    const names = product === 'trtc'
        ? matrix.trtc_versions.map((v) => v.name)
        : product === 'chat'
            ? matrix.im_versions.map((v) => v.name)
            : (matrix.components.find((c) => c.product === product)?.versions ?? []).map((v) => v.name);
    return [...names].sort((a, b) => b.length - a.length);
}
/** Strip a trailing parenthesis annotation from a version name (e.g. "Free Trial (Default Edition)" -> "Free Trial"). */
function bareVersionName(name) {
    return name.replace(/\([^)]*\)\s*$/, '').trim();
}
/**
 * Find the version name hit for this product line in the prompt (longest match first), returns
 * undefined if none hit. Two passes: ① exact substring of the raw version name; ② substring of
 * the "bare name" with the parenthesis annotation stripped (fallback, so an official version
 * name with a parenthetical suffix isn't missed when the user only says the bare name).
 */
function findVersionNameInPrompt(matrix, product, prompt) {
    const names = versionNamesForProduct(matrix, product);
    const lowerPrompt = prompt.toLowerCase();
    const exact = names.find((name) => lowerPrompt.includes(name.toLowerCase()));
    if (exact)
        return exact;
    return names.find((name) => {
        const bare = bareVersionName(name);
        return bare.length > 0 && bare !== name && lowerPrompt.includes(bare.toLowerCase());
    });
}
function intersect(base, target) {
    const set = new Set(target);
    return base.filter((item) => set.has(item));
}
/**
 * Empty route result (not matched / not triggered). Exported for search_trtc_knowledge.ts's
 * try/catch fallback: any runtime exception inside tryPackageRoute (e.g. a malformed
 * matrix.json) MUST degrade to this value -- a package-routing bug must never take down the
 * whole search_trtc_knowledge pipeline (which also handles a large volume of unrelated
 * technical retrieval).
 */
export function emptyRouteResult() {
    return { attempted: false, matchedProducts: [], results: [], faqHit: null, anyHit: false };
}
/**
 * Internal package-routing aggregation entry: FAQ gate -> selection gate -> per-product-line
 * query -> aggregate. Called by search_trtc_knowledge.ts after preflightRoute and before the
 * first CLS report.
 *
 * - matrix unavailable (loadPackageMatrix returns null) -> return not-attempted directly,
 *   hand off to the normal retrieval flow; a missing matrix must not take down the whole
 *   search_trtc_knowledge pipeline.
 * - FAQ hit takes priority over the selection gate and does not require matchedProducts to be
 *   non-empty (see 实现方案 doc §6.1 in zh for the original design rationale).
 */
export function tryPackageRoute(primary, prompt, requirements) {
    const matrix = loadPackageMatrix();
    if (!matrix)
        return emptyRouteResult();
    // --- 1. types intent signal: the agent passing types=['product'/'faq'] is a strong trigger
    //    signal (not a hard veto). Non-product types are not hard-vetoed all the way — if the
    //    prompt carries precise selection words (which package / how much / budget / recommend),
    //    treat it as a wrong-types override and still route; otherwise hand off to retrieval. ---
    const types = primary.types ?? [];
    const isPackageIntent = types.includes('product') || types.includes('faq');
    const isExplicitNonPackage = types.length > 0 && !isPackageIntent;
    const strongSelection = STRONG_SELECTION_RE.test(prompt);
    // --- 2. FAQ gate: ahead of the selection gate, does not require matchedProducts to be
    //    non-empty, and is NOT subject to NEGATIVE_RE. Must run before the NEGATIVE_RE check --
    //    a question like "how do I configure the pre-message callback for billing purposes"
    //    hits both the FAQ keyword "pre-message callback" and the negative word "how do I
    //    configure"; judging NEGATIVE_RE first would wrongly veto a legitimate FAQ.
    //    Only checked when types is empty or package-intent (skip FAQ for explicit non-package
    //    types like error_code); and an exception/investigation tone (why/overdue/charged/refund…)
    //    goes to retrieval even if a FAQ keyword matched. ---
    if (types.length === 0 || isPackageIntent) {
        const faqHit = queryFaq(matrix, prompt);
        if (faqHit && !EXCEPTION_PROBE_RE.test(prompt)) {
            return { attempted: true, matchedProducts: [], results: [], faqHit, anyHit: true };
        }
    }
    // --- 3. Selection gate: judge NEGATIVE_RE as early as possible (before computing the
    //    matchedProducts intersection), since most real-world questions are technical/
    //    integration questions and should short-circuit to retrieval as fast as possible,
    //    without extra computation. ---
    if (NEGATIVE_RE.test(prompt))
        return emptyRouteResult();
    // --- 3.5 Hard veto + wrong-types override: explicit non-package types (non product/faq)
    //    with no strong selection words → retrieval; with strong selection words → override. ---
    if (isExplicitNonPackage && !strongSelection)
        return emptyRouteResult();
    let matchedProducts = intersect((primary.product ?? []), PACKAGE_ROUTABLE_PRODUCTS);
    // Fallback: when the agent didn't pass `product` (or passed one outside the package-routable
    // set), infer the product line from the prompt text. This is a common miss for package
    // routing -- `product` is an optional "only pass when confident" parameter, while the prompt
    // often carries explicit product signal words (RoomKit/online classroom/whiteboard, etc.);
    // package routing shouldn't give up just because the agent omitted `product`.
    if (matchedProducts.length === 0) {
        matchedProducts = inferProductsFromPrompt(prompt);
    }
    if (matchedProducts.length === 0)
        return emptyRouteResult();
    const versionHitByProduct = new Map();
    for (const product of matchedProducts) {
        const hit = findVersionNameInPrompt(matrix, product, prompt);
        if (hit)
            versionHitByProduct.set(product, hit);
    }
    // Trigger: types strong signal | precise selection words | keyword fallback | version-name
    // lookup; but an exception/investigation tone (EXCEPTION_PROBE_RE) always vetoes → retrieval.
    const triggered = (isPackageIntent || strongSelection || POSITIVE_RE.test(prompt) || versionHitByProduct.size > 0)
        && !EXCEPTION_PROBE_RE.test(prompt);
    if (!triggered)
        return emptyRouteResult();
    // --- 3. Prompt-internal extraction (best-effort): budget ---
    const budget = extractBudget(prompt);
    // --- 4. Per-product-line query ---
    const results = matchedProducts.map((product) => {
        const versionName = versionHitByProduct.get(product);
        const links = linksForProduct(product);
        if (versionName) {
            const v = lookupVersion(matrix, product, versionName);
            if (v) {
                return {
                    product,
                    covered: true,
                    message: null,
                    recommendation: v,
                    alternatives: [],
                    reasoning: [`Version lookup "${versionName}" → matched "${v.version}"`],
                    next_steps: ['Buy via links.purchase_url; activate and manage via links.console_url.'],
                    warnings: ['Price is the list price; limited-time discounts are shown on links.purchase_url in real time.'],
                    coexistence: null,
                    links,
                };
            }
            return {
                product,
                covered: false,
                message: `Version "${versionName}" not found in product "${product}".`,
                recommendation: null,
                alternatives: [],
                reasoning: [],
                next_steps: [],
                warnings: [],
                coexistence: null,
                links,
            };
        }
        const sel = product === 'trtc' || product === 'chat'
            ? selectBase(matrix, product, requirements, budget)
            : selectPackage(matrix, product, requirements, budget);
        return {
            product,
            covered: sel.recommendation != null,
            message: sel.recommendation == null ? `No version satisfies the given constraints for product "${product}".` : null,
            recommendation: sel.recommendation,
            alternatives: sel.alternatives,
            reasoning: sel.reasoning,
            next_steps: sel.next_steps,
            warnings: sel.warnings,
            coexistence: null,
            links,
        };
    });
    const anyHit = results.some((r) => r.covered);
    return { attempted: true, matchedProducts, results, faqHit: null, anyHit };
}
// message / answer_contract: mandatory action directives and rendering rules for the short-circuit branch
export function buildPackageAgentMessage(results, faqHit) {
    if (faqHit) {
        return `Deterministic billing-rule answer retrieved from the knowledge matrix (not a retrieval result). ${MANDATORY_FOLLOWUP_TAIL}`;
    }
    const anyMiss = results.some((r) => !r.covered);
    const missNote = anyMiss
        ? 'Some requested products were not found in the matrix; explicitly state which ones are unavailable, do not guess. '
        : '';
    return `Deterministic package/pricing data retrieved from the knowledge matrix (not a retrieval result). ${missNote}${MANDATORY_FOLLOWUP_TAIL}`;
}
export function buildPackageAnswerContract(results, faqHit) {
    if (faqHit) {
        return [
            'Render the `faq.answer` field verbatim; do not paraphrase away specific numbers/dates/conditions.',
            'Always surface `faq.source` as a reference link to the user.',
            'User-visible content MUST NOT include internal field names (e.g. "kind", "package_result", "faq", "matrix") or routing/tool wording (e.g. "search_trtc_knowledge", "finalize_answer", "submit_feedback").',
        ].join(' ');
    }
    return [
        'Render price/abilities/limits/links fields from `packages[]` verbatim; do not reformat or invent values beyond what is returned.',
        'For any entry with covered:false, explicitly tell the user that product/version is not found, do not silently omit it.',
        'Always surface links.purchase_url and links.console_url (and chat_package_url/trtc_package_url when present) to the user.',
        'Do not use speculative wording (e.g. "maybe/probably") for price — matrix data is authoritative and deterministic.',
        'User-visible content MUST NOT include internal field names (e.g. "kind", "package_result", "matrix", "covered") or routing/tool wording (e.g. "search_trtc_knowledge", "finalize_answer", "submit_feedback").',
    ].join(' ');
}
