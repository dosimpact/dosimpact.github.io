import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

const CORE_TRACKS = [
  {
    title: "Cloud SW 아키텍처 패턴:소개",
    description: "확장성과 안정성을 고려한 시스템 설계 패턴을 빠르게 훑습니다.",
    imgSrc: "/img/th-arch.png",
    linkTo: "/docs/g-be/common/architecture-pattern/co030-cc1",
    icon: "🧱",
    tag: "System",
  },
  {
    title: "정규표현식",
    description: "실무에서 자주 만나는 문자열 패턴 문제를 정리합니다.",
    imgSrc: "/img/th-reg.png",
    linkTo: "/docs/g-fe/js/js-part3/07-1-reg",
    icon: "🧩",
    tag: "Frontend",
  },
  {
    title: "Next + TailwindCSS",
    description: "UI 개발 생산성을 높이는 구성과 실전 패턴을 따라갑니다.",
    imgSrc: "/img/th-tail.png",
    linkTo: "/docs/category/tailwindcss",
    icon: "🎨",
    tag: "UI",
  },
  {
    title: "Supabase Concepts",
    description: "인증, 데이터, 벡터까지 서비스형 백엔드의 핵심을 정리합니다.",
    imgSrc: "/img/th-supabase.png",
    linkTo: "/docs/category/7supabase",
    icon: "🗄️",
    tag: "Data",
  },
  {
    title: "개발자와 협업을 위한 kafka의 핵심 개념",
    description: "프로듀서/컨슈머/오프셋 구조를 팀 협업 관점에서 이해합니다.",
    imgSrc: "/img/th-kafka.png",
    linkTo: "/docs/g-be/kafka/ka002",
    icon: "⚙️",
    tag: "Backend",
  },
];

const PINNED_SPOTLIGHT = {
  title: "DeepDive 브라우저, 리액트, 서버 렌더링",
  description: "렌더링 흐름을 한 번에 이해할 수 있는 집중 아티클입니다.",
  imgSrc: "/img/th-stream-render.png",
  linkTo: "/docs/g-fe/common/deepdive/de01-2",
  tag: "Pinned Spotlight",
};

function TrackCard({ title, description, imgSrc, linkTo, icon, tag }) {
  return (
    <article className={styles.trackCard}>
      <Link className={styles.trackLink} to={linkTo}>
        <div className={styles.thumbBox}>
          <img
            className={styles.trackThumb}
            src={imgSrc}
            alt={`${title} 썸네일`}
            loading="lazy"
          />
        </div>
        <div className={styles.trackBody}>
          <p className={styles.trackMeta}>
            <span className={styles.trackIcon} aria-hidden="true">
              {icon}
            </span>
            <span>{tag}</span>
          </p>
          <h3 className={styles.trackTitle}>{title}</h3>
          <p className={styles.trackDescription}>{description}</p>
        </div>
      </Link>
    </article>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Core Tracks</p>
          <h2 className={styles.title}>지금 읽기 좋은 큐레이션</h2>
          <p className={styles.subtitle}>
            핵심 주제를 빠르게 훑고, 필요한 문서부터 바로 들어가세요.
          </p>
        </div>

        <div className={styles.trackGrid}>
          {CORE_TRACKS.map((track) => (
            <TrackCard key={track.title} {...track} />
          ))}
        </div>

        <div className={styles.pinnedWrap}>
          <Link className={styles.pinnedLink} to={PINNED_SPOTLIGHT.linkTo}>
            <div className={styles.pinnedThumbBox}>
              <img
                className={styles.pinnedThumb}
                src={PINNED_SPOTLIGHT.imgSrc}
                alt={`${PINNED_SPOTLIGHT.title} 배너 이미지`}
                loading="lazy"
              />
            </div>
            <div className={styles.pinnedBody}>
              <p className={styles.pinnedTag}>{PINNED_SPOTLIGHT.tag}</p>
              <h3 className={styles.pinnedTitle}>{PINNED_SPOTLIGHT.title}</h3>
              <p className={styles.pinnedDescription}>
                {PINNED_SPOTLIGHT.description}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
