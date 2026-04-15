/* ============================================
   JEFF CLINE AGENCY DASHBOARD
   DataForSEO API Client - Full SEMrush/Ahrefs Feature Set
   
   API Docs: https://docs.dataforseo.com/
   Auth: Basic Auth (login:password → base64)
   Base URL: https://api.dataforseo.com
   ============================================ */

class DataForSEOClient {
  constructor() {
    this.baseURL = 'https://api.dataforseo.com/v3';
    // Proxy URL: same directory as dashboard.html — solves CORS
    this.proxyURL = localStorage.getItem('jc_proxy_url') || 'api-proxy.php';
    // API mode: 'auto' tries direct first then proxy, 'direct' bypasses proxy, 'proxy' forces proxy
    this.apiMode = localStorage.getItem('jc_api_mode') || 'auto';
    this.useProxy = this.apiMode === 'proxy';
    this.detectedMode = null; // Cached after first successful auto-detect
    this.credentials = this.loadCredentials();
  }

  // ---- MODE MANAGEMENT ----
  setApiMode(mode) {
    this.apiMode = mode;
    localStorage.setItem('jc_api_mode', mode);
    this.detectedMode = null; // Reset detection
    if (mode === 'direct') this.useProxy = false;
    else if (mode === 'proxy') this.useProxy = true;
    // 'auto' will detect on next request
  }

  setProxyURL(url) {
    this.proxyURL = url;
    localStorage.setItem('jc_proxy_url', url);
  }

  getActiveMode() {
    if (this.apiMode === 'auto') return this.detectedMode || 'auto (not yet detected)';
    return this.apiMode;
  }

  // ---- CREDENTIAL MANAGEMENT ----
  loadCredentials() {
    const stored = localStorage.getItem('jc_dataforseo_creds');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  saveCredentials(login, password) {
    const creds = { login, password };
    localStorage.setItem('jc_dataforseo_creds', JSON.stringify(creds));
    this.credentials = creds;
    return true;
  }

  clearCredentials() {
    localStorage.removeItem('jc_dataforseo_creds');
    this.credentials = null;
  }

  isConnected() {
    return this.credentials && this.credentials.login && this.credentials.password;
  }

  getAuthHeader() {
    if (!this.credentials) return null;
    const encoded = btoa(`${this.credentials.login}:${this.credentials.password}`);
    return `Basic ${encoded}`;
  }

  // ---- CORE REQUEST METHOD ----
  // Supports three modes:
  //   'direct' → Browser calls DataForSEO API directly (works if CORS is allowed)
  //   'proxy'  → Browser → api-proxy.php → DataForSEO API
  //   'auto'   → Tries direct first; if CORS blocks it, falls back to proxy
  async request(endpoint, body = null) {
    if (!this.isConnected()) {
      throw new Error('DataForSEO not connected. Please add your API credentials in Settings.');
    }

    // Auto mode: try direct first, cache result for future calls
    if (this.apiMode === 'auto' && !this.detectedMode) {
      try {
        const result = await this._fetchDirect(endpoint, body);
        this.detectedMode = 'direct';
        this.useProxy = false;
        return result;
      } catch (directErr) {
        // Direct failed (likely CORS) — try proxy
        try {
          const result = await this._fetchProxy(endpoint, body);
          this.detectedMode = 'proxy';
          this.useProxy = true;
          return result;
        } catch (proxyErr) {
          // Both failed — give actionable error
          throw new Error(
            'Could not reach DataForSEO API.\n\n' +
            '• Direct API: ' + directErr.message + '\n' +
            '• Proxy (' + this.proxyURL + '): ' + proxyErr.message + '\n\n' +
            'Fix: Go to Settings → set API Mode to "Direct" or deploy api-proxy.php to your server.'
          );
        }
      }
    }

    // Use cached / manually-set mode
    if (this.useProxy || this.detectedMode === 'proxy') {
      return await this._fetchProxy(endpoint, body);
    }
    return await this._fetchDirect(endpoint, body);
  }

  // ---- DIRECT API FETCH (no proxy) ----
  async _fetchDirect(endpoint, body = null) {
    try {
      const options = {
        method: body ? 'POST' : 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      };
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      return await this._parseResponse(response, 'direct');
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('CORS')) {
        throw new Error('CORS blocked or network error. Try using Proxy mode in Settings.');
      }
      throw error;
    }
  }

  // ---- PROXY FETCH (through api-proxy.php) ----
  async _fetchProxy(endpoint, body = null) {
    try {
      const payload = {
        endpoint: endpoint,
        auth: this.getAuthHeader()
      };
      if (body !== null) {
        payload.body = body;
      }

      const response = await fetch(this.proxyURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await this._parseResponse(response, 'proxy');
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error(
          'Cannot reach ' + this.proxyURL + '. Ensure api-proxy.php is uploaded to the same folder as dashboard.html. ' +
          'Test it: visit ' + new URL(this.proxyURL, window.location.href).href + ' in your browser.'
        );
      }
      throw error;
    }
  }

  // ---- PARSE RESPONSE (shared) ----
  async _parseResponse(response, mode) {
    const responseText = await response.text();

    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response from ' + mode + ' API call.');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      const preview = responseText.substring(0, 200);
      if (preview.includes('<!') || preview.includes('<html') || preview.includes('<br')) {
        throw new Error(mode === 'proxy'
          ? 'Proxy returned HTML instead of JSON — PHP may have an error. Check: ' + this.proxyURL
          : 'API returned HTML instead of JSON.');
      }
      throw new Error('Invalid JSON from ' + mode + ': ' + preview);
    }

    // Check for proxy-level errors
    if (data.status_code && data.status_code >= 40000 && data.status_code < 60000 && data.status_message) {
      throw new Error(data.status_message);
    }

    // Check for DataForSEO success
    if (data.status_code === 20000) {
      return data;
    } else if (data.status_code) {
      throw new Error(data.status_message || 'DataForSEO API Error: ' + data.status_code);
    }

    return data;
  }

  // ---- TEST CONNECTION ----
  async testConnection() {
    // Reset detected mode so auto-detect runs fresh
    this.detectedMode = null;

    try {
      const result = await this.request('/appendix/user_data');
      if (result && result.tasks && result.tasks[0] && result.tasks[0].result) {
        const userData = result.tasks[0].result[0];
        return {
          success: true,
          mode: this.getActiveMode(),
          login: userData.login,
          balance: userData.money?.balance || 0,
          rateLimit: userData.rates?.limits?.day?.value || 'N/A'
        };
      }
      return { success: true, mode: this.getActiveMode(), balance: 'Unknown' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // ===========================================================
  // KEYWORD RESEARCH (like SEMrush Keyword Magic Tool)
  // ===========================================================

  /**
   * Get keyword suggestions with volume, CPC, competition
   * Similar to SEMrush "Keyword Magic Tool"
   */
  async getKeywordSuggestions(keyword, location = 2840, language = 'en', limit = 50) {
    const body = [{
      keyword: keyword,
      location_code: location,  // 2840 = United States
      language_code: language,
      include_seed_keyword: true,
      limit: limit,
      filters: null,
      order_by: ["keyword_info.search_volume,desc"]
    }];

    let result;
    try {
      result = await this.request('/dataforseo_labs/google/keyword_suggestions/live', body);
    } catch (e) {
      return { success: false, error: e.message, keywords: [], totalCount: 0 };
    }
    return this.parseKeywordResults(result);
  }

  /**
   * Get related keywords
   * Similar to SEMrush "Related Keywords"
   */
  async getRelatedKeywords(keyword, location = 2840, language = 'en', limit = 50) {
    const body = [{
      keyword: keyword,
      location_code: location,
      language_code: language,
      limit: limit,
      order_by: ["keyword_info.search_volume,desc"]
    }];

    let result;
    try {
      result = await this.request('/dataforseo_labs/google/related_keywords/live', body);
    } catch (e) {
      return { success: false, error: e.message, keywords: [], totalCount: 0 };
    }
    return this.parseKeywordResults(result);
  }

  /**
   * Get keyword ideas (broader discovery)
   * Similar to Ahrefs "Keyword Explorer"
   */
  async getKeywordIdeas(keywords, location = 2840, language = 'en', limit = 50) {
    const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
    const body = [{
      keywords: keywordArray,
      location_code: location,
      language_code: language,
      limit: limit,
      include_seed_keyword: true,
      order_by: ["keyword_info.search_volume,desc"]
    }];

    let result;
    try {
      result = await this.request('/dataforseo_labs/google/keyword_ideas/live', body);
    } catch (e) {
      return { success: false, error: e.message, keywords: [], totalCount: 0 };
    }
    return this.parseKeywordResults(result);
  }

  /**
   * Get exact search volume + CPC for specific keywords
   * Similar to SEMrush "Keyword Overview"
   */
  async getSearchVolume(keywords, location = 2840, language = 'en') {
    const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
    const body = [{
      keywords: keywordArray,
      location_code: location,
      language_code: language,
      date_from: this.getDateMonthsAgo(12),
      sort_by: "search_volume"
    }];

    let result;
    try {
      result = await this.request('/keywords_data/google_ads/search_volume/live', body);
    } catch (e) {
      return { success: false, error: e.message, keywords: [] };
    }
    return this.parseVolumeResults(result);
  }

  /**
   * Questions people ask (like AnswerThePublic / "People Also Ask")
   */
  async getKeywordQuestions(keyword, location = 2840, language = 'en', limit = 30) {
    const body = [{
      keyword: keyword,
      location_code: location,
      language_code: language,
      limit: limit,
      filters: [
        ["keyword_info.search_volume", ">", 0]
      ],
      order_by: ["keyword_info.search_volume,desc"]
    }];

    // Use keyword suggestions with question filter
    let result;
    try {
      result = await this.request('/dataforseo_labs/google/keyword_suggestions/live', body);
    } catch (e) {
      return { success: false, error: e.message, keywords: [], totalCount: 0 };
    }
    const parsed = this.parseKeywordResults(result);
    // Filter for questions
    if (parsed.keywords) {
      parsed.keywords = parsed.keywords.filter(kw =>
        /^(what|who|where|when|why|how|is|are|can|do|does|will|should)/i.test(kw.keyword)
      );
    }
    return parsed;
  }

  // ===========================================================
  // BACKLINK ANALYSIS (like Ahrefs Backlink Checker)
  // ===========================================================

  /**
   * Get backlink summary for a domain
   * Similar to Ahrefs "Domain Rating" / SEMrush "Backlink Analytics"
   */
  async getBacklinkSummary(domain) {
    const body = [{
      target: domain,
      internal_list_limit: 0,
      include_subdomains: true
    }];

    let result;
    try {
      result = await this.request('/backlinks/summary/live', body);
    } catch (e) {
      console.warn('[DFS] getBacklinkSummary request error:', e.message);
      return { success: false, error: e.message };
    }

    const task = result.tasks && result.tasks[0];
    if (!task) return { success: false, error: 'No tasks returned from API' };

    // Check task-level status
    if (task.status_code !== 20000) {
      console.warn('[DFS] Backlink summary task error:', task.status_code, task.status_message);
      return { success: false, error: task.status_message || ('Task error: ' + task.status_code) };
    }

    if (task.result && task.result[0]) {
      const data = task.result[0];
      return {
        success: true,
        domain: domain,
        backlinks: data.backlinks || 0,
        referringDomains: data.referring_domains || 0,
        referringMainDomains: data.referring_main_domains || 0,
        referringIps: data.referring_ips || 0,
        rank: data.rank || 0,
        brokenBacklinks: data.broken_backlinks || 0,
        referringDomainsNofollow: data.referring_domains_nofollow || 0,
        backlinksSpamScore: data.backlinks_spam_score || 0,
        firstSeen: data.first_seen,
        lostDate: data.lost_date
      };
    }
    return { success: false, error: 'No backlink data found for this domain' };
  }

  /**
   * Get individual backlinks for a domain
   * Similar to Ahrefs "Backlinks" report
   */
  async getBacklinks(domain, limit = 100, orderBy = 'rank') {
    const body = [{
      target: domain,
      limit: limit,
      mode: "as_is",
      order_by: [`page_from_${orderBy},desc`]
    }];

    let result;
    try {
      result = await this.request('/backlinks/backlinks/live', body);
    } catch (e) {
      console.warn('[DFS] getBacklinks request error:', e.message);
      return { success: false, error: e.message, backlinks: [] };
    }

    const task = result.tasks && result.tasks[0];
    if (!task) return { success: false, error: 'No tasks returned from API', backlinks: [] };

    // Check task-level status
    if (task.status_code !== 20000) {
      console.warn('[DFS] Backlinks task error:', task.status_code, task.status_message);
      return { success: false, error: task.status_message || ('Task error: ' + task.status_code), backlinks: [] };
    }

    if (task.result && task.result[0]) {
      const items = task.result[0].items || [];
      return {
        success: true,
        total: task.result[0].total_count || 0,
        backlinks: items.map(link => ({
          urlFrom: link.url_from,
          urlTo: link.url_to,
          anchor: link.anchor || '(no anchor)',
          domainFrom: link.domain_from,
          pageRank: link.rank || 0,
          dofollow: link.dofollow,
          firstSeen: link.first_seen,
          lastSeen: link.last_seen,
          linkType: link.type,
          isLost: link.is_lost,
          domainFromRank: link.domain_from_rank || 0,
          pageFromExternalLinks: link.page_from_external_links || 0,
          domainFromCountry: link.domain_from_country || 'N/A'
        }))
      };
    }
    return { success: false, error: 'No backlink data found for this domain', backlinks: [] };
  }

  /**
   * Get referring domains
   * Similar to Ahrefs "Referring Domains" report
   */
  async getReferringDomains(domain, limit = 100) {
    const body = [{
      target: domain,
      limit: limit,
      order_by: ["rank,desc"],
      include_subdomains: true
    }];

    let result;
    try {
      result = await this.request('/backlinks/referring_domains/live', body);
    } catch (e) {
      console.warn('[DFS] getReferringDomains request error:', e.message);
      return { success: false, error: e.message, domains: [] };
    }

    const task = result.tasks && result.tasks[0];
    if (!task) return { success: false, error: 'No tasks returned from API', domains: [] };

    // Check task-level status
    if (task.status_code !== 20000) {
      console.warn('[DFS] Referring domains task error:', task.status_code, task.status_message);
      return { success: false, error: task.status_message || ('Task error: ' + task.status_code), domains: [] };
    }

    if (task.result && task.result[0]) {
      const items = task.result[0].items || [];
      return {
        success: true,
        total: task.result[0].total_count || 0,
        domains: items.map(d => ({
          domain: d.domain,
          rank: d.rank || 0,
          backlinks: d.backlinks || 0,
          firstSeen: d.first_seen,
          brokenBacklinks: d.broken_backlinks || 0,
          referringLinks: d.referring_links_tld || {},
          externalLinks: d.external_links || 0
        }))
      };
    }
    return { success: false, error: 'No referring domain data found', domains: [] };
  }

  /**
   * Get new and lost backlinks
   * Similar to Ahrefs "New/Lost" backlinks
   */
  async getNewLostBacklinks(domain, limit = 50) {
    const body = [{
      target: domain,
      limit: limit,
      date_from: this.getDateDaysAgo(30),
      order_by: ["rank,desc"]
    }];

    // New backlinks
    let newResult;
    try {
      newResult = await this.request('/backlinks/backlinks/live', [{
        ...body[0],
        filters: [["first_seen", ">", this.getDateDaysAgo(30)]]
      }]);
    } catch (e) {
      return { success: false, error: e.message, newBacklinks: [] };
    }

    return {
      success: true,
      newBacklinks: this.extractBacklinkItems(newResult)
    };
  }

  // ===========================================================
  // DOMAIN ANALYSIS (like SEMrush Domain Overview)
  // ===========================================================

  /**
   * Get domain rank/authority
   * Similar to Moz Domain Authority / Ahrefs Domain Rating
   */
  async getDomainRank(domain, location = 2840, language = 'en') {
    const body = [{
      target: domain,
      location_code: location,
      language_code: language
    }];

    let result;
    try {
      result = await this.request('/dataforseo_labs/google/domain_rank/live', body);
    } catch (e) {
      console.warn('[DFS] getDomainRank request error:', e.message);
      return { success: false, error: e.message };
    }

    const task = result.tasks && result.tasks[0];
    if (!task) return { success: false, error: 'No tasks returned from API' };

    if (task.status_code !== 20000) {
      console.warn('[DFS] Domain rank task error:', task.status_code, task.status_message);
      return { success: false, error: task.status_message || ('Task error: ' + task.status_code) };
    }

    if (task.result && task.result[0]) {
      const items = task.result[0].items || [];
      if (items.length > 0) {
        const data = items[0];
        return {
          success: true,
          domain: domain,
          organicRank: data.metrics?.organic?.pos_1 || 0,
          organicTraffic: data.metrics?.organic?.etv || 0,
          organicKeywords: data.metrics?.organic?.count || 0,
          organicCost: data.metrics?.organic?.estimated_paid_traffic_cost || 0,
          paidTraffic: data.metrics?.paid?.etv || 0,
          paidKeywords: data.metrics?.paid?.count || 0,
          metrics: data.metrics
        };
      }
    }
    return { success: false, error: 'No ranking data found for this domain' };
  }

  /**
   * Get competitor domains
   * Similar to SEMrush "Competitors" report
   */
  async getCompetitors(domain, location = 2840, language = 'en', limit = 20) {
    const body = [{
      target: domain,
      location_code: location,
      language_code: language,
      limit: limit,
      order_by: ["avg_position,asc"]
    }];

    let result;
    try {
      result = await this.request('/dataforseo_labs/google/competitors_domain/live', body);
    } catch (e) {
      console.warn('[DFS] getCompetitors request error:', e.message);
      return { success: false, error: e.message, competitors: [] };
    }

    const task = result.tasks && result.tasks[0];
    if (!task) return { success: false, error: 'No tasks returned from API', competitors: [] };

    if (task.status_code !== 20000) {
      console.warn('[DFS] Competitors task error:', task.status_code, task.status_message);
      return { success: false, error: task.status_message || ('Task error: ' + task.status_code), competitors: [] };
    }

    if (task.result && task.result[0]) {
      const items = task.result[0].items || [];
      return {
        success: true,
        competitors: items.map(comp => ({
          domain: comp.domain,
          avgPosition: comp.avg_position || 0,
          commonKeywords: comp.se_keywords || 0,
          sumPosition: comp.sum_position || 0,
          intersections: comp.relevant_serp_items || 0,
          organicTraffic: comp.metrics?.organic?.etv || 0,
          organicKeywords: comp.metrics?.organic?.count || 0,
          paidKeywords: comp.metrics?.paid?.count || 0
        }))
      };
    }
    return { success: false, error: 'No competitor data found for this domain', competitors: [] };
  }

  /**
   * Get domain organic keywords
   * Similar to SEMrush "Organic Research" → "Positions"
   */
  async getDomainOrganicKeywords(domain, location = 2840, language = 'en', limit = 100) {
    const body = [{
      target: domain,
      location_code: location,
      language_code: language,
      limit: limit,
      order_by: ["keyword_data.keyword_info.search_volume,desc"],
      filters: [
        ["ranked_serp_element.serp_item.rank_group", "<=", 100]
      ]
    }];

    let result;
    try {
      result = await this.request('/dataforseo_labs/google/ranked_keywords/live', body);
    } catch (e) {
      console.warn('[DFS] getDomainOrganicKeywords request error:', e.message);
      return { success: false, error: e.message, keywords: [] };
    }

    const task = result.tasks && result.tasks[0];
    if (!task) return { success: false, error: 'No tasks returned from API', keywords: [] };

    if (task.status_code !== 20000) {
      console.warn('[DFS] Organic keywords task error:', task.status_code, task.status_message);
      return { success: false, error: task.status_message || ('Task error: ' + task.status_code), keywords: [] };
    }

    if (task.result && task.result[0]) {
      const items = task.result[0].items || [];
      return {
        success: true,
        total: task.result[0].total_count || 0,
        keywords: items.map(item => ({
          keyword: item.keyword_data?.keyword || '',
          position: item.ranked_serp_element?.serp_item?.rank_group || 0,
          searchVolume: item.keyword_data?.keyword_info?.search_volume || 0,
          cpc: item.keyword_data?.keyword_info?.cpc || 0,
          competition: item.keyword_data?.keyword_info?.competition || 0,
          competitionLevel: item.keyword_data?.keyword_info?.competition_level || 'N/A',
          url: item.ranked_serp_element?.serp_item?.url || '',
          trafficEstimate: item.ranked_serp_element?.serp_item?.etv || 0,
          trafficCost: item.ranked_serp_element?.serp_item?.estimated_paid_traffic_cost || 0,
          lastUpdated: item.ranked_serp_element?.serp_item?.last_updated_time || ''
        }))
      };
    }
    return { success: false, error: 'No keyword data found for this domain', keywords: [] };
  }

  // ===========================================================
  // SERP ANALYSIS (like SEMrush Position Tracking)
  // ===========================================================

  /**
   * Live SERP results for a keyword
   * See exactly who ranks for a keyword right now
   */
  async getSERPResults(keyword, location = 2840, language = 'en', depth = 20) {
    const body = [{
      keyword: keyword,
      location_code: location,
      language_code: language,
      depth: depth,
      se_domain: "google.com"
    }];

    let result;
    try {
      result = await this.request('/serp/google/organic/live/regular', body);
    } catch (e) {
      return { success: false, error: e.message, items: [] };
    }
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const serpData = result.tasks[0].result[0];
      return {
        success: true,
        keyword: serpData.keyword,
        totalResults: serpData.se_results_count || 0,
        items: (serpData.items || []).filter(item => item.type === 'organic').map(item => ({
          position: item.rank_group,
          title: item.title,
          url: item.url,
          domain: item.domain,
          description: item.description || '',
          breadcrumb: item.breadcrumb || ''
        })),
        featuredSnippet: (serpData.items || []).find(i => i.type === 'featured_snippet') || null,
        peopleAlsoAsk: (serpData.items || []).filter(i => i.type === 'people_also_ask'),
        relatedSearches: (serpData.items || []).filter(i => i.type === 'related_searches')
      };
    }
    return { success: false, items: [] };
  }

  // ===========================================================
  // ON-PAGE SEO AUDIT (like Screaming Frog / SEMrush Site Audit)
  // ===========================================================

  /**
   * Start an on-page SEO audit for a URL
   */
  async startOnPageAudit(url, maxPages = 100) {
    const body = [{
      target: url,
      max_crawl_pages: maxPages,
      load_resources: true,
      enable_javascript: true,
      enable_browser_rendering: true,
      store_raw_html: false
    }];

    let result;
    try {
      result = await this.request('/on_page/task_post', body);
    } catch (e) {
      return { success: false, error: e.message };
    }
    if (result.tasks && result.tasks[0]) {
      return {
        success: true,
        taskId: result.tasks[0].id,
        status: result.tasks[0].status_message
      };
    }
    return { success: false, error: 'Failed to start audit' };
  }

  /**
   * Get on-page audit summary
   */
  async getOnPageSummary(taskId) {
    let result;
    try {
      result = await this.request(`/on_page/summary/${taskId}`);
    } catch (e) {
      return { success: false, error: e.message };
    }
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const data = result.tasks[0].result[0];
      return {
        success: true,
        crawlProgress: data.crawl_progress || 'unknown',
        crawlStatus: data.crawl_status || {},
        pagesCount: data.pages_count || 0,
        pagesCrawled: data.pages_crawled || 0,
        checks: data.page_metrics || {}
      };
    }
    return { success: false };
  }

  /**
   * Get on-page audit pages detail
   */
  async getOnPagePages(taskId, limit = 100) {
    const body = [{
      id: taskId,
      limit: limit,
      order_by: ["meta.content.plain_text_word_count,desc"]
    }];

    let result;
    try {
      result = await this.request('/on_page/pages', body);
    } catch (e) {
      return { success: false, error: e.message, pages: [] };
    }
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const items = result.tasks[0].result[0].items || [];
      return {
        success: true,
        pages: items.map(page => ({
          url: page.url,
          statusCode: page.status_code,
          title: page.meta?.title || '',
          description: page.meta?.description || '',
          h1: page.meta?.htags?.h1?.[0] || '',
          wordCount: page.meta?.content?.plain_text_word_count || 0,
          internalLinks: page.meta?.internal_links_count || 0,
          externalLinks: page.meta?.external_links_count || 0,
          images: page.meta?.images_count || 0,
          imagesWithoutAlt: page.meta?.images_without_alt_count || 0,
          loadTime: page.page_timing?.duration_time || 0,
          size: page.meta?.content?.plain_text_size || 0,
          checks: page.checks || {}
        }))
      };
    }
    return { success: false, pages: [] };
  }

  // ===========================================================
  // CONTENT ANALYSIS / KEYWORD DENSITY
  // ===========================================================

  /**
   * Analyze keyword density and content for a URL
   */
  async analyzeContent(targetUrl) {
    const body = [{
      url: targetUrl,
      load_resources: true,
      enable_javascript: true
    }];

    let result;
    try {
      result = await this.request('/on_page/instant_pages', body);
    } catch (e) {
      return { success: false, error: e.message };
    }

    const task = result.tasks && result.tasks[0];
    if (!task) return { success: false, error: 'No tasks returned from API' };

    if (task.status_code !== 20000) {
      return { success: false, error: task.status_message || ('Task error: ' + task.status_code) };
    }

    if (task.result && task.result[0]) {
      const items = task.result[0].items || [];
      if (items.length > 0) {
        const page = items[0];
        return {
          success: true,
          url: targetUrl,
          title: page.meta?.title || '',
          description: page.meta?.description || '',
          wordCount: page.meta?.content?.plain_text_word_count || 0,
          h1: page.meta?.htags?.h1 || [],
          h2: page.meta?.htags?.h2 || [],
          h3: page.meta?.htags?.h3 || [],
          internalLinks: page.meta?.internal_links_count || 0,
          externalLinks: page.meta?.external_links_count || 0,
          canonicalUrl: page.meta?.canonical || '',
          hasSchemaMarkup: (page.meta?.social_media_tags || []).length > 0,
          checks: page.checks || {}
        };
      }
    }
    return { success: false, error: 'No page data returned. The URL may be unreachable or blocked.' };
  }

  // ===========================================================
  // KEYWORD DIFFICULTY & GAP ANALYSIS
  // ===========================================================

  /**
   * Get keyword difficulty score
   * Similar to Ahrefs KD / SEMrush Keyword Difficulty
   */
  async getKeywordDifficulty(keywords, location = 2840, language = 'en') {
    const keywordArray = Array.isArray(keywords) ? keywords : [keywords];
    const body = [{
      keywords: keywordArray,
      location_code: location,
      language_code: language
    }];

    let result;
    try {
      result = await this.request('/dataforseo_labs/google/bulk_keyword_difficulty/live', body);
    } catch (e) {
      return { success: false, error: e.message, keywords: [] };
    }
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const items = result.tasks[0].result[0].items || [];
      return {
        success: true,
        keywords: items.map(item => ({
          keyword: item.keyword,
          difficulty: item.keyword_difficulty || 0,
          searchVolume: item.search_volume || 0
        }))
      };
    }
    return { success: false, keywords: [] };
  }

  /**
   * Keyword gap analysis - find keywords competitor ranks for but you don't
   * Similar to SEMrush "Keyword Gap"
   */
  async getKeywordGap(yourDomain, competitorDomains, location = 2840, language = 'en', limit = 50) {
    const targets = {};
    targets[yourDomain] = { "target_type": "domain" };
    competitorDomains.forEach((d, i) => {
      targets[d] = { "target_type": "domain" };
    });

    const body = [{
      targets: targets,
      location_code: location,
      language_code: language,
      limit: limit,
      order_by: ["keyword_data.keyword_info.search_volume,desc"]
    }];

    let result;
    try {
      result = await this.request('/dataforseo_labs/google/domain_intersection/live', body);
    } catch (e) {
      return { success: false, error: e.message, keywords: [] };
    }
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const items = result.tasks[0].result[0].items || [];
      return {
        success: true,
        keywords: items.map(item => ({
          keyword: item.keyword_data?.keyword || '',
          searchVolume: item.keyword_data?.keyword_info?.search_volume || 0,
          cpc: item.keyword_data?.keyword_info?.cpc || 0,
          competition: item.keyword_data?.keyword_info?.competition || 0,
          intersections: item.intersection_result || {}
        }))
      };
    }
    return { success: false, keywords: [] };
  }

  // ===========================================================
  // SERP FEATURES / FEATURED SNIPPETS
  // ===========================================================

  /**
   * Get SERP feature opportunities for a keyword set
   */
  async getSERPFeatures(keyword, location = 2840, language = 'en') {
    const body = [{
      keyword: keyword,
      location_code: location,
      language_code: language,
      depth: 30
    }];

    let result;
    try {
      result = await this.request('/serp/google/organic/live/regular', body);
    } catch (e) {
      return { success: false, error: e.message };
    }
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const serpData = result.tasks[0].result[0];
      const items = serpData.items || [];
      return {
        success: true,
        keyword: keyword,
        hasFeaturedSnippet: items.some(i => i.type === 'featured_snippet'),
        hasPeopleAlsoAsk: items.some(i => i.type === 'people_also_ask'),
        hasLocalPack: items.some(i => i.type === 'local_pack'),
        hasKnowledgeGraph: items.some(i => i.type === 'knowledge_graph'),
        hasTopStories: items.some(i => i.type === 'top_stories'),
        hasVideoResults: items.some(i => i.type === 'video'),
        hasSitelinks: items.some(i => i.type === 'organic' && i.links),
        featuredSnippet: items.find(i => i.type === 'featured_snippet'),
        paa: items.filter(i => i.type === 'people_also_ask')
      };
    }
    return { success: false };
  }

  // ===========================================================
  // TECHNOLOGY DETECTION
  // ===========================================================

  /**
   * Detect technologies used on a domain
   */
  async getTechnologies(domain) {
    const body = [{
      target: domain,
      limit: 10
    }];

    let result;
    try {
      result = await this.request('/domain_analytics/technologies/domain_technologies/live', body);
    } catch (e) {
      return { success: false, error: e.message, technologies: [] };
    }
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const items = result.tasks[0].result[0].items || [];
      return {
        success: true,
        technologies: items.flatMap(item =>
          (item.technologies || []).map(tech => ({
            name: tech.name,
            category: tech.category,
            version: tech.version
          }))
        )
      };
    }
    return { success: false, technologies: [] };
  }

  // ===========================================================
  // HELPER / PARSER METHODS
  // ===========================================================

  parseKeywordResults(result) {
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const taskResult = result.tasks[0].result[0];
      const items = taskResult.items || [];

      return {
        success: true,
        seed: taskResult.seed_keyword || '',
        totalCount: taskResult.total_count || 0,
        keywords: items.map(item => ({
          keyword: item.keyword_data?.keyword || item.keyword || '',
          searchVolume: item.keyword_data?.keyword_info?.search_volume
            || item.keyword_info?.search_volume || 0,
          cpc: item.keyword_data?.keyword_info?.cpc
            || item.keyword_info?.cpc || 0,
          competition: item.keyword_data?.keyword_info?.competition
            || item.keyword_info?.competition || 0,
          competitionLevel: item.keyword_data?.keyword_info?.competition_level
            || item.keyword_info?.competition_level || 'N/A',
          monthlySearches: item.keyword_data?.keyword_info?.monthly_searches
            || item.keyword_info?.monthly_searches || [],
          keywordDifficulty: item.keyword_data?.keyword_properties?.keyword_difficulty
            || item.keyword_properties?.keyword_difficulty || null,
          categories: item.keyword_data?.keyword_info?.categories || [],
          serpFeatures: item.keyword_data?.serp_info?.serp_item_types
            || item.serp_info?.serp_item_types || []
        }))
      };
    }
    return { success: false, keywords: [], totalCount: 0 };
  }

  parseVolumeResults(result) {
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const items = result.tasks[0].result || [];
      return {
        success: true,
        keywords: items.map(item => ({
          keyword: item.keyword || '',
          searchVolume: item.search_volume || 0,
          cpc: item.cpc || 0,
          competition: item.competition || 0,
          competitionLevel: item.competition_level || 'N/A',
          monthlySearches: item.monthly_searches || []
        }))
      };
    }
    return { success: false, keywords: [] };
  }

  extractBacklinkItems(result) {
    if (result.tasks && result.tasks[0] && result.tasks[0].result) {
      const items = result.tasks[0].result[0].items || [];
      return items.map(link => ({
        urlFrom: link.url_from,
        urlTo: link.url_to,
        anchor: link.anchor || '',
        domainFrom: link.domain_from,
        pageRank: link.rank || 0,
        dofollow: link.dofollow,
        firstSeen: link.first_seen
      }));
    }
    return [];
  }

  getDateDaysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  }

  getDateMonthsAgo(months) {
    const d = new Date();
    d.setMonth(d.getMonth() - months);
    return d.toISOString().split('T')[0];
  }

  // Location codes for common countries
  static LOCATIONS = {
    'United States': 2840,
    'United Kingdom': 2826,
    'Canada': 2124,
    'Australia': 2036,
    'Germany': 2276,
    'France': 2250,
    'Spain': 2724,
    'Italy': 2380,
    'Brazil': 2076,
    'India': 2356,
    'Mexico': 2484,
    'Japan': 2392
  };

  static getCompetitionBadge(level) {
    const map = {
      'LOW': '<span class="text-green">Low</span>',
      'MEDIUM': '<span class="text-gold">Medium</span>',
      'HIGH': '<span class="text-red">High</span>'
    };
    return map[level] || `<span class="text-muted">${level}</span>`;
  }

  static getDifficultyBadge(score) {
    if (score === null || score === undefined) return '<span class="text-muted">-</span>';
    if (score <= 25) return `<span class="text-green">${score}</span>`;
    if (score <= 50) return `<span class="text-gold">${score}</span>`;
    if (score <= 75) return `<span class="text-red">${score}</span>`;
    return `<span style="color:var(--accent-red); font-weight:700;">${score}</span>`;
  }

  static formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    if (n === 0) return '0';
    if (n < 1) return n.toFixed(2);
    if (Number.isInteger(n)) return n.toLocaleString();
    return n.toFixed(1);
  }

  static getOpportunityScore(volume, competition, difficulty) {
    // Higher volume + lower competition + lower difficulty = better opportunity
    const compScore = competition ? (1 - competition) : 0.5;
    const diffScore = difficulty !== null ? (1 - difficulty / 100) : 0.5;
    const volScore = Math.min(volume / 10000, 1);
    const score = (volScore * 0.4 + compScore * 0.3 + diffScore * 0.3) * 100;

    if (score >= 65) return '<span class="badge badge-gold" style="font-size:0.7rem;">GOLDEN</span>';
    if (score >= 45) return '<span class="badge" style="font-size:0.7rem; background:rgba(16,185,129,0.1); border-color:rgba(16,185,129,0.2); color:var(--accent-green);">HIGH VALUE</span>';
    if (score >= 25) return '<span class="badge" style="font-size:0.7rem;">GOOD</span>';
    return '<span class="badge" style="font-size:0.7rem; opacity:0.5;">LOW</span>';
  }
}

// Global instance
const dfs = new DataForSEOClient();
