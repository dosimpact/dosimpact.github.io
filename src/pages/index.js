import React from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

const HERO_ACTIONS = [
  {
    label: "문서 시작하기",
    to: "/docs/g-fe/common/workprocess/wp-1-high-level",
    variant: "primary",
  },
  {
    label: "블로그 보기",
    to: "/blog",
    variant: "secondary",
  },
];

const QUICK_NAV_ITEMS = [
  { label: "System", to: "/docs/g-fe/common/workprocess/wp-1-high-level" },
  { label: "Stock", to: "/docs/g-da/quant/vectorbt/quant001" },
  { label: "Side", to: "/docs/g-hard/solopreneur/sideproject/sp001" },
  { label: "Career", to: "/docs/g-soft/output/programmer/p001" },
  { label: "ETC", to: "/docs/g-da/etc/da-etc-1" },
];

const JOURNEY_STEPS = [
  {
    title: "1. 탐색",
    description: "퀵 네비게이션으로 관심 있는 주제를 빠르게 선택합니다.",
  },
  {
    title: "2. 집중",
    description: "코어 트랙에서 지금 필요한 아티클을 골라 깊게 읽습니다.",
  },
  {
    title: "3. 실행",
    description: "Pinned 콘텐츠와 연계 문서를 통해 바로 실전에 연결합니다.",
  },
];

function LandingHero() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroGlass}>
          <p className={styles.heroBadge}>RedBrain Landing</p>
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}
            <br />
            한국어 중심 큐레이션으로, 필요한 지식을 빠르게 탐색하고 바로
            실행까지 연결합니다.
          </p>
          <div className={styles.heroActions}>
            {HERO_ACTIONS.map((action) => (
              <Link
                key={action.label}
                className={
                  action.variant === "primary"
                    ? styles.primaryAction
                    : styles.secondaryAction
                }
                to={action.to}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickNavigation() {
  return (
    <section className={styles.quickNavSection}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Quick Navigation</p>
          <h2 className={styles.sectionTitle}>한 번에 이동하기</h2>
        </div>
        <div className={styles.quickNavList}>
          {QUICK_NAV_ITEMS.map((item) => (
            <Link key={item.label} className={styles.quickNavChip} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function JourneyGuide() {
  return (
    <section className={styles.journeySection}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Journey</p>
          <h2 className={styles.sectionTitle}>어떻게 읽을지, 3단계 가이드</h2>
        </div>
        <div className={styles.journeyGrid}>
          {JOURNEY_STEPS.map((step) => (
            <article key={step.title} className={styles.journeyCard}>
              <h3 className={styles.journeyTitle}>{step.title}</h3>
              <p className={styles.journeyDescription}>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} | RedBrain`}
      description="RedBrain 홈에서 시스템/투자/사이드/커리어 큐레이션을 한 번에 탐색하세요."
    >
      <main className={styles.landingRoot}>
        <LandingHero />
        <QuickNavigation />
        <JourneyGuide />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
