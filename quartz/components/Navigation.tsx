import type { QuartzComponent, QuartzComponentConstructor } from "./types"

const Navigation: QuartzComponentConstructor = () => {
  const Component: QuartzComponent = () => (
    <nav
      class="site-navigation"
      aria-label="主导航"
      style="width:100%;display:flex;align-items:center;justify-content:flex-end;gap:1.4rem;padding:.75rem 0 1rem;border-bottom:1px solid var(--lightgray)"
    >
      <a href="/">主页</a>
      <a href="/blog">博客</a>
      <a href="/about">关于</a>
    </nav>
  )

  Component.css = `
    .site-navigation {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1.4rem;
      padding: .75rem 0 1rem;
      border-bottom: 1px solid var(--lightgray);
    }
    .site-navigation a {
      color: var(--darkgray);
      font-weight: 600;
      text-decoration: none;
    }
    .site-navigation a:hover { color: var(--secondary); }
    @media (max-width: 800px) {
      .site-navigation { justify-content: center; }
    }
  `

  return Component
}

export default Navigation
