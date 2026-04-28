// === BLOG CORE LOGIC ===
// Fetches markdown posts, parses frontmatter, renders with marked library

const BLOG_BASE = './posts';
const POSTS_DIR = './posts';

// === FRONTMATTER PARSER ===
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  if (!match) return { meta: {}, body: content };

  const metaLines = match[1].trim().split('\n');
  const meta = {};
  for (const line of metaLines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();

    // Parse arrays like [tag1, tag2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(t => t.trim().replace(/^["']|["']$/g, ''));
    }
    meta[key] = value;
  }
  return { meta, body: match[2] };
}

// === MARKDOWN RENDERER ===
function renderMarkdown(md) {
  if (typeof marked !== 'undefined') {
    return marked.parse(md);
  }
  // Fallback: basic paragraph wrapping
  return md.split('\n\n').map(p => `<p>${p}</p>`).join('');
}

// === FALLBACK POST DATA ===
const FALLBACK_STORE = {
  'first-post': {
    slug: 'first-post',
    title: 'My First Blog Post',
    date: '2025-01-15',
    tags: ['AWS', 'Cloud', 'Architecture'],
    readtime: '5 min',
    body: `## Welcome to My Blog

This is the first post on my new terminal-themed blog. I'll be writing about cloud infrastructure, autonomous systems, and backend engineering.

### Why a Blog?

Writing helps me consolidate what I learn. Whether it's a new AWS service, a Kubernetes pattern, or a computer vision algorithm, I believe in documenting the journey.

### What to Expect

- **Cloud Architecture** — AWS patterns, infrastructure design, and lessons from production
- **Autonomous Systems** — Integration challenges in factory automation
- **Backend Engineering** — Java microservices, performance tuning, and scalability

Stay tuned for more posts!`,
  },
};

// === POST DISCOVERY ===
async function discoverPosts() {
  const posts = [];
  const seen = new Set();

  let slugs = [];

  try {
    const indexUrl = `${POSTS_DIR}/post-index.json`;
    const response = await fetch(indexUrl);
    if (response.ok) {
      const index = await response.json();
      if (Array.isArray(index) && index.length > 0) {
        slugs = index;
      }
    }
  } catch (e) {
    console.warn('[blog] Could not fetch post-index.json, using fallback:', e);
  }

  if (slugs.length === 0) {
    console.log('[blog] Using fallback posts');
    slugs = Object.keys(FALLBACK_STORE);
  }

  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);

    let post = null;

    // Try fetching from markdown file first
    try {
      const postUrl = `${POSTS_DIR}/${slug}/index.md`;
      const res = await fetch(postUrl);
      if (res.ok) {
        const content = await res.text();
        const { meta, body } = parseFrontmatter(content);
        post = {
          slug,
          title: meta.title || slug,
          date: meta.date || 'unknown',
          tags: Array.isArray(meta.tags) ? meta.tags : [],
          readtime: meta.readtime || '',
          excerpt: body.replace(/[#*`_\[\]()]/g, '').replace(/\n+/g, ' ').trim().slice(0, 180) + '...',
          body,
        };
      }
    } catch (e) {
      console.warn(`[blog] Failed to fetch ${slug}/index.md, trying fallback`);
    }

    // Use fallback post data if fetch failed
    if (!post && FALLBACK_STORE[slug]) {
      const fb = FALLBACK_STORE[slug];
      post = {
        slug: fb.slug,
        title: fb.title,
        date: fb.date,
        tags: fb.tags,
        readtime: fb.readtime,
        body: fb.body,
        excerpt: fb.body.replace(/[#*`_\[\]()]/g, '').replace(/\n+/g, ' ').trim().slice(0, 180) + '...',
      };
    }

    if (post) {
      posts.push(post);
    }
  }

  // Sort by date descending
  posts.sort((a, b) => (b.date > a.date ? 1 : -1));
  return posts;
}

// === SINGLE POST LOADER ===
async function loadPost(slug) {
  let post = null;

  try {
    const res = await fetch(`${POSTS_DIR}/${slug}/index.md`);
    if (res.ok) {
      const content = await res.text();
      const { meta, body } = parseFrontmatter(content);
      post = {
        slug,
        title: meta.title || slug,
        date: meta.date || 'unknown',
        tags: Array.isArray(meta.tags) ? meta.tags : [],
        readtime: meta.readtime || '',
        body,
      };
    }
  } catch (e) {
    console.warn(`[blog] Failed to fetch ${slug}/index.md, using fallback`);
  }

  if (!post && FALLBACK_STORE[slug]) {
    console.log(`[blog] Using fallback post: ${slug}`);
    post = { ...FALLBACK_STORE[slug] };
  }

  return post;
}

// === BLOG LISTING PAGE ===
async function initBlogListing() {
  const posts = await discoverPosts();
  const container = document.getElementById('blog-posts');
  if (!container) return;

  // Collect all tags
  const allTags = new Set();
  posts.forEach(p => p.tags.forEach(t => allTags.add(t)));

  // Render tag filter
  const filterContainer = document.getElementById('tag-filters');
  if (filterContainer) {
    let filterHTML = `<button class="tag-pill active" data-tag="all">all (${posts.length})</button>`;
    [...allTags].sort().forEach(tag => {
      const count = posts.filter(p => p.tags.includes(tag)).length;
      filterHTML += `<button class="tag-pill" data-tag="${tag}">${tag} (${count})</button>`;
    });
    filterContainer.innerHTML = filterHTML;

    // Tag filter click handlers
    filterContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.tag-pill');
      if (!pill) return;
      const tag = pill.dataset.tag;

      // Update active state
      filterContainer.querySelectorAll('.tag-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // Filter posts
      const filtered = tag === 'all' ? posts : posts.filter(p => p.tags.includes(tag));
      renderPostCards(filtered, container);
    });
  }

  // Initial render
  renderPostCards(posts, container);
}

function renderPostCards(posts, container) {
  if (posts.length === 0) {
    container.innerHTML = `<div class="no-posts">No posts found.</div>`;
    return;
  }

  container.innerHTML = posts.map(post => {
    const dateStr = formatDate(post.date);
    const tagsHTML = post.tags.map(t => `<span class="post-tag">${t}</span>`).join('');
    return `
      <article class="post-card" data-slug="${post.slug}">
        <div class="post-card-header">
          <h3 class="post-card-title">
            <a href="post.html?slug=${post.slug}">${post.title}</a>
          </h3>
          <div class="post-card-meta">
            <span class="post-date">${dateStr}</span>
            ${post.readtime ? `<span class="post-readtime">${post.readtime}</span>` : ''}
          </div>
        </div>
        <div class="post-card-excerpt">${post.excerpt}</div>
        <div class="post-card-tags">${tagsHTML}</div>
      </article>
    `;
  }).join('');
}

// === SINGLE POST PAGE ===
async function initPostView() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  if (!slug) {
    document.getElementById('post-content').innerHTML = '<p>No post specified.</p>';
    return;
  }

  const post = await loadPost(slug);
  if (!post) {
    document.getElementById('post-content').innerHTML = '<p>Post not found.</p>';
    return;
  }

  // Set page title
  document.title = `${post.title} | Blog`;

  // Render header
  const header = document.getElementById('post-header');
  if (header) {
    const dateStr = formatDate(post.date);
    const tagsHTML = post.tags.map(t => `<span class="post-tag">${t}</span>`).join('');
    header.innerHTML = `
      <h1 class="post-title">${post.title}</h1>
      <div class="post-meta">
        <span class="post-date">${dateStr}</span>
        ${post.readtime ? `<span class="post-readtime">${post.readtime}</span>` : ''}
      </div>
      <div class="post-tags">${tagsHTML}</div>
    `;
  }

  // Render body
  const contentEl = document.getElementById('post-content');
  if (contentEl) {
    const html = renderMarkdown(post.body);
    contentEl.innerHTML = html;

    // Fix relative image paths
    contentEl.querySelectorAll('img[src^="images/"]').forEach(img => {
      img.src = `${BLOG_BASE}/${post.slug}/${img.src}`;
    });
  }

  // Apply code highlighting
  if (typeof hljs !== 'undefined') {
    contentEl.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block);
    });
  }

  // Init reading progress bar
  initProgressBar();
}

// === READING PROGRESS BAR ===
function initProgressBar() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// === DATE FORMATTER ===
function formatDate(dateStr) {
  if (!dateStr || dateStr === 'unknown') return dateStr;
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// === NAV TOGGLE ===
function initNavToggle() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

// === INIT ON LOAD ===
document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  if (document.getElementById('blog-posts')) {
    initBlogListing();
  } else if (document.getElementById('post-content')) {
    initPostView();
  }
});
