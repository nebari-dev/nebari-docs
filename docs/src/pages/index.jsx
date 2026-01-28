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
              {/* Your open source data science & AI platform. */}
              A fully open source stack for your AI.
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
                <span className={styles.pitchItemHeading}>Nebari classic</span>
                <p>
                  Cloud-agnostic data science platform with environment management, role-based-access control,
                  and curated app integrations for application deployment, scalability, monitoring, and more.
                  <br/>
                  <a href="TODO">Get started →</a>
                </p>
              </li>
              <li className={styles.pitchItem}>
                <JarPlantSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Nebari core (early access)</span>
                <p>
                  New and robust core infrastructure layer for platform deployment on popular cloud providers.
                  Security, authentication, role-based access, and observability built-in by design.
                  <br/>
                  <a href="TODO">Learn more →</a>
                </p>
              </li>
              <li className={styles.pitchItem}>
                <JarPlantSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Nebi (early access)</span>
                <p>
                  Tools to manage, share, and collaborate on AI software lifecycle.
                  SBoMs, licensing, and compliance tools.
                  <br/>
                  <a href="TODO">Learn more →</a>
                </p>
              </li>
              <li className={styles.pitchItem}>
                <RootsPlantSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Usage-specific UIs (coming soon)</span>
                <p>
                  Jupyter/VSCode for developers, chat & dashboard interfaces for AI users.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <TwoPlantsSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>AI model serving pack (coming soon)</span>
                <p>
                  TODO
                </p>
              </li>
              <li className={styles.pitchItem}>
                <TwoPlantsSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Agentic AI pack (coming soon)</span>
                <p>
                  Frameworks for building, deploying, evaluating, and governing agent-based workflows.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <TwoPlantsSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Data orchestration pack (coming soon)</span>
                <p>
                  Data engineering pipeline, governance of data and AI assets.
                </p>
              </li>
              <li className={styles.pitchItem}>
                <ScissorStringSvg aria-hidden="true" height="150px" />
                <span className={styles.pitchItemHeading}>Custom integrations</span>
                <p>
                  All Nebari tools are based on an open and extensible architecture, that allows quick integration of new tools you may need.
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
                  Try Nebari on your local machine or deploy it on your cloud of
                  choice. Nebari is designed to be flexible, extensible, and
                  vendor-agnostic.
                </p>
                <p>
                  Nebari can be seamlessly deployed to the major public cloud
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
                Learn to deploy a Nebari classic instance&nbsp;&nbsp;
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

        <section className={styles.integrationsSection}>
          <div className={styles.sectionContent}>
            <h2 className={styles.sectionHeading}>Our Vision</h2>
            <p className={styles.integrationsSubheading}>
              Enable organizations to rapidly build with AI.
            </p>
            <ul className={styles.integrationsList}>
              <li className={styles.integrationsItem}>Ownership: Lorem ipsum</li>
              <li className={styles.integrationsItem}>Open source: Lorem ipsum</li>
              <li className={styles.integrationsItem}>Community-oriented development: Lorem ipsum</li>
              <li className={styles.integrationsItem}>Modularity / expandability: Lorem ipsum</li>
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}
