import React from "react";
import Layout from "@theme/Layout";
import NebariLogoSvg from "@site/static/logo/Nebari-logo-square.svg";
import RightArrowSvg from "@site/static/icons/right-arrow-light.svg";
import LeavesCircleSvg from "@site/static/img/home/leaves-circle.svg";
import JarPlantSvg from "@site/static/img/home/jar-plant.svg";
import RootsPlantSvg from "@site/static/img/home/roots-plant.svg";
import TwoPlantsSvg from "@site/static/img/home/two-plants.svg";
import ScissorStringSvg from "@site/static/img/home/scissor-string.svg";
import AwsSvg from "@site/static/img/home/aws.svg";
import AzureSvg from "@site/static/img/home/azure.svg";
import GcloudSvg from "@site/static/img/home/gcloud.svg";
import styles from "./index.module.css";

export default function HomePage() {
  return (
    <Layout
      title="Nebari Homepage"
      description="TODO"
    >
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.sectionContent}>
            <NebariLogoSvg width="158px" role="img" aria-label="Nebari logo" />
            <p className={styles.tagline1}>
              An open source stack for your AI.
            </p>
            <p className={styles.tagline2}>
              Core infrastructure, curated frameworks and apps, and everything in between.
            </p>
            <p>
              <a
                href="/docs/get-started"
                className={styles.getStartedLink}
              >
                Get Started&nbsp;&nbsp;
                <RightArrowSvg aria-hidden="true" />
              </a>
            </p>
          </div>
        </section>

        <section className={styles.pitchSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionHeading}>Ecosystem of tools</h2>
            <ol className={styles.pitchList}>
              <li className={styles.pitchItem}>
                <LeavesCircleSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>
                  <a href="https://github.com/nebari-dev/nebari">Nebari classic</a>
                </span>
                <p>
                  Cloud-agnostic data science platform with environment management, role-based-access control,
                  and curated app integrations for application deployment, scalability, monitoring, and more.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <JarPlantSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>
                  <a href="https://github.com/nebari-dev/nebari-infrastructure-core">Nebari core (early access)</a>
                </span>
                <p>
                  New robust core infrastructure layer for platform deployment on popular cloud providers.
                  Security, authentication, role-based access, and observability built-in by design.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <JarPlantSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>
                  <a href="https://github.com/nebari-dev/nebi">Nebi (early access)</a>
                </span>
                <p>
                  Tools to manage, share, and collaborate on AI software lifecycle across your team.
                  Includes future plans for SBoM generation and compliance checking.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <RootsPlantSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Usage-specific UIs (coming soon)</span>
                <p>
                  Multiple UI options available:
                  Jupyter/VSCode for developers, chat & dashboard interfaces for AI users, and more.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <TwoPlantsSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>AI model serving pack (coming soon)</span>
                <p>
                  Serve and monitor different AI models for your development workflow or production applications.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <TwoPlantsSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Agentic AI pack (coming soon)</span>
                <p>
                  Frameworks for building, deploying, evaluating, and monitoring AI agent-based workflows.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <TwoPlantsSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Data orchestration pack (coming soon)</span>
                <p>
                  Tools for building data engineering pipelines, and governance and provenance of data & AI assets.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <ScissorStringSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Custom integrations</span>
                <p>
                  All Nebari projects are developed on an open and extensible architecture,
                  that allows for quick integration of any libraries you need.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <ScissorStringSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Community hub (coming soon)</span>
                <p>
                  A space for community members to share their custom packs.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.platformsSection}>
          <div
            className={[
              styles.sectionContent,
              styles.platformsSectionContent,
            ].join(" ")}
          >
            <div className={styles.platformsLeft}>
              <div className={styles.platformsTextColumn}>
                <h2
                  className={[
                    styles.sectionHeading,
                    styles.platformsHeading,
                  ].join(" ")}
                >
                  Deploy anywhere
                </h2>
                <p>
                  Try Nebari classic on your local machine or deploy it on your cloud of
                  choice. It is designed to be flexible, extensible, and
                  vendor-agnostic.
                </p>
                <p>
                  Nebari classic and new Nebari projects can be seamlessly deployed to the major public cloud
                  providers, including AWS, Azure, and GCP.
                </p>
              </div>
            </div>
            <div className={styles.platformsRight}>
              <ul className={styles.platformsList}>
                <li className={styles.platformsItem}>
                  <AwsSvg role="img" aria-label="AWS" />
                </li>
                <li className={styles.platformsItem}>
                  <AzureSvg role="img" aria-label="Microsoft Azure" />
                </li>
                <li className={styles.platformsItem}>
                  <GcloudSvg role="img" aria-label="Google Cloud" />
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.getStartedSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionHeading}>Quick look at Nebari classic</h2>
            <p>
              <a
                href="/docs/get-started"
                className={styles.getStartedLink2}
              >
                Deploy a Nebari classic instance&nbsp;&nbsp;
                <RightArrowSvg aria-hidden="true" />
              </a>
            </p>
            <div className={styles.videoContainer}>
              <iframe
                width="885"
                height="500"
                src="https://www.youtube.com/embed/sQTQ_fg2avA?si=cWwUp0pv_zM6jYP9"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              />
            </div>
          </div>
        </section>

        <section className={styles.pitchSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionHeading}>Development principles</h2>
            <ol className={styles.pitchList}>
              <li className={styles.pitchItem}>
                <span className={styles.pitchItemHeading}>Open source</span>
                <p>
                  All projects are developed under an open source license, and built using open source software.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <span className={styles.pitchItemHeading}>Community-oriented</span>
                <p>
                  All projects welcome community contributions and engagement on various project spaces and community meetings.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <span className={styles.pitchItemHeading}>Composable architecture</span>
                <p>
                  All projects have a modular design and integrate with each other, while also allowing for independent use and extensibility.
                </p>
              </li>
            </ol>
          </div>
        </section>
      </main>
    </Layout>
  );
}
