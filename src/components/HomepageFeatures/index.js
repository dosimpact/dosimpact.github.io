import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import Link from "@docusaurus/Link";

const FeatureList = [
  {
    title: "DeepDive 브라우저, 리액트, 서버 렌더링",
    description: <></>,
    imgSrc: "/img/th-stream-render.png",
    linkTo: "/docs/g-fe/common/deepdive/de01-2",
  },
  {
    title: "Cloud SW 아키텍처 패턴:소개",
    description: <></>,
    imgSrc: "/img/th-arch.png",
    linkTo: "/docs/g-be/common/architecture-pattern/co030-cc1",
  },
  {
    title: "정규표현식",
    description: <></>,
    imgSrc: "/img/th-reg.png",
    linkTo: "/docs/g-fe/js/js-part3/07-1-reg",
  },
  {
    title: "Next + TailwindCSS",
    description: <></>,
    imgSrc: "/img/th-tail.png",
    linkTo: "/docs/category/tailwindcss",
  },
  {
    title: "Supabase Concepts",
    description: <></>,
    imgSrc: "/img/th-supabase.png",
    linkTo: "/docs/category/7supabase",
  },
  {
    title: "개발자와 협업을 위한 kafka의 핵심 개념",
    description: <></>,
    imgSrc: "/img/th-kafka.png",
    linkTo: "/docs/g-be/kafka/ka002",
  },
];

function Feature({ imgSrc, title, description, linkTo, linkTitle }) {
  return (
    <div className={clsx("col col--4")}>
      <Link to={linkTo}>
        {imgSrc && (
          <div className="text--center">
            <img style={{ objectFit: "contain" }} height={200} src={imgSrc} />
          </div>
        )}
      </Link>
      <div
        className="text--center padding-horiz--md"
        style={{ marginBottom: "30px" }}
      >
        <h3>{title}</h3>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <div>
      <section>
        <h2 className={styles.pinned}>📌 Pinned</h2>
      </section>
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
